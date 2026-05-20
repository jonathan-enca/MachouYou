export const maxDuration = 120;

// Helper to find action values in Meta Ads actions/action_values arrays
function findAction(actions, actionType) {
  if (!actions) return 0;
  const found = actions.find(a => a.action_type === actionType);
  return found ? parseFloat(found.value) || 0 : 0;
}

// Parse Meta Ads segmented_metrics (from Pipeboard get_insights)
function parseMetaSegmented(data) {
  const segments = data?.segmented_metrics;
  if (!segments || !Array.isArray(segments)) return null;
  const daily = segments.map(seg => {
    const m = seg.metrics || {};
    const actions = m.actions || [];
    const av = m.action_values || [];
    return {
      date: seg.period || seg.period_start || m.date_start || "",
      campaign_id: m.campaign_id || seg.campaign_id || "",
      campaign_name: m.campaign_name || seg.campaign_name || "",
      spend: parseFloat(m.spend) || 0,
      impressions: parseInt(m.impressions) || 0,
      clicks: parseInt(m.clicks) || 0,
      reach: parseInt(m.reach) || 0,
      lp_views: findAction(actions, "landing_page_view"),
      view_content: findAction(actions, "offsite_conversion.fb_pixel_view_content") || findAction(actions, "view_content"),
      atc: findAction(actions, "offsite_conversion.fb_pixel_add_to_cart") || findAction(actions, "add_to_cart"),
      ic: findAction(actions, "offsite_conversion.fb_pixel_initiate_checkout") || findAction(actions, "initiate_checkout"),
      purchases: findAction(actions, "offsite_conversion.fb_pixel_purchase") || findAction(actions, "purchase"),
      atc_value: findAction(av, "offsite_conversion.fb_pixel_add_to_cart") || findAction(av, "add_to_cart"),
      purchase_value: findAction(av, "offsite_conversion.fb_pixel_purchase") || findAction(av, "purchase"),
    };
  }).filter(d => d.date);
  return daily.length > 0 ? { account_daily: daily } : null;
}

// Extract insights from various response formats
function extractInsights(resultData, parser) {
  if (resultData?.segmented_metrics) return parser(resultData);
  if (resultData?.result?.content) {
    for (const block of resultData.result.content) {
      if (block.text || block.type === "text") {
        try {
          const parsed = JSON.parse(block.text || "");
          if (parsed?.segmented_metrics) return parser(parsed);
        } catch {}
      }
    }
  }
  if (resultData?.data?.segmented_metrics) return parser(resultData.data);
  return null;
}

