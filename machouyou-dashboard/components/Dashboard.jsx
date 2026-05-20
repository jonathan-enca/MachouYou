"use client";
import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Legend } from "recharts";

const RAW_DATA = {"account_weekly":[{"week":"2025-11-24","spend":1351.21,"impressions":221785,"clicks":5073,"reach":95767,"lp_views":1325,"view_content":847,"atc":1069,"ic":105,"purchases":58,"atc_value":28019.44,"purchase_value":1115.25},{"week":"2025-12-01","spend":1431.45,"impressions":258357,"clicks":5153,"reach":136004,"lp_views":1827,"view_content":1057,"atc":1313,"ic":111,"purchases":67,"atc_value":32896.93,"purchase_value":1489.0},{"week":"2025-12-08","spend":1878.23,"impressions":362570,"clicks":8185,"reach":199419,"lp_views":2888,"view_content":1469,"atc":896,"ic":151,"purchases":77,"atc_value":22362.67,"purchase_value":1824.5},{"week":"2025-12-15","spend":1457.58,"impressions":311207,"clicks":8192,"reach":145967,"lp_views":2642,"view_content":1488,"atc":251,"ic":91,"purchases":56,"atc_value":5182.82,"purchase_value":1030.85},{"week":"2025-12-22","spend":1048.98,"impressions":283915,"clicks":5644,"reach":121200,"lp_views":2049,"view_content":1071,"atc":223,"ic":72,"purchases":42,"atc_value":4667.96,"purchase_value":486.96},{"week":"2025-12-29","spend":1040.08,"impressions":341270,"clicks":4995,"reach":136810,"lp_views":2054,"view_content":1246,"atc":244,"ic":81,"purchases":63,"atc_value":4935.6,"purchase_value":848.0},{"week":"2026-01-05","spend":1151.52,"impressions":309847,"clicks":4742,"reach":117374,"lp_views":1917,"view_content":1198,"atc":255,"ic":95,"purchases":70,"atc_value":4571.25,"purchase_value":1111.49},{"week":"2026-01-12","spend":1234.1,"impressions":302135,"clicks":4280,"reach":129105,"lp_views":1716,"view_content":1019,"atc":217,"ic":63,"purchases":46,"atc_value":3838.53,"purchase_value":542.2},{"week":"2026-01-19","spend":1323.78,"impressions":430448,"clicks":4275,"reach":233512,"lp_views":1497,"view_content":938,"atc":196,"ic":65,"purchases":36,"atc_value":4204.88,"purchase_value":494.16},{"week":"2026-01-26","spend":1328.93,"impressions":355075,"clicks":5087,"reach":177473,"lp_views":1000,"view_content":840,"atc":226,"ic":66,"purchases":40,"atc_value":4406.99,"purchase_value":582.55},{"week":"2026-02-02","spend":1349.98,"impressions":270455,"clicks":6913,"reach":105397,"lp_views":742,"view_content":651,"atc":153,"ic":60,"purchases":31,"atc_value":3101.03,"purchase_value":314.65},{"week":"2026-02-09","spend":1131.94,"impressions":257668,"clicks":6075,"reach":98046,"lp_views":698,"view_content":316,"atc":73,"ic":21,"purchases":11,"atc_value":1498.2,"purchase_value":173.8},{"week":"2026-02-16","spend":686.73,"impressions":133894,"clicks":2213,"reach":46248,"lp_views":708,"view_content":552,"atc":527,"ic":61,"purchases":32,"atc_value":14084.85,"purchase_value":709.88},{"week":"2026-02-23","spend":532.78,"impressions":109680,"clicks":3355,"reach":47922,"lp_views":781,"view_content":577,"atc":606,"ic":52,"purchases":24,"atc_value":16913.31,"purchase_value":623.45},{"week":"2026-03-02","spend":823.15,"impressions":163005,"clicks":3781,"reach":59541,"lp_views":1247,"view_content":916,"atc":1019,"ic":86,"purchases":44,"atc_value":26925.85,"purchase_value":952.55},{"week":"2026-03-09","spend":1936.53,"impressions":339564,"clicks":9357,"reach":135417,"lp_views":3278,"view_content":1874,"atc":1896,"ic":129,"purchases":42,"atc_value":60019.11,"purchase_value":849.3},{"week":"2026-03-16","spend":965.87,"impressions":183350,"clicks":3813,"reach":72727,"lp_views":1001,"view_content":844,"atc":863,"ic":90,"purchases":37,"atc_value":25834.35,"purchase_value":997.9},{"week":"2026-03-23","spend":1184.28,"impressions":342630,"clicks":4935,"reach":198536,"lp_views":1264,"view_content":993,"atc":1033,"ic":121,"purchases":68,"atc_value":29630.79,"purchase_value":1820.55},{"week":"2026-03-30","spend":1536.45,"impressions":512062,"clicks":7125,"reach":308543,"lp_views":1863,"view_content":1274,"atc":665,"ic":148,"purchases":86,"atc_value":17166.6,"purchase_value":1934.34},{"week":"2026-04-06","spend":1574.71,"impressions":648847,"clicks":8150,"reach":427839,"lp_views":2403,"view_content":1223,"atc":1050,"ic":128,"purchases":69,"atc_value":29639.12,"purchase_value":1532.76},{"week":"2026-04-13","spend":1206.93,"impressions":755005,"clicks":5417,"reach":620725,"lp_views":1745,"view_content":938,"atc":985,"ic":81,"purchases":37,"atc_value":27705.59,"purchase_value":575.55},{"week":"2026-04-20","spend":1058.84,"impressions":591374,"clicks":4440,"reach":463581,"lp_views":1014,"view_content":951,"atc":967,"ic":82,"purchases":36,"atc_value":28743.78,"purchase_value":533.5},{"week":"2026-04-27","spend":1413.45,"impressions":469994,"clicks":5133,"reach":247577,"lp_views":1517,"view_content":1535,"atc":1632,"ic":109,"purchases":42,"atc_value":47874.25,"purchase_value":1082.7},{"week":"2026-05-04","spend":1238.53,"impressions":538554,"clicks":4386,"reach":377527,"lp_views":1331,"view_content":1346,"atc":653,"ic":103,"purchases":55,"atc_value":17383.2,"purchase_value":984.96},{"week":"2026-05-11","spend":914.07,"impressions":478937,"clicks":3500,"reach":346765,"lp_views":994,"view_content":1050,"atc":130,"ic":82,"purchases":43,"atc_value":2041.43,"purchase_value":957.57},{"week":"2026-05-18","spend":284.27,"impressions":174335,"clicks":1247,"reach":139106,"lp_views":247,"view_content":304,"atc":35,"ic":26,"purchases":15,"atc_value":1003.9,"purchase_value":422.45}]};

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  bar: "#93A3F8",
  barHover: "#6366F1",
  line: "#1E1B4B",
  good: "#059669",
  bad: "#DC2626",
  neutral: "#6B7280",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  headerBg: "#4F46E5",
  text: "#1E293B",
  textMuted: "#64748B",
};

