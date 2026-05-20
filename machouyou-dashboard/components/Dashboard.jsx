"use client";
import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";

const INITIAL_META = {"account_daily":[{"date":"2025-11-24","spend":1351.21,"impressions":221785,"clicks":5073,"reach":95767,"lp_views":1325,"view_content":847,"atc":1069,"ic":105,"purchases":58,"atc_value":28019.44,"purchase_value":1115.25},{"date":"2025-12-01","spend":1431.45,"impressions":258357,"clicks":5153,"reach":136004,"lp_views":1827,"view_content":1057,"atc":1313,"ic":111,"purchases":67,"atc_value":32896.93,"purchase_value":1489.0},{"date":"2025-12-08","spend":1878.23,"impressions":362570,"clicks":8185,"reach":199419,"lp_views":2888,"view_content":1469,"atc":896,"ic":151,"purchases":77,"atc_value":22362.67,"purchase_value":1824.5},{"date":"2025-12-15","spend":1457.58,"impressions":311207,"clicks":8192,"reach":145967,"lp_views":2642,"view_content":1488,"atc":251,"ic":91,"purchases":56,"atc_value":5182.82,"purchase_value":1030.85},{"date":"2025-12-22","spend":1048.98,"impressions":283915,"clicks":5644,"reach":121200,"lp_views":2049,"view_content":1071,"atc":223,"ic":72,"purchases":42,"atc_value":4667.96,"purchase_value":486.96},{"date":"2025-12-29","spend":1040.08,"impressions":341270,"clicks":4995,"reach":136810,"lp_views":2054,"view_content":1246,"atc":244,"ic":81,"purchases":63,"atc_value":4935.6,"purchase_value":848.0},{"date":"2026-01-05","spend":1151.52,"impressions":309847,"clicks":4742,"reach":117374,"lp_views":1917,"view_content":1198,"atc":255,"ic":95,"purchases":70,"atc_value":4571.25,"purchase_value":1111.49},{"date":"2026-01-12","spend":1234.1,"impressions":302135,"clicks":4280,"reach":129105,"lp_views":1716,"view_content":1019,"atc":217,"ic":63,"purchases":46,"atc_value":3838.53,"purchase_value":542.2},{"date":"2026-01-19","spend":1323.78,"impressions":430448,"clicks":4275,"reach":233512,"lp_views":1497,"view_content":938,"atc":196,"ic":65,"purchases":36,"atc_value":4204.88,"purchase_value":494.16},{"date":"2026-01-26","spend":1328.93,"impressions":355075,"clicks":5087,"reach":177473,"lp_views":1000,"view_content":840,"atc":226,"ic":66,"purchases":40,"atc_value":4406.99,"purchase_value":582.55},{"date":"2026-02-02","spend":1349.98,"impressions":270455,"clicks":6913,"reach":105397,"lp_views":742,"view_content":651,"atc":153,"ic":60,"purchases":31,"atc_value":3101.03,"purchase_value":314.65},{"date":"2026-02-09","spend":1131.94,"impressions":257668,"clicks":6075,"reach":98046,"lp_views":698,"view_content":316,"atc":73,"ic":21,"purchases":11,"atc_value":1498.2,"purchase_value":173.8},{"date":"2026-02-16","spend":686.73,"impressions":133894,"clicks":2213,"reach":46248,"lp_views":708,"view_content":552,"atc":527,"ic":61,"purchases":32,"atc_value":14084.85,"purchase_value":709.88},{"date":"2026-02-23","spend":532.78,"impressions":109680,"clicks":3355,"reach":47922,"lp_views":781,"view_content":577,"atc":606,"ic":52,"purchases":24,"atc_value":16913.31,"purchase_value":623.45},{"date":"2026-03-02","spend":823.15,"impressions":163005,"clicks":3781,"reach":59541,"lp_views":1247,"view_content":916,"atc":1019,"ic":86,"purchases":44,"atc_value":26925.85,"purchase_value":952.55},{"date":"2026-03-09","spend":1936.53,"impressions":339564,"clicks":9357,"reach":135417,"lp_views":3278,"view_content":1874,"atc":1896,"ic":129,"purchases":42,"atc_value":60019.11,"purchase_value":849.3},{"date":"2026-03-16","spend":965.87,"impressions":183350,"clicks":3813,"reach":72727,"lp_views":1001,"view_content":844,"atc":863,"ic":90,"purchases":37,"atc_value":25834.35,"purchase_value":997.9},{"date":"2026-03-23","spend":1184.28,"impressions":342630,"clicks":4935,"reach":198536,"lp_views":1264,"view_content":993,"atc":1033,"ic":121,"purchases":68,"atc_value":29630.79,"purchase_value":1820.55},{"date":"2026-03-30","spend":1536.45,"impressions":512062,"clicks":7125,"reach":308543,"lp_views":1863,"view_content":1274,"atc":665,"ic":148,"purchases":86,"atc_value":17166.6,"purchase_value":1934.34},{"date":"2026-04-06","spend":1574.71,"impressions":648847,"clicks":8150,"reach":427839,"lp_views":2403,"view_content":1223,"atc":1050,"ic":128,"purchases":69,"atc_value":29639.12,"purchase_value":1532.76},{"date":"2026-04-13","spend":1206.93,"impressions":755005,"clicks":5417,"reach":620725,"lp_views":1745,"view_content":938,"atc":985,"ic":81,"purchases":37,"atc_value":27705.59,"purchase_value":575.55},{"date":"2026-04-20","spend":1058.84,"impressions":591374,"clicks":4440,"reach":463581,"lp_views":1014,"view_content":951,"atc":967,"ic":82,"purchases":36,"atc_value":28743.78,"purchase_value":533.5},{"date":"2026-04-27","spend":1413.45,"impressions":469994,"clicks":5133,"reach":247577,"lp_views":1517,"view_content":1535,"atc":1632,"ic":109,"purchases":42,"atc_value":47874.25,"purchase_value":1082.7},{"date":"2026-05-04","spend":1238.53,"impressions":538554,"clicks":4386,"reach":377527,"lp_views":1331,"view_content":1346,"atc":653,"ic":103,"purchases":55,"atc_value":17383.2,"purchase_value":984.96},{"date":"2026-05-11","spend":914.07,"impressions":478937,"clicks":3500,"reach":346765,"lp_views":994,"view_content":1050,"atc":130,"ic":82,"purchases":43,"atc_value":2041.43,"purchase_value":957.57},{"date":"2026-05-18","spend":284.27,"impressions":174335,"clicks":1247,"reach":139106,"lp_views":247,"view_content":304,"atc":35,"ic":26,"purchases":15,"atc_value":1003.9,"purchase_value":422.45}],"campaigns":[]};

