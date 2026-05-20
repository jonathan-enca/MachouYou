"use client";
import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";

// ─── INITIAL DATA ───
// Meta Ads data (existing)
const META_DATA = {"account_daily":[{"date":"2025-11-24","spend":1351.21,"impressions":221785,"clicks":5073,"reach":95767,"lp_views":1325,"view_content":847,"atc":1069,"ic":105,"purchases":58,"atc_value":28019.44,"purchase_value":1115.25},{"date":"2025-12-01","spend":1431.45,"impressions":258357,"clicks":5153,"reach":136004,"lp_views":1827,"view_content":1057,"atc":1313,"ic":111,"purchases":67,"atc_value":32896.93,"purchase_value":1489.0},{"date":"2025-12-08","spend":1878.23,"impressions":362570,"clicks":8185,"reach":199419,"lp_views":2888,"view_content":1469,"atc":896,"ic":151,"purchases":77,"atc_value":22362.67,"purchase_value":1824.5},{"date":"2025-12-15","spend":1457.58,"impressions":311207,"clicks":8192,"reach":145967,"lp_views":2642,"view_content":1488,"atc":251,"ic":91,"purchases":56,"atc_value":5182.82,"purchase_value":1030.85},{"date":"2025-12-22","spend":1048.98,"impressions":283915,"clicks":5644,"reach":121200,"lp_views":2049,"view_content":1071,"atc":223,"ic":72,"purchases":42,"atc_value":4667.96,"purchase_value":486.96},{"date":"2025-12-29","spend":1040.08,"impressions":341270,"clicks":4995,"reach":136810,"lp_views":2054,"view_content":1246,"atc":244,"ic":81,"purchases":63,"atc_value":4935.6,"purchase_value":848.0},{"date":"2026-01-05","spend":1151.52,"impressions":309847,"clicks":4742,"reach":117374,"lp_views":1917,"view_content":1198,"atc":255,"ic":95,"purchases":70,"atc_value":4571.25,"purchase_value":1111.49},{"date":"2026-01-12","spend":1234.1,"impressions":302135,"clicks":4280,"reach":129105,"lp_views":1716,"view_content":1019,"atc":217,"ic":63,"purchases":46,"atc_value":3838.53,"purchase_value":542.2},{"date":"2026-01-19","spend":1323.78,"impressions":430448,"clicks":4275,"reach":233512,"lp_views":1497,"view_content":938,"atc":196,"ic":65,"purchases":36,"atc_value":4204.88,"purchase_value":494.16},{"date":"2026-01-26","spend":1328.93,"impressions":355075,"clicks":5087,"reach":177473,"lp_views":1000,"view_content":840,"atc":226,"ic":66,"purchases":40,"atc_value":4406.99,"purchase_value":582.55},{"date":"2026-02-02","spend":1349.98,"impressions":270455,"clicks":6913,"reach":105397,"lp_views":742,"view_content":651,"atc":153,"ic":60,"purchases":31,"atc_value":3101.03,"purchase_value":314.65},{"date":"2026-02-09","spend":1131.94,"impressions":257668,"clicks":6075,"reach":98046,"lp_views":698,"view_content":316,"atc":73,"ic":21,"purchases":11,"atc_value":1498.2,"purchase_value":173.8},{"date":"2026-02-16","spend":686.73,"impressions":133894,"clicks":2213,"reach":46248,"lp_views":708,"view_content":552,"atc":527,"ic":61,"purchases":32,"atc_value":14084.85,"purchase_value":709.88},{"date":"2026-02-23","spend":532.78,"impressions":109680,"clicks":3355,"reach":47922,"lp_views":781,"view_content":577,"atc":606,"ic":52,"purchases":24,"atc_value":16913.31,"purchase_value":623.45},{"date":"2026-03-02","spend":823.15,"impressions":163005,"clicks":3781,"reach":59541,"lp_views":1247,"view_content":916,"atc":1019,"ic":86,"purchases":44,"atc_value":26925.85,"purchase_value":952.55},{"date":"2026-03-09","spend":1936.53,"impressions":339564,"clicks":9357,"reach":135417,"lp_views":3278,"view_content":1874,"atc":1896,"ic":129,"purchases":42,"atc_value":60019.11,"purchase_value":849.3},{"date":"2026-03-16","spend":965.87,"impressions":183350,"clicks":3813,"reach":72727,"lp_views":1001,"view_content":844,"atc":863,"ic":90,"purchases":37,"atc_value":25834.35,"purchase_value":997.9},{"date":"2026-03-23","spend":1184.28,"impressions":342630,"clicks":4935,"reach":198536,"lp_views":1264,"view_content":993,"atc":1033,"ic":121,"purchases":68,"atc_value":29630.79,"purchase_value":1820.55},{"date":"2026-03-30","spend":1536.45,"impressions":512062,"clicks":7125,"reach":308543,"lp_views":1863,"view_content":1274,"atc":665,"ic":148,"purchases":86,"atc_value":17166.6,"purchase_value":1934.34},{"date":"2026-04-06","spend":1574.71,"impressions":648847,"clicks":8150,"reach":427839,"lp_views":2403,"view_content":1223,"atc":1050,"ic":128,"purchases":69,"atc_value":29639.12,"purchase_value":1532.76},{"date":"2026-04-13","spend":1206.93,"impressions":755005,"clicks":5417,"reach":620725,"lp_views":1745,"view_content":938,"atc":985,"ic":81,"purchases":37,"atc_value":27705.59,"purchase_value":575.55},{"date":"2026-04-20","spend":1058.84,"impressions":591374,"clicks":4440,"reach":463581,"lp_views":1014,"view_content":951,"atc":967,"ic":82,"purchases":36,"atc_value":28743.78,"purchase_value":533.5},{"date":"2026-04-27","spend":1413.45,"impressions":469994,"clicks":5133,"reach":247577,"lp_views":1517,"view_content":1535,"atc":1632,"ic":109,"purchases":42,"atc_value":47874.25,"purchase_value":1082.7},{"date":"2026-05-04","spend":1238.53,"impressions":538554,"clicks":4386,"reach":377527,"lp_views":1331,"view_content":1346,"atc":653,"ic":103,"purchases":55,"atc_value":17383.2,"purchase_value":984.96},{"date":"2026-05-11","spend":914.07,"impressions":478937,"clicks":3500,"reach":346765,"lp_views":994,"view_content":1050,"atc":130,"ic":82,"purchases":43,"atc_value":2041.43,"purchase_value":957.57},{"date":"2026-05-18","spend":284.27,"impressions":174335,"clicks":1247,"reach":139106,"lp_views":247,"view_content":304,"atc":35,"ic":26,"purchases":15,"atc_value":1003.9,"purchase_value":422.45}]};

