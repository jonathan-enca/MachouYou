export const maxDuration = 60;

function findAction(actions, actionType) {
  if (!actions) return 0;
  const found = actions.find(a => a.action_type === actionType);
  return found ? parseFloat(found.value) || 0 : 0;
}

function parseSegmentedMetrics(data) {
  const segments = data?.segmented_metrics;
  if (!segments || !Array.isArray(segments)) return null;

  const daily = segments.map(seg => {
    const m = seg.metrics || {};
    const actions = m.actions || [];
    const av = m.action_values || [];
    return {
      date: seg.period || m.date_start || "",
      spend: parseFloat(m.spend) || 0,
      impressions: parseInt(m.impressions) || 0,
      clicks: parseInt(m.clicks) || 0,
      reach: parseInt(m.reach) || 0,
      lp_views: findAction(actions, "landing_page_view"),
      view_content: findAction(actions, "offsite_conversion.fb_pixel_view_content"),
      atc: findAction(actions, "offsite_conversion.fb_pixel_add_to_cart"),
      ic: findAction(actions, "offsite_conversion.fb_pixel_initiate_checkout"),
      purchases: findAction(actions, "offsite_conversion.fb_pixel_purchase"),
      atc_value: findAction(av, "offsite_conversion.fb_pixel_add_to_cart"),
      purchase_value: findAction(av, "offsite_conversion.fb_pixel_purchase"),
    };
  }).filter(d => d.date);

  return daily.length > 0 ? { account_daily: daily.sort((a, b) => a.date.localeCompare(b.date)) } : null;
}

function extractInsights(resultData) {
  // Way 1: segmented_metrics directly on root
  if (resultData?.segmented_metrics) {
    return parseSegmentedMetrics(resultData);
  }
  // Way 2: MCP JSON-RPC wrapper — result.content[].text contains stringified JSON
  if (resultData?.result?.content) {
    for (const block of resultData.result.content) {
      if (block.text || block.type === "text") {
        const txt = block.text || "";
        try {
          const parsed = JSON.parse(txt);
          if (parsed?.segmented_metrics) return parseSegmentedMetrics(parsed);
        } catch {}
      }
    }
  }
  // Way 3: Maybe it's SSE-parsed and nested differently
  if (resultData?.data?.segmented_metrics) {
    return parseSegmentedMetrics(resultData.data);
  }
  return null;
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "meta";

  if (source === "google") {
    return Response.json({
      success: false,
      error: "Google Ads : fonctionnalité en cours de développement.",
    }, { status: 422 });
  }

  const PIPEBOARD_API_KEY = process.env.PIPEBOARD_API_KEY;
  const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || "802144206480252";

  if (!PIPEBOARD_API_KEY) {
    return Response.json({ error: "PIPEBOARD_API_KEY non configurée dans Vercel > Settings > Environment Variables." }, { status: 500 });
  }

  const now = new Date();
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89);
  const since = ninetyDaysAgo.toISOString().slice(0, 10);
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
      return Response.json({ error: `Pipeboard HTTP ${res.status}: ${errText.slice(0, 300)}` }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "";
    let resultData;

    if (contentType.includes("text/event-stream")) {
      // SSE: collect lines, find the last "data:" line with valid JSON
      const text = await res.text();
      const lines = text.split("\n");
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith("data:")) {
          const payload = line.slice(5).trim();
          if (payload && payload !== "[DONE]") {
            try {
              resultData = JSON.parse(payload);
              break;
            } catch {}
          }
        }
      }
      if (!resultData) {
        return Response.json({
          success: false,
          error: "Réponse SSE Pipeboard non parsable.",
          raw_response: text.slice(0, 1500),
        }, { status: 422 });
      }
    } else {
      resultData = await res.json();
    }

    // Check for Pipeboard error response
    if (resultData?.result?.isError) {
      const errMsg = resultData.result.content?.[0]?.text || "Erreur Pipeboard inconnue";
      return Response.json({ success: false, error: `Pipeboard: ${errMsg}` }, { status: 422 });
    }

    const parsed = extractInsights(resultData);

    if (parsed?.account_daily?.length > 0) {
      return Response.json({
        success: true,
        data: parsed,
        source: "meta",
        days: parsed.account_daily.length,
        updated_at: new Date().toISOString(),
      });
    }

    // Debug: show what we got
    const keys = Object.keys(resultData || {});
    const hasResult = !!resultData?.result;
    const hasContent = !!resultData?.result?.content;
    const contentLen = resultData?.result?.content?.length;
    const firstBlockType = resultData?.result?.content?.[0]?.type;
    const firstBlockTextLen = resultData?.result?.content?.[0]?.text?.length;

    return Response.json({
      success: false,
      error: `Parsing échoué. Structure reçue: keys=[${keys}], hasResult=${hasResult}, hasContent=${hasContent}, contentLen=${contentLen}, firstBlockType=${firstBlockType}, firstBlockTextLen=${firstBlockTextLen}`,
      raw_sample: JSON.stringify(resultData).slice(0, 1000),
    }, { status: 422 });

  } catch (err) {
    return Response.json({ error: "Erreur: " + err.message }, { status: 500 });
  }
}