const C = {
  primary: "#4F46E5", bar: "#93A3F8", line: "#1E1B4B",
  good: "#059669", bad: "#DC2626", bg: "#F8FAFC",
  card: "#FFFFFF", border: "#E2E8F0", text: "#1E293B", textMuted: "#64748B",
  gPrimary: "#1A73E8", gBar: "#7BCBD6", gLine: "#1A73E8",
};

const SUM = ["spend","impressions","clicks","reach","lp_views","view_content","atc","ic","purchases","atc_value","purchase_value"];
const GL = { day: "Jour", week: "Semaine", month: "Mois" };

const fmt = (v, t) => {
  if (v == null || isNaN(v)) return "–";
  if (t === "eur") return `${v.toFixed(2).replace(".",",")} €`;
  if (t === "eurK") return `${(v/1000).toFixed(1).replace(".",",")} k€`;
  if (t === "pct") return `${v.toFixed(1).replace(".",",")} %`;
  if (t === "x") return `${v.toFixed(2).replace(".",",")}x`;
  if (t === "num") return v.toLocaleString("fr-FR");
  if (t === "numK") return `${(v/1000).toFixed(0)} k`;
  return String(v);
};

function getWeekStart(ds) {
  const d = new Date(ds+"T00:00:00"); const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return d.toISOString().slice(0,10);
}