// Parse Google Ads GAQL response with conversion action breakdown
// GAQL with segments.conversion_action_name repeats base metrics (cost, impressions, clicks)
// on every conversion action row. We need to dedup base metrics per date+campaign.
function parseGoogleConversionData(resultData) {
  let rawText = null;
  if (resultData?.result?.content) {
    for (const block of resultData.result.content) {
      if (block.text || block.type === "text") {
        rawText = block.text || "";
        break;
      }
    }
  } else if (typeof resultData === "string") {
    rawText = resultData;
  } else if (resultData?.rows || resultData?.results || Array.isArray(resultData)) {
    rawText = JSON.stringify(resultData);
  }

  if (!rawText) return null;

  let rows;
  try {
    const parsed = JSON.parse(rawText);
    rows = parsed?.rows || parsed?.results || parsed;
    if (!Array.isArray(rows)) rows = null;
  } catch {
    rows = null;
  }

  if (!rows || rows.length === 0) return null;

  // Build per-date+campaign entries. Track which date+campaign combos already got base metrics.
  const entries = {};
  const baseMetricsSeen = new Set();

  for (const row of rows) {
    const date = row?.segments?.date || row?.date || "";
    if (!date) continue;

    const campaignName = row?.campaign?.name || row?.campaign_name || "";
    const campaignId = row?.campaign?.resource_name || row?.campaign?.id || row?.campaign_id || "";
    const key = date + "||" + campaignName;

    if (!entries[key]) {
      entries[key] = {
        date, campaign_name: campaignName, campaign_id: campaignId,
        spend: 0, impressions: 0, clicks: 0, reach: 0,
        lp_views: 0, view_content: 0, atc: 0, ic: 0, purchases: 0,
        atc_value: 0, purchase_value: 0,
      };
    }

    const d = entries[key];
    const metrics = row?.metrics || row;

    // Base metrics: add only once per date+campaign
    if (!baseMetricsSeen.has(key)) {
      const costMicros = parseFloat(metrics?.cost_micros || metrics?.costMicros || 0);
      d.spend += costMicros / 1000000;
      d.impressions += parseInt(metrics?.impressions || 0);
      d.clicks += parseInt(metrics?.clicks || 0);
      d.reach += parseInt(metrics?.impressions || 0);
      baseMetricsSeen.add(key);
    }

    // Conversion action mapping
    const convAction = row?.segments?.conversion_action_name ||
                       row?.conversionAction?.name ||
                       row?.conversion_action_name || "";
    const convs = parseFloat(metrics?.conversions || metrics?.all_conversions || 0);
    const convVal = parseFloat(metrics?.conversions_value || metrics?.all_conversions_value || 0);
    const actionLower = convAction.toLowerCase();

    if (actionLower.includes("page_view") || actionLower.includes("pageview")) {
      d.lp_views += convs;
    } else if (actionLower.includes("view_content") || actionLower.includes("viewcontent")) {
      d.view_content += convs;
    } else if (actionLower.includes("add_to_cart") || actionLower.includes("addtocart")) {
      d.atc += convs;
      d.atc_value += convVal;
    } else if (actionLower.includes("begin_checkout") || actionLower.includes("initiate_checkout") || actionLower.includes("begincheckout")) {
      d.ic += convs;
    } else if (actionLower.includes("purchase") && !actionLower.includes("add_to_cart")) {
      d.purchases += convs;
      d.purchase_value += convVal;
    }
  }

  const daily = Object.values(entries)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      ...d,
      spend: Math.round(d.spend * 100) / 100,
      atc_value: Math.round(d.atc_value * 100) / 100,
      purchase_value: Math.round(d.purchase_value * 100) / 100,
      lp_views: Math.round(d.lp_views),
      view_content: Math.round(d.view_content),
      atc: Math.round(d.atc),
      ic: Math.round(d.ic),
      purchases: Math.round(d.purchases),
    }));

  return daily.length > 0 ? { account_daily: daily } : null;
}