// Google Ads placeholder — same shape, will be replaced by live data
const GOOGLE_DATA = {"account_daily":[]};

// ─── CONSTANTS ───
const COLORS = {
  primary: "#4F46E5", primaryLight: "#818CF8", bar: "#93A3F8", line: "#1E1B4B",
  good: "#059669", bad: "#DC2626", neutral: "#6B7280", bg: "#F8FAFC",
  card: "#FFFFFF", border: "#E2E8F0", headerBg: "#4F46E5", text: "#1E293B", textMuted: "#64748B",
  // Google Ads colors
  gPrimary: "#1A73E8", gBar: "#7BCBD6", gLine: "#1A73E8", gHeaderBg: "#1A73E8",
};

const SUM_FIELDS = ["spend", "impressions", "clicks", "reach", "lp_views", "view_content", "atc", "ic", "purchases", "atc_value", "purchase_value"];
const GRAN_LABELS = { day: "Jour", week: "Semaine", month: "Mois" };

// ─── UTILS ───
const fmt = (v, type) => {
  if (v == null || isNaN(v)) return "–";
  if (type === "eur") return `${v.toFixed(2).replace(".", ",")} €`;
  if (type === "eurK") return `${(v/1000).toFixed(1).replace(".", ",")} k€`;
  if (type === "pct") return `${v.toFixed(1).replace(".", ",")} %`;
  if (type === "x") return `${v.toFixed(2).replace(".", ",")}x`;
  if (type === "num") return v.toLocaleString("fr-FR");
  if (type === "numK") return `${(v/1000).toFixed(0)} k`;
  return String(v);
};