function agg(data, g) {
  if (g === "day") return data;
  const b = {};
  data.forEach(d => {
    const k = g === "week" ? getWeekStart(d.date) : d.date.slice(0,7);
    if (!b[k]) { b[k] = {date:k}; SUM.forEach(f => b[k][f] = 0); }
    SUM.forEach(f => b[k][f] += (d[f]||0));
  });
  return Object.values(b).sort((a,b) => a.date.localeCompare(b.date));
}

function fmtLabel(ds, g) {
  if (g === "month") { const m = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"]; return `${m[parseInt(ds.slice(5,7))-1]} ${ds.slice(2,4)}`; }
  return ds.slice(5).replace("-","/");
}

const META_CHARTS = [
  {s:"ACQUISITION",i:[{t:"ROAS",b:"purchase_value",bl:"Revenue",bf:"eurK",l:"roas",lf:"x",cl:d=>d.spend>0?d.purchase_value/d.spend:0},{t:"Spend & Impressions",b:"impressions",bl:"Impressions",bf:"numK",l:"spend",ll:"Spend",lf:"eur"},{t:"CPM & CPC",b:"cpm",bl:"CPM",bf:"eur",l:"cpc",ll:"CPC",lf:"eur",cc:d=>({cpm:d.impressions>0?d.spend/d.impressions*1000:0,cpc:d.clicks>0?d.spend/d.clicks:0})},{t:"Clics & CTR",b:"clicks",bl:"Clics",bf:"num",l:"ctr",ll:"CTR",lf:"pct",cl:d=>d.impressions>0?d.clicks/d.impressions*100:0}]},
  {s:"ENGAGEMENT SITE",i:[{t:"Landing Page Views",b:"lp_views",bl:"LP Views",bf:"num",l:"cost_lp",ll:"Coût LP",lf:"eur",cl:d=>d.lp_views>0?d.spend/d.lp_views:0},{t:"Vue de Contenu",b:"view_content",bl:"Views Content",bf:"num",l:"cost_vc",ll:"Coût VC",lf:"eur",cl:d=>d.view_content>0?d.spend/d.view_content:0},{t:"Ajouts au panier",b:"atc",bl:"ATC",bf:"num",l:"cost_atc",ll:"Coût ATC",lf:"eur",cl:d=>d.atc>0?d.spend/d.atc:0},{t:"Paiements Initiés",b:"ic",bl:"IC",bf:"num",l:"cost_ic",ll:"Coût IC",lf:"eur",cl:d=>d.ic>0?d.spend/d.ic:0}]},
  {s:"CONVERSION",i:[{t:"Achats",b:"purchases",bl:"Achats",bf:"num",l:"cpa",ll:"CPA",lf:"eur",cl:d=>d.purchases>0?d.spend/d.purchases:0},{t:"Valeur d'Achat",b:"purchase_value",bl:"Revenue",bf:"eurK",l:"aov",ll:"Panier moyen",lf:"eur",cl:d=>d.purchases>0?d.purchase_value/d.purchases:0},{t:"Valeur d'ATC",b:"atc_value",bl:"Valeur ATC",bf:"eurK",l:null}]},
  {s:"TAUX DE CONVERSION",i:[{t:"Tx Conv LP/Clics",lo:true,cl:d=>d.clicks>0?d.lp_views/d.clicks*100:0,lf:"pct"},{t:"Tx Conv Purchase/LP",lo:true,cl:d=>d.lp_views>0?d.purchases/d.lp_views*100:0,lf:"pct"},{t:"Tx Conv ATC/LP",lo:true,cl:d=>d.lp_views>0?d.atc/d.lp_views*100:0,lf:"pct"},{t:"Tx Conv IC/ATC",lo:true,cl:d=>d.atc>0?d.ic/d.atc*100:0,lf:"pct"},{t:"Tx Conv Purchase/Checkout",lo:true,cl:d=>d.ic>0?d.purchases/d.ic*100:0,lf:"pct"},{t:"ATC / ViewContent",lo:true,cl:d=>d.view_content>0?d.atc/d.view_content*100:0,lf:"pct"},{t:"ROAS",lo:true,cl:d=>d.spend>0?d.purchase_value/d.spend:0,lf:"x"}]}
];

const GOOGLE_CHARTS = [
  {s:"ACQUISITION",i:[{t:"Cost over time",b:"impressions",bl:"Impressions",bf:"numK",l:"spend",ll:"Coût",lf:"eur"},{t:"Clics & CTR",b:"clicks",bl:"Clics",bf:"num",l:"ctr",ll:"CTR",lf:"pct",cl:d=>d.impressions>0?d.clicks/d.impressions*100:0},{t:"CPM & CPC",b:"cpm",bl:"Avg. CPM",bf:"eur",l:"cpc",ll:"CPC moy.",lf:"eur",cc:d=>({cpm:d.impressions>0?d.spend/d.impressions*1000:0,cpc:d.clicks>0?d.spend/d.clicks:0})}]},
  {s:"CONVERSION",i:[{t:"Achats",b:"purchases",bl:"Conversions",bf:"num",l:"cpa",ll:"Coût/conv.",lf:"eur",cl:d=>d.purchases>0?d.spend/d.purchases:0},{t:"Valeur Achats",lo:true,cl:d=>d.purchase_value||0,lf:"eurK"},{t:"ROAS",lo:true,cl:d=>d.spend>0?d.purchase_value/d.spend:0,lf:"x"},{t:"Conv Achat / Clics",lo:true,cl:d=>d.clicks>0?d.purchases/d.clicks*100:0,lf:"pct"}]}
];

const Tip = ({active,payload,label,fmts:f}) => {
  if(!active||!payload?.length) return null;
  return <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 14px",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}}>
    <div style={{fontWeight:600,fontSize:12,color:C.text,marginBottom:4}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.text}}>
      <span style={{width:8,height:8,borderRadius:"50%",background:p.color,display:"inline-block"}}/>
      <span style={{color:C.textMuted}}>{p.name}:</span>
      <span style={{fontWeight:600}}>{f?.[p.dataKey]?fmt(p.value,f[p.dataKey]):fmt(p.value,"num")}</span>
    </div>)}
  </div>;
};