const fmt = (v, type) => {
  if (v == null || isNaN(v)) return "–";
  if (type === "eur") return `${v.toFixed(2).replace(".", ",")} €`;
  if (type === "eurK") return `${(v/1000).toFixed(1).replace(".", ",")} k€`;
  if (type === "pct") return `${v.toFixed(1).replace(".", ",")} %`;
  if (type === "x") return `${v.toFixed(2).replace(".", ",")}x`;
  if (type === "num") return v.toLocaleString("fr-FR");
  if (type === "numK") return `${(v/1000).toFixed(0)} k`;
  if (type === "numM") return `${(v/1000000).toFixed(2)} M`;
  return String(v);
};

const CHARTS = [
  {
    section: "ACQUISITION",
    items: [
      { title: "ROAS", bar: "purchase_value", barLabel: "Revenue", barFmt: "eurK", line: "roas", lineFmt: "x", calcLine: d => d.spend > 0 ? d.purchase_value / d.spend : 0 },
      { title: "Spend & Impressions", bar: "impressions", barLabel: "Impressions", barFmt: "numK", line: "spend", lineLabel: "Spend", lineFmt: "eur", rightAxis: true },
      { title: "CPM & CPC", bar: "cpm", barLabel: "CPM", barFmt: "eur", line: "cpc", lineLabel: "CPC", lineFmt: "eur", calc: d => ({ cpm: d.impressions > 0 ? d.spend / d.impressions * 1000 : 0, cpc: d.clicks > 0 ? d.spend / d.clicks : 0 }) },
      { title: "Clics & CTR", bar: "clicks", barLabel: "Clics", barFmt: "num", line: "ctr", lineLabel: "CTR", lineFmt: "pct", calcLine: d => d.impressions > 0 ? d.clicks / d.impressions * 100 : 0 },
    ]
  },
  {
    section: "ENGAGEMENT SITE",
    items: [
      { title: "Landing Page Views", bar: "lp_views", barLabel: "LP Views", barFmt: "num", line: "cost_lp", lineLabel: "Coût LP", lineFmt: "eur", calcLine: d => d.lp_views > 0 ? d.spend / d.lp_views : 0 },
      { title: "Vue de Contenu", bar: "view_content", barLabel: "Views Content", barFmt: "num", line: "cost_vc", lineLabel: "Coût VC", lineFmt: "eur", calcLine: d => d.view_content > 0 ? d.spend / d.view_content : 0 },
      { title: "Ajouts au panier", bar: "atc", barLabel: "ATC", barFmt: "num", line: "cost_atc", lineLabel: "Coût ATC", lineFmt: "eur", calcLine: d => d.atc > 0 ? d.spend / d.atc : 0 },
      { title: "Paiements Initiés", bar: "ic", barLabel: "IC", barFmt: "num", line: "cost_ic", lineLabel: "Coût IC", lineFmt: "eur", calcLine: d => d.ic > 0 ? d.spend / d.ic : 0 },
    ]
  },
  {
    section: "CONVERSION",
    items: [
      { title: "Achats", bar: "purchases", barLabel: "Achats", barFmt: "num", line: "cpa", lineLabel: "CPA", lineFmt: "eur", calcLine: d => d.purchases > 0 ? d.spend / d.purchases : 0 },
      { title: "Valeur d'Achat", bar: "purchase_value", barLabel: "Revenue", barFmt: "eurK", line: "aov", lineLabel: "Panier moyen", lineFmt: "eur", calcLine: d => d.purchases > 0 ? d.purchase_value / d.purchases : 0 },
      { title: "Valeur d'ATC", bar: "atc_value", barLabel: "Valeur ATC", barFmt: "eurK", line: null },
    ]
  },
  {
    section: "TAUX DE CONVERSION",
    items: [
      { title: "Tx Conv LP/Clics", lineOnly: true, calcLine: d => d.clicks > 0 ? d.lp_views / d.clicks * 100 : 0, lineFmt: "pct" },
      { title: "Tx Conv Purchase/LP", lineOnly: true, calcLine: d => d.lp_views > 0 ? d.purchases / d.lp_views * 100 : 0, lineFmt: "pct" },
      { title: "Tx Conv ATC/LP", lineOnly: true, calcLine: d => d.lp_views > 0 ? d.atc / d.lp_views * 100 : 0, lineFmt: "pct" },
      { title: "Tx Conv VC/LP", lineOnly: true, calcLine: d => d.lp_views > 0 ? d.view_content / d.lp_views * 100 : 0, lineFmt: "pct" },
      { title: "Tx Conv IC/ATC", lineOnly: true, calcLine: d => d.atc > 0 ? d.ic / d.atc * 100 : 0, lineFmt: "pct" },
      { title: "Tx Conv Purchase/Checkout", lineOnly: true, calcLine: d => d.ic > 0 ? d.purchases / d.ic * 100 : 0, lineFmt: "pct" },
      { title: "Tx Conv Purchase/ATC", lineOnly: true, calcLine: d => d.atc > 0 ? d.purchases / d.atc * 100 : 0, lineFmt: "pct" },
      { title: "ATC / ViewContent", lineOnly: true, calcLine: d => d.view_content > 0 ? d.atc / d.view_content * 100 : 0, lineFmt: "pct" },
    ]
  }
];

