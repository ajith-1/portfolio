import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThemeProvider, createTheme, CssBaseline, Box, Typography, Drawer, List,
  ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Chip,
  Avatar, Divider, Card, CardContent, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Stepper, Step, StepLabel, StepContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, LinearProgress,
  Grid, InputAdornment, Alert, Snackbar, CircularProgress, Tooltip,
} from "@mui/material";
import {
  Package, Truck, Globe, Home, CreditCard, Search, Plus, MapPin,
  CheckCircle, BarChart3, Users, Building2, FileText, Plane, Ship,
  ArrowRight, DollarSign, Download, RefreshCw, Navigation, Shield,
  Database, Wifi, WifiOff, Save, X, Check, Zap,
} from "lucide-react";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00D4FF", contrastText: "#000" },
    secondary: { main: "#FF6B35", contrastText: "#fff" },
    success: { main: "#00E676" },
    warning: { main: "#FFD600" },
    error: { main: "#FF1744" },
    background: { default: "#040B16", paper: "#08152A" },
    text: { primary: "#E2F0FA", secondary: "#7A9BB5" },
  },
  typography: {
    fontFamily: "'Space Grotesk', sans-serif",
    h4: { fontFamily: "'Orbitron', monospace", fontWeight: 700 },
    h5: { fontFamily: "'Orbitron', monospace", fontWeight: 600 },
    h6: { fontFamily: "'Orbitron', monospace", fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg,#08152A 0%,#0C1E38 100%)",
          border: "1px solid rgba(0,212,255,0.1)",
          borderRadius: 14,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 9, textTransform: "none", fontWeight: 700 },
        containedPrimary: {
          background: "linear-gradient(135deg,#00D4FF,#0088BB)",
          "&:hover": { background: "linear-gradient(135deg,#33DDFF,#00A8E0)" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 9,
            "& fieldset": { borderColor: "rgba(0,212,255,0.18)" },
            "&:hover fieldset": { borderColor: "rgba(0,212,255,0.45)" },
            "&.Mui-focused fieldset": { borderColor: "#00D4FF" },
          },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 7, fontWeight: 700 } } },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(135deg,#08152A,#0C1E38)",
          border: "1px solid rgba(0,212,255,0.15)",
          borderRadius: 16,
        },
      },
    },
  },
});

// ── GOOGLE SHEETS SERVICE ─────────────────────────────────────────────────────
class SheetsService {
  constructor(apiKey, spreadsheetId, accessToken) {
    this.apiKey = apiKey;
    this.spreadsheetId = spreadsheetId;
    this.accessToken = accessToken;
    this.base = "https://sheets.googleapis.com/v4/spreadsheets";
  }

  authHeader() {
    if (this.accessToken) return { Authorization: `Bearer ${this.accessToken}` };
    return {};
  }

  async verify() {
    const url = `${this.base}/${this.spreadsheetId}?key=${this.apiKey}&fields=spreadsheetId,sheets.properties.title`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Cannot access spreadsheet.");
    }
    return res.json();
  }

  async read(sheetName) {
    const url = `${this.base}/${this.spreadsheetId}/values/${encodeURIComponent(sheetName)}?key=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const rows = data.values || [];
    if (rows.length < 2) return [];
    const headers = rows[0];
    return rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? row[i] : ""; });
      return obj;
    });
  }

  async write(sheetName, headers, rows) {
    const clearUrl = `${this.base}/${this.spreadsheetId}/values/${encodeURIComponent(sheetName)}:clear?key=${this.apiKey}`;
    await fetch(clearUrl, { method: "POST", headers: { "Content-Type": "application/json", ...this.authHeader() } });
    const writeUrl = `${this.base}/${this.spreadsheetId}/values/${encodeURIComponent(sheetName)}?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
    const res = await fetch(writeUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...this.authHeader() },
      body: JSON.stringify({ values: [headers, ...rows] }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || "Write failed. Check sheet permissions.");
    }
    return res.json();
  }
}

// ── SCHEMA ───────────────────────────────────────────────────────────────────
const SHIP_H = ["id","type","originCity","originCountry","originCode","destCity","destCountry","destCode","shipperName","shipperId","receiverName","receiverId","carrierName","carrierId","status","progress","mode","weight","dimensions","value","currency","paymentStatus","paymentAmount","paymentMethod","createdAt","eta","trackingJson","documentsJson"];
const ENT_H  = ["id","name","type","country","email","phone","address","shipments","revenue","createdAt"];
const PAY_H  = ["id","shipmentId","amount","currency","status","method","date","entity","notes"];

function s2r(s) {
  return SHIP_H.map(h => {
    if (h === "trackingJson")   return JSON.stringify(s.tracking || []);
    if (h === "documentsJson")  return JSON.stringify(s.documents || []);
    if (h === "originCity")     return s.origin?.city || "";
    if (h === "originCountry")  return s.origin?.country || "";
    if (h === "originCode")     return s.origin?.code || "";
    if (h === "destCity")       return s.destination?.city || "";
    if (h === "destCountry")    return s.destination?.country || "";
    if (h === "destCode")       return s.destination?.code || "";
    if (h === "shipperName")    return s.shipper?.name || "";
    if (h === "shipperId")      return s.shipper?.id || "";
    if (h === "receiverName")   return s.receiver?.name || "";
    if (h === "receiverId")     return s.receiver?.id || "";
    if (h === "carrierName")    return s.carrier?.name || "";
    if (h === "carrierId")      return s.carrier?.id || "";
    return s[h] !== undefined ? String(s[h]) : "";
  });
}

function r2s(r) {
  return {
    id: r.id, type: r.type, status: r.status,
    progress: Number(r.progress) || 0, mode: r.mode,
    weight: r.weight, dimensions: r.dimensions, value: r.value, currency: r.currency,
    paymentStatus: r.paymentStatus, paymentAmount: Number(r.paymentAmount) || 0,
    paymentMethod: r.paymentMethod, createdAt: r.createdAt, eta: r.eta,
    origin: { city: r.originCity, country: r.originCountry, code: r.originCode },
    destination: { city: r.destCity, country: r.destCountry, code: r.destCode },
    shipper:  { name: r.shipperName,  id: r.shipperId  },
    receiver: { name: r.receiverName, id: r.receiverId },
    carrier:  { name: r.carrierName,  id: r.carrierId  },
    tracking:  (() => { try { return JSON.parse(r.trackingJson  || "[]"); } catch { return []; } })(),
    documents: (() => { try { return JSON.parse(r.documentsJson || "[]"); } catch { return []; } })(),
  };
}