const gb = a => ({background:a?"#fff":"transparent",color:a?C.primary:C.textMuted,border:"none",borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:a?700:500,cursor:"pointer"});

function Chart({config:cfg,dailyData,weeklyData,theme}) {
  const {t:title,b:bar,bl:barLabel,bf:barFmt,l:line,ll:lineLabel,lf:lineFmt,cl:calcLine,cc:calc,lo:lineOnly} = cfg;
  const [g,setG] = useState("week");
  const bc = theme==="google"?C.gBar:C.bar, lc = theme==="google"?C.gLine:C.line, hb = theme==="google"?C.gPrimary:C.primary;
  // For week: weeklyData is already weekly, just pass through; for month: aggregate weeklyData by month
  const finalData = useMemo(() => {
    if (g === "day") return agg(dailyData, "day");
    if (g === "week" && weeklyData?.length > 0) return weeklyData; // already weekly
    if (g === "month" && weeklyData?.length > 0) return agg(weeklyData, "month");
    return agg(dailyData, g); // fallback
  }, [dailyData, weeklyData, g]);
  const cd = useMemo(()=>finalData.map(d=>{
    const r = {label:fmtLabel(d.date,g)};
    if(bar) r[bar]=d[bar]; if(calc) Object.assign(r,calc(d));
    if(calcLine) r[line||"lv"]=calcLine(d); return r;
  }),[finalData,g]);
  const lk=line||"lv", fm={[bar]:barFmt,[lk]:lineFmt};
  const tog = <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.3)",borderRadius:6,padding:2}}>
    {["day","week","month"].map(v=><button key={v} onClick={()=>setG(v)} style={gb(g===v)}>{GL[v]}</button>)}
  </div>;

  if(lineOnly) {
    const ld = finalData.map(d=>({label:fmtLabel(d.date,g),lv:calcLine(d)}));
    return <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden"}}>
      <div style={{background:hb,padding:"6px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{color:"#fff",fontWeight:700,fontSize:13}}>{title}</span>{tog}
      </div>
      <div style={{padding:"12px 8px 4px"}}><ResponsiveContainer width="100%" height={160}>
        <LineChart data={ld} margin={{top:10,right:10,left:0,bottom:0}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
          <XAxis dataKey="label" tick={{fontSize:9,fill:C.textMuted}} interval={Math.max(0,Math.floor(ld.length/8))}/>
          <YAxis tick={{fontSize:9,fill:C.textMuted}} tickFormatter={v=>fmt(v,lineFmt)} width={50}/>
          <Tooltip content={<Tip fmts={{lv:lineFmt}}/>}/><Line type="monotone" dataKey="lv" name={title} stroke={lc} strokeWidth={2.5} dot={{r:ld.length>60?0:3,fill:lc}}/>
        </LineChart></ResponsiveContainer></div></div>;
  }
  return <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden"}}>
    <div style={{background:hb,padding:"6px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{color:"#fff",fontWeight:700,fontSize:13}}>{title}</span>{tog}
    </div>
    <div style={{padding:"12px 8px 4px"}}><ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={cd} margin={{top:10,right:10,left:0,bottom:0}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
        <XAxis dataKey="label" tick={{fontSize:9,fill:C.textMuted}} interval={Math.max(0,Math.floor(cd.length/8))}/>
        <YAxis yAxisId="left" tick={{fontSize:9,fill:C.textMuted}} tickFormatter={v=>fmt(v,barFmt)} width={55}/>
        {(line||calcLine)&&<YAxis yAxisId="right" orientation="right" tick={{fontSize:9,fill:C.textMuted}} tickFormatter={v=>fmt(v,lineFmt)} width={50}/>}
        <Tooltip content={<Tip fmts={fm}/>}/>
        <Bar yAxisId="left" dataKey={bar} name={barLabel||bar} fill={bc} radius={[3,3,0,0]}/>
        {(line||calcLine)&&<Line yAxisId="right" type="monotone" dataKey={lk} name={lineLabel||line} stroke={lc} strokeWidth={2.5} dot={{r:cd.length>60?0:2.5,fill:lc}}/>}
      </ComposedChart></ResponsiveContainer></div></div>;
}

export default function Dashboard() {
  const [tab, setTab] = useState("meta");
  const [metaLive, setMetaLive] = useState(null);
  const [googleLive, setGoogleLive] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState(null);
  const [lastUp, setLastUp] = useState(null);
  const [campFilter, setCampFilter] = useState("all");

  const metaData = metaLive || INITIAL_META;
  const googleData = googleLive || {account_daily:[], campaigns:[]};
  const isGoogle = tab === "google";
  const dailyRows = isGoogle ? googleData.account_daily : metaData.account_daily;
  const weeklyRows = isGoogle ? [] : (metaData.account_weekly || []);
  const campaigns = isGoogle ? (googleData.campaigns||[]) : (metaData.campaigns||[]);

  const allDates = dailyRows.map(d=>d.date);
  const [sd, setSd] = useState(INITIAL_META.account_daily[0]?.date||"2025-11-24");
  const [ed, setEd] = useState(INITIAL_META.account_daily.at(-1)?.date||"2026-05-18");

  const refresh = async () => {
    setRefreshing(true);
    setStatus(`Connexion à ${isGoogle?"Google":"Meta"} Ads...`);
    try {
      const r = await fetch(`/api/refresh?source=${tab}`,{method:"POST"});
      const j = await r.json();
      if(j.success && j.data?.account_daily?.length>0) {
        if(tab==="meta") setMetaLive(j.data); else setGoogleLive(j.data);
        const nd = j.data.account_daily;
        setSd(nd[0].date); setEd(nd.at(-1).date);
        setLastUp(new Date().toLocaleString("fr-FR"));
        setStatus("Données mises à jour !"); setTimeout(()=>setStatus(null),3000);
      } else { setStatus("Erreur : "+(j.error||"pas de données")); setTimeout(()=>setStatus(null),6000); }
    } catch(e) { setStatus("Erreur réseau : "+e.message); setTimeout(()=>setStatus(null),6000); }
    finally { setRefreshing(false); }
  };

  const filtered = useMemo(()=>dailyRows.filter(d=>d.date>=sd&&d.date<=ed),[dailyRows,sd,ed]);
  const filteredWeekly = useMemo(()=>weeklyRows.filter(d=>d.date>=sd&&d.date<=ed),[weeklyRows,sd,ed]);

  // Use weekly data for totals if it has more history than daily
  const totalsSource = filteredWeekly.length > filtered.length ? filteredWeekly : filtered;
  const totals = useMemo(()=>{
    const t = {}; SUM.forEach(k=>t[k]=0);
    totalsSource.forEach(d=>{SUM.forEach(k=>t[k]+=(d[k]||0));});
    t.roas=t.spend>0?t.purchase_value/t.spend:0;
    t.cpa=t.purchases>0?t.spend/t.purchases:0;
    t.cpm=t.impressions>0?t.spend/t.impressions*1000:0;
    t.ctr=t.impressions>0?t.clicks/t.impressions*100:0;
    t.aov=t.purchases>0?t.purchase_value/t.purchases:0;
    return t;
  },[totalsSource]);

  const charts = isGoogle ? GOOGLE_CHARTS : META_CHARTS;
  const g1 = isGoogle?"#0D47A1":"#1E1B4B", g2 = isGoogle?"#1A73E8":"#4F46E5";
  const accent = isGoogle?C.gPrimary:C.primary;
  const noData = filtered.length===0;

  const kpis = isGoogle ? [
    {l:"Impressions",v:fmt(totals.impressions,"num")},{l:"Avg. CPM",v:fmt(totals.cpm,"eur")},
    {l:"Clics",v:fmt(totals.clicks,"num")},{l:"Coût",v:fmt(totals.spend,"eur")},
    {l:"Purchase",v:fmt(totals.purchases,"num")},{l:"Cost Purchase",v:fmt(totals.cpa,"eur")},
  ] : [
    {l:"Spend",v:fmt(totals.spend,"eur")},{l:"ROAS",v:fmt(totals.roas,"x"),c:totals.roas>=1?C.good:C.bad},
    {l:"Achats",v:fmt(totals.purchases,"num")},{l:"CPA",v:fmt(totals.cpa,"eur"),c:totals.cpa<20?C.good:C.bad},
    {l:"Revenue",v:fmt(totals.purchase_value,"eur")},{l:"Panier Ø",v:fmt(totals.aov,"eur")},{l:"CTR",v:fmt(totals.ctr,"pct")},
  ];

  return <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
    <div style={{background:`linear-gradient(135deg,${g1} 0%,${g2} 100%)`,padding:"24px 32px 20px",color:"#fff"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div>
            <h1 style={{margin:0,fontSize:24,fontWeight:800,letterSpacing:-0.5}}>MACHOUYOU</h1>
            <p style={{margin:"4px 0 0",fontSize:13,opacity:0.8}}>Dashboard Funnel — {isGoogle?"Google Ads":"Meta Ads"}</p>
          </div>
          <div style={{display:"flex",background:"rgba(255,255,255,0.15)",borderRadius:8,overflow:"hidden"}}>
            {[{id:"meta",l:"📘 Meta Ads"},{id:"google",l:"🔍 Google Ads"}].map(x=>
              <button key={x.id} onClick={()=>{setTab(x.id);setCampFilter("all");}} style={{background:tab===x.id?"rgba(255,255,255,0.25)":"transparent",color:"#fff",border:"none",padding:"8px 16px",fontSize:13,fontWeight:tab===x.id?700:400,cursor:"pointer"}}>{x.l}</button>
            )}
          </div>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <label style={{fontSize:12,opacity:0.7}}>Du</label>
          <input type="date" value={sd} onChange={e=>setSd(e.target.value)} style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,padding:"6px 10px",fontSize:12,colorScheme:"dark"}}/>
          <label style={{fontSize:12,opacity:0.7}}>au</label>
          <input type="date" value={ed} onChange={e=>setEd(e.target.value)} style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,padding:"6px 10px",fontSize:12,colorScheme:"dark"}}/>
          {campaigns.length>0 && <select value={campFilter} onChange={e=>setCampFilter(e.target.value)} style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,padding:"6px 10px",fontSize:12,maxWidth:200}}>
            <option value="all" style={{color:"#000"}}>Toutes les campagnes</option>
            {campaigns.map(c=><option key={c.id} value={c.id} style={{color:"#000"}}>{c.name}</option>)}
          </select>}
          <button onClick={refresh} disabled={refreshing} style={{background:refreshing?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.2)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:refreshing?"wait":"pointer",display:"flex",alignItems:"center",gap:6}}>
            <span style={{display:"inline-block",animation:refreshing?"spin 1s linear infinite":"none"}}>↻</span>
            {refreshing?"Chargement...":"Rafraîchir"}
          </button>
        </div>
      </div>

      {(status||lastUp)&&<div style={{marginTop:8,fontSize:11,opacity:0.7}}>
        {status&&<span style={{color:status.startsWith("Erreur")?"#FCA5A5":"#A7F3D0"}}>{status}</span>}
        {lastUp&&!status&&<span>Dernière mise à jour : {lastUp}</span>}
      </div>}

      {/* Campaign filter info */}
      {campFilter!=="all"&&campaigns.length>0&&<div style={{marginTop:8,fontSize:11,opacity:0.8}}>
        Filtre : {campaigns.find(c=>c.id===campFilter)?.name} — <button onClick={()=>setCampFilter("all")} style={{background:"none",border:"none",color:"#A7F3D0",cursor:"pointer",fontSize:11,textDecoration:"underline"}}>Réinitialiser</button>
      </div>}

      <div style={{display:"flex",gap:0,marginTop:20,background:"rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden",flexWrap:"wrap"}}>
        {kpis.map((k,i)=><div key={i} style={{flex:1,padding:"12px 16px",textAlign:"center",minWidth:80}}>
          <div style={{fontSize:10,opacity:0.6,textTransform:"uppercase",letterSpacing:1}}>{k.l}</div>
          <div style={{fontSize:18,fontWeight:800,marginTop:2,color:k.c||"#fff"}}>{k.v}</div>
        </div>)}
      </div>
    </div>

    <div style={{padding:"24px 24px"}}>
      {noData ? <div style={{textAlign:"center",padding:"80px 20px",color:C.textMuted}}>
        <div style={{fontSize:48,marginBottom:16}}>📊</div>
        <h2 style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:8}}>Pas encore de données {isGoogle?"Google Ads":"Meta Ads"}</h2>
        <p style={{fontSize:14,maxWidth:500,margin:"0 auto 24px"}}>Clique sur <strong>Rafraîchir</strong> pour tirer les données en live.</p>
      </div> : <>
        {charts.map((sec,si)=><div key={si} style={{marginBottom:32}}>
          <h2 style={{fontSize:14,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:2,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${accent}`}}>{sec.s}</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16}}>
            {sec.i.map((ch,ci)=><Chart key={ci} config={ch} dailyData={filtered} weeklyData={filteredWeekly} theme={tab}/>)}
          </div>
        </div>)}
      </>}
    </div>
    <div style={{textAlign:"center",padding:"16px 0 32px",color:C.textMuted,fontSize:11}}>
      Données extraites via Pipeboard — {filtered.length} points affichés
    </div>
  </div>;
}
