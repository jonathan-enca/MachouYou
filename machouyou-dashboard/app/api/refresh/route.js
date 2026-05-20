export const maxDuration = 60;

export async function POST() {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || "802144206480252";

  if (!ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

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
        max_tokens: 8000,
        mcp_servers: [
          {
            type: "url",
            url: "https://mcp.pipeboard.co/meta-ads-mcp",
            name: "meta-ads",
          },
        ],
        messages: [
          {
            role: "user",
            content: `You are a data extraction assistant. Your ONLY job is to return raw JSON data, nothing else.

Use the Meta Ads MCP tools to fetch weekly performance data for ad account ${META_AD_ACCOUNT_ID}.

Steps:
1. Call get_insights for the ad account with these parameters:
   - level: account
   - time_range: last 6 months (from 6 months ago to today)
   - time_increment: 7 (weekly breakdown)
   - fields: spend, impressions, clicks, reach, actions, action_values
   
2. From the results, extract weekly data points. For each week, extract:
   - week: the start date (YYYY-MM-DD)
   - spend
   - impressions  
   - clicks
   - reach
   - lp_views: from actions where action_type = "landing_page_view"
   - view_content: from actions where action_type = "offsite_conversion.fb_pixel_view_content"
   - atc: from actions where action_type = "offsite_conversion.fb_pixel_add_to_cart"
   - ic: from actions where action_type = "offsite_conversion.fb_pixel_initiate_checkout"
   - purchases: from actions where action_type = "offsite_conversion.fb_pixel_purchase"
   - atc_value: from action_values where action_type = "offsite_conversion.fb_pixel_add_to_cart"
   - purchase_value: from action_values where action_type = "offsite_conversion.fb_pixel_purchase"

3. Return ONLY a valid JSON object in this exact format, no explanation, no markdown:
{"account_weekly":[{"week":"YYYY-MM-DD","spend":0,"impressions":0,"clicks":0,"reach":0,"lp_views":0,"view_content":0,"atc":0,"ic":0,"purchases":0,"atc_value":0,"purchase_value":0}]}

If any field is missing, use 0. Return ONLY the JSON, no other text.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return Response.json({ error: "Anthropic API error", details: errText }, { status: 502 });
    }

    const data = await response.json();

    // Extract all text and tool result content
    let allText = "";
    for (const block of data.content || []) {
      if (block.type === "text" && block.text) {
        allText += block.text;
      }
      if (block.type === "mcp_tool_result" && block.content) {
        for (const sub of block.content) {
          if (sub.text) allText += sub.text;
        }
      }
    }

    // Try to find JSON in the response
    const jsonMatch = allText.match(/\{"account_weekly"\s*:\s*\[[\s\S]*?\]\s*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return Response.json({ success: true, data: parsed, updated_at: new Date().toISOString() });
      } catch (e) {
        // JSON found but couldn't parse
      }
    }

    // If Claude couldn't extract structured data, return the raw response for debugging
    return Response.json({
      success: false,
      error: "Could not extract structured data from Meta Ads",
      raw_response: allText.slice(0, 3000),
      updated_at: new Date().toISOString(),
    }, { status: 422 });

  } catch (err) {
    console.error("Refresh error:", err);
    return Response.json({ error: "Internal error", message: err.message }, { status: 500 });
  }
}