function e2r(e) { return ENT_H.map(h => e[h] !== undefined ? String(e[h]) : ""); }
function p2r(p) { return PAY_H.map(h => p[h] !== undefined ? String(p[h]) : ""); }

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const SEED_S = [
  { id:"SHP-001", type:"international", status:"in_transit", progress:65, mode:"air",
    origin:{city:"Mumbai",country:"India",code:"BOM"}, destination:{city:"London",country:"UK",code:"LHR"},
    shipper:{name:"TechCorp India Pvt Ltd",id:"ENT-001"}, receiver:{name:"GlobalTech UK",id:"ENT-003"},
    carrier:{name:"DHL Express",id:"CAR-001"}, weight:"45.2 kg", dimensions:"80x60x40 cm",
    value:"$12,500", currency:"USD", paymentStatus:"paid", paymentAmount:850, paymentMethod:"Wire Transfer",
    createdAt:"2024-03-01", eta:"2024-03-08",
    tracking:[
      {date:"2024-03-01 09:00",event:"Shipment Created",location:"Mumbai, India",done:"true"},
      {date:"2024-03-01 14:30",event:"Picked Up",location:"Mumbai Warehouse",done:"true"},
      {date:"2024-03-02 18:45",event:"Departed Origin",location:"BOM Airport",done:"true"},
      {date:"2024-03-05 11:00",event:"Customs Clearance",location:"Heathrow, UK",done:"false"},
      {date:"2024-03-08 12:00",event:"Delivered",location:"London, UK",done:"false"},
    ],
    documents:["Commercial Invoice","Bill of Lading","Packing List","Certificate of Origin"],
  },
  { id:"SHP-002", type:"domestic", status:"delivered", progress:100, mode:"ground",
    origin:{city:"Delhi",country:"India",code:"DEL"}, destination:{city:"Bangalore",country:"India",code:"BLR"},
    shipper:{name:"Retail Hub India",id:"ENT-002"}, receiver:{name:"Sunrise Distributors",id:"ENT-004"},
    carrier:{name:"BlueDart Express",id:"CAR-002"}, weight:"12.8 kg", dimensions:"40x30x20 cm",
    value:"₹45,000", currency:"INR", paymentStatus:"paid", paymentAmount:2200, paymentMethod:"UPI",
    createdAt:"2024-03-02", eta:"2024-03-05",
    tracking:[
      {date:"2024-03-02 10:00",event:"Shipment Created",location:"Delhi",done:"true"},
      {date:"2024-03-03 08:00",event:"In Transit",location:"Delhi-Agra Highway",done:"true"},
      {date:"2024-03-05 14:20",event:"Delivered",location:"Bangalore, Karnataka",done:"true"},
    ],
    documents:["Invoice","Delivery Receipt"],
  },
  { id:"SHP-003", type:"international", status:"pending", progress:10, mode:"sea",
    origin:{city:"Shanghai",country:"China",code:"PVG"}, destination:{city:"New York",country:"USA",code:"JFK"},
    shipper:{name:"ManufactureX China",id:"ENT-005"}, receiver:{name:"TechCorp India Pvt Ltd",id:"ENT-001"},
    carrier:{name:"COSCO Shipping",id:"CAR-003"}, weight:"2450 kg", dimensions:"20ft Container",
    value:"$89,000", currency:"USD", paymentStatus:"pending", paymentAmount:4200, paymentMethod:"LC",
    createdAt:"2024-03-05", eta:"2024-04-02",
    tracking:[
      {date:"2024-03-05 08:00",event:"Shipment Created",location:"Shanghai, China",done:"true"},
      {date:"2024-03-10 00:00",event:"Customs Clearance",location:"Shanghai Port",done:"false"},
      {date:"2024-04-02 00:00",event:"Delivered",location:"Port of Newark",done:"false"},
    ],
    documents:["Commercial Invoice","Bill of Lading","Packing List"],
  },
];

const SEED_E = [
  {id:"ENT-001",name:"TechCorp India Pvt Ltd",type:"shipper",country:"India",email:"ops@techcorp.in",phone:"+91-22-4567890",address:"BKC, Mumbai",shipments:24,revenue:"$42,000",createdAt:"2024-01-01"},
  {id:"ENT-002",name:"Retail Hub India",type:"shipper",country:"India",email:"logistics@retailhub.in",phone:"+91-11-9876543",address:"CP, Delhi",shipments:18,revenue:"₹1,20,000",createdAt:"2024-01-05"},
  {id:"ENT-003",name:"GlobalTech UK",type:"receiver",country:"UK",email:"imports@globaltech.uk",phone:"+44-20-71234567",address:"Canary Wharf, London",shipments:12,revenue:"$18,500",createdAt:"2024-01-10"},
  {id:"ENT-004",name:"Sunrise Distributors",type:"receiver",country:"India",email:"admin@sunrisedist.in",phone:"+91-80-2345678",address:"Electronic City, Bangalore",shipments:15,revenue:"₹85,000",createdAt:"2024-01-15"},
  {id:"ENT-005",name:"ManufactureX China",type:"shipper",country:"China",email:"export@manufacturex.cn",phone:"+86-21-56789012",address:"Pudong, Shanghai",shipments:8,revenue:"$120,000",createdAt:"2024-02-01"},
  {id:"CAR-001",name:"DHL Express",type:"carrier",country:"Germany",email:"ops@dhl.com",phone:"+49-228-1820",address:"Bonn, Germany",shipments:45,revenue:"$89,000",createdAt:"2024-01-01"},
  {id:"CAR-002",name:"BlueDart Express",type:"carrier",country:"India",email:"support@bluedart.com",phone:"+91-22-28392988",address:"Mumbai, India",shipments:38,revenue:"₹3,50,000",createdAt:"2024-01-01"},
  {id:"CAR-003",name:"COSCO Shipping",type:"carrier",country:"China",email:"freight@cosco.com",phone:"+86-21-65962688",address:"Shanghai, China",shipments:12,revenue:"$280,000",createdAt:"2024-01-01"},
];

const SEED_P = [
  {id:"PAY-001",shipmentId:"SHP-001",amount:850,currency:"USD",status:"paid",method:"Wire Transfer",date:"2024-03-01",entity:"TechCorp India Pvt Ltd",notes:"Full payment"},
  {id:"PAY-002",shipmentId:"SHP-002",amount:2200,currency:"INR",status:"paid",method:"UPI",date:"2024-03-02",entity:"Retail Hub India",notes:""},
  {id:"PAY-003",shipmentId:"SHP-003",amount:4200,currency:"USD",status:"pending",method:"LC",date:"2024-03-05",entity:"ManufactureX China",notes:"LC under review"},
];

// ── STATUS CHIP ───────────────────────────────────────────────────────────────
const SC = ({ s }) => {
  const m = {
    in_transit:{label:"In Transit",color:"primary"}, delivered:{label:"Delivered",color:"success"},
    pending:{label:"Pending",color:"warning"}, exception:{label:"Exception",color:"error"},
    paid:{label:"Paid",color:"success"}, overdue:{label:"Overdue",color:"error"},
  };
  const x = m[s] || {label:s,color:"default"};
  return <Chip label={x.label} color={x.color} size="small" sx={{fontWeight:700,fontSize:"0.68rem"}} />;
};

const MI = ({ mode, size=16 }) => {
  if (mode==="air") return <Plane size={size}/>;
  if (mode==="sea") return <Ship size={size}/>;
  return <Truck size={size}/>;
};

const MC = motion(Card);

// ── SYNC BADGE ────────────────────────────────────────────────────────────────
const SyncBadge = ({ syncing, isDemo, lastSync }) => (
  <Tooltip title={isDemo?"Demo — data resets on refresh":syncing?"Syncing…":`Last synced: ${lastSync}`}>
    <Chip size="small"
      icon={isDemo?<WifiOff size={11}/>:syncing?<RefreshCw size={11} style={{animation:"spin 1s linear infinite"}}/>:<Database size={11}/>}
      label={isDemo?"DEMO":syncing?"SYNCING":"SYNCED"}
      sx={{background:isDemo?"rgba(255,107,53,0.15)":syncing?"rgba(255,214,0,0.15)":"rgba(0,230,118,0.15)",
           color:isDemo?"#FF6B35":syncing?"#FFD600":"#00E676",fontWeight:700,fontSize:"0.62rem"}} />
  </Tooltip>
);

