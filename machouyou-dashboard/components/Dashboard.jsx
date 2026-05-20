"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from "recharts";

const INITIAL_DATA = {"account_daily":[
{"date":"2025-11-24","spend":1351.21,"impressions":221785,"clicks":5073,"reach":95767,"lp_views":1325,"view_content":847,"atc":1069,"ic":105,"purchases":58,"atc_value":28019.44,"purchase_value":1115.25,"campaign_name":"","campaign_id":""},
{"date":"2025-12-01","spend":1431.45,"impressions":258357,"clicks":5153,"reach":136004,"lp_views":1827,"view_content":1057,"atc":1313,"ic":111,"purchases":67,"atc_value":32896.93,"purchase_value":1489.0,"campaign_name":"","campaign_id":""},
{"date":"2025-12-08","spend":1878.23,"impressions":362570,"clicks":8185,"reach":199419,"lp_views":2888,"view_content":1469,"atc":896,"ic":151,"purchases":77,"atc_value":22362.67,"purchase_value":1824.5,"campaign_name":"","campaign_id":""},
{"date":"2025-12-15","spend":1457.58,"impressions":311207,"clicks":8192,"reach":145967,"lp_views":2642,"view_content":1488,"atc":251,"ic":91,"purchases":56,"atc_value":5182.82,"purchase_value":1030.85,"campaign_name":"","campaign_id":""},
{"date":"2025-12-22","spend":1048.98,"impressions":283915,"clicks":5644,"reach":121200,"lp_views":2049,"view_content":1071,"atc":223,"ic":72,"purchases":42,"atc_value":4667.96,"purchase_value":486.96,"campaign_name":"","campaign_id":""},
{"date":"2025-12-29","spend":1040.08,"impressions":341270,"clicks":4995,"reach":136810,"lp_views":2054,"view_content":1246,"atc":244,"ic":81,"purchases":63,"atc_value":4935.6,"purchase_value":848.0,"campaign_name":"","campaign_id":""},
{"date":"2026-01-05","spend":1151.52,"impressions":309847,"clicks":4742,"reach":117374,"lp_views":1917,"view_content":1198,"atc":255,"ic":95,"purchases":70,"atc_value":4571.25,"purchase_value":1111.49,"campaign_name":"","campaign_id":""},
{"date":"2026-01-12","spend":1234.1,"impressions":302135,"clicks":4280,"reach":129105,"lp_views":1716,"view_content":1019,"atc":217,"ic":63,"purchases":46,"atc_value":3838.53,"purchase_value":542.2,"campaign_name":"","campaign_id":""},
{"date":"2026-01-19","spend":1323.78,"impressions":430448,"clicks":4275,"reach":233512,"lp_views":1497,"view_content":938,"atc":196,"ic":65,"purchases":36,"atc_value":4204.88,"purchase_value":494.16,"campaign_name":"","campaign_id":""},
{"date":"2026-01-26","spend":1328.93,"impressions":355075,"clicks":5087,"reach":177473,"lp_views":1000,"view_content":840,"atc":226,"ic":66,"purchases":40,"atc_value":4406.99,"purchase_value":582.55,"campaign_name":"","campaign_id":""},
{"date":"2026-02-02","spend":1349.98,"impressions":270455,"clicks":6913,"reach":105397,"lp_views":742,"view_content":651,"atc":153,"ic":60,"purchases":31,"atc_value":3101.03,"purchase_value":314.65,"campaign_name":"","campaign_id":""},
{"date":"2026-02-09","spend":1131.94,"impressions":257668,"clicks":6075,"reach":98046,"lp_views":698,"view_content":316,"atc":73,"ic":21,"purchases":11,"atc_value":1498.2,"purchase_value":173.8,"campaign_name":"","campaign_id":""},
{"date":"2026-02-16","spend":686.73,"impressions":133894,"clicks":2213,"reach":46248,"lp_views":708,"view_content":552,"atc":527,"ic":61,"purchases":32,"atc_value":14084.85,"purchase_value":709.88,"campaign_name":"","campaign_id":""},
{"date":"2026-02-23","spend":532.78,"impressions":109680,"clicks":3355,"reach":47922,"lp_views":781,"view_content":577,"atc":606,"ic":52,"purchases":24,"atc_value":16913.31,"purchase_value":623.45,"campaign_name":"","campaign_id":""},
{"date":"2026-03-02","spend":823.15,"impressions":163005,"clicks":3781,"reach":59541,"lp_views":1247,"view_content":916,"atc":1019,"ic":86,"purchases":44,"atc_value":26925.85,"purchase_value":952.55,"campaign_name":"","campaign_id":""},
{"date":"2026-03-09","spend":1936.53,"impressions":339564,"clicks":9357,"reach":135417,"lp_views":3278,"view_content":1874,"atc":1896,"ic":129,"purchases":42,"atc_value":60019.11,"purchase_value":849.3,"campaign_name":"","campaign_id":""},
{"date":"2026-03-16","spend":965.87,"impressions":183350,"clicks":3813,"reach":72727,"lp_views":1001,"view_content":844,"atc":863,"ic":90,"purchases":37,"atc_value":25834.35,"purchase_value":997.9,"campaign_name":"","campaign_id":""},
{"date":"2026-03-23","spend":1184.28,"impressions":342630,"clicks":4935,"reach":198536,"lp_views":1264,"view_content":993,"atc":1033,"ic":121,"purchases":68,"atc_value":29630.79,"purchase_value":1820.55,"campaign_name":"","campaign_id":""},
{"date":"2026-03-30","spend":1536.45,"impressions":512062,"clicks":7125,"reach":308543,"lp_views":1863,"view_content":1274,"atc":665,"ic":148,"purchases":86,"atc_value":17166.6,"purchase_value":1934.34,"campaign_name":"","campaign_id":""},
{"date":"2026-04-06","spend":1574.71,"impressions":648847,"clicks":8150,"reach":427839,"lp_views":2403,"view_content":1223,"atc":1050,"ic":128,"purchases":69,"atc_value":29639.12,"purchase_value":1532.76,"campaign_name":"","campaign_id":""},
{"date":"2026-04-13","spend":1206.93,"impressions":755005,"clicks":5417,"reach":620725,"lp_views":1745,"view_content":938,"atc":985,"ic":81,"purchases":37,"atc_value":27705.59,"purchase_value":575.55,"campaign_name":"","campaign_id":""},
{"date":"2026-04-20","spend":1058.84,"impressions":591374,"clicks":4440,"reach":463581,"lp_views":1014,"view_content":951,"atc":967,"ic":82,"purchases":36,"atc_value":28743.78,"purchase_value":533.5,"campaign_name":"","campaign_id":""},
{"date":"2026-04-27","spend":1413.45,"impressions":469994,"clicks":5133,"reach":247577,"lp_views":1517,"view_content":1535,"atc":1632,"ic":109,"purchases":42,"atc_value":47874.25,"purchase_value":1082.7,"campaign_name":"","campaign_id":""},
{"date":"2026-05-04","spend":1238.53,"impressions":538554,"clicks":4386,"reach":377527,"lp_views":1331,"view_content":1346,"atc":653,"ic":103,"purchases":55,"atc_value":17383.2,"purchase_value":984.96,"campaign_name":"","campaign_id":""},
{"date":"2026-05-11","spend":914.07,"impressions":478937,"clicks":3500,"reach":346765,"lp_views":994,"view_content":1050,"atc":130,"ic":82,"purchases":43,"atc_value":2041.43,"purchase_value":957.57,"campaign_name":"","campaign_id":""},
{"date":"2026-05-18","spend":284.27,"impressions":174335,"clicks":1247,"reach":139106,"lp_views":247,"view_content":304,"atc":35,"ic":26,"purchases":15,"atc_value":1003.9,"purchase_value":422.45,"campaign_name":"","campaign_id":""}
]};