const CustomTooltip = ({ active, payload, label, fmts }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, fontSize: 12, color: COLORS.text, marginBottom: 4 }}>Sem. {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.text }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: COLORS.textMuted }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{fmts?.[p.dataKey] ? fmt(p.value, fmts[p.dataKey]) : fmt(p.value, "num")}</span>
        </div>
      ))}
    </div>
  );
};

function ChartCard({ config, data }) {
  const { title, bar, barLabel, barFmt, line, lineLabel, lineFmt, calcLine, calc, lineOnly, rightAxis } = config;

  const chartData = useMemo(() => data.map(d => {
    const label = d.week.slice(5).replace("-", "/");
    const result = { label, [bar]: d[bar] };
    if (calc) {
      const computed = calc(d);
      Object.assign(result, computed);
    }
    if (calcLine) {
      const lineKey = line || "lineVal";
      result[lineKey] = calcLine(d);
    }
    if (bar) result[bar] = d[bar];
    return result;
  }), [data]);

  const lineKey = line || "lineVal";
  const fmts = { [bar]: barFmt, [lineKey]: lineFmt };

  if (lineOnly) {
    const lineData = data.map(d => ({ label: d.week.slice(5).replace("-", "/"), lineVal: calcLine(d) }));
    return (
      <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
        <div style={{ background: COLORS.headerBg, padding: "8px 16px" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>{title}</span>
        </div>
        <div style={{ padding: "12px 8px 4px" }}>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: COLORS.textMuted }} interval={Math.max(0, Math.floor(lineData.length / 8))} />
              <YAxis tick={{ fontSize: 9, fill: COLORS.textMuted }} tickFormatter={v => fmt(v, lineFmt)} width={50} />
              <Tooltip content={<CustomTooltip fmts={{ lineVal: lineFmt }} />} />
              <Line type="monotone" dataKey="lineVal" name={title} stroke={COLORS.primary} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.primary }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
      <div style={{ background: COLORS.headerBg, padding: "8px 16px" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>{title}</span>
      </div>
      <div style={{ padding: "12px 8px 4px" }}>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: COLORS.textMuted }} interval={Math.max(0, Math.floor(chartData.length / 8))} />
            <YAxis yAxisId="left" tick={{ fontSize: 9, fill: COLORS.textMuted }} tickFormatter={v => barFmt === "eurK" || barFmt === "numK" ? fmt(v, barFmt) : fmt(v, barFmt)} width={55} />
            {(line || calcLine) && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: COLORS.textMuted }} tickFormatter={v => fmt(v, lineFmt)} width={50} />}
            <Tooltip content={<CustomTooltip fmts={fmts} />} />
            <Bar yAxisId="left" dataKey={bar} name={barLabel || bar} fill={COLORS.bar} radius={[3, 3, 0, 0]} />
            {(line || calcLine) && <Line yAxisId="right" type="monotone" dataKey={lineKey} name={lineLabel || line} stroke={COLORS.line} strokeWidth={2.5} dot={{ r: 2.5, fill: COLORS.line }} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [liveData, setLiveData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const activeData = liveData || RAW_DATA;
  const allWeeks = activeData.account_weekly.map(w => w.week);
  const [startWeek, setStartWeek] = useState(allWeeks[0]);
  const [endWeek, setEndWeek] = useState(allWeeks[allWeeks.length - 1]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshStatus("Connexion à Meta Ads via Claude...");
    try {
      const res = await fetch("/api/refresh", { method: "POST" });
      const json = await res.json();
      if (json.success && json.data?.account_weekly?.length > 0) {
        setLiveData(json.data);
        const newWeeks = json.data.account_weekly.map(w => w.week);
        setStartWeek(newWeeks[0]);
        setEndWeek(newWeeks[newWeeks.length - 1]);
        setLastUpdated(new Date().toLocaleString("fr-FR"));
        setRefreshStatus("Données mises à jour !");
        setTimeout(() => setRefreshStatus(null), 3000);
      } else {
        setRefreshStatus("Erreur : " + (json.error || "données non extraites"));
        setTimeout(() => setRefreshStatus(null), 5000);
      }
    } catch (err) {
      setRefreshStatus("Erreur réseau : " + err.message);
      setTimeout(() => setRefreshStatus(null), 5000);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredData = useMemo(() => {
    return activeData.account_weekly.filter(w => w.week >= startWeek && w.week <= endWeek);
  }, [startWeek, endWeek]);

  const totals = useMemo(() => {
    const t = { spend: 0, impressions: 0, clicks: 0, lp_views: 0, atc: 0, ic: 0, purchases: 0, purchase_value: 0 };
    filteredData.forEach(d => { Object.keys(t).forEach(k => t[k] += d[k]); });
    t.roas = t.spend > 0 ? t.purchase_value / t.spend : 0;
    t.cpa = t.purchases > 0 ? t.spend / t.purchases : 0;
    t.ctr = t.impressions > 0 ? t.clicks / t.impressions * 100 : 0;
    t.aov = t.purchases > 0 ? t.purchase_value / t.purchases : 0;
    return t;
  }, [filteredData]);

  const kpis = [
    { label: "Spend", value: fmt(totals.spend, "eur"), color: COLORS.text },
    { label: "ROAS", value: fmt(totals.roas, "x"), color: totals.roas >= 1 ? COLORS.good : COLORS.bad },
    { label: "Achats", value: fmt(totals.purchases, "num"), color: COLORS.text },
    { label: "CPA", value: fmt(totals.cpa, "eur"), color: totals.cpa < 20 ? COLORS.good : COLORS.bad },
    { label: "Revenue", value: fmt(totals.purchase_value, "eur"), color: COLORS.text },
    { label: "Panier Ø", value: fmt(totals.aov, "eur"), color: COLORS.text },
    { label: "CTR", value: fmt(totals.ctr, "pct"), color: COLORS.text },
  ];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", padding: 0, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)", padding: "24px 32px 20px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>MACHOUYOU</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.8 }}>Dashboard Funnel — Meta Ads</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label style={{ fontSize: 12, opacity: 0.7 }}>Du</label>
            <select value={startWeek} onChange={e => setStartWeek(e.target.value)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 10px", fontSize: 12 }}>
              {allWeeks.map(w => <option key={w} value={w} style={{ color: "#000" }}>{w}</option>)}
            </select>
            <label style={{ fontSize: 12, opacity: 0.7 }}>au</label>
            <select value={endWeek} onChange={e => setEndWeek(e.target.value)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 10px", fontSize: 12 }}>
              {allWeeks.map(w => <option key={w} value={w} style={{ color: "#000" }}>{w}</option>)}
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                background: refreshing ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: refreshing ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
            >
              <span style={{ display: "inline-block", animation: refreshing ? "spin 1s linear infinite" : "none" }}>↻</span>
              {refreshing ? "Chargement..." : "Rafraîchir"}
            </button>
          </div>
        </div>

        {/* Refresh status */}
        {(refreshStatus || lastUpdated) && (
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.7, display: "flex", gap: 16 }}>
            {refreshStatus && <span style={{ color: refreshStatus.startsWith("Erreur") ? "#FCA5A5" : "#A7F3D0" }}>{refreshStatus}</span>}
            {lastUpdated && !refreshStatus && <span>Dernière mise à jour : {lastUpdated}</span>}
          </div>
        )}

        {/* KPI bar */}
        <div style={{ display: "flex", gap: 0, marginTop: 20, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ flex: 1, padding: "12px 16px", borderRight: i < kpis.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none", textAlign: "center" }}>
              <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1 }}>{k.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: k.color === COLORS.text ? "#fff" : k.color }}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div style={{ padding: "24px 24px" }}>
        {CHARTS.map((section, si) => (
          <div key={si} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: COLORS.primary, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${COLORS.primary}` }}>
              {section.section}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
              {section.items.map((chart, ci) => (
                <ChartCard key={ci} config={chart} data={filteredData} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "16px 0 32px", color: COLORS.textMuted, fontSize: 11 }}>
        Données extraites via Pipeboard MCP — {filteredData.length} semaines affichées
      </div>
    </div>
  );
}