export async function POST(request) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const PIPEBOARD_API_KEY = process.env.PIPEBOARD_API_KEY;
  const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || "802144206480252";

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const source = body.source || "meta";
  const since = body.since || "";
  const until = body.until || "";

  if (!ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY non configurée." }, { status: 500 });
  }
  if (!PIPEBOARD_API_KEY) {
    return Response.json({ error: "PIPEBOARD_API_KEY non configurée." }, { status: 500 });
  }

  // Date range: use frontend values or default to last 89 days
  const now = new Date();
  const defaultStart = new Date(now);
  defaultStart.setDate(defaultStart.getDate() - 89);
  const rangeStart = since || defaultStart.toISOString().slice(0, 10);
  const rangeEnd = until || now.toISOString().slice(0, 10);

  // Cap at 89 days for Pipeboard's 90-period limit
  const dayCount = Math.ceil((new Date(rangeEnd) - new Date(rangeStart)) / (1000 * 60 * 60 * 24)) + 1;
  const safeStart = dayCount > 89
    ? new Date(new Date(rangeEnd).getTime() - 88 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    : rangeStart;

  const mcpServer = source === "google"
    ? { type: "url", url: "https://google-ads.mcp.pipeboard.co", name: "google-ads", authorization_token: PIPEBOARD_API_KEY }
    : { type: "url", url: "https://meta-ads.mcp.pipeboard.co/", name: "meta-ads", authorization_token: PIPEBOARD_API_KEY };

  // --- BUILD PROMPT ---
  let prompt;
  if (source === "google") {
    prompt = `You are a data extraction assistant. Return ONLY raw JSON, no markdown, no explanation.

Use the Google Ads MCP tools to:

1. First list available Google Ads customer accounts to find the right one.

2. Execute this GAQL query to get DAILY metrics with conversion action breakdown:

SELECT
  segments.date,
  campaign.name,
  campaign.id,
  segments.conversion_action_name,
  metrics.cost_micros,
  metrics.impressions,
  metrics.clicks,
  metrics.conversions,
  metrics.conversions_value
FROM campaign
WHERE segments.date BETWEEN '${safeStart}' AND '${rangeEnd}'
ORDER BY segments.date ASC

3. Return the raw rows as JSON. Each row should have:
{
  "segments": {"date": "YYYY-MM-DD", "conversion_action_name": "..."},
  "campaign": {"name": "...", "id": "..."},
  "metrics": {"cost_micros": "...", "impressions": "...", "clicks": "...", "conversions": "...", "conversions_value": "..."}
}

Return ONLY: {"rows": [...]}`;
  } else {
    prompt = `You are a data extraction assistant. Return ONLY raw JSON, no markdown.

Use the Meta Ads MCP tools to fetch DAILY performance data for ad account ${META_AD_ACCOUNT_ID}.

Call get_insights with:
- ad_account_id: ${META_AD_ACCOUNT_ID}
- level: campaign
- time_range: {"since": "${safeStart}", "until": "${rangeEnd}"}
- time_increment: 1
- fields: spend, impressions, clicks, reach, actions, action_values, campaign_id, campaign_name

Return the raw segmented_metrics response as-is. Do NOT summarize or transform the data.`;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2025-01-01",
        "anthropic-beta": "mcp-client-2025-04-04",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 16000,
        mcp_servers: [mcpServer],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: "Erreur API Anthropic", details: errText.slice(0, 500) }, { status: 502 });
    }

    const data = await response.json();

    // Collect all text and tool results from Claude's response
    let allText = "";
    let lastToolResultData = null;

    for (const block of data.content || []) {
      if (block.type === "text" && block.text) allText += block.text;
      if (block.type === "mcp_tool_result" && block.content) {
        for (const sub of block.content) {
          if (sub.text) {
            allText += sub.text;
            try { lastToolResultData = JSON.parse(sub.text); } catch {}
          }
        }
      }
    }

    // Try to find structured data
    let resultData = lastToolResultData;

    // Fallback: try SSE format
    if (!resultData && (allText.includes("event:") || allText.includes("data:"))) {
      const lines = allText.split("\n");
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith("data:")) {
          const payload = line.slice(5).trim();
          if (payload && payload !== "[DONE]") {
            try { resultData = JSON.parse(payload); break; } catch {}
          }
        }
      }
    }

    // Fallback: extract JSON objects from text
    if (!resultData) {
      const jsonMatch = allText.match(/\{[\s\S]*"segmented_metrics"[\s\S]*\}/);
      if (jsonMatch) {
        try { resultData = JSON.parse(jsonMatch[0]); } catch {}
      }
    }
    if (!resultData && source === "google") {
      const jsonMatch = allText.match(/\{[\s\S]*"rows"[\s\S]*\}/);
      if (jsonMatch) {
        try { resultData = JSON.parse(jsonMatch[0]); } catch {}
      }
    }

    // Check for Pipeboard error
    if (resultData?.result?.isError || resultData?.isError) {
      const errMsg = (resultData.result?.content || resultData.content)?.map(c => c.text).join(" ") || "Erreur Pipeboard inconnue";
      return Response.json({ error: errMsg }, { status: 422 });
    }

    // Parse based on source
    let parsed;
    if (source === "google") {
      parsed = parseGoogleConversionData(resultData);
      // Also try with the raw data directly
      if (!parsed) {
        parsed = parseGoogleConversionData({ rows: resultData });
      }
      // Try extracting from JSON-RPC wrapped format
      if (!parsed && resultData?.result?.content) {
        for (const block of resultData.result.content) {
          if (block.text) {
            try {
              const inner = JSON.parse(block.text);
              parsed = parseGoogleConversionData(inner);
            } catch {}
          }
          if (parsed) break;
        }
      }
    } else {
      parsed = extractInsights(resultData, parseMetaSegmented);
    }

    if (parsed?.account_daily?.length > 0) {
      return Response.json({
        success: true,
        data: parsed,
        source,
        date_range: { since: safeStart, until: rangeEnd },
        updated_at: new Date().toISOString(),
      });
    }

    return Response.json({
      success: false,
      error: "Aucune donnée trouvée dans la réponse.",
      raw_sample: JSON.stringify(resultData || allText).slice(0, 2000),
    }, { status: 422 });

  } catch (err) {
    return Response.json({ error: "Erreur: " + err.message }, { status: 500 });
  }
}
