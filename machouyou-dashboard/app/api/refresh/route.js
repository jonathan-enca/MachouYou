export const maxDuration = 60;

// Pipeboard MCP is called directly from Claude tools — the API route
// just needs to call the same tool via JSON-RPC with auth.
// But since Pipeboard returns SSE/streaming on the cloud URL,
// we use the tool directly via the Pipeboard REST-like interface.

function parseAction(actions, actionType) {
  if (!actions) return 0;
  const found = actions.find(a => a.action_type === actionType);
  return found ? parseFloat(found.value) || 0 : 0;
}

function parseSegmentedMetrics(result) {
  const segments = result?.segmented_metrics;
  if (!segments || !Array.isArray(segments)) return null;

  const daily = segments.map(seg => {
    const m = seg.metrics || {};
    const actions = m.actions || [];
    const actionValues = m.action_values || [];

    return {
      date: seg.period || m.date_start || "",
      spend: parseFloat(m.spend) || 0,
      impressions: parseInt(m.impressions) || 0,
      clicks: parseInt(m.clicks) || 0,
      reach: parseInt(m.reach) || 0,
      lp_views: parseAction(actions, "landing_page_view"),
      view_content: parseAction(actions, "offsite_conversion.fb_pixel_view_content"),
      atc: parseAction(actions, "offsite_conversion.fb_pixel_add_to_cart"),
      ic: parseAction(actions, "offsite_conversion.fb_pixel_initiate_checkout"),
      purchases: parseAction(actions, "offsite_conversion.fb_pixel_purchase"),
      atc_value: parseAction(actionValues, "offsite_conversion.fb_pixel_add_to_cart"),
      purchase_value: parseAction(actionValues, "offsite_conversion.fb_pixel_purchase"),
    };
  }).filter(d => d.date);

  return { account_daily: daily.sort((a, b) => a.date.localeCompare(b.date)) };
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "meta";

  // For now, we return instructions for Google Ads (not yet wired)
  if (source === "google") {
    return Response.json({
      success: false,
      error: "Google Ads : connectez Pipeboard Google Ads dans les variables Vercel. Fonctionnalité en cours.",
    }, { status: 422 });
  }

  // Meta Ads: call Pipeboard get_insights tool via MCP JSON-RPC
  const PIPEBOARD_API_KEY = process.env.PIPEBOARD_API_KEY;
  const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || "802144206480252";

  if (!PIPEBOARD_API_KEY) {
    return Response.json({ error: "PIPEBOARD_API_KEY non configurée dans Vercel." }, { status: 500 });
  }

  // Calculate 6 months ago
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const since = sixMonthsAgo.toISOString().slice(0, 10);
  const until = now.toISOString().slice(0, 10);

  try {
    const res = await fetch("https://meta-ads.mcp.pipeboard.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "Authorization": `Bearer ${PIPEBOARD_API_KEY}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "get_insights",
          arguments: {
            object_id: `act_${META_AD_ACCOUNT_ID}`,
            level: "account",
            time_range: { since, until },
            time_breakdown: "day",
          },
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `Pipeboard erreur ${res.status}: ${errText.slice(0, 500)}` }, { status: 502 });
    }

    // Pipeboard may return SSE or JSON — handle both
    const contentType = res.headers.get("content-type") || "";
    let resultData;

    if (contentType.includes("text/event-stream")) {
      // Parse SSE: collect all data lines
      const text = await res.text();
      const lines = text.split("\n");
      let lastData = "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          lastData = line.slice(6);
        }
      }
      if (lastData) {
        try { resultData = JSON.parse(lastData); } catch {}
      }
    } else {
      resultData = await res.json();
    }

    if (!resultData) {
      return Response.json({ error: "Pas de réponse de Pipeboard." }, { status: 502 });
    }

    // The result comes wrapped: resultData.result.content[0].text contains the JSON
    let insightsData;
    const content = resultData?.result?.content;
    if (content && Array.isArray(content)) {
      for (const block of content) {
        if (block.text) {
          try {
            insightsData = JSON.parse(block.text);
            break;
          } catch {
            // Try next block
          }
        }
      }
    }

    // Or it might be returned directly (depending on Pipeboard version)
    if (!insightsData && resultData.segmented_metrics) {
      insightsData = resultData;
    }

    if (!insightsData) {
      return Response.json({
        success: false,
        error: "Format de réponse Pipeboard inattendu.",
        raw_response: JSON.stringify(resultData).slice(0, 2000),
      }, { status: 422 });
    }

    const parsed = parseSegmentedMetrics(insightsData);

    if (parsed?.account_daily?.length > 0) {
      return Response.json({
        success: true,
        data: parsed,
        source: "meta",
        updated_at: new Date().toISOString(),
      });
    }

    return Response.json({
      success: false,
      error: "Aucune donnée daily trouvée dans la réponse.",
      raw_response: JSON.stringify(insightsData).slice(0, 2000),
    }, { status: 422 });

  } catch (err) {
    console.error("Refresh error:", err);
    return Response.json({ error: "Erreur: " + err.message }, { status: 500 });
  }
}