// ── SETUP SCREEN ──────────────────────────────────────────────────────────────
const Setup = ({ onConnect }) => {
  const [apiKey,setApiKey] = useState("");
  const [sheetId,setSheetId] = useState("");
  const [testing,setTesting] = useState(false);
  const [err,setErr] = useState("");

  const connect = async () => {
    if (!apiKey.trim()||!sheetId.trim()) { setErr("Both fields required."); return; }
    setTesting(true); setErr("");
    try {
      const svc = new SheetsService(apiKey.trim(), sheetId.trim());
      await svc.verify();
      onConnect(apiKey.trim(), sheetId.trim());
    } catch(e) { setErr(e.message); }
    setTesting(false);
  };

  return (
    <Box sx={{minHeight:"100vh",background:"#040B16",display:"flex",alignItems:"center",justifyContent:"center",
      backgroundImage:"radial-gradient(ellipse at 30% 30%,rgba(0,212,255,0.07) 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,rgba(255,107,53,0.07) 0%,transparent 60%)"}}>
      <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
        <Card sx={{width:520,p:1}}>
          <CardContent sx={{p:4}}>
            <Box sx={{display:"flex",alignItems:"center",gap:2,mb:3}}>
              <Box sx={{p:1.5,borderRadius:3,background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.3)"}}>
                <Database size={28} color="#00D4FF"/>
              </Box>
              <Box>
                <Typography variant="h5" sx={{background:"linear-gradient(135deg,#00D4FF,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  LOGIX PRO
                </Typography>
                <Typography variant="caption" color="text.secondary">Google Sheets Persistent Backend</Typography>
              </Box>
            </Box>

            <Alert severity="info" sx={{mb:3,background:"rgba(0,212,255,0.05)",border:"1px solid rgba(0,212,255,0.2)",color:"#E2F0FA","& .MuiAlert-icon":{color:"#00D4FF"}}}>
              <Typography variant="body2" fontWeight={700} sx={{mb:1}}>📋 Google Sheet Setup (5 min):</Typography>
              <Typography variant="caption" component="div" sx={{lineHeight:2.1}}>
                <b>1.</b> Create a Google Sheet — add 3 tabs named exactly: <b>Shipments</b>, <b>Entities</b>, <b>Payments</b><br/>
                <b>2.</b> Go to <b>Google Cloud Console</b> → APIs & Services → Enable <b>Google Sheets API</b><br/>
                <b>3.</b> Create an <b>API Key</b> (Credentials → + Create Credentials → API Key)<br/>
                <b>4.</b> Set sheet sharing to <b>"Anyone with the link can view"</b> for read access<br/>
                <b>5.</b> For write access: share the sheet with a Service Account email and use OAuth (or use Demo mode)<br/>
                <b>Tip:</b> The Spreadsheet ID is the long string in the URL between <code>/d/</code> and <code>/edit</code>
              </Typography>
            </Alert>

            <TextField fullWidth label="Google Sheets API Key" value={apiKey} onChange={e=>setApiKey(e.target.value)}
              sx={{mb:2}} placeholder="AIzaSy..." type="password"
              InputProps={{startAdornment:<InputAdornment position="start"><Shield size={15} color="#7A9BB5"/></InputAdornment>}} />

            <TextField fullWidth label="Spreadsheet ID" value={sheetId} onChange={e=>setSheetId(e.target.value)}
              sx={{mb:2}} placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
              helperText="From the Google Sheets URL"
              InputProps={{startAdornment:<InputAdornment position="start"><FileText size={15} color="#7A9BB5"/></InputAdornment>}} />

            {err && <Alert severity="error" sx={{mb:2}}>{err}</Alert>}

            <Button fullWidth variant="contained" size="large" onClick={connect} disabled={testing}
              startIcon={testing?<CircularProgress size={17} color="inherit"/>:<Wifi size={17}/>} sx={{mb:2}}>
              {testing?"Verifying connection…":"Connect to Google Sheets"}
            </Button>

            <Divider sx={{mb:2,borderColor:"rgba(0,212,255,0.1)"}}>
              <Typography variant="caption" color="text.secondary">OR</Typography>
            </Divider>

            <Button fullWidth variant="outlined" size="large"
              sx={{borderColor:"rgba(255,107,53,0.4)",color:"#FF6B35","&:hover":{background:"rgba(255,107,53,0.07)",borderColor:"#FF6B35"}}}
              onClick={()=>onConnect("DEMO","DEMO")}
              startIcon={<Zap size={17}/>}>
              Launch Demo Mode (in-memory only)
            </Button>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{mt:1}}>
              Demo data resets on page refresh. Connect Google Sheets for true persistence.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

// ── NEW SHIPMENT DIALOG ───────────────────────────────────────────────────────
const NewShipDlg = ({ open, onClose, onSave, entities }) => {
  const blank = () => ({
    id:`SHP-${Date.now()}`, type:"domestic", mode:"ground", status:"pending", progress:0,
    origin:{city:"",country:"",code:""}, destination:{city:"",country:"",code:""},
    shipper:{name:"",id:""}, receiver:{name:"",id:""}, carrier:{name:"",id:""},
    weight:"", dimensions:"", value:"", currency:"INR",
    paymentStatus:"pending", paymentAmount:0, paymentMethod:"Bank Transfer",
    createdAt:new Date().toISOString().split("T")[0], eta:"",
    tracking:[{date:new Date().toISOString().split("T")[0]+" 09:00",event:"Shipment Created",location:"",done:"true"}],
    documents:[],
  });
  const [f,setF] = useState(blank());
  const [saving,setSaving] = useState(false);

  useEffect(()=>{ if(open) setF(blank()); },[open]);

  const set = (path,val) => setF(prev => {
    const next = JSON.parse(JSON.stringify(prev));
    const parts = path.split(".");
    let cur = next;
    parts.slice(0,-1).forEach(p=>{ cur=cur[p]; });
    cur[parts[parts.length-1]] = val;
    return next;
  });

  const shippers  = entities.filter(e=>e.type==="shipper");
  const receivers = entities.filter(e=>e.type==="receiver");
  const carriers  = entities.filter(e=>e.type==="carrier");

  const save = async () => {
    if (!f.origin.city||!f.destination.city) return;
    setSaving(true);
    await onSave(f);
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{borderBottom:"1px solid rgba(0,212,255,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Typography variant="h6" sx={{color:"#00D4FF"}}>NEW SHIPMENT</Typography>
        <IconButton size="small" onClick={onClose}><X size={17}/></IconButton>
      </DialogTitle>
      <DialogContent sx={{p:3}}>
        <Grid container spacing={2} sx={{mt:0}}>
          <Grid item xs={6}><FormControl fullWidth size="small"><InputLabel>Type</InputLabel>
            <Select value={f.type} onChange={e=>set("type",e.target.value)} label="Type">
              <MenuItem value="domestic">Domestic</MenuItem><MenuItem value="international">International</MenuItem>
            </Select></FormControl></Grid>
          <Grid item xs={6}><FormControl fullWidth size="small"><InputLabel>Mode</InputLabel>
            <Select value={f.mode} onChange={e=>set("mode",e.target.value)} label="Mode">
              <MenuItem value="ground">Ground</MenuItem><MenuItem value="air">Air</MenuItem><MenuItem value="sea">Sea</MenuItem>
            </Select></FormControl></Grid>
          <Grid item xs={6}><TextField fullWidth size="small" label="Origin City *" value={f.origin.city} onChange={e=>set("origin.city",e.target.value)}/></Grid>
          <Grid item xs={6}><TextField fullWidth size="small" label="Origin Country" value={f.origin.country} onChange={e=>set("origin.country",e.target.value)}/></Grid>
          <Grid item xs={6}><TextField fullWidth size="small" label="Destination City *" value={f.destination.city} onChange={e=>set("destination.city",e.target.value)}/></Grid>
          <Grid item xs={6}><TextField fullWidth size="small" label="Destination Country" value={f.destination.country} onChange={e=>set("destination.country",e.target.value)}/></Grid>
          <Grid item xs={4}><FormControl fullWidth size="small"><InputLabel>Shipper</InputLabel>
            <Select value={f.shipper.id} onChange={e=>{ const en=shippers.find(s=>s.id===e.target.value); set("shipper",{name:en?.name||"",id:e.target.value}); }} label="Shipper">
              {shippers.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </Select></FormControl></Grid>
          <Grid item xs={4}><FormControl fullWidth size="small"><InputLabel>Receiver</InputLabel>
            <Select value={f.receiver.id} onChange={e=>{ const en=receivers.find(r=>r.id===e.target.value); set("receiver",{name:en?.name||"",id:e.target.value}); }} label="Receiver">
              {receivers.map(r=><MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
            </Select></FormControl></Grid>
          <Grid item xs={4}><FormControl fullWidth size="small"><InputLabel>Carrier</InputLabel>
            <Select value={f.carrier.id} onChange={e=>{ const en=carriers.find(c=>c.id===e.target.value); set("carrier",{name:en?.name||"",id:e.target.value}); }} label="Carrier">
              {carriers.map(c=><MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select></FormControl></Grid>
          <Grid item xs={4}><TextField fullWidth size="small" label="Weight" value={f.weight} onChange={e=>set("weight",e.target.value)} placeholder="45 kg"/></Grid>
          <Grid item xs={4}><TextField fullWidth size="small" label="Cargo Value" value={f.value} onChange={e=>set("value",e.target.value)} placeholder="$10,000"/></Grid>
          <Grid item xs={4}><TextField fullWidth size="small" label="Freight Cost" type="number" value={f.paymentAmount} onChange={e=>set("paymentAmount",Number(e.target.value))}/></Grid>
          <Grid item xs={4}><FormControl fullWidth size="small"><InputLabel>Currency</InputLabel>
            <Select value={f.currency} onChange={e=>set("currency",e.target.value)} label="Currency">
              <MenuItem value="INR">INR ₹</MenuItem><MenuItem value="USD">USD $</MenuItem>
              <MenuItem value="GBP">GBP £</MenuItem><MenuItem value="EUR">EUR €</MenuItem>
            </Select></FormControl></Grid>
          <Grid item xs={4}><TextField fullWidth size="small" label="ETA" type="date" value={f.eta} onChange={e=>set("eta",e.target.value)} InputLabelProps={{shrink:true}}/></Grid>
          <Grid item xs={4}><FormControl fullWidth size="small"><InputLabel>Payment Method</InputLabel>
            <Select value={f.paymentMethod} onChange={e=>set("paymentMethod",e.target.value)} label="Payment Method">
              {["Bank Transfer","Wire Transfer","UPI","Letter of Credit","Credit","Cash"].map(m=><MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select></FormControl></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{px:3,pb:3,borderTop:"1px solid rgba(0,212,255,0.1)"}}>
        <Button onClick={onClose} variant="outlined" sx={{borderColor:"rgba(0,212,255,0.3)"}}>Cancel</Button>
        <Button variant="contained" onClick={save} disabled={saving}
          startIcon={saving?<CircularProgress size={15} color="inherit"/>:<Save size={15}/>}>
          {saving?"Saving to Google Sheet…":"Save Shipment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ── NEW ENTITY DIALOG ─────────────────────────────────────────────────────────
const NewEntDlg = ({ open, onClose, onSave }) => {
  const blank = () => ({id:`ENT-${Date.now()}`,name:"",type:"shipper",country:"",email:"",phone:"",address:"",shipments:0,revenue:"0",createdAt:new Date().toISOString().split("T")[0]});
  const [f,setF] = useState(blank());
  const [saving,setSaving] = useState(false);

  useEffect(()=>{ if(open) setF(blank()); },[open]);

  const save = async () => {
    if (!f.name) return;
    setSaving(true);
    await onSave(f);
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{borderBottom:"1px solid rgba(0,212,255,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Typography variant="h6" sx={{color:"#00D4FF"}}>NEW ENTITY</Typography>
        <IconButton size="small" onClick={onClose}><X size={17}/></IconButton>
      </DialogTitle>
      <DialogContent sx={{p:3}}>
        <Grid container spacing={2} sx={{mt:0}}>
          <Grid item xs={8}><TextField fullWidth size="small" label="Name *" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></Grid>
          <Grid item xs={4}><FormControl fullWidth size="small"><InputLabel>Type</InputLabel>
            <Select value={f.type} onChange={e=>setF(p=>({...p,type:e.target.value}))} label="Type">
              <MenuItem value="shipper">Shipper</MenuItem><MenuItem value="receiver">Receiver</MenuItem><MenuItem value="carrier">Carrier</MenuItem>
            </Select></FormControl></Grid>
          <Grid item xs={6}><TextField fullWidth size="small" label="Country" value={f.country} onChange={e=>setF(p=>({...p,country:e.target.value}))}/></Grid>
          <Grid item xs={6}><TextField fullWidth size="small" label="Email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/></Grid>
          <Grid item xs={6}><TextField fullWidth size="small" label="Phone" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))}/></Grid>
          <Grid item xs={6}><TextField fullWidth size="small" label="Revenue" value={f.revenue} onChange={e=>setF(p=>({...p,revenue:e.target.value}))}/></Grid>
          <Grid item xs={12}><TextField fullWidth size="small" label="Address" value={f.address} onChange={e=>setF(p=>({...p,address:e.target.value}))}/></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{px:3,pb:3,borderTop:"1px solid rgba(0,212,255,0.1)"}}>
        <Button onClick={onClose} variant="outlined" sx={{borderColor:"rgba(0,212,255,0.3)"}}>Cancel</Button>
        <Button variant="contained" onClick={save} disabled={saving}
          startIcon={saving?<CircularProgress size={15} color="inherit"/>:<Save size={15}/>}>
          {saving?"Saving…":"Save Entity"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ── PAY DIALOG ────────────────────────────────────────────────────────────────
const PayDlg = ({ open, payment, onClose, onPay }) => {
  const [method,setMethod] = useState("Bank Transfer");
  const [saving,setSaving] = useState(false);
  const pay = async () => { setSaving(true); await onPay(payment,method); setSaving(false); onClose(); };
  if (!payment) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{borderBottom:"1px solid rgba(0,212,255,0.1)"}}>
        <Typography variant="h6" sx={{color:"#00E676"}}>PROCESS PAYMENT</Typography>
      </DialogTitle>
      <DialogContent sx={{p:3}}>
        <Typography variant="body2" color="text.secondary" sx={{mb:1}}>{payment.shipmentId}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{mb:2}}>{payment.entity}</Typography>
        <Typography variant="h4" sx={{color:"#00D4FF",fontFamily:"'Orbitron',monospace",mb:3}}>
          {payment.currency==="INR"?"₹":"$"}{Number(payment.amount).toLocaleString()}
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>Payment Method</InputLabel>
          <Select value={method} onChange={e=>setMethod(e.target.value)} label="Payment Method">
            {["Bank Transfer","Wire Transfer","UPI","Letter of Credit","Cash","Credit Card"].map(m=><MenuItem key={m} value={m}>{m}</MenuItem>)}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{px:3,pb:3}}>
        <Button onClick={onClose} variant="outlined" sx={{borderColor:"rgba(0,212,255,0.3)"}}>Cancel</Button>
        <Button variant="contained" color="success" onClick={pay} disabled={saving}
          startIcon={saving?<CircularProgress size={15} color="inherit"/>:<Check size={15}/>}>
          {saving?"Processing…":"Confirm Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ── SHIPMENT DETAIL ───────────────────────────────────────────────────────────
const ShipDetail = ({ shipment, onBack, onAdvance }) => {
  const [tab,setTab] = useState(0);
  const [upd,setUpd] = useState(false);
  const next = {pending:"in_transit",in_transit:"delivered"};
  const advance = async () => {
    const ns = next[shipment.status];
    if (!ns) return;
    setUpd(true);
    await onAdvance(shipment.id, ns, ns==="delivered"?100:50);
    setUpd(false);
  };

  return (
    <Box>
      <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}>
        <Box sx={{display:"flex",alignItems:"center",gap:2,mb:3,flexWrap:"wrap"}}>
          <Button variant="outlined" size="small" onClick={onBack} sx={{borderColor:"rgba(0,212,255,0.3)"}}>← Back</Button>
          <Typography variant="h5" sx={{background:"linear-gradient(135deg,#00D4FF,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            {shipment.id}
          </Typography>
          <SC s={shipment.status}/><SC s={shipment.paymentStatus}/>
          <Box sx={{flex:1}}/>
          {next[shipment.status] && (
            <Button variant="contained" size="small" onClick={advance} disabled={upd}
              startIcon={upd?<CircularProgress size={13} color="inherit"/>:<ArrowRight size={13}/>}>
              {upd?"Updating Sheet…":"Mark "+next[shipment.status].replace("_"," ")}
            </Button>
          )}
        </Box>
      </motion.div>

      <Grid container spacing={1.5} sx={{mb:2}}>
        {[
          {label:"Origin",value:`${shipment.origin?.city}, ${shipment.origin?.country}`},
          {label:"Destination",value:`${shipment.destination?.city}, ${shipment.destination?.country}`},
          {label:"Mode",value:(shipment.mode||"").toUpperCase()},
          {label:"Carrier",value:shipment.carrier?.name},
          {label:"Weight",value:shipment.weight},
          {label:"Value",value:shipment.value},
          {label:"ETA",value:shipment.eta},
          {label:"Freight Cost",value:`${shipment.currency==="INR"?"₹":"$"}${Number(shipment.paymentAmount||0).toLocaleString()}`},
        ].map((item,i)=>(
          <Grid item xs={6} sm={3} key={i}>
            <MC initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.04}}>
              <CardContent sx={{p:1.8}}>
                <Typography variant="caption" color="text.secondary" display="block">{item.label}</Typography>
                <Typography variant="body2" fontWeight={700}>{item.value||"—"}</Typography>
              </CardContent>
            </MC>
          </Grid>
        ))}
      </Grid>

      <MC sx={{mb:2}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
        <CardContent sx={{p:2.5}}>
          <Box sx={{display:"flex",justifyContent:"space-between",mb:1}}>
            <Typography variant="body2" fontWeight={700}>Progress</Typography>
            <Typography variant="body2" color="primary">{shipment.progress}%</Typography>
          </Box>
          <Box sx={{height:10,background:"rgba(255,255,255,0.05)",borderRadius:5,overflow:"hidden"}}>
            <motion.div initial={{width:0}} animate={{width:`${shipment.progress}%`}} transition={{delay:0.5,duration:1}}
              style={{height:"100%",background:"linear-gradient(90deg,#00D4FF,#FF6B35)",borderRadius:5}}/>
          </Box>
        </CardContent>
      </MC>

      <Tabs value={tab} onChange={(_,v)=>setTab(v)}
        sx={{mb:2,"& .MuiTab-root":{color:"text.secondary"},"& .Mui-selected":{color:"#00D4FF"},"& .MuiTabs-indicator":{background:"#00D4FF"}}}>
        <Tab label="Tracking"/><Tab label="Entities"/><Tab label="Documents"/><Tab label="Payment"/>
      </Tabs>

      <AnimatePresence mode="wait">
        {tab===0 && (
          <motion.div key="tr" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <Card><CardContent sx={{p:2.5}}>
              <Stepper orientation="vertical">
                {(shipment.tracking||[]).map((t,i)=>{
                  const done = t.done==="true"||t.done===true;
                  return (
                    <Step key={i} active={done} completed={done}>
                      <StepLabel StepIconProps={{sx:{color:done?"#00E676 !important":"rgba(255,255,255,0.15) !important"}}}>
                        <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}>
                          <Typography variant="body2" fontWeight={done?700:400} color={done?"text.primary":"text.secondary"}>{t.event}</Typography>
                          <Typography variant="caption" color="text.secondary">{t.location} • {t.date}</Typography>
                        </motion.div>
                      </StepLabel>
                      <StepContent><Box/></StepContent>
                    </Step>
                  );
                })}
              </Stepper>
            </CardContent></Card>
          </motion.div>
        )}
        {tab===1 && (
          <motion.div key="en" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <Grid container spacing={2}>
              {[
                {label:"SHIPPER",data:shipment.shipper,color:"#00D4FF",icon:<Building2 size={18}/>},
                {label:"RECEIVER",data:shipment.receiver,color:"#FF6B35",icon:<Users size={18}/>},
                {label:"CARRIER",data:shipment.carrier,color:"#00E676",icon:<Truck size={18}/>},
              ].map((e,i)=>(
                <Grid item xs={12} sm={4} key={i}>
                  <MC initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
                    <CardContent sx={{p:2}}>
                      <Box sx={{display:"flex",alignItems:"center",gap:1,mb:1.5,color:e.color}}>{e.icon}
                        <Typography variant="caption" sx={{color:e.color,fontWeight:700,letterSpacing:2}}>{e.label}</Typography>
                      </Box>
                      <Typography fontWeight={700}>{e.data?.name||"—"}</Typography>
                      <Typography variant="caption" color="text.secondary">{e.data?.id}</Typography>
                    </CardContent>
                  </MC>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
        {tab===2 && (
          <motion.div key="do" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <Card><CardContent sx={{p:2.5}}>
              {!(shipment.documents||[]).length
                ? <Typography color="text.secondary">No documents attached.</Typography>
                : <Grid container spacing={1.5}>
                    {(shipment.documents||[]).map((d,i)=>(
                      <Grid item xs={12} sm={6} key={i}>
                        <MC whileHover={{scale:1.02}} sx={{cursor:"pointer"}}>
                          <CardContent sx={{p:1.5,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <Box sx={{display:"flex",alignItems:"center",gap:1.5}}>
                              <FileText size={17} color="#00D4FF"/><Typography variant="body2" fontWeight={600}>{d}</Typography>
                            </Box>
                            <IconButton size="small"><Download size={13}/></IconButton>
                          </CardContent>
                        </MC>
                      </Grid>
                    ))}
                  </Grid>}
            </CardContent></Card>
          </motion.div>
        )}
        {tab===3 && (
          <motion.div key="pa" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <Card><CardContent sx={{p:2.5}}>
              <Box sx={{display:"flex",justifyContent:"space-between",mb:2}}>
                <Typography variant="h6">Payment Breakdown</Typography><SC s={shipment.paymentStatus}/>
              </Box>
              {[{label:"Freight (70%)",pct:0.7},{label:"Customs (20%)",pct:0.2},{label:"Insurance (5%)",pct:0.05},{label:"Handling (5%)",pct:0.05}].map((item,i)=>(
                <Box key={i} sx={{display:"flex",justifyContent:"space-between",py:1.5,borderBottom:"1px solid rgba(0,212,255,0.07)"}}>
                  <Typography variant="body2">{item.label}</Typography>
                  <Typography fontWeight={700}>{shipment.currency==="INR"?"₹":"$"}{Math.round((shipment.paymentAmount||0)*item.pct).toLocaleString()}</Typography>
                </Box>
              ))}
              <Box sx={{display:"flex",justifyContent:"space-between",pt:2}}>
                <Typography fontWeight={800}>TOTAL</Typography>
                <Typography fontWeight={800} color="primary">{shipment.currency==="INR"?"₹":"$"}{Number(shipment.paymentAmount||0).toLocaleString()}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{mt:1,display:"block"}}>Method: {shipment.paymentMethod||"—"}</Typography>
            </CardContent></Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV = [
  {icon:<BarChart3 size={19}/>,label:"Dashboard",id:"dashboard"},
  {icon:<Package size={19}/>,label:"All Shipments",id:"shipments"},
  {icon:<Globe size={19}/>,label:"International",id:"international"},
  {icon:<Home size={19}/>,label:"Domestic",id:"domestic"},
  {icon:<Users size={19}/>,label:"Entities",id:"entities"},
  {icon:<CreditCard size={19}/>,label:"Payments",id:"payments"},
];

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [creds,setCreds]         = useState(null);
  const [svc,setSvc]             = useState(null);
  const [isDemo,setIsDemo]       = useState(false);
  const [shipments,setShipments] = useState([]);
  const [entities,setEntities]   = useState([]);
  const [payments,setPayments]   = useState([]);
  const [page,setPage]           = useState("dashboard");
  const [selected,setSelected]   = useState(null);
  const [loading,setLoading]     = useState(false);
  const [syncing,setSyncing]     = useState(false);
  const [lastSync,setLastSync]   = useState("Never");
  const [snack,setSnack]         = useState({open:false,msg:"",sev:"success"});
  const [newShip,setNewShip]     = useState(false);
  const [newEnt,setNewEnt]       = useState(false);
  const [payDlg,setPayDlg]       = useState({open:false,payment:null});
  const [search,setSearch]       = useState("");
  const [statusF,setStatusF]     = useState("all");
  const [entTypeF,setEntTypeF]   = useState("all");

  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap";
    l.rel="stylesheet"; document.head.appendChild(l);
  },[]);

  const notify=(msg,sev="success")=>setSnack({open:true,msg,sev});
  const ts=()=>setLastSync(new Date().toLocaleTimeString());

  const connect = async (apiKey,sheetId) => {
    if (apiKey==="DEMO") {
      setIsDemo(true);
      setShipments(SEED_S); setEntities(SEED_E); setPayments(SEED_P);
      setCreds({apiKey,sheetId});
      notify("Demo mode — data resets on refresh","warning");
      return;
    }
    const service = new SheetsService(apiKey,sheetId);
    setSvc(service); setCreds({apiKey,sheetId});
    setLoading(true);
    try {
      await loadAll(service);
      notify("Connected! Data loaded from Google Sheets ✓");
    } catch(e) { notify("Error: "+e.message,"error"); }
    setLoading(false);
  };

  const loadAll = async (service) => {
    setSyncing(true);
    try {
      const [rs,re,rp] = await Promise.all([
        service.read("Shipments"), service.read("Entities"), service.read("Payments"),
      ]);
      if (rs.length===0) {
        await seedAll(service);
        setShipments(SEED_S); setEntities(SEED_E); setPayments(SEED_P);
        notify("Empty sheet detected — seeded with sample data ✓");
      } else {
        setShipments(rs.map(r2s));
        setEntities(re);
        setPayments(rp.map(r=>({...r,amount:Number(r.amount)||0})));
      }
      ts();
    } finally { setSyncing(false); }
  };

  const seedAll = async (service) => {
    await Promise.all([
      service.write("Shipments",SHIP_H,SEED_S.map(s2r)),
      service.write("Entities",ENT_H,SEED_E.map(e2r)),
      service.write("Payments",PAY_H,SEED_P.map(p2r)),
    ]);
  };

  const syncShipments = async (next) => {
    setShipments(next);
    if (!isDemo&&svc) {
      setSyncing(true);
      try { await svc.write("Shipments",SHIP_H,next.map(s2r)); ts(); }
      catch(e) { notify("Sync failed: "+e.message,"error"); }
      setSyncing(false);
    }
  };

  const syncPayments = async (next) => {
    setPayments(next);
    if (!isDemo&&svc) {
      setSyncing(true);
      try { await svc.write("Payments",PAY_H,next.map(p2r)); ts(); }
      catch(e) { notify("Sync failed: "+e.message,"error"); }
      setSyncing(false);
    }
  };

  const saveShipment = async (s) => {
    const next = [...shipments.filter(x=>x.id!==s.id), s];
    await syncShipments(next);
    const newPay = {id:`PAY-${Date.now()}`,shipmentId:s.id,amount:s.paymentAmount,currency:s.currency,
      status:"pending",method:s.paymentMethod,date:s.createdAt,entity:s.shipper?.name||"",notes:"Auto-created"};
    const nextP = [...payments, newPay];
    await syncPayments(nextP);
    notify(isDemo?"Shipment added (Demo)":"Shipment saved to Google Sheets ✓", isDemo?"warning":"success");
  };

  const saveEntity = async (e) => {
    const next = [...entities, e];
    setEntities(next);
    if (!isDemo&&svc) {
      setSyncing(true);
      try { await svc.write("Entities",ENT_H,next.map(e2r)); ts(); notify("Entity saved to Google Sheets ✓"); }
      catch(err) { notify("Sync failed: "+err.message,"error"); }
      setSyncing(false);
    } else { notify("Entity added (Demo)","warning"); }
  };

  const advanceStatus = async (id,status,progress) => {
    const next = shipments.map(s=>s.id===id?{...s,status,progress}:s);
    await syncShipments(next);
    if (selected?.id===id) setSelected(p=>({...p,status,progress}));
    notify(isDemo?`Status → "${status}" (Demo)`:`Status → "${status}" saved to Google Sheets ✓`, isDemo?"warning":"success");
  };

  const processPayment = async (payment,method) => {
    const nextP = payments.map(p=>p.id===payment.id?{...p,status:"paid",method,date:new Date().toISOString().split("T")[0]}:p);
    await syncPayments(nextP);
    const nextS = shipments.map(s=>s.id===payment.shipmentId?{...s,paymentStatus:"paid"}:s);
    await syncShipments(nextS);
    notify(isDemo?"Payment processed (Demo)":"Payment saved to Google Sheets ✓", isDemo?"warning":"success");
  };

  const refresh = async () => {
    if (isDemo) { notify("Demo mode — nothing to refresh","warning"); return; }
    if (!svc) return;
    setLoading(true);
    try { await loadAll(svc); notify("Refreshed from Google Sheets ✓"); }
    catch(e) { notify("Refresh failed: "+e.message,"error"); }
    setLoading(false);
  };

  if (!creds) return <ThemeProvider theme={theme}><CssBaseline/><Setup onConnect={connect}/></ThemeProvider>;

  const filteredS = (type) => shipments.filter(s=>{
    const mt = !type||s.type===type;
    const ms = statusF==="all"||s.status===statusF;
    const mq = !search||(s.id+s.origin?.city+s.destination?.city).toLowerCase().includes(search.toLowerCase());
    return mt&&ms&&mq;
  });

  const stats = {
    total:shipments.length,
    transit:shipments.filter(s=>s.status==="in_transit").length,
    delivered:shipments.filter(s=>s.status==="delivered").length,
    pendingPay:payments.filter(p=>p.status!=="paid").length,
  };

  const renderContent = () => {
    if (selected) return <ShipDetail shipment={selected} onBack={()=>setSelected(null)} onAdvance={advanceStatus}/>;

    // ── DASHBOARD ──
    if (page==="dashboard") return (
      <Box>
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}>
          <Typography variant="h4" sx={{background:"linear-gradient(135deg,#00D4FF,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",mb:0.5}}>
            COMMAND CENTER
          </Typography>
          <Typography color="text.secondary" sx={{mb:3}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</Typography>
        </motion.div>

        <Grid container spacing={2} sx={{mb:3}}>
          {[
            {label:"Total Shipments",value:stats.total,icon:<Package size={22}/>,color:"#00D4FF"},
            {label:"In Transit",value:stats.transit,icon:<Truck size={22}/>,color:"#FF6B35"},
            {label:"Delivered",value:stats.delivered,icon:<CheckCircle size={22}/>,color:"#00E676"},
            {label:"Pending Payments",value:stats.pendingPay,icon:<CreditCard size={22}/>,color:"#FFD600"},
          ].map((s,i)=>(
            <Grid item xs={6} lg={3} key={i}>
              <MC initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
                whileHover={{scale:1.03,boxShadow:`0 8px 32px ${s.color}22`}}>
                <CardContent sx={{p:2.5}}>
                  <Box sx={{p:1,borderRadius:2,background:`${s.color}18`,color:s.color,display:"inline-flex",mb:1.5}}>{s.icon}</Box>
                  <Typography variant="h4" sx={{color:s.color,fontFamily:"'Orbitron',monospace"}}>{s.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                </CardContent>
              </MC>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <MC initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3}}>
              <CardContent sx={{p:2.5}}>
                <Box sx={{display:"flex",justifyContent:"space-between",mb:2}}>
                  <Typography variant="h6" sx={{fontSize:"0.78rem",letterSpacing:2}}>RECENT SHIPMENTS</Typography>
                  <Button size="small" onClick={()=>setPage("shipments")}>View All →</Button>
                </Box>
                {shipments.slice(0,5).map((s,i)=>(
                  <motion.div key={s.id} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:0.4+i*0.07}}>
                    <Box onClick={()=>setSelected(s)} sx={{display:"flex",alignItems:"center",gap:2,py:1.5,cursor:"pointer",
                      borderBottom:"1px solid rgba(0,212,255,0.07)","&:hover":{background:"rgba(0,212,255,0.03)",borderRadius:1,px:0.5}}}>
                      <Box sx={{p:0.8,borderRadius:1.5,background:s.type==="international"?"#00D4FF18":"#FF6B3518",color:s.type==="international"?"#00D4FF":"#FF6B35"}}>
                        {s.type==="international"?<Globe size={15}/>:<Home size={15}/>}
                      </Box>
                      <Box sx={{flex:1}}>
                        <Typography variant="body2" fontWeight={700}>{s.id}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.origin?.city} → {s.destination?.city}</Typography>
                      </Box>
                      <SC s={s.status}/><SC s={s.paymentStatus}/>
                    </Box>
                  </motion.div>
                ))}
              </CardContent>
            </MC>
          </Grid>

          <Grid item xs={12} md={5}>
            <MC initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.3}} sx={{height:"100%"}}>
              <CardContent sx={{p:2.5}}>
                <Typography variant="h6" sx={{fontSize:"0.78rem",letterSpacing:2,mb:2}}>STATUS OVERVIEW</Typography>
                {[
                  {label:"Delivered",count:stats.delivered,color:"#00E676"},
                  {label:"In Transit",count:stats.transit,color:"#00D4FF"},
                  {label:"Pending",count:shipments.filter(s=>s.status==="pending").length,color:"#FFD600"},
                  {label:"Exception",count:shipments.filter(s=>s.status==="exception").length,color:"#FF1744"},
                ].map((item,i)=>(
                  <Box key={i} sx={{mb:2}}>
                    <Box sx={{display:"flex",justifyContent:"space-between",mb:0.4}}>
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body2" fontWeight={700}>{item.count}</Typography>
                    </Box>
                    <Box sx={{height:6,background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden"}}>
                      <motion.div initial={{width:0}} animate={{width:stats.total?`${(item.count/stats.total)*100}%`:0}}
                        transition={{delay:0.5+i*0.1,duration:0.8}} style={{height:"100%",background:item.color,borderRadius:4}}/>
                    </Box>
                  </Box>
                ))}
                <Divider sx={{my:2,borderColor:"rgba(0,212,255,0.08)"}}/>
                <Typography variant="h6" sx={{fontSize:"0.78rem",letterSpacing:2,mb:2}}>PAYMENT ALERTS</Typography>
                {payments.filter(p=>p.status!=="paid").slice(0,3).map((p,i)=>(
                  <Box key={i} sx={{display:"flex",justifyContent:"space-between",alignItems:"center",mb:1.2}}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{p.shipmentId}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{maxWidth:130,display:"block"}}>{p.entity}</Typography>
                    </Box>
                    <Box sx={{textAlign:"right"}}>
                      <SC s={p.status}/>
                      <Typography variant="caption" display="block" sx={{mt:0.3}}>{p.currency==="INR"?"₹":"$"}{Number(p.amount).toLocaleString()}</Typography>
                    </Box>
                  </Box>
                ))}
                {!payments.filter(p=>p.status!=="paid").length && <Typography variant="body2" color="text.secondary">All payments cleared ✓</Typography>}
              </CardContent>
            </MC>
          </Grid>
        </Grid>
      </Box>
    );

    // ── SHIPMENTS LIST ──
    if (["shipments","international","domestic"].includes(page)) {
      const type = page==="international"?"international":page==="domestic"?"domestic":null;
      const list = filteredS(type);
      return (
        <Box>
          <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}>
            <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",mb:3}}>
              <Box>
                <Typography variant="h4" sx={{background:"linear-gradient(135deg,#00D4FF,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  {type?type.toUpperCase():"ALL"} SHIPMENTS
                </Typography>
                <Typography color="text.secondary">{list.length} found{!isDemo&&" · synced from Google Sheets"}</Typography>
              </Box>
              <Button variant="contained" startIcon={<Plus size={15}/>} onClick={()=>setNewShip(true)}>New Shipment</Button>
            </Box>
          </motion.div>

          <Box sx={{display:"flex",gap:2,mb:3,flexWrap:"wrap"}}>
            <TextField placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} size="small" sx={{width:210}}
              InputProps={{startAdornment:<InputAdornment position="start"><Search size={13}/></InputAdornment>}}/>
            <FormControl size="small" sx={{minWidth:130}}>
              <InputLabel>Status</InputLabel>
              <Select value={statusF} onChange={e=>setStatusF(e.target.value)} label="Status">
                {["all","in_transit","delivered","pending","exception"].map(v=>(
                  <MenuItem key={v} value={v}>{v==="all"?"All Status":v.replace("_"," ")}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={2}>
            {list.map((s,i)=>(
              <Grid item xs={12} key={s.id}>
                <MC initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  whileHover={{scale:1.006,boxShadow:"0 6px 28px rgba(0,212,255,0.1)"}} sx={{cursor:"pointer"}} onClick={()=>setSelected(s)}>
                  <CardContent sx={{p:2}}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <Box sx={{display:"flex",alignItems:"center",gap:1.5}}>
                          <Box sx={{p:0.9,borderRadius:2,background:s.type==="international"?"#00D4FF18":"#FF6B3518",color:s.type==="international"?"#00D4FF":"#FF6B35"}}>
                            {s.type==="international"?<Globe size={17}/>:<Home size={17}/>}
                          </Box>
                          <Box>
                            <Typography fontWeight={800} sx={{fontFamily:"'Orbitron',monospace",fontSize:"0.82rem"}}>{s.id}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.type?.toUpperCase()}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Box sx={{display:"flex",alignItems:"center",gap:0.7}}>
                          <Box><Typography variant="body2" fontWeight={700}>{s.origin?.city}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.origin?.country}</Typography></Box>
                          <ArrowRight size={13} color="#00D4FF"/>
                          <Box><Typography variant="body2" fontWeight={700}>{s.destination?.city}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.destination?.country}</Typography></Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Box sx={{display:"flex",alignItems:"center",gap:0.7,color:"text.secondary"}}>
                          <MI mode={s.mode}/>
                          <Typography variant="body2">{(s.mode||"").charAt(0).toUpperCase()+(s.mode||"").slice(1)}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{s.carrier?.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <LinearProgress variant="determinate" value={Number(s.progress)||0}
                          sx={{height:5,borderRadius:3,mb:0.5,background:"rgba(255,255,255,0.05)",
                            "& .MuiLinearProgress-bar":{background:s.status==="delivered"?"#00E676":s.status==="exception"?"#FF1744":"linear-gradient(90deg,#00D4FF,#FF6B35)"}}}/>
                        <Typography variant="caption" color="text.secondary">{s.progress}% complete</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Box sx={{display:"flex",gap:0.5,flexWrap:"wrap"}}>
                          <SC s={s.status}/><SC s={s.paymentStatus}/>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{s.value}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </MC>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    // ── ENTITIES ──
    if (page==="entities") {
      const list = entities.filter(e=>entTypeF==="all"||e.type===entTypeF);
      return (
        <Box>
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",mb:3}}>
            <Box>
              <Typography variant="h4" sx={{background:"linear-gradient(135deg,#00D4FF,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ENTITIES</Typography>
              <Typography color="text.secondary">Shippers · Receivers · Carriers</Typography>
            </Box>
            <Button variant="contained" startIcon={<Plus size={15}/>} onClick={()=>setNewEnt(true)}>Add Entity</Button>
          </Box>
          <Box sx={{display:"flex",gap:1,mb:3}}>
            {["all","shipper","receiver","carrier"].map(t=>(
              <Chip key={t} label={t.charAt(0).toUpperCase()+t.slice(1)} onClick={()=>setEntTypeF(t)}
                sx={{cursor:"pointer",background:entTypeF===t?"#00D4FF":"transparent",color:entTypeF===t?"#000":"text.secondary",
                  border:"1px solid",borderColor:entTypeF===t?"#00D4FF":"rgba(0,212,255,0.2)"}}/>
            ))}
          </Box>
          <Grid container spacing={2}>
            {list.map((e,i)=>(
              <Grid item xs={12} sm={6} md={4} key={e.id}>
                <MC initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} whileHover={{scale:1.02}}>
                  <CardContent sx={{p:2.5}}>
                    <Box sx={{display:"flex",justifyContent:"space-between",mb:2}}>
                      <Box sx={{p:1.1,borderRadius:2,background:e.type==="carrier"?"#FF6B3522":e.type==="shipper"?"#00D4FF22":"#00E67622"}}>
                        {e.type==="carrier"?<Truck size={17} color="#FF6B35"/>:e.type==="shipper"?<Building2 size={17} color="#00D4FF"/>:<Users size={17} color="#00E676"/>}
                      </Box>
                      <Chip label={e.type} size="small" sx={{textTransform:"capitalize"}}/>
                    </Box>
                    <Typography fontWeight={800} sx={{mb:0.3}}>{e.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{e.id} · {e.country}</Typography>
                    {e.email&&<Typography variant="caption" color="text.secondary" display="block">{e.email}</Typography>}
                    {e.phone&&<Typography variant="caption" color="text.secondary" display="block">{e.phone}</Typography>}
                    <Box sx={{display:"flex",justifyContent:"space-between",mt:1.5}}>
                      <Box><Typography variant="caption" color="text.secondary">Shipments</Typography>
                        <Typography variant="body2" fontWeight={700} color="primary">{e.shipments||0}</Typography></Box>
                      <Box><Typography variant="caption" color="text.secondary">Revenue</Typography>
                        <Typography variant="body2" fontWeight={700} color="secondary">{e.revenue||"—"}</Typography></Box>
                    </Box>
                  </CardContent>
                </MC>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    // ── PAYMENTS ──
    if (page==="payments") {
      const total   = payments.reduce((a,p)=>a+Number(p.amount||0),0);
      const paid    = payments.filter(p=>p.status==="paid").reduce((a,p)=>a+Number(p.amount||0),0);
      const pending = payments.filter(p=>p.status==="pending").reduce((a,p)=>a+Number(p.amount||0),0);
      const overdue = payments.filter(p=>p.status==="overdue").reduce((a,p)=>a+Number(p.amount||0),0);
      return (
        <Box>
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",mb:3}}>
            <Box>
              <Typography variant="h4" sx={{background:"linear-gradient(135deg,#00D4FF,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PAYMENTS</Typography>
              <Typography color="text.secondary">Freight billing — {isDemo?"Demo":"Google Sheets backed"}</Typography>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{mb:3}}>
            {[
              {label:"Total Billed",value:total,color:"#00D4FF"},
              {label:"Collected",value:paid,color:"#00E676"},
              {label:"Pending",value:pending,color:"#FFD600"},
              {label:"Overdue",value:overdue,color:"#FF1744"},
            ].map((s,i)=>(
              <Grid item xs={6} sm={3} key={i}>
                <MC initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.08}}>
                  <CardContent sx={{p:2,textAlign:"center"}}>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                    <Typography variant="h5" sx={{color:s.color,fontFamily:"'Orbitron',monospace",mt:0.5}}>{s.value.toLocaleString()}</Typography>
                  </CardContent>
                </MC>
              </Grid>
            ))}
          </Grid>
          <MC initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{"& th":{borderColor:"rgba(0,212,255,0.07)",color:"#00D4FF",fontWeight:700,fontFamily:"'Orbitron',monospace",fontSize:"0.68rem",letterSpacing:1}}}>
                    {["PAYMENT ID","SHIPMENT","ENTITY","AMOUNT","METHOD","DATE","STATUS","ACTION"].map(h=><TableCell key={h}>{h}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((p,i)=>(
                    <motion.tr key={p.id} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:0.35+i*0.06}}>
                      <TableCell sx={{color:"#00D4FF",fontWeight:700,fontSize:"0.78rem"}}>{p.id}</TableCell>
                      <TableCell><Typography variant="body2">{p.shipmentId}</Typography></TableCell>
                      <TableCell><Typography variant="body2" noWrap sx={{maxWidth:150}}>{p.entity}</Typography></TableCell>
                      <TableCell><Typography fontWeight={700}>{p.currency==="INR"?"₹":"$"}{Number(p.amount||0).toLocaleString()}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{p.method}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{p.date}</Typography></TableCell>
                      <TableCell><SC s={p.status}/></TableCell>
                      <TableCell>
                        {p.status!=="paid"
                          ? <Button size="small" variant="outlined"
                              sx={{fontSize:"0.64rem",borderColor:"#00E676",color:"#00E676","&:hover":{background:"rgba(0,230,118,0.07)"}}}
                              onClick={()=>setPayDlg({open:true,payment:p})}>Pay Now</Button>
                          : <Check size={15} color="#00E676"/>}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MC>
        </Box>
      );
    }

    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Box sx={{display:"flex",minHeight:"100vh",background:"#040B16",
        backgroundImage:"radial-gradient(ellipse at 20% 10%,rgba(0,212,255,0.05) 0%,transparent 55%),radial-gradient(ellipse at 80% 90%,rgba(255,107,53,0.05) 0%,transparent 55%)"}}>

        {/* Sidebar */}
        <Drawer variant="permanent"
          sx={{width:228,flexShrink:0,"& .MuiDrawer-paper":{width:228,background:"linear-gradient(180deg,#040D1C 0%,#071328 100%)",borderRight:"1px solid rgba(0,212,255,0.08)",boxSizing:"border-box"}}}>
          <Box sx={{p:2.5,borderBottom:"1px solid rgba(0,212,255,0.08)"}}>
            <Box sx={{display:"flex",alignItems:"center",gap:1.5}}>
              <Box sx={{p:1,borderRadius:2,background:"linear-gradient(135deg,#00D4FF,#006699)"}}><Navigation size={17} color="#fff"/></Box>
              <Box>
                <Typography variant="h6" sx={{fontSize:"0.82rem",background:"linear-gradient(135deg,#00D4FF,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>LOGIX PRO</Typography>
                <Typography variant="caption" color="text.secondary" sx={{fontSize:"0.65rem"}}>Sheets Persistent Backend</Typography>
              </Box>
            </Box>
          </Box>

          <List sx={{px:1,py:1.5,flex:1}}>
            {NAV.map(item=>(
              <motion.div key={item.id} whileHover={{x:3}} whileTap={{scale:0.97}}>
                <ListItem button onClick={()=>{ setPage(item.id); setSelected(null); }}
                  sx={{borderRadius:2,mb:0.3,background:page===item.id?"linear-gradient(135deg,rgba(0,212,255,0.12),rgba(0,212,255,0.03))":"transparent",
                    borderLeft:`3px solid ${page===item.id?"#00D4FF":"transparent"}`,
                    "&:hover":{background:"rgba(0,212,255,0.06)"}}}>
                  <ListItemIcon sx={{color:page===item.id?"#00D4FF":"#7A9BB5",minWidth:33}}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label}
                    primaryTypographyProps={{variant:"body2",fontWeight:page===item.id?700:400,color:page===item.id?"#00D4FF":"#7A9BB5",fontSize:"0.84rem"}}/>
                </ListItem>
              </motion.div>
            ))}
          </List>

          <Box sx={{p:2,borderTop:"1px solid rgba(0,212,255,0.08)"}}>
            <Box sx={{display:"flex",alignItems:"center",gap:1.5,mb:1}}>
              <Avatar sx={{width:28,height:28,background:"linear-gradient(135deg,#00D4FF,#FF6B35)",fontSize:"0.72rem"}}>AD</Avatar>
              <Box sx={{flex:1}}><Typography variant="body2" fontWeight={700} sx={{fontSize:"0.82rem"}}>Admin</Typography>
                <Typography variant="caption" color="text.secondary" sx={{fontSize:"0.68rem"}}>Super Admin</Typography></Box>
            </Box>
            <SyncBadge syncing={syncing} isDemo={isDemo} lastSync={lastSync}/>
          </Box>
        </Drawer>

        {/* Main area */}
        <Box sx={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <AppBar position="sticky" sx={{background:"rgba(4,11,22,0.93)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,212,255,0.08)",boxShadow:"none"}}>
            <Toolbar sx={{gap:2,minHeight:"54px !important"}}>
              <TextField placeholder="Search shipments…" value={search} onChange={e=>setSearch(e.target.value)} size="small"
                InputProps={{startAdornment:<InputAdornment position="start"><Search size={13}/></InputAdornment>}}
                sx={{width:240,"& .MuiOutlinedInput-root":{height:33}}}/>
              <Box sx={{flex:1}}/>
              <Tooltip title={isDemo?"Demo mode":"Refresh from Google Sheets"}>
                <span>
                  <IconButton size="small" onClick={refresh} disabled={loading||isDemo}>
                    <RefreshCw size={16} color="#7A9BB5" style={{animation:loading?"spin 1s linear infinite":"none"}}/>
                  </IconButton>
                </span>
              </Tooltip>
              <SyncBadge syncing={syncing} isDemo={isDemo} lastSync={lastSync}/>
              <Avatar sx={{width:28,height:28,background:"linear-gradient(135deg,#00D4FF,#FF6B35)",fontSize:"0.7rem"}}>AD</Avatar>
            </Toolbar>
          </AppBar>

          <Box sx={{flex:1,overflow:"auto",p:3}}>
            {loading
              ? <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",flexDirection:"column",gap:2}}>
                  <CircularProgress color="primary"/>
                  <Typography color="text.secondary">Loading from Google Sheets…</Typography>
                </Box>
              : <AnimatePresence mode="wait">
                  <motion.div key={page+(selected?.id||"")} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}} transition={{duration:0.22}}>
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>}
          </Box>
        </Box>
      </Box>

      <NewShipDlg open={newShip} onClose={()=>setNewShip(false)} onSave={saveShipment} entities={entities}/>
      <NewEntDlg  open={newEnt}  onClose={()=>setNewEnt(false)}  onSave={saveEntity}/>
      <PayDlg open={payDlg.open} payment={payDlg.payment} onClose={()=>setPayDlg({open:false,payment:null})} onPay={processPayment}/>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={()=>setSnack(p=>({...p,open:false}))} anchorOrigin={{vertical:"bottom",horizontal:"right"}}>
        <Alert severity={snack.sev} onClose={()=>setSnack(p=>({...p,open:false}))} sx={{borderRadius:2}}>{snack.msg}</Alert>
      </Snackbar>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:rgba(0,0,0,0.15)}
        ::-webkit-scrollbar-thumb{background:rgba(0,212,255,0.25);border-radius:3px}
      `}</style>
    </ThemeProvider>
  );
}
