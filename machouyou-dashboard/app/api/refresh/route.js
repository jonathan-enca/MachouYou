export const maxDuration = 60;

const META_URL = "https://meta-ads.mcp.pipeboard.co/";
const GOOGLE_URL = "https://google-ads.mcp.pipeboard.co/";

function findAction(actions, type) {
  const f = actions?.find(a => a.action_type === type);
  return f ? parseFloat(f.value) || 0 : 0;
}

async function callMCP(url, toolName, args, token) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0", id: 1,
      method: "tools/call",
      params: { name: toolName, arguments: args },
    }),
  });
  if (!res.ok) throw new Error(`MCP HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("text/event-stream")) {
    const text = await res.text();
    for (const line of text.split("\n").reverse()) {
      if (line.trim().startsWith("data:")) {
        const payload = line.trim().slice(5).trim();
        if (payload && payload !== "[DONE]") {
          try { return JSON.parse(payload); } catch {}
        }
      }
    }
    throw new Error("SSE non parsable");
  }
  return res.json();
}

function unwrapMCP(raw) {
  // Check for Pipeboard error
  if (raw?.result?.isError) {
    throw new Error(raw.result.content?.[0]?.text || "Erreur Pipeboard");
  }
  // Unwrap MCP: result.content[0].text -> parsed JSON
  if (raw?.result?.content) {
    for (const b of raw.result.content) {
      if (b.text) { try { return JSON.parse(b.text); } catch {} }
    }
  }
  // Maybe it's already direct
  if (raw?.segmented_metrics || raw?.data) return raw;
  throw new Error("Format MCP inattendu");
}

function parseMetaSegmented(data) {
  const segs = data?.segmented_metrics;
  if (!segs?.length) return null;
  return segs.map(s => {
    const m = s.metrics || {};
    return {
      date: s.period || m.date_start || "",
      spend: parseFloat(m.spend) || 0,
      impressions: parseInt(m.impressions) || 0,
      clicks: parseInt(m.clicks) || 0,
      reach: parseInt(m.reach) || 0,
      lp_views: findAction(m.actions, "landing_page_view"),
      view_content: findAction(m.actions, "offsite_conversion.fb_pixel_view_content"),
      atc: findAction(m.actions, "offsite_conversion.fb_pixel_add_to_cart"),
      ic: findAction(m.actions, "offsite_conversion.fb_pixel_initiate_checkout"),
      purchases: findAction(m.actions, "offsite_conversion.fb_pixel_purchase"),
      atc_value: findAction(m.action_values, "offsite_conversion.fb_pixel_add_to_cart"),
      purchase_value: findAction(m.action_values, "offsite_conversion.fb_pixel_purchase"),
    };
  }).filter(d => d.date);
}

function parseMetaCampaigns(data) {
  // data is array of campaign rows (no time_breakdown)
  const rows = Array.isArray(data) ? data : data?.data || [];
  return rows.map(r => ({
    id: r.campaign_id,
    name: r.campaign_name,
    spend: parseFloat(r.spend) || 0,
    impressions: parseInt(r.impressions) || 0,
    clicks: parseInt(r.clicks) || 0,
    purchases: findAction(r.actions, "offsite_conversion.fb_pixel_purchase"),
    purchase_value: findAction(r.action_values, "offsite_conversion.fb_pixel_purchase"),
  })).filter(c => c.id);
}

function parseGoogleGAQL(results) {
  // results = array of {campaign: {id, name}, metrics: {costMicros, impressions, clicks, conversions, conversionsValue}, segments: {date}}
  const dailyMap = {};
  const campaigns = {};
  for (const r of results) {
    const date = r.segments?.date;
    const cId = r.campaign?.id;
    const cName = r.campaign?.name;
    if (!date) continue;

    // Track campaigns
    if (cId && cName && !campaigns[cId]) campaigns[cId] = { id: cId, name: cName, spend: 0, impressions: 0, clicks: 0, conversions: 0, conversionsValue: 0 };
    if (cId && campaigns[cId]) {
      campaigns[cId].spend += (parseInt(r.metrics?.costMicros) || 0) / 1000000;
      campaigns[cId].impressions += parseInt(r.metrics?.impressions) || 0;
      campaigns[cId].clicks += parseInt(r.metrics?.clicks) || 0;
      campaigns[cId].conversions += parseFloat(r.metrics?.conversions) || 0;
      campaigns[cId].conversionsValue += parseFloat(r.metrics?.conversionsValue) || 0;
    }

    if (!dailyMap[date]) {
      dailyMap[date] = { date, spend: 0, impressions: 0, clicks: 0, reach: 0, lp_views: 0, view_content: 0, atc: 0, ic: 0, purchases: 0, atc_value: 0, purchase_value: 0 };
    }
    const d = dailyMap[date];
    d.spend += (parseInt(r.metrics?.costMicros) || 0) / 1000000;
    d.impressions += parseInt(r.metrics?.impressions) || 0;
    d.clicks += parseInt(r.metrics?.clicks) || 0;
    d.reach += parseInt(r.metrics?.impressions) || 0;
    d.purchases += parseFloat(r.metrics?.conversions) || 0;
    d.purchase_value += parseFloat(r.metrics?.conversionsValue) || 0;
  }
  return {
    daily: Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date)),
    campaigns: Object.values(campaigns),
  };
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "meta";
  const TOKEN = process.env.PIPEBOARD_API_KEY;
  const META_ID = process.env.META_AD_ACCOUNT_ID || "802144206480252";
  const GOOGLE_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || "8373152497";

  if (!TOKEN) return Response.json({ error: "PIPEBOARD_API_KEY non configurée." }, { status: 500 });

  try {
    if (source === "meta") {
      const now = new Date();
      const d89 = new Date(now); d89.setDate(d89.getDate() - 89);
      const w89 = new Date(now); w89.setDate(w89.getDate() - 89 * 7); // 89 weeks = ~623 days

      // Parallel: daily 89d + weekly 89w (~20 months) + campaign list
      const [dailyRaw, weeklyRaw, campaignsRaw] = await Promise.all([
        callMCP(META_URL, "get_insights", {
          object_id: `act_${META_ID}`, level: "account",
          time_range: { since: d89.toISOString().slice(0, 10), until: now.toISOString().slice(0, 10) },
          time_breakdown: "day",
        }, TOKEN),
        callMCP(META_URL, "get_insights", {
          object_id: `act_${META_ID}`, level: "account",
          time_range: { since: w89.toISOString().slice(0, 10), until: now.toISOString().slice(0, 10) },
          time_breakdown: "week",
        }, TOKEN),
        callMCP(META_URL, "get_insights", {
          object_id: `act_${META_ID}`, level: "campaign",
          time_range: { since: d89.toISOString().slice(0, 10), until: now.toISOString().slice(0, 10) },
        }, TOKEN),
      ]);

      const daily = parseMetaSegmented(unwrapMCP(dailyRaw));
      const weekly = parseMetaSegmented(unwrapMCP(weeklyRaw));
      const campaigns = parseMetaCampaigns(unwrapMCP(campaignsRaw));

      if (!daily?.length) throw new Error("Aucune donnée daily Meta");

      return Response.json({
        success: true, source: "meta",
        data: { account_daily: daily, account_weekly: weekly || [], campaigns: campaigns || [] },
        updated_at: new Date().toISOString(),
      });

    } else {
      // Google Ads via GAQL
      const now = new Date();
      const d89 = new Date(now); d89.setDate(d89.getDate() - 89);
      const since = d89.toISOString().slice(0, 10);
      const until = now.toISOString().slice(0, 10);

      const raw = await callMCP(GOOGLE_URL, "execute_google_ads_gaql_query", {
        customer_id: GOOGLE_ID,
        query: `SELECT campaign.id, campaign.name, segments.date, metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions, metrics.conversions_value FROM campaign WHERE segments.date BETWEEN '${since}' AND '${until}' ORDER BY segments.date ASC`,
      }, TOKEN);

      const data = unwrapMCP(raw);
      const results = data?.results || [];
      if (!results.length) throw new Error("Aucune donnée Google Ads");

      const parsed = parseGoogleGAQL(results);

      return Response.json({
        success: true, source: "google",
        data: { account_daily: parsed.daily, campaigns: parsed.campaigns },
        updated_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 422 });
  }
}
