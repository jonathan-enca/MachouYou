export const maxDuration = 60;

const META_MCP_URL = "https://meta-ads.mcp.pipeboard.co/";
const GOOGLE_MCP_URL = "https://google-ads.mcp.pipeboard.co/";

async function callPipeboard(url, toolName, args, token) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: toolName, arguments: args },
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Pipeboard ${res.status}: ${txt.slice(0, 500)}`);
  }
  return res.json();
}

function parseMetaInsights(rawResult) {
  // rawResult.result.content[0].text contains the insights data
  let text = "";
  if (rawResult?.result?.content) {
    for (const block of rawResult.result.content) {
      if (block.text) text += block.text;
    }
  }

  // Try to parse as JSON
  let insights;
  try {
    insights = JSON.parse(text);
  } catch {
    // Maybe it's wrapped in markdown
    const match = text.match(/```json?\s*([\s\S]*?)```/);
    if (match) {
      try { insights = JSON.parse(match[1]); } catch {}
    }
  }

  if (!insights) return { raw: text };
  
  // Handle both array and object with data key
  const rows = Array.isArray(insights) ? insights : insights.data || insights.insights?.data || [];
  
  const daily = rows.map(row => {
    const d = {
      date: row.date_start || row.date || "",
      spend: parseFloat(row.spend) || 0,
      impressions: parseInt(row.impressions) || 0,
      clicks: parseInt(row.clicks) || 0,
      reach: parseInt(row.reach) || 0,
      lp_views: 0, view_content: 0, atc: 0, ic: 0, purchases: 0,
      atc_value: 0, purchase_value: 0,
    };

    // Parse actions array
    if (row.actions) {
      for (const a of row.actions) {
        const t = a.action_type;
        const v = parseFloat(a.value) || 0;
        if (t === "landing_page_view") d.lp_views = v;
        if (t === "offsite_conversion.fb_pixel_view_content") d.view_content = v;
        if (t === "offsite_conversion.fb_pixel_add_to_cart") d.atc = v;
        if (t === "offsite_conversion.fb_pixel_initiate_checkout") d.ic = v;
        if (t === "offsite_conversion.fb_pixel_purchase") d.purchases = v;
      }
    }

    // Parse action_values array
    if (row.action_values) {
      for (const a of row.action_values) {
        const t = a.action_type;
        const v = parseFloat(a.value) || 0;
        if (t === "offsite_conversion.fb_pixel_add_to_cart") d.atc_value = v;
        if (t === "offsite_conversion.fb_pixel_purchase") d.purchase_value = v;
      }
    }

    return d;
  }).filter(d => d.date);

  return { account_daily: daily.sort((a, b) => a.date.localeCompare(b.date)) };
}

function parseGoogleInsights(rawResult) {
  let text = "";
  if (rawResult?.result?.content) {
    for (const block of rawResult.result.content) {
      if (block.text) text += block.text;
    }
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    const match = text.match(/```json?\s*([\s\S]*?)```/);
    if (match) {
      try { data = JSON.parse(match[1]); } catch {}
    }
  }

  if (!data) return { raw: text };

  const rows = Array.isArray(data) ? data : data.results || data.data || [];

  const dailyMap = {};
  for (const row of rows) {
    const date = row.segments?.date || row.date || "";
    if (!date) continue;
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date, spend: 0, impressions: 0, clicks: 0, reach: 0,
        lp_views: 0, view_content: 0, atc: 0, ic: 0, purchases: 0,
        atc_value: 0, purchase_value: 0,
      };
    }
    const d = dailyMap[date];
    const m = row.metrics || row;
    d.spend += (parseFloat(m.cost_micros) || 0) / 1000000;
    d.impressions += parseInt(m.impressions) || 0;
    d.clicks += parseInt(m.clicks) || 0;
    d.reach += parseInt(m.impressions) || 0;
    d.purchases += parseFloat(m.conversions) || 0;
    d.purchase_value += parseFloat(m.conversions_value) || 0;
  }

  const daily = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
  return { account_daily: daily };
}

export async function POST(request) {
  const PIPEBOARD_API_KEY = process.env.PIPEBOARD_API_KEY;
  const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || "802144206480252";

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "meta";

  if (!PIPEBOARD_API_KEY) {
    return Response.json({ error: "PIPEBOARD_API_KEY non configurée dans Vercel." }, { status: 500 });
  }

  try {
    if (source === "meta") {
      // Calculate date range: last 6 months
      const now = new Date();
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const since = sixMonthsAgo.toISOString().slice(0, 10);
      const until = now.toISOString().slice(0, 10);

      const result = await callPipeboard(META_MCP_URL, "get_insights", {
        ad_account_id: META_AD_ACCOUNT_ID,
        level: "account",
        time_range: JSON.stringify({ since, until }),
        time_increment: "1",
        fields: "spend,impressions,clicks,reach,actions,action_values",
      }, PIPEBOARD_API_KEY);

      const parsed = parseMetaInsights(result);
      
      if (parsed.account_daily?.length > 0) {
        return Response.json({ success: true, data: parsed, source, updated_at: new Date().toISOString() });
      }

      return Response.json({
        success: false,
        error: "Données Meta non extraites. Vérifiez l'ID du compte publicitaire.",
        raw_response: (parsed.raw || JSON.stringify(result)).slice(0, 2000),
      }, { status: 422 });

    } else {
      // Google Ads — first list accounts, then get metrics
      const accountsResult = await callPipeboard(GOOGLE_MCP_URL, "list_google_ads_customers", {}, PIPEBOARD_API_KEY);

      // Extract customer ID from result
      let customerId = null;
      let accountsText = "";
      if (accountsResult?.result?.content) {
        for (const block of accountsResult.result.content) {
          if (block.text) accountsText += block.text;
        }
      }
      
      // Try to find customer ID in the response
      try {
        const accounts = JSON.parse(accountsText);
        if (Array.isArray(accounts) && accounts.length > 0) {
          customerId = accounts[0].customer_id || accounts[0].id || accounts[0].customerId;
        } else if (accounts.customers) {
          customerId = accounts.customers[0]?.customer_id || accounts.customers[0]?.id;
        }
      } catch {
        const idMatch = accountsText.match(/(\d{10})/);
        if (idMatch) customerId = idMatch[1];
      }

      if (!customerId) {
        return Response.json({
          success: false,
          error: "Impossible de trouver le compte Google Ads. Vérifiez la connexion Pipeboard.",
          raw_response: accountsText.slice(0, 1000),
        }, { status: 422 });
      }

      // Fetch campaign metrics with daily breakdown
      const now = new Date();
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const since = sixMonthsAgo.toISOString().slice(0, 10);
      const until = now.toISOString().slice(0, 10);

      const metricsResult = await callPipeboard(GOOGLE_MCP_URL, "get_google_ads_campaign_metrics", {
        customer_id: customerId,
        date_range: `${since},${until}`,
        segment_by: "date",
      }, PIPEBOARD_API_KEY);

      const parsed = parseGoogleInsights(metricsResult);

      if (parsed.account_daily?.length > 0) {
        return Response.json({ success: true, data: parsed, source, updated_at: new Date().toISOString() });
      }

      return Response.json({
        success: false,
        error: "Données Google Ads non extraites.",
        raw_response: (parsed.raw || JSON.stringify(metricsResult)).slice(0, 2000),
      }, { status: 422 });
    }

  } catch (err) {
    console.error("Refresh error:", err);
    return Response.json({ error: "Erreur: " + err.message }, { status: 500 });
  }
}