function getWeekStart(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday.toISOString().slice(0, 10);
}

function aggregateData(dailyData, granularity) {
  if (granularity === "day") return dailyData;
  const buckets = {};
  dailyData.forEach(d => {
    const key = granularity === "week" ? getWeekStart(d.date) : d.date.slice(0, 7);
    if (!buckets[key]) { buckets[key] = { date: key }; SUM_FIELDS.forEach(f => buckets[key][f] = 0); }
    SUM_FIELDS.forEach(f => buckets[key][f] += (d[f] || 0));
  });
  return Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
}

function formatDateLabel(dateStr, gran) {
  if (gran === "month") {
    const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
    return `${months[parseInt(dateStr.slice(5, 7)) - 1]} ${dateStr.slice(2, 4)}`;
  }
  return dateStr.slice(5).replace("-", "/");
}

function calcDelta(current, previous) {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

// ─── CHART CONFIGS ───
const META_CHARTS = [
  { section: "ACQUISITION", items: [
    { title: "ROAS", bar: "purchase_value", barLabel: "Revenue", barFmt: "eurK", line: "roas", lineFmt: "x", calcLine: d => d.spend > 0 ? d.purchase_value / d.spend : 0 },
    { title: "Spend & Impressions", bar: "impressions", barLabel: "Impressions", barFmt: "numK", line: "spend", lineLabel: "Spend", lineFmt: "eur" },
    { title: "CPM & CPC", bar: "cpm", barLabel: "CPM", barFmt: "eur", line: "cpc", lineLabel: "CPC", lineFmt: "eur", calc: d => ({ cpm: d.impressions > 0 ? d.spend / d.impressions * 1000 : 0, cpc: d.clicks > 0 ? d.spend / d.clicks : 0 }) },
    { title: "Clics & CTR", bar: "clicks", barLabel: "Clics", barFmt: "num", line: "ctr", lineLabel: "CTR", lineFmt: "pct", calcLine: d => d.impressions > 0 ? d.clicks / d.impressions * 100 : 0 },
  ]},
  { section: "ENGAGEMENT SITE", items: [
    { title: "Landing Page Views", bar: "lp_views", barLabel: "LP Views", barFmt: "num", line: "cost_lp", lineLabel: "Coût LP", lineFmt: "eur", calcLine: d => d.lp_views > 0 ? d.spend / d.lp_views : 0 },
    { title: "Vue de Contenu", bar: "view_content", barLabel: "Views Content", barFmt: "num", line: "cost_vc", lineLabel: "Coût VC", lineFmt: "eur", calcLine: d => d.view_content > 0 ? d.spend / d.view_content : 0 },
    { title: "Ajouts au panier", bar: "atc", barLabel: "ATC", barFmt: "num", line: "cost_atc", lineLabel: "Coût ATC", lineFmt: "eur", calcLine: d => d.atc > 0 ? d.spend / d.atc : 0 },
    { title: "Paiements Initiés", bar: "ic", barLabel: "IC", barFmt: "num", line: "cost_ic", lineLabel: "Coût IC", lineFmt: "eur", calcLine: d => d.ic > 0 ? d.spend / d.ic : 0 },
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
  ]}
];

const GOOGLE_CHARTS = [
  { section: "ACQUISITION", items: [
    { title: "Cost over time", bar: "impressions", barLabel: "Impressions", barFmt: "numK", line: "spend", lineLabel: "Coût", lineFmt: "eur" },
    { title: "Clics & CTR", bar: "clicks", barLabel: "Clics", barFmt: "num", line: "ctr", lineLabel: "CTR", lineFmt: "pct", calcLine: d => d.impressions > 0 ? d.clicks / d.impressions * 100 : 0 },
    { title: "CPM & CPC", bar: "cpm", barLabel: "Avg. CPM", barFmt: "eur", line: "cpc", lineLabel: "CPC moy.", lineFmt: "eur", calc: d => ({ cpm: d.impressions > 0 ? d.spend / d.impressions * 1000 : 0, cpc: d.clicks > 0 ? d.spend / d.clicks : 0 }) },
  ]},
  { section: "ENGAGEMENT SITE", items: [
    { title: "Page View", bar: "lp_views", barLabel: "Toutes les conv.", barFmt: "num", line: "cost_lp", lineLabel: "Coût/conv.", lineFmt: "eur", calcLine: d => d.lp_views > 0 ? d.spend / d.lp_views : 0 },
    { title: "Vue de contenu", bar: "view_content", barLabel: "Toutes les conv.", barFmt: "num", line: "cost_vc", lineLabel: "Coût/conv.", lineFmt: "eur", calcLine: d => d.view_content > 0 ? d.spend / d.view_content : 0 },
    { title: "Add_To_Cart", bar: "atc", barLabel: "Toutes les conv.", barFmt: "num", line: "cost_atc", lineLabel: "Coût/conv.", lineFmt: "eur", calcLine: d => d.atc > 0 ? d.spend / d.atc : 0 },
    { title: "Valeur ATC", lineOnly: true, calcLine: d => d.atc_value || 0, lineFmt: "eurK" },
  ]},
  { section: "CONVERSION", items: [
    { title: "Begin Checkout", bar: "ic", barLabel: "Toutes les conv.", barFmt: "num", line: "cost_ic", lineLabel: "Coût/conv.", lineFmt: "eur", calcLine: d => d.ic > 0 ? d.spend / d.ic : 0 },
    { title: "Achats", bar: "purchases", barLabel: "Conversions", barFmt: "num", line: "cpa", lineLabel: "Coût/conv.", lineFmt: "eur", calcLine: d => d.purchases > 0 ? d.spend / d.purchases : 0 },
    { title: "Valeur d'ATC", lineOnly: true, calcLine: d => d.atc_value || 0, lineFmt: "eurK" },
    { title: "Valeur Achats", lineOnly: true, calcLine: d => d.purchase_value || 0, lineFmt: "eurK" },
  ]},
  { section: "TAUX DE CONVERSION", items: [
    { title: "ATC / Clics", lineOnly: true, calcLine: d => d.clicks > 0 ? d.atc / d.clicks * 100 : 0, lineFmt: "pct" },
    { title: "Paiement Initié / ATC", lineOnly: true, calcLine: d => d.atc > 0 ? d.ic / d.atc * 100 : 0, lineFmt: "pct" },
    { title: "Achat / Paiements initiés", lineOnly: true, calcLine: d => d.ic > 0 ? d.purchases / d.ic * 100 : 0, lineFmt: "pct" },
    { title: "Conv Achat / Clics", lineOnly: true, calcLine: d => d.clicks > 0 ? d.purchases / d.clicks * 100 : 0, lineFmt: "pct" },
    { title: "ROAS", lineOnly: true, calcLine: d => d.spend > 0 ? d.purchase_value / d.spend : 0, lineFmt: "x" },
  ]}
];

// ─── COMPONENTS ───
const CustomTooltip = ({ active, payload, label, fmts }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, fontSize: 12, color: COLORS.text, marginBottom: 4 }}>{label}</div>
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

