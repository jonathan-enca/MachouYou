export const maxDuration = 60;

export async function POST(request) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || "802144206480252";

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "meta";

  if (!ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const mcpServer = source === "google"
    ? { type: "url", url: "https://google-ads.mcp.pipeboard.co", name: "google-ads" }
    : { type: "url", url: "https://mcp.pipeboard.co/meta-ads-mcp", name: "meta-ads" };

  const prompt = source === "google"
    ? `You are a data extraction assistant. Return ONLY raw JSON.

Use the Google Ads MCP tools to fetch DAILY performance data for the connected Google Ads account.

Steps:
1. First list the available Google Ads customer accounts to find the right one.
2. Fetch campaign performance metrics with daily breakdown for the last 6 months.
   Use fields: metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions, metrics.conversions_value, and segment by date.
3. Also fetch conversion action metrics to break down by conversion type if possible (page_view, add_to_cart, begin_checkout, purchase).

For each day, compile:
- date: YYYY-MM-DD
- spend: cost in euros (cost_micros / 1000000)
- impressions
- clicks
- reach: use impressions as proxy
- lp_views: page view conversions (or 0)
- view_content: view content conversions (or 0)
- atc: add to cart conversions (or 0)
- ic: begin checkout conversions (or 0)
- purchases: purchase conversions
- atc_value: add to cart conversion value (or 0)
- purchase_value: purchase conversion value

Return ONLY this JSON, no explanation:
{"account_daily":[{"date":"YYYY-MM-DD","spend":0,"impressions":0,"clicks":0,"reach":0,"lp_views":0,"view_content":0,"atc":0,"ic":0,"purchases":0,"atc_value":0,"purchase_value":0}]}`
    : `You are a data extraction assistant. Return ONLY raw JSON.

Use the Meta Ads MCP tools to fetch DAILY performance data for ad account ${META_AD_ACCOUNT_ID}.

Steps:
1. Call get_insights for the ad account with:
   - level: account
   - time_range: last 6 months
   - time_increment: 1 (daily)
   - fields: spend, impressions, clicks, reach, actions, action_values

2. For each day extract:
   - date: YYYY-MM-DD
   - spend, impressions, clicks, reach
   - lp_views: actions where action_type = "landing_page_view"
   - view_content: actions where action_type = "offsite_conversion.fb_pixel_view_content"
   - atc: actions where action_type = "offsite_conversion.fb_pixel_add_to_cart"
   - ic: actions where action_type = "offsite_conversion.fb_pixel_initiate_checkout"
   - purchases: actions where action_type = "offsite_conversion.fb_pixel_purchase"
   - atc_value: action_values where action_type = "offsite_conversion.fb_pixel_add_to_cart"
   - purchase_value: action_values where action_type = "offsite_conversion.fb_pixel_purchase"

Return ONLY this JSON:
{"account_daily":[{"date":"YYYY-MM-DD","spend":0,"impressions":0,"clicks":0,"reach":0,"lp_views":0,"view_content":0,"atc":0,"ic":0,"purchases":0,"atc_value":0,"purchase_value":0}]}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2024-01-01",
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
      return Response.json({ error: "API error", details: errText }, { status: 502 });
    }

    const data = await response.json();

    let allText = "";
    for (const block of data.content || []) {
      if (block.type === "text" && block.text) allText += block.text;
      if (block.type === "mcp_tool_result" && block.content) {
        for (const sub of block.content) { if (sub.text) allText += sub.text; }
      }
    }

    const jsonMatch = allText.match(/\{"account_daily"\s*:\s*\[[\s\S]*?\]\s*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return Response.json({ success: true, data: parsed, source, updated_at: new Date().toISOString() });
      } catch (e) { /* fall through */ }
    }

    return Response.json({
      success: false, error: "Could not extract structured data",
      raw_response: allText.slice(0, 3000), updated_at: new Date().toISOString(),
    }, { status: 422 });

  } catch (err) {
    return Response.json({ error: "Internal error", message: err.message }, { status: 500 });
  }
}