const CL = {
  primary: "#4F46E5", bar: "#93A3F8", line: "#1E1B4B",
  good: "#059669", bad: "#DC2626", bg: "#F8FAFC", card: "#FFFFFF",
  border: "#E2E8F0", text: "#1E293B", textMuted: "#64748B",
  gPrimary: "#1A73E8", gBar: "#8AB4F8", gLine: "#0D47A1",
};

const fmt = (v, type) => {
  if (v == null || isNaN(v)) return "\u2013";
  if (type === "eur") return v.toFixed(2).replace(".", ",") + " \u20AC";
  if (type === "eurK") return (v/1000).toFixed(1).replace(".", ",") + " k\u20AC";
  if (type === "pct") return v.toFixed(1).replace(".", ",") + " %";
  if (type === "x") return v.toFixed(2).replace(".", ",") + "x";
  if (type === "num") return v.toLocaleString("fr-FR");
  if (type === "numK") return (v/1000).toFixed(0) + " k";
  return String(v);
};

const CHARTS = [
  { section: "ACQUISITION", items: [
    { title: "ROAS", bar: "purchase_value", barLabel: "Revenue", barFmt: "eurK", line: "roas", lineFmt: "x", calcLine: d => d.spend > 0 ? d.purchase_value / d.spend : 0 },
    { title: "Spend & Impressions", bar: "impressions", barLabel: "Impressions", barFmt: "numK", line: "spend", lineLabel: "Spend", lineFmt: "eur", rightAxis: true },
    { title: "CPM & CPC", bar: "cpm", barLabel: "CPM", barFmt: "eur", line: "cpc", lineLabel: "CPC", lineFmt: "eur", calc: d => ({ cpm: d.impressions > 0 ? d.spend / d.impressions * 1000 : 0, cpc: d.clicks > 0 ? d.spend / d.clicks : 0 }) },
    { title: "Clics & CTR", bar: "clicks", barLabel: "Clics", barFmt: "num", line: "ctr", lineLabel: "CTR", lineFmt: "pct", calcLine: d => d.impressions > 0 ? d.clicks / d.impressions * 100 : 0 },
  ]},
  { section: "ENGAGEMENT SITE", items: [
    { title: "Landing Page Views", bar: "lp_views", barLabel: "LP Views", barFmt: "num", line: "cost_lp", lineLabel: "Co\u00FBt LP", lineFmt: "eur", calcLine: d => d.lp_views > 0 ? d.spend / d.lp_views : 0 },
    { title: "Vue de Contenu", bar: "view_content", barLabel: "Views Content", barFmt: "num", line: "cost_vc", lineLabel: "Co\u00FBt VC", lineFmt: "eur", calcLine: d => d.view_content > 0 ? d.spend / d.view_content : 0 },
    { title: "Ajouts au panier", bar: "atc", barLabel: "ATC", barFmt: "num", line: "cost_atc", lineLabel: "Co\u00FBt ATC", lineFmt: "eur", calcLine: d => d.atc > 0 ? d.spend / d.atc : 0 },
    { title: "Paiements Initi\u00E9s", bar: "ic", barLabel: "IC", barFmt: "num", line: "cost_ic", lineLabel: "Co\u00FBt IC", lineFmt: "eur", calcLine: d => d.ic > 0 ? d.spend / d.ic : 0 },
  ]},
  { section: "CONVERSION", items: [
    { title: "Achats", bar: "purchases", barLabel: "Achats", barFmt: "num", line: "cpa", lineLabel: "CPA", lineFmt: "eur", calcLine: d => d.purchases > 0 ? d.spend / d.purchases : 0 },
    { title: "Valeur d'Achat", bar: "purchase_value", barLabel: "Revenue", barFmt: "eurK", line: "aov", lineLabel: "Panier moyen", lineFmt: "eur", calcLine: d => d.purchases > 0 ? d.purchase_value / d.purchases : 0 },
    { title: "Valeur d'ATC", bar: "atc_value", barLabel: "Valeur ATC", barFmt: "eurK", line: null },
  ]},
  { section: "TAUX DE CONVERSION", items: [
    { title: "Tx Conv LP/Clics", lineOnly: true, calcLine: d => d.clicks > 0 ? d.lp_views / d.clicks * 100 : 0, lineFmt: "pct" },
    { title: "Tx Conv Purchase/LP", lineOnly: true, calcLine: d => d.lp_views > 0 ? d.purchases / d.lp_views * 100 : 0, lineFmt: "pct" },
    { title: "Tx Conv ATC/LP", lineOnly: true, calcLine: d => d.lp_views > 0 ? d.atc / d.lp_views * 100 : 0, lineFmt: "pct" },
    { title: "Tx Conv VC/LP", lineOnly: true, calcLine: d => d.lp_views > 0 ? d.view_content / d.lp_views * 100 : 0, lineFmt: "pct" },
    { title: "Tx Conv IC/ATC", lineOnly: true, calcLine: d => d.atc > 0 ? d.ic / d.atc * 100 : 0, lineFmt: "pct" },
    { title: "Tx Conv Purchase/Checkout", lineOnly: true, calcLine: d => d.ic > 0 ? d.purchases / d.ic * 100 : 0, lineFmt: "pct" },
    { title: "Tx Conv Purchase/ATC", lineOnly: true, calcLine: d => d.atc > 0 ? d.purchases / d.atc * 100 : 0, lineFmt: "pct" },
    { title: "ATC / ViewContent", lineOnly: true, calcLine: d => d.view_content > 0 ? d.atc / d.view_content * 100 : 0, lineFmt: "pct" },
  ]},
];