const granBtnStyle = (active) => ({
  background: active ? "#fff" : "transparent",
  color: active ? COLORS.primary : COLORS.textMuted,
  border: "none", borderRadius: 4, padding: "2px 8px", fontSize: 10,
  fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s",
});

function ChartCard({ config, dailyData, theme }) {
  const { title, bar, barLabel, barFmt, line, lineLabel, lineFmt, calcLine, calc, lineOnly } = config;
  const [gran, setGran] = useState("week");
  const barColor = theme === "google" ? COLORS.gBar : COLORS.bar;
  const lineColor = theme === "google" ? COLORS.gLine : COLORS.line;
  const headerBg = theme === "google" ? COLORS.gHeaderBg : COLORS.headerBg;

  const aggregated = useMemo(() => aggregateData(dailyData, gran), [dailyData, gran]);

  const chartData = useMemo(() => aggregated.map(d => {
    const label = formatDateLabel(d.date, gran);
    const result = { label };
    if (bar) result[bar] = d[bar];
    if (calc) Object.assign(result, calc(d));
    if (calcLine) result[line || "lineVal"] = calcLine(d);
    return result;
  }), [aggregated, gran]);

  const lineKey = line || "lineVal";
  const fmts = { [bar]: barFmt, [lineKey]: lineFmt };

  const granToggle = (
    <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.3)", borderRadius: 6, padding: 2 }}>
      {["day", "week", "month"].map(g => (
        <button key={g} onClick={() => setGran(g)} style={granBtnStyle(gran === g)}>{GRAN_LABELS[g]}</button>
      ))}
    </div>
  );

  if (lineOnly) {
    const lineData = aggregated.map(d => ({ label: formatDateLabel(d.date, gran), lineVal: calcLine(d) }));
    return (
      <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
        <div style={{ background: headerBg, padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>{title}</span>
          {granToggle}
        </div>
        <div style={{ padding: "12px 8px 4px" }}>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: COLORS.textMuted }} interval={Math.max(0, Math.floor(lineData.length / 8))} />
              <YAxis tick={{ fontSize: 9, fill: COLORS.textMuted }} tickFormatter={v => fmt(v, lineFmt)} width={50} />
              <Tooltip content={<CustomTooltip fmts={{ lineVal: lineFmt }} />} />
              <Line type="monotone" dataKey="lineVal" name={title} stroke={lineColor} strokeWidth={2.5} dot={{ r: lineData.length > 60 ? 0 : 3, fill: lineColor }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
      <div style={{ background: headerBg, padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>{title}</span>
        {granToggle}
      </div>
      <div style={{ padding: "12px 8px 4px" }}>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: COLORS.textMuted }} interval={Math.max(0, Math.floor(chartData.length / 8))} />
            <YAxis yAxisId="left" tick={{ fontSize: 9, fill: COLORS.textMuted }} tickFormatter={v => fmt(v, barFmt)} width={55} />
            {(line || calcLine) && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: COLORS.textMuted }} tickFormatter={v => fmt(v, lineFmt)} width={50} />}
            <Tooltip content={<CustomTooltip fmts={fmts} />} />
            <Bar yAxisId="left" dataKey={bar} name={barLabel || bar} fill={barColor} radius={[3, 3, 0, 0]} />
            {(line || calcLine) && <Line yAxisId="right" type="monotone" dataKey={lineKey} name={lineLabel || line} stroke={lineColor} strokeWidth={2.5} dot={{ r: chartData.length > 60 ? 0 : 2.5, fill: lineColor }} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── KPI CARD with delta ───
function KpiCard({ label, value, delta, good }) {
  const deltaColor = delta == null ? COLORS.textMuted : delta >= 0 === good ? COLORS.good : COLORS.bad;
  return (
    <div style={{ flex: 1, padding: "12px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: "#fff" }}>{value}</div>
      {delta != null && (
        <div style={{ fontSize: 10, marginTop: 2, color: deltaColor, fontWeight: 600 }}>
          {delta >= 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ───
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("meta");
  const [metaLive, setMetaLive] = useState(null);
  const [googleLive, setGoogleLive] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const metaDaily = (metaLive || META_DATA).account_daily;
  const googleDaily = (googleLive || GOOGLE_DATA).account_daily;
  const dailyRows = activeTab === "meta" ? metaDaily : googleDaily;

  const allDates = dailyRows.length > 0 ? dailyRows.map(d => d.date) : [];
  const [startDate, setStartDate] = useState(META_DATA.account_daily[0]?.date || "2025-11-24");
  const [endDate, setEndDate] = useState(META_DATA.account_daily[META_DATA.account_daily.length - 1]?.date || "2026-05-18");

  const handleRefresh = async () => {
    setRefreshing(true);
    const source = activeTab === "meta" ? "meta" : "google";
    setRefreshStatus(`Connexion à ${source === "meta" ? "Meta" : "Google"} Ads via Claude...`);
    try {
      const res = await fetch(`/api/refresh?source=${source}`, { method: "POST" });
      const json = await res.json();
      if (json.success && json.data?.account_daily?.length > 0) {
        if (source === "meta") setMetaLive(json.data);
        else setGoogleLive(json.data);
        const newDates = json.data.account_daily.map(d => d.date);
        setStartDate(newDates[0]);
        setEndDate(newDates[newDates.length - 1]);
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

  const filteredDaily = useMemo(() => {
    return dailyRows.filter(d => d.date >= startDate && d.date <= endDate);
  }, [dailyRows, startDate, endDate]);

  // Split period in half for delta calculation
  const totals = useMemo(() => {
    const t = { spend: 0, impressions: 0, clicks: 0, lp_views: 0, atc: 0, ic: 0, purchases: 0, purchase_value: 0, atc_value: 0 };
    filteredDaily.forEach(d => { Object.keys(t).forEach(k => t[k] += (d[k] || 0)); });
    t.roas = t.spend > 0 ? t.purchase_value / t.spend : 0;
    t.cpa = t.purchases > 0 ? t.spend / t.purchases : 0;
    t.cpm = t.impressions > 0 ? t.spend / t.impressions * 1000 : 0;
    t.ctr = t.impressions > 0 ? t.clicks / t.impressions * 100 : 0;
    t.aov = t.purchases > 0 ? t.purchase_value / t.purchases : 0;
    // Calculate deltas using first vs second half
    const mid = Math.floor(filteredDaily.length / 2);
    const firstHalf = filteredDaily.slice(0, mid);
    const secondHalf = filteredDaily.slice(mid);
    const sumHalf = (arr, k) => arr.reduce((s, d) => s + (d[k] || 0), 0);
    t.d_impressions = calcDelta(sumHalf(secondHalf, "impressions"), sumHalf(firstHalf, "impressions"));
    t.d_spend = calcDelta(sumHalf(secondHalf, "spend"), sumHalf(firstHalf, "spend"));
    t.d_clicks = calcDelta(sumHalf(secondHalf, "clicks"), sumHalf(firstHalf, "clicks"));
    t.d_purchases = calcDelta(sumHalf(secondHalf, "purchases"), sumHalf(firstHalf, "purchases"));
    const cpa1 = sumHalf(firstHalf, "purchases") > 0 ? sumHalf(firstHalf, "spend") / sumHalf(firstHalf, "purchases") : 0;
    const cpa2 = sumHalf(secondHalf, "purchases") > 0 ? sumHalf(secondHalf, "spend") / sumHalf(secondHalf, "purchases") : 0;
    t.d_cpa = calcDelta(cpa2, cpa1);
    const cpm1 = sumHalf(firstHalf, "impressions") > 0 ? sumHalf(firstHalf, "spend") / sumHalf(firstHalf, "impressions") * 1000 : 0;
    const cpm2 = sumHalf(secondHalf, "impressions") > 0 ? sumHalf(secondHalf, "spend") / sumHalf(secondHalf, "impressions") * 1000 : 0;
    t.d_cpm = calcDelta(cpm2, cpm1);
    return t;
  }, [filteredDaily]);

  const charts = activeTab === "meta" ? META_CHARTS : GOOGLE_CHARTS;
  const gradientFrom = activeTab === "meta" ? "#1E1B4B" : "#0D47A1";
  const gradientTo = activeTab === "meta" ? "#4F46E5" : "#1A73E8";
  const noData = filteredDaily.length === 0;

  const kpis = activeTab === "meta" ? [
    { label: "Spend", value: fmt(totals.spend, "eur"), delta: t => t.d_spend, good: false },
    { label: "ROAS", value: fmt(totals.roas, "x") },
    { label: "Achats", value: fmt(totals.purchases, "num"), delta: t => t.d_purchases, good: true },
    { label: "CPA", value: fmt(totals.cpa, "eur"), delta: t => t.d_cpa, good: false },
    { label: "Revenue", value: fmt(totals.purchase_value, "eur") },
    { label: "Panier Ø", value: fmt(totals.aov, "eur") },
    { label: "CTR", value: fmt(totals.ctr, "pct") },
  ] : [
    { label: "Impressions", value: fmt(totals.impressions, "num"), delta: t => t.d_impressions, good: true },
    { label: "Avg. CPM", value: fmt(totals.cpm, "eur"), delta: t => t.d_cpm, good: false },
    { label: "Clics", value: fmt(totals.clicks, "num"), delta: t => t.d_clicks, good: true },
    { label: "Coût", value: fmt(totals.spend, "eur"), delta: t => t.d_spend, good: false },
    { label: "Purchase", value: fmt(totals.purchases, "num"), delta: t => t.d_purchases, good: true },
    { label: "Cost Purchase", value: fmt(totals.cpa, "eur"), delta: t => t.d_cpa, good: false },
  ];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`, padding: "24px 32px 20px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>MACHOUYOU</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.8 }}>
                Dashboard Funnel — {activeTab === "meta" ? "Meta Ads" : "Google Ads"}
              </p>
            </div>
            {/* Tab switcher */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: 8, overflow: "hidden" }}>
              {[
                { id: "meta", label: "Meta Ads", icon: "📘" },
                { id: "google", label: "Google Ads", icon: "🔍" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  background: activeTab === tab.id ? "rgba(255,255,255,0.25)" : "transparent",
                  color: "#fff", border: "none", padding: "8px 16px", fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400,
                  cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ fontSize: 12, opacity: 0.7 }}>Du</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 10px", fontSize: 12, colorScheme: "dark" }} />
            <label style={{ fontSize: 12, opacity: 0.7 }}>au</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 10px", fontSize: 12, colorScheme: "dark" }} />
            <button onClick={handleRefresh} disabled={refreshing} style={{
              background: refreshing ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
              color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6,
              padding: "6px 14px", fontSize: 12, fontWeight: 600,
              cursor: refreshing ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}>
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
        <div style={{ display: "flex", gap: 0, marginTop: 20, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden", flexWrap: "wrap" }}>
          {kpis.map((k, i) => (
            <KpiCard key={i} label={k.label} value={k.value} delta={k.delta ? k.delta(totals) : null} good={k.good !== false} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 24px" }}>
        {noData ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: COLORS.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
              Pas encore de données Google Ads
            </h2>
            <p style={{ fontSize: 14, maxWidth: 500, margin: "0 auto 24px" }}>
              Clique sur <strong>Rafraîchir</strong> pour tirer les données en live depuis ton compte Google Ads via Claude.
            </p>
          </div>
        ) : (
          <>
            {charts.map((section, si) => (
              <div key={si} style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: activeTab === "meta" ? COLORS.primary : COLORS.gPrimary, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${activeTab === "meta" ? COLORS.primary : COLORS.gPrimary}` }}>
                  {section.section}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
                  {section.items.map((chart, ci) => (
                    <ChartCard key={ci} config={chart} dailyData={filteredDaily} theme={activeTab} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "16px 0 32px", color: COLORS.textMuted, fontSize: 11 }}>
        Données extraites via Pipeboard MCP — {filteredDaily.length} points affichés
      </div>
    </div>
  );
}