const CustomTooltip = ({ active, payload, label, fmts }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", zIndex: 100 }}>
      <div style={{ fontWeight: 600, fontSize: 12, color: CL.text, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: CL.text }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: CL.textMuted }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{fmts?.[p.dataKey] ? fmt(p.value, fmts[p.dataKey]) : fmt(p.value, "num")}</span>
        </div>
      ))}
    </div>
  );
};

function ChartCard({ config, data, theme }) {
  const { title, bar, barLabel, barFmt, line, lineLabel, lineFmt, calcLine, calc, lineOnly } = config;
  const barColor = theme === "google" ? CL.gBar : CL.bar;
  const lineColor = theme === "google" ? CL.gLine : CL.line;
  const headerColor = theme === "google" ? CL.gPrimary : CL.primary;

  const chartData = useMemo(() => data.map(d => {
    const label = d.date ? d.date.slice(5).replace("-", "/") : "";
    const result = { label };
    if (bar) result[bar] = d[bar];
    if (calc) Object.assign(result, calc(d));
    if (calcLine) result[line || "lineVal"] = calcLine(d);
    if (line && !calcLine && !calc) result[line] = d[line];
    return result;
  }), [data, bar, calc, calcLine, line]);

  const lineKey = line || "lineVal";
  const fmts = { [bar]: barFmt, [lineKey]: lineFmt };
  const interval = Math.max(0, Math.floor(chartData.length / 10));

  if (lineOnly) {
    const lineData = data.map(d => ({ label: d.date ? d.date.slice(5).replace("-", "/") : "", lineVal: calcLine(d) }));
    return (
      <div style={{ background: CL.card, borderRadius: 12, border: "1px solid " + CL.border, overflow: "hidden" }}>
        <div style={{ background: headerColor, padding: "8px 16px" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>{title}</span>
        </div>
        <div style={{ padding: "12px 8px 4px" }}>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: CL.textMuted }} interval={interval} />
              <YAxis tick={{ fontSize: 9, fill: CL.textMuted }} tickFormatter={v => fmt(v, lineFmt)} width={50} />
              <Tooltip content={<CustomTooltip fmts={{ lineVal: lineFmt }} />} />
              <Line type="monotone" dataKey="lineVal" name={title} stroke={headerColor} strokeWidth={2.5} dot={{ r: 2.5, fill: headerColor }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: CL.card, borderRadius: 12, border: "1px solid " + CL.border, overflow: "hidden" }}>
      <div style={{ background: headerColor, padding: "8px 16px" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>{title}</span>
      </div>
      <div style={{ padding: "12px 8px 4px" }}>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: CL.textMuted }} interval={interval} />
            <YAxis yAxisId="left" tick={{ fontSize: 9, fill: CL.textMuted }} tickFormatter={v => fmt(v, barFmt)} width={55} />
            {(line || calcLine) && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: CL.textMuted }} tickFormatter={v => fmt(v, lineFmt)} width={50} />}
            <Tooltip content={<CustomTooltip fmts={fmts} />} />
            <Bar yAxisId="left" dataKey={bar} name={barLabel || bar} fill={barColor} radius={[3, 3, 0, 0]} />
            {(line || calcLine) && <Line yAxisId="right" type="monotone" dataKey={lineKey} name={lineLabel || line} stroke={lineColor} strokeWidth={2.5} dot={{ r: 2.5, fill: lineColor }} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function aggregateByWeek(daily) {
  const weeks = {};
  for (const d of daily) {
    const dt = new Date(d.date);
    const day = dt.getDay();
    const monday = new Date(dt);
    monday.setDate(dt.getDate() - ((day + 6) % 7));
    const key = monday.toISOString().slice(0, 10);
    if (!weeks[key]) weeks[key] = { date: key, spend:0, impressions:0, clicks:0, reach:0, lp_views:0, view_content:0, atc:0, ic:0, purchases:0, atc_value:0, purchase_value:0 };
    const w = weeks[key];
    w.spend+=d.spend; w.impressions+=d.impressions; w.clicks+=d.clicks; w.reach+=d.reach;
    w.lp_views+=d.lp_views; w.view_content+=d.view_content; w.atc+=d.atc; w.ic+=d.ic;
    w.purchases+=d.purchases; w.atc_value+=d.atc_value; w.purchase_value+=d.purchase_value;
  }
  return Object.values(weeks).sort((a,b) => a.date.localeCompare(b.date));
}

function aggregateByDate(rows, campaignFilter) {
  let filtered = rows;
  if (campaignFilter && campaignFilter !== "all") {
    filtered = rows.filter(r => r.campaign_name === campaignFilter);
  }
  const byDate = {};
  for (const d of filtered) {
    if (!byDate[d.date]) byDate[d.date] = { date: d.date, spend:0, impressions:0, clicks:0, reach:0, lp_views:0, view_content:0, atc:0, ic:0, purchases:0, atc_value:0, purchase_value:0 };
    const t = byDate[d.date];
    t.spend+=d.spend; t.impressions+=d.impressions; t.clicks+=d.clicks; t.reach+=d.reach;
    t.lp_views+=d.lp_views; t.view_content+=d.view_content; t.atc+=d.atc; t.ic+=d.ic;
    t.purchases+=d.purchases; t.atc_value+=d.atc_value; t.purchase_value+=d.purchase_value;
  }
  return Object.values(byDate).sort((a,b) => a.date.localeCompare(b.date));
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("meta");
  const [granularity, setGranularity] = useState("week");
  const [rawData, setRawData] = useState({ meta: INITIAL_DATA, google: null });
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState(null);
  const [campaign, setCampaign] = useState("all");

  const today = new Date().toISOString().slice(0, 10);
  const defaultStart = new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(today);

  const sourceData = rawData[activeTab];
  const allRows = sourceData?.account_daily || [];

  const campaignList = useMemo(() => {
    const names = new Set();
    allRows.forEach(r => { if (r.campaign_name) names.add(r.campaign_name); });
    return ["all", ...Array.from(names).sort()];
  }, [allRows]);

  useEffect(() => { setCampaign("all"); }, [activeTab]);

  const filteredData = useMemo(() => {
    const dateFiltered = allRows.filter(d => d.date >= startDate && d.date <= endDate);
    const daily = aggregateByDate(dateFiltered, campaign);
    if (granularity === "week") return aggregateByWeek(daily);
    return daily;
  }, [allRows, startDate, endDate, campaign, granularity]);

  const totals = useMemo(() => {
    const t = { spend:0, impressions:0, clicks:0, lp_views:0, atc:0, ic:0, purchases:0, purchase_value:0 };
    filteredData.forEach(d => { Object.keys(t).forEach(k => t[k] += d[k]); });
    t.roas = t.spend > 0 ? t.purchase_value / t.spend : 0;
    t.cpa = t.purchases > 0 ? t.spend / t.purchases : 0;
    t.ctr = t.impressions > 0 ? t.clicks / t.impressions * 100 : 0;
    t.aov = t.purchases > 0 ? t.purchase_value / t.purchases : 0;
    return t;
  }, [filteredData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshStatus("Connexion \u00E0 " + (activeTab === "meta" ? "Meta" : "Google") + " Ads...");
    try {
      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: activeTab, since: startDate, until: endDate }),
      });
      const json = await res.json();
      if (json.success && json.data?.account_daily?.length > 0) {
        setRawData(prev => ({ ...prev, [activeTab]: json.data }));
        setRefreshStatus("\u2713 " + json.data.account_daily.length + " jours charg\u00E9s");
        setTimeout(() => setRefreshStatus(null), 4000);
      } else {
        setRefreshStatus("Erreur : " + (json.error || "Pas de donn\u00E9es"));
        setTimeout(() => setRefreshStatus(null), 8000);
      }
    } catch (err) {
      setRefreshStatus("Erreur r\u00E9seau : " + err.message);
      setTimeout(() => setRefreshStatus(null), 8000);
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, startDate, endDate]);

  const kpis = [
    { label: "Spend", value: fmt(totals.spend, "eur") },
    { label: "ROAS", value: fmt(totals.roas, "x"), color: totals.roas >= 1 ? CL.good : CL.bad },
    { label: "Achats", value: fmt(totals.purchases, "num") },
    { label: "CPA", value: fmt(totals.cpa, "eur"), color: totals.cpa < 20 ? CL.good : CL.bad },
    { label: "Revenue", value: fmt(totals.purchase_value, "eur") },
    { label: "Panier \u00D8", value: fmt(totals.aov, "eur") },
    { label: "CTR", value: fmt(totals.ctr, "pct") },
  ];

  const accentColor = activeTab === "google" ? CL.gPrimary : CL.primary;
  const gradientBg = activeTab === "google"
    ? "linear-gradient(135deg, #0D47A1 0%, #1A73E8 100%)"
    : "linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)";
  const selSt = { background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 10px", fontSize: 12 };

  return (
    <div style={{ background: CL.bg, minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <div style={{ background: gradientBg, padding: "20px 24px 16px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>MACHOUYOU</h1>
            <p style={{ margin: "2px 0 0", fontSize: 12, opacity: 0.7 }}>Dashboard Funnel</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {["meta", "google"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer",
                border: activeTab === tab ? "2px solid #fff" : "1px solid rgba(255,255,255,0.3)",
                background: activeTab === tab ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)", color: "#fff",
              }}>{tab === "meta" ? "Meta Ads" : "Google Ads"}</button>
            ))}
            <button onClick={handleRefresh} disabled={refreshing} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: refreshing ? "wait" : "pointer",
              border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.15)", color: "#fff",
              opacity: refreshing ? 0.6 : 1,
            }}>{refreshing ? "\u23F3" : "\u21BB"} Rafra\u00EEchir</button>
          </div>
        </div>
        {refreshStatus && (
          <div style={{ marginTop: 8, padding: "6px 12px", background: "rgba(255,255,255,0.15)", borderRadius: 6, fontSize: 12 }}>{refreshStatus}</div>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
          <label style={{ fontSize: 11, opacity: 0.6 }}>Du</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={selSt} />
          <label style={{ fontSize: 11, opacity: 0.6 }}>au</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={selSt} />
          <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />
          <label style={{ fontSize: 11, opacity: 0.6 }}>Granularit\u00E9</label>
          <select value={granularity} onChange={e => setGranularity(e.target.value)} style={selSt}>
            <option value="day" style={{ color: "#000" }}>Jour</option>
            <option value="week" style={{ color: "#000" }}>Semaine</option>
          </select>
          {campaignList.length > 1 && (<>
            <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />
            <label style={{ fontSize: 11, opacity: 0.6 }}>Campagne</label>
            <select value={campaign} onChange={e => setCampaign(e.target.value)} style={{ ...selSt, maxWidth: 250 }}>
              {campaignList.map(c => (
                <option key={c} value={c} style={{ color: "#000" }}>{c === "all" ? "Toutes les campagnes" : c}</option>
              ))}
            </select>
          </>)}
        </div>
        {campaign !== "all" && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, padding: "3px 10px", background: "rgba(255,255,255,0.2)", borderRadius: 20 }}>Filtre : {campaign}</span>
            <button onClick={() => setCampaign("all")} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 11, textDecoration: "underline", opacity: 0.8 }}>R\u00E9initialiser</button>
          </div>
        )}
        <div style={{ display: "flex", gap: 0, marginTop: 14, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ flex: 1, padding: "10px 12px", borderRight: i < kpis.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none", textAlign: "center" }}>
              <div style={{ fontSize: 9, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1 }}>{k.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2, color: k.color || "#fff" }}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "20px 20px" }}>
        {!sourceData ? (
          <div style={{ textAlign: "center", padding: 60, color: CL.textMuted }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>Pas encore de donn\u00E9es {activeTab === "google" ? "Google" : "Meta"} Ads</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Cliquez sur \u21BB Rafra\u00EEchir pour charger les donn\u00E9es live.</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: CL.textMuted }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>Aucune donn\u00E9e sur cette p\u00E9riode</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Essayez d'\u00E9largir la plage de dates ou s\u00E9lectionnez une autre campagne.</p>
          </div>
        ) : CHARTS.map((section, si) => (
          <div key={si} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, paddingBottom: 8, borderBottom: "2px solid " + accentColor }}>
              {section.section}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 14 }}>
              {section.items.map((chart, ci) => (
                <ChartCard key={ci} config={chart} data={filteredData} theme={activeTab} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", padding: "12px 0 28px", color: CL.textMuted, fontSize: 11 }}>
        {filteredData.length} {granularity === "week" ? "semaines" : "jours"} affich\u00E9s
        {campaign !== "all" && (" \u2014 " + campaign)}
      </div>
    </div>
  );
}
