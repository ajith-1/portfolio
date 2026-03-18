import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const p = {
  navy: "#1E3A5F", lime: "#C8E84A", dark: "#0D0C20",
  green: "#2ECB72", yellow: "#F7DF1E", midnight: "#001920",
  light: "#F5F6F6", white: "#FFFFFF", black: "#000000", lavender: "#C8C3FC",
};

const navLinks = ["Home", "About", "Experience", "Skills", "Contact"];

/* ── ICONS ─────────────────────────────────────────────────────── */
const Icon = ({ name, size=18, stroke="currentColor", sw=1.6 }) => {
  const a = { width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke, strokeWidth:sw, strokeLinecap:"round", strokeLinejoin:"round" };
  const icons = {
    ship:       <svg {...a}><path d="M2 20h20M5 20l1.5-6h11L19 20M12 3v11M8 9l4-6 4 6"/><path d="M3 14h18"/></svg>,
    filetext:   <svg {...a}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    monitor:    <svg {...a}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    calculator: <svg {...a}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
    shield:     <svg {...a}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    award:      <svg {...a}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    package:    <svg {...a}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    refresh:    <svg {...a}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    users:      <svg {...a}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    tool:       <svg {...a}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    globe:      <svg {...a}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    database:   <svg {...a}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
    barchart:   <svg {...a}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    mail:       <svg {...a}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone:      <svg {...a}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.95-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    linkedin:   <svg {...a}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    mappin:     <svg {...a}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    briefcase:  <svg {...a}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 12h20"/></svg>,
    zap:        <svg {...a}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    arrowright: <svg {...a}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    star:       <svg {...a}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    settings:   <svg {...a}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    check:      <svg {...a}><polyline points="20 6 9 17 4 12"/></svg>,
  };
  return icons[name] || null;
};

/* ── HAMBURGER ─────────────────────────────────────────────────── */
function HamburgerMenu({ open, toggle }) {
  const spread = [{ x:-3,y:-3 },{ x:3,y:-3 },{ x:-3,y:3 },{ x:3,y:3 }];
  const [hov, setHov] = useState(false);
  return (
    <motion.button onClick={toggle} onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      whileTap={{ scale:0.88 }} aria-label="Toggle menu"
      style={{ background:"none", border:"none", cursor:"pointer", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", padding:0 }}>
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div key="close" initial={{ rotate:-90,opacity:0,scale:0.6 }} animate={{ rotate:0,opacity:1,scale:1 }} exit={{ rotate:90,opacity:0,scale:0.6 }} transition={{ duration:0.18,type:"spring",stiffness:300,damping:20 }} style={{ position:"absolute" }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="3" y1="3" x2="19" y2="19" stroke={p.navy} strokeWidth="2" strokeLinecap="round"/>
              <line x1="19" y1="3" x2="3" y2="19" stroke={p.navy} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.div>
        ) : (
          <motion.div key="menu" initial={{ rotate:90,opacity:0,scale:0.6 }} animate={{ rotate:0,opacity:1,scale:1 }} exit={{ rotate:-90,opacity:0,scale:0.6 }} transition={{ duration:0.18,type:"spring",stiffness:300,damping:20 }} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, position:"absolute" }}>
            {[0,1,2,3].map(i => (
              <motion.div key={i}
                animate={ hov ? { x:spread[i].x, y:spread[i].y, scale:1.2 } : { x:0,y:0,scale:1 } }
                transition={{ type:"spring", stiffness:500, damping:22 }}
                style={{ width:8, height:8, borderRadius:"50%", border:`1.8px solid ${p.navy}`, background:"transparent" }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── NAVBAR ─────────────────────────────────────────────────────── */
function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = s => { document.getElementById(s.toLowerCase())?.scrollIntoView({ behavior:"smooth" }); setOpen(false); };

  return (
    <>
      <motion.nav initial={{ y:-60 }} animate={{ y:0 }} transition={{ type:"spring", stiffness:140, damping:22 }}
        style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background: scrolled?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.92)", backdropFilter:"blur(14px)", boxShadow: scrolled?"0 1px 20px rgba(30,58,95,0.08)":"none", transition:"all 0.12s" }}>
        <div className="inner" style={{ padding:"0 clamp(14px,3.5vw,48px)", height:58, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <motion.div whileHover={{ scale:1.03 }} onClick={() => go("Home")} style={{ cursor:"pointer" }}>
            <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:17, color:p.navy }}>Ajith<span style={{ color:p.lime }}>.</span></span>
          </motion.div>

          <div className="desk-nav" style={{ display:"flex", gap:2, alignItems:"center" }}>
            {navLinks.map(l => (
              <motion.button key={l} onClick={() => go(l)} whileTap={{ scale:0.96 }}
                style={{ background: active===l.toLowerCase()?p.navy:"transparent", color: active===l.toLowerCase()?p.white:p.navy, border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:500, fontSize:13, padding:"6px 16px", borderRadius:30, transition:"all 0.2s" }}>{l}</motion.button>
            ))}
            <motion.button onClick={() => go("Contact")} whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
              style={{ background:p.lime, color:p.dark, border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, padding:"7px 20px", borderRadius:30, marginLeft:8, display:"flex", alignItems:"center", gap:5 }}>
              Hire Me <Icon name="arrowright" size={12} stroke={p.dark} />
            </motion.button>
          </div>

          <div className="mob-nav"><HamburgerMenu open={open} toggle={() => setOpen(o=>!o)} /></div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0,y:-12 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-12 }} transition={{ duration:0.22 }}
            style={{ position:"fixed", top:58, left:0, right:0, zIndex:99, background:p.white, boxShadow:"0 8px 32px rgba(30,58,95,0.1)", padding:"10px 0 16px", borderBottom:`2px solid ${p.lime}` }}>
            {navLinks.map((l,i) => (
              <motion.div key={l} initial={{ opacity:0,x:-12 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.04 }} onClick={() => go(l)}
                style={{ padding:"11px 28px", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:500, fontSize:14, color: active===l.toLowerCase()?p.navy:p.dark, borderLeft: active===l.toLowerCase()?`3px solid ${p.lime}`:"3px solid transparent", background: active===l.toLowerCase()?`${p.lime}15`:"transparent" }}>{l}</motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── HERO ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="home" style={{ minHeight:"100vh", background:`linear-gradient(140deg,${p.midnight} 0%,${p.navy} 65%,#0D1F35 100%)`, display:"flex", alignItems:"center", position:"relative", overflow:"hidden", padding:"58px clamp(14px,4.5vw,72px) 60px" }}>

      {/* Subtle grid */}
      <div style={{ position:"absolute", inset:0, opacity:0.03, backgroundImage:`linear-gradient(${p.white} 1px,transparent 1px),linear-gradient(90deg,${p.white} 1px,transparent 1px)`, backgroundSize:"50px 50px", pointerEvents:"none" }} />

      {/* Decorative blob rings */}
      <motion.div animate={{ rotate:360 }} transition={{ duration:50, repeat:Infinity, ease:"linear" }}
        style={{ position:"absolute", right:"-5%", top:"5%", width:"clamp(220px,28vw,420px)", height:"clamp(220px,28vw,420px)", borderRadius:"40% 60% 65% 35%/45% 50% 55% 40%", border:`1px solid ${p.lime}18`, pointerEvents:"none" }} />
      <motion.div animate={{ rotate:-360 }} transition={{ duration:30, repeat:Infinity, ease:"linear" }}
        style={{ position:"absolute", right:"4%", top:"14%", width:"clamp(120px,14vw,220px)", height:"clamp(120px,14vw,220px)", borderRadius:"60% 40% 35% 65%/50% 55% 45% 50%", border:`1px solid ${p.lavender}25`, pointerEvents:"none" }} />

      {/* Ambient dots */}
      {Array.from({length:14},(_,i)=>i).map(i=>(
        <div key={i} style={{ position:"absolute", width:(i%3)+2, height:(i%3)+2, borderRadius:"50%", background:i%3===0?p.lime:i%3===1?p.lavender:p.green, opacity:0.14, left:`${(i*17)%95}%`, top:`${(i*29)%88}%`, pointerEvents:"none" }} />
      ))}

      {/* Main grid: left content | right panel */}
      <div className="inner" style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center", gap:"clamp(24px,4vw,64px)", position:"relative", zIndex:2, width:"100%" }}>

        {/* LEFT */}
        <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.75, ease:"easeOut" }}>

          {/* Eyebrow */}
          <motion.p initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.12 }}
            style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:p.lavender, fontWeight:600, letterSpacing:3.5, textTransform:"uppercase", marginBottom:12 }}>
            Logistics & EXIM Professional
          </motion.p>

          {/* Name */}
          <motion.h1 initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.22 }}
            style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, lineHeight:1.02, fontSize:"clamp(30px,4.8vw,58px)", color:p.white, margin:0, marginBottom:18 }}>
            Ajith<br /><span style={{ color:p.lime }}>Kumar</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.34 }}
            style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(12px,1.25vw,14px)", color:"rgba(255,255,255,0.58)", lineHeight:1.85, marginBottom:20, maxWidth:460 }}>
            Specializing in end-to-end import & export operations, customs compliance, and supply chain coordination — with hands-on experience at one of India's leading EV manufacturers.
          </motion.p>

          {/* Bento cards visible on mobile only */}
          <motion.div className="hero-cards-mobile" initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }}
            style={{ display:"none", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:22 }}>
            <div style={{ background:p.navy, borderRadius:12, padding:"11px 12px", border:"1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ width:24,height:24,borderRadius:7,background:`${p.lime}20`,border:`1px solid ${p.lime}33`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6 }}>
                <Icon name="briefcase" size={12} stroke={p.lime} sw={1.5} />
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:8,color:"rgba(255,255,255,0.45)",fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:2 }}>Since 2021</div>
              <div style={{ display:"flex",alignItems:"flex-end",gap:1,lineHeight:1,marginBottom:1 }}>
                <span style={{ fontFamily:"'Poppins',sans-serif",fontWeight:900,fontSize:22,color:p.white }}>5</span>
                <span style={{ fontFamily:"'Poppins',sans-serif",fontWeight:900,fontSize:15,color:p.lime,marginBottom:1 }}>+</span>
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:8,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase" }}>Yrs Industry</div>
            </div>
            <div style={{ background:p.lime, borderRadius:12, padding:"11px 12px" }}>
              <div style={{ width:24,height:24,borderRadius:7,background:"rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6 }}>
                <Icon name="shield" size={12} stroke={p.dark} sw={1.6} />
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:8,fontWeight:700,color:"rgba(0,0,0,0.45)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:3 }}>Regulatory</div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:9,fontWeight:700,color:p.dark,lineHeight:1.4 }}>DGFT · Customs Act · FEMA</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"11px 12px" }}>
              <div style={{ width:24,height:24,borderRadius:7,background:`${p.lavender}25`,border:`1px solid ${p.lavender}40`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6 }}>
                <Icon name="database" size={12} stroke={p.lavender} sw={1.6} />
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:8,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:3 }}>SAP / ERP</div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:9,fontWeight:700,color:p.white,lineHeight:1.4 }}>MIS · PO · Tracking</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"11px 12px" }}>
              <div style={{ width:24,height:24,borderRadius:7,background:`${p.green}25`,border:`1px solid ${p.green}40`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6 }}>
                <Icon name="monitor" size={12} stroke={p.green} sw={1.6} />
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:8,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:3 }}>ICEGATE</div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:9,fontWeight:700,color:p.white,lineHeight:1.4 }}>Customs Filing</div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.44 }} style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <motion.button whileHover={{ scale:1.04, boxShadow:`0 6px 22px ${p.lime}44` }} whileTap={{ scale:0.97 }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" })}
              style={{ background:p.lime, color:p.dark, border:"none", borderRadius:28, padding:"11px 28px", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:7, transition:"all 0.12s" }}>
              Get In Touch <Icon name="arrowright" size={13} stroke={p.dark} />
            </motion.button>
            <motion.button whileHover={{ scale:1.04, borderColor:p.lime, color:p.lime }} whileTap={{ scale:0.97 }}
              onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior:"smooth" })}
              style={{ background:"transparent", color:p.white, border:"1.5px solid rgba(255,255,255,0.22)", borderRadius:28, padding:"11px 26px", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, transition:"all 0.12s" }}>
              View Experience
            </motion.button>
          </motion.div>
        </motion.div>

        {/* RIGHT — equal bento cards 2x3 grid */}
        <motion.div className="hero-right" initial={{ opacity:0,x:40 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.75, delay:0.24, ease:"easeOut" }}
          style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"auto auto auto", gap:10, width:300 }}>

          {/* Card 1 — Since 2021 / 5+ */}
          <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }}
            whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(0,0,0,0.3)" }}
            style={{ background:p.navy, borderRadius:14, padding:"14px 14px", border:`1px solid rgba(255,255,255,0.1)`, transition:"all 0.12s" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:`${p.lime}20`, border:`1px solid ${p.lime}33`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8 }}>
              <Icon name="briefcase" size={14} stroke={p.lime} sw={1.5} />
            </div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, color:"rgba(255,255,255,0.45)", fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>Since 2021</div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:1, lineHeight:1, marginBottom:2 }}>
              <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:28, color:p.white }}>5</span>
              <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:20, color:p.lime, marginBottom:2 }}>+</span>
            </div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.45)", letterSpacing:1.2, textTransform:"uppercase" }}>Yrs Industry Exp.</div>
          </motion.div>

          {/* Card 2 — Regulatory Compliance */}
          <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.36 }}
            whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(0,0,0,0.25)" }}
            style={{ background:p.lime, borderRadius:14, padding:"14px 14px", transition:"all 0.12s" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"rgba(0,0,0,0.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8 }}>
              <Icon name="shield" size={14} stroke={p.dark} sw={1.6} />
            </div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, fontWeight:700, color:"rgba(0,0,0,0.45)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>Regulatory</div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:700, color:p.dark, lineHeight:1.45 }}>DGFT · Customs Act · FEMA</div>
          </motion.div>

          {/* Card 3 — SAP / ERP */}
          <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.42 }}
            whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(0,0,0,0.25)" }}
            style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"14px 14px", backdropFilter:"blur(8px)", transition:"all 0.12s" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:`${p.lavender}25`, border:`1px solid ${p.lavender}40`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8 }}>
              <Icon name="database" size={14} stroke={p.lavender} sw={1.6} />
            </div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>SAP / ERP</div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:700, color:p.white, lineHeight:1.45 }}>MIS · PO · Tracking</div>
          </motion.div>

          {/* Card 4 — ICEGATE & Customs Filing */}
          <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.48 }}
            whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(0,0,0,0.25)" }}
            style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"14px 14px", backdropFilter:"blur(8px)", transition:"all 0.12s" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:`${p.green}25`, border:`1px solid ${p.green}40`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8 }}>
              <Icon name="monitor" size={14} stroke={p.green} sw={1.6} />
            </div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>ICEGATE</div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:700, color:p.white, lineHeight:1.45 }}>Customs Filing</div>
          </motion.div>

          {/* Card 5 — BoE / Duty Calc (full width) */}
          <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.54 }}
            whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(0,0,0,0.28)" }}
            style={{ gridColumn:"span 2", background:`${p.lavender}18`, border:`1px solid ${p.lavender}30`, borderRadius:14, padding:"13px 16px", transition:"all 0.12s", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:`${p.lavender}25`, border:`1px solid ${p.lavender}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name="calculator" size={14} stroke={p.lavender} sw={1.6} />
            </div>
            <div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, fontWeight:700, color:`${p.lavender}88`, letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>Customs Filing</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:700, color:p.lavender, lineHeight:1.4 }}>BoE · Shipping Bills · Duty Calculation</div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll mouse */}
      <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
        <span style={{ fontFamily:"'Poppins',sans-serif", color:"rgba(255,255,255,0.25)", fontSize:9, letterSpacing:3, textTransform:"uppercase" }}>Scroll</span>
        <div style={{ width:20, height:32, borderRadius:10, border:"1.5px solid rgba(255,255,255,0.25)", display:"flex", justifyContent:"center", alignItems:"flex-start", paddingTop:4 }}>
          <motion.div animate={{ y:[0,13,0], opacity:[1,0.1,1] }} transition={{ duration:1.5, repeat:Infinity, ease:"easeInOut" }}
            style={{ width:3, height:6, borderRadius:2, background:p.lime }} />
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT ──────────────────────────────────────────────────────── */
function About() {
  const ref = useRef(null);
  const vis = useInView(ref, { once:true, margin:"-60px" });
  const cards = [
    { label:"Current Role",    value:"Senior Executive — Logistics & EXIM", icon:"briefcase", bg:p.navy,         fg:p.white, sub:"rgba(255,255,255,0.5)", accent:p.lime,  wide:false },
    { label:"Location",        value:"Bangalore, India",                     icon:"mappin",    bg:p.lime,         fg:p.dark,  sub:"rgba(0,0,0,0.45)",       accent:p.navy,  wide:false },
    { label:"Industry Focus",  value:"EV Manufacturing · EXIM · Supply Chain",icon:"zap",      bg:p.lavender,     fg:p.dark,  sub:"rgba(0,0,0,0.45)",       accent:p.navy,  wide:true  },
    { label:"Core Expertise",  value:"Customs · ICEGATE · DGFT · EPCG · SAP",icon:"settings",  bg:p.light,        fg:p.dark,  sub:"#888",                   accent:p.navy,  wide:true, border:`1.5px solid #ddd` },
    { label:"Background",      value:"Logistics + Manufacturing",             icon:"tool",      bg:`${p.green}18`, fg:p.dark,  sub:"#555",                   accent:p.green, wide:false, border:`1.5px solid ${p.green}44` },
    { label:"Status",          value:"Open to New Opportunities",             icon:"star",      bg:`${p.yellow}22`,fg:p.dark,  sub:"#666",                   accent:"#b8a000",wide:false,border:`1.5px solid ${p.yellow}88` },
  ];
  return (
    <section id="about" style={{ padding:"56px clamp(14px,4vw,56px)", background:p.white }}>
      <div className="inner" ref={ref}>
        <motion.div initial={{ opacity:0,y:28 }} animate={vis?{opacity:1,y:0}:{}} transition={{ duration:0.6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
            <div style={{ width:36, height:3, borderRadius:2, background:p.lime }} />
            <span style={{ fontFamily:"'Poppins',sans-serif", color:p.navy, fontWeight:700, fontSize:11, letterSpacing:3, textTransform:"uppercase" }}>About Me</span>
          </div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:"clamp(18px,2.6vw,30px)", color:p.dark, lineHeight:1.15, marginBottom:28 }}>
            Building precision in<br /><span style={{ color:p.navy }}>global trade operations</span>
          </h2>
        </motion.div>

        <div style={{ display:"flex", gap:36, flexWrap:"wrap", alignItems:"flex-start" }}>
          <motion.div initial={{ opacity:0,x:-28 }} animate={vis?{opacity:1,x:0}:{}} transition={{ duration:0.6, delay:0.14 }} style={{ flex:"1 1 280px", maxWidth:480 }}>
            {[
              "I'm a logistics and EXIM professional with 5+ years of industrial experience, including 2.5+ years specializing in import-export operations within the EV manufacturing sector. Currently associated with Ola Electric Technologies via Transsafe Global Forwarding, I manage high-stakes, time-sensitive shipments for production-critical EV components.",
              "From ICEGATE filings and customs documentation to EPCG/IGCR compliance and reverse logistics, I thrive in dynamic, regulation-heavy environments — bridging CHA, freight forwarders, procurement, and warehouse teams with clarity and speed.",
              "My manufacturing background gives me a unique edge: I understand the downstream impact of every delayed shipment on a production line, and I act with that urgency and precision.",
            ].map((txt,i) => (
              <motion.p key={i} initial={{ opacity:0,y:12 }} animate={vis?{opacity:1,y:0}:{}} transition={{ delay:0.2+i*0.1 }}
                style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(12px,1.2vw,14px)", lineHeight:1.85, color:"#555", marginBottom:14 }}>{txt}</motion.p>
            ))}
          </motion.div>

          <motion.div initial={{ opacity:0,x:28 }} animate={vis?{opacity:1,x:0}:{}} transition={{ duration:0.6, delay:0.24 }}
            style={{ flex:"1 1 280px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {cards.map((c,i) => (
              <motion.div key={i} initial={{ opacity:0,y:14 }} animate={vis?{opacity:1,y:0}:{}} transition={{ delay:0.3+i*0.07 }}
                whileHover={{ y:-4, boxShadow:"0 8px 24px rgba(30,58,95,0.12)" }}
                style={{ gridColumn:c.wide?"span 2":"span 1", background:c.bg, borderRadius:14, padding:"14px 16px", border:c.border||"none", boxShadow:"0 1px 8px rgba(0,0,0,0.05)", transition:"all 0.12s" }}>
                <div style={{ marginBottom:8 }}><Icon name={c.icon} size={18} stroke={c.accent} sw={1.6} /></div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, fontWeight:700, color:c.sub, letterSpacing:1.5, marginBottom:3, textTransform:"uppercase" }}>{c.label}</div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(11px,1vw,13px)", fontWeight:700, color:c.fg, lineHeight:1.4 }}>{c.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── EXPERIENCE ─────────────────────────────────────────────────── */
const exps = [
  {
    num:"01", label:"01 · Current",
    title:"Senior Executive — Logistics & EXIM",
    company:"Ola Electric Technologies Pvt Ltd",
    sub:"via Transsafe Global Forwarding Pvt Ltd · Implant / Off-Roll",
    location:"Bangalore", period:"Feb 2026 – Present",
    bg:"#FFFFFF", border:`1.5px solid rgba(30,58,95,0.10)`,
    ghost:"rgba(30,58,95,0.045)", pillBg:p.navy, pillFg:p.white,
    accentBar:p.lime, titleFg:p.navy, compFg:p.navy, subFg:"#aaa",
    textFg:"#555", dot:p.lime, wide:true,
    pts:[
      "Oversee end-to-end import & export operations (air & sea) for EV components and production-critical materials — ensuring zero-delay clearances that directly support manufacturing timelines.",
      "Prepare and review customs documentation — Bills of Entry, Shipping Bills, Commercial Invoices, Packing Lists, BL/AWB — with meticulous accuracy and full regulatory alignment.",
      "Execute HSN classification, customs duty computation (BCD, SWS, IGST), and end-to-end clearance through ICEGATE in compliance with Customs Act, DGFT, and FEMA.",
      "Drive EPCG and IGCR import compliance: documentation coordination, obligation tracking, and audit-ready record maintenance.",
      "Primary liaison between CHA, freight forwarders, customs authorities, and internal stakeholders — procurement, warehouse, and production teams.",
      "Manage reverse logistics for international shipments: re-imports, warranty returns, and cross-border repair movements with documentation precision.",
      "Support domestic reverse logistics for rejected, damaged, or surplus materials in coordination with warehouse and domestic transporters.",
      "Utilize SAP for PO referencing, EXIM tracking, and shipment coordination; maintain MIS reports and compliance dashboards for management visibility.",
    ],
  },
  {
    num:"02", label:"02 · Prior",
    title:"Associate — Logistics & EXIM",
    company:"Ola Electric Technologies Pvt Ltd",
    sub:"On-Roll Position",
    location:"Bangalore", period:"Oct 2025 – Feb 2026",
    bg:"#F0F4FF", border:`1.5px solid rgba(30,58,95,0.09)`,
    ghost:"rgba(30,58,95,0.038)", pillBg:p.navy, pillFg:p.white,
    accentBar:p.lavender, titleFg:p.navy, compFg:p.navy, subFg:"#aaa",
    textFg:"#555", dot:p.navy, wide:false,
    pts:[
      "Initial on-roll position at Ola Electric, building foundational expertise in EV-sector EXIM operations and large-scale supply chain coordination.",
      "Supported customs documentation, shipment management, and clearance tracking for production-critical imports.",
      "Gained deep knowledge of internal procurement, warehouse, and production workflows — forming the basis for expanded responsibilities.",
    ],
  },
  {
    num:"03", label:"03 · Previous",
    title:"Operation Executive",
    company:"Sree Exim Solution",
    sub:"Full-Time",
    location:"Bangalore", period:"Oct 2023 – Sep 2025",
    bg:"#F2FBF6", border:`1.5px solid rgba(46,203,114,0.14)`,
    ghost:"rgba(46,203,114,0.045)", pillBg:p.green, pillFg:p.dark,
    accentBar:p.green, titleFg:p.navy, compFg:"#1a6b3a", subFg:"#999",
    textFg:"#555", dot:p.green, wide:false,
    pts:[
      "Independently managed 35–45 import & export shipments per month across air and sea modes at Bengaluru Air Cargo and ICD.",
      "End-to-end processing of Bills of Entry, Shipping Bills, and customs clearance via ICEGATE with consistently high accuracy.",
      "HSN classification, duty calculation (BCD, SWS, IGST), compliance checks, re-imports, amendments, and reverse logistics documentation.",
      "Maintained shipment trackers, clearance MIS, and documentation records ensuring audit readiness and operational continuity.",
    ],
  },
  {
    num:"04", label:"04 · Foundation",
    title:"CNC Machinist",
    company:"Passon Industry",
    sub:"Full-Time",
    location:"Krishnagiri", period:"Sep 2021 – Jul 2023",
    bg:"#FFFDF0", border:`1.5px solid rgba(247,223,30,0.22)`,
    ghost:"rgba(247,223,30,0.08)", pillBg:"#b8a000", pillFg:p.white,
    accentBar:"#e6c900", titleFg:p.navy, compFg:"#7a6800", subFg:"#aaa",
    textFg:"#555", dot:"#b8a000", wide:false,
    pts:[
      "Operated CNC machining equipment with high precision, developing strong industrial discipline and quality-standards awareness.",
      "Built firsthand understanding of manufacturing workflows and supply chain impact — directly informing current EXIM and logistics decision-making.",
    ],
  },
];

function ExpCard({ exp, idx, vis }) {
  return (
    <motion.div initial={{ opacity:0,y:20 }} animate={vis?{opacity:1,y:0}:{}} transition={{ delay:idx*0.09, duration:0.4, ease:"easeOut" }}
      whileHover={{ y:-3, boxShadow:`0 8px 24px rgba(0,0,0,0.1), 0 0 0 1.5px ${exp.accentBar}44` }}
      style={{ background:exp.bg, border:exp.border, borderRadius:13, padding:"13px 15px", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 1px 8px rgba(0,0,0,0.05)", transition:"all 0.12s" }}>

      {/* Ghost number */}
      <div style={{ position:"absolute", right:"-0.04em", bottom:"-0.26em", fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:"clamp(48px,6vw,80px)", lineHeight:1, color:exp.ghost, userSelect:"none", pointerEvents:"none", letterSpacing:-2 }}>{exp.num}</div>

      <div style={{ width:22, height:2.5, borderRadius:2, background:exp.accentBar, marginBottom:7 }} />
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:8, fontWeight:700, color:exp.subFg, letterSpacing:1.8, marginBottom:5, textTransform:"uppercase" }}>{exp.label}</div>

      <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:"clamp(10px,1vw,12px)", color:exp.titleFg, lineHeight:1.25, marginBottom:2 }}>{exp.title}</h3>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(9px,0.78vw,10px)", color:exp.compFg, fontWeight:700, marginBottom:1 }}>{exp.company}</div>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(8px,0.7vw,9px)", color:exp.subFg, marginBottom:7 }}>{exp.sub}</div>

      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:7 }}>
        <span style={{ background:exp.pillBg, color:exp.pillFg, borderRadius:20, padding:"2px 7px", fontFamily:"'Poppins',sans-serif", fontSize:8, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}>
          <Icon name="mappin" size={7} stroke={exp.pillFg} /> {exp.location}
        </span>
        <span style={{ background:`${exp.accentBar}20`, color:exp.accentBar===p.lime?"#5a6e00":exp.accentBar, border:`1px solid ${exp.accentBar}50`, borderRadius:20, padding:"2px 7px", fontFamily:"'Poppins',sans-serif", fontSize:8, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}>
          <Icon name="check" size={7} stroke={exp.accentBar===p.lime?"#5a6e00":exp.accentBar} /> {exp.period}
        </span>
      </div>

      <div style={{ width:"100%", height:1, background:`${exp.accentBar}22`, marginBottom:7 }} />

      <div style={{ flex:1, display:exp.wide?"grid":"flex", gridTemplateColumns:exp.wide?"1fr 1fr":undefined, flexDirection:exp.wide?undefined:"column", gap:exp.wide?5:3 }}>
        {exp.pts.map((pt,i) => (
          <div key={i} style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
            <div style={{ width:3.5, height:3.5, minWidth:3.5, borderRadius:"50%", background:exp.dot, marginTop:5, flexShrink:0 }} />
            <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(10px,0.88vw,11.5px)", color:exp.textFg, lineHeight:1.65 }}>{pt}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Experience() {
  const ref = useRef(null);
  const vis = useInView(ref, { once:true, margin:"-60px" });
  return (
    <section id="experience" style={{ padding:"56px clamp(14px,4.5vw,72px)", background:`linear-gradient(180deg,${p.light} 0%,${p.white} 60%)` }}>
      <div style={{ maxWidth:"min(75vw,1100px)", margin:"0 auto" }} ref={ref}>
        <motion.div initial={{ opacity:0,y:24 }} animate={vis?{opacity:1,y:0}:{}} transition={{ duration:0.5 }} style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <div style={{ width:28, height:2.5, borderRadius:2, background:p.lime }} />
            <span style={{ fontFamily:"'Poppins',sans-serif", color:p.navy, fontWeight:700, fontSize:10, letterSpacing:2.5, textTransform:"uppercase" }}>Career Journey</span>
          </div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:"clamp(18px,2.8vw,32px)", color:p.dark, lineHeight:1.15 }}>
            Experience &<span style={{ color:p.navy }}> Track Record</span>
          </h2>
        </motion.div>

        <div style={{ marginBottom:12 }}>
          <ExpCard exp={exps[0]} idx={0} vis={vis} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
          {exps.slice(1).map((exp,i) => <ExpCard key={exp.num} exp={exp} idx={i+1} vis={vis} />)}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ─────────────────────────────────────────────────────── */
const skillCards = [
  { name:"Import & Export Operations", sub:"Air & Sea Modes",               icon:"ship",        bg:p.navy,          fg:p.white, accent:p.lime,     span:2 },
  { name:"Customs Documentation",      sub:"Bills · Invoices · Packing Lists",icon:"filetext",  bg:p.lime,          fg:p.dark,  accent:p.navy,     span:1 },
  { name:"ICEGATE Filing",             sub:"Procedures & E-Clearance",       icon:"monitor",    bg:p.lavender,      fg:p.dark,  accent:p.navy,     span:1 },
  { name:"HSN Classification",         sub:"BCD · SWS · IGST Duty Calc",    icon:"calculator", bg:"#0D2818",        fg:p.white, accent:p.green,    span:1 },
  { name:"DGFT & Customs Regulations", sub:"Indian Trade Policy",            icon:"shield",     bg:p.midnight,      fg:p.white, accent:p.lavender, span:1 },
  { name:"EPCG & IGCR Compliance",     sub:"Documentation & Tracking",       icon:"award",      bg:`${p.green}18`,  fg:p.dark,  accent:p.green,    span:1, border:`1.5px solid ${p.green}44` },
  { name:"Shipment Tracking",          sub:"End-to-End Clearance",           icon:"package",    bg:`${p.yellow}22`, fg:p.dark,  accent:"#b8a000",  span:1, border:`1.5px solid ${p.yellow}88` },
  { name:"Reverse Logistics",          sub:"International & Domestic",        icon:"refresh",    bg:p.navy,          fg:p.white, accent:p.lime,     span:1 },
  { name:"CHA & Freight Coordination", sub:"Forwarder & Customs Liaison",    icon:"users",      bg:"#1C1408",        fg:p.white, accent:p.yellow,   span:1 },
  { name:"Manufacturing EXIM Support", sub:"Supply Chain Integration",        icon:"tool",       bg:p.lavender,      fg:p.dark,  accent:p.navy,     span:1 },
  { name:"SAP / ERP Coordination",     sub:"PO Reference & Tracking",        icon:"database",   bg:p.lime,          fg:p.dark,  accent:p.navy,     span:1 },
  { name:"MIS Reporting & Excel",      sub:"Trackers & Dashboards",           icon:"barchart",   bg:`${p.navy}0D`,   fg:p.navy,  accent:p.navy,     span:1, border:`1.5px solid ${p.navy}20` },
];

function Skills() {
  const ref = useRef(null);
  const vis = useInView(ref, { once:true, margin:"-60px" });
  return (
    <section id="skills" style={{ padding:"56px clamp(14px,4vw,56px)", background:p.light }}>
      <div style={{ maxWidth:"min(75vw,1100px)", margin:"0 auto" }} ref={ref}>
        <motion.div initial={{ opacity:0,y:28 }} animate={vis?{opacity:1,y:0}:{}} transition={{ duration:0.6 }} style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:8 }}>
            <div style={{ width:36, height:3, borderRadius:2, background:p.lime }} />
            <span style={{ fontFamily:"'Poppins',sans-serif", color:p.navy, fontWeight:700, fontSize:11, letterSpacing:3, textTransform:"uppercase" }}>Expertise</span>
            <div style={{ width:36, height:3, borderRadius:2, background:p.lime }} />
          </div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:"clamp(18px,2.6vw,30px)", color:p.dark }}>Core Skills & Competencies</h2>
        </motion.div>

        <div className="skill-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {skillCards.map((s,i) => (
            <motion.div key={i} initial={{ opacity:0,y:22 }} animate={vis?{opacity:1,y:0}:{}} transition={{ delay:i*0.05, duration:0.45 }}
              whileHover={{ y:-5, boxShadow:"0 12px 36px rgba(0,0,0,0.13)" }}
              style={{ gridColumn:`span ${s.span}`, background:s.bg, border:s.border||"none", borderRadius:16, padding:"11px 13px", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", transition:"all 0.12s", cursor:"default", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-12, bottom:-12, opacity:0.07, pointerEvents:"none" }}>
                <Icon name={s.icon} size={72} stroke={s.fg} sw={0.8} />
              </div>
              <div style={{ display:"inline-flex", padding:8, borderRadius:10, background:`${s.accent}1E`, border:`1px solid ${s.accent}33`, marginBottom:10 }}>
                <Icon name={s.icon} size={18} stroke={s.accent} sw={1.7} />
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:"clamp(11px,1.05vw,13px)", color:s.fg, lineHeight:1.3, marginBottom:3 }}>{s.name}</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(9px,0.85vw,11px)", color:s.fg===p.dark?"rgba(0,0,0,0.48)":"rgba(255,255,255,0.5)", fontWeight:500 }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ────────────────────────────────────────────────────── */
function Contact() {
  const ref = useRef(null);
  const vis = useInView(ref, { once:true, margin:"-60px" });
  const contacts = [
    { icon:"mail",     label:"Email",    value:"ajithm0216@gmail.com",              href:"mailto:ajithm0216@gmail.com",                   bg:p.navy,     fg:p.white, accent:p.lime,  cta:"Send Email →" },
    { icon:"phone",    label:"Phone",    value:"+91 97862 26148",                   href:"tel:+919786226148",                              bg:p.lime,     fg:p.dark,  accent:p.navy,  cta:"Call Now →" },
    { icon:"linkedin", label:"LinkedIn", value:"linkedin.com/in/ajith-kumar-ak216", href:"https://www.linkedin.com/in/ajith-kumar-ak216",  bg:p.lavender, fg:p.dark,  accent:p.navy,  cta:"View Profile →" },
  ];
  const chips = [
    { icon:"ship",   label:"2.5+ Yrs EXIM" },
    { icon:"zap",    label:"EV Sector"      },
    { icon:"shield", label:"Customs Expert" },
    { icon:"globe",  label:"Global Logistics"},
  ];
  return (
    <section id="contact" style={{ padding:"56px clamp(14px,4vw,56px) 40px", background:`linear-gradient(140deg,${p.midnight} 0%,${p.navy} 100%)`, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", bottom:-100, right:-100, width:340, height:340, borderRadius:"50%", background:`${p.lime}06`, pointerEvents:"none" }} />
      <div style={{ maxWidth:"min(75vw,1100px)", margin:"0 auto" }} ref={ref}>
        <motion.div initial={{ opacity:0,y:28 }} animate={vis?{opacity:1,y:0}:{}} transition={{ duration:0.6 }} style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:8 }}>
            <div style={{ width:36, height:3, borderRadius:2, background:p.lime }} />
            <span style={{ fontFamily:"'Poppins',sans-serif", color:p.lime, fontWeight:700, fontSize:11, letterSpacing:3, textTransform:"uppercase" }}>Get In Touch</span>
            <div style={{ width:36, height:3, borderRadius:2, background:p.lime }} />
          </div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:"clamp(18px,2.6vw,30px)", color:p.white, marginBottom:12 }}>Let's Connect</h2>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(12px,1.2vw,14px)", color:"rgba(255,255,255,0.55)", maxWidth:420, margin:"0 auto" }}>
            Open to new roles in logistics, EXIM operations, or supply chain management. Let's discuss how I can add value to your team.
          </p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:14 }}>
          {contacts.map((c,i) => (
            <motion.a key={i} href={c.href} target={c.href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
              initial={{ opacity:0,y:22 }} animate={vis?{opacity:1,y:0}:{}} transition={{ delay:i*0.1 }}
              whileHover={{ y:-5, boxShadow:"0 14px 40px rgba(0,0,0,0.28)" }}
              style={{ background:c.bg, borderRadius:18, padding:"22px 20px", textDecoration:"none", display:"flex", flexDirection:"column", gap:8, boxShadow:"0 3px 16px rgba(0,0,0,0.2)", transition:"all 0.12s" }}>
              <div style={{ display:"inline-flex", padding:8, borderRadius:10, background:`${c.accent}22`, width:"fit-content" }}>
                <Icon name={c.icon} size={20} stroke={c.fg} sw={1.7} />
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:10, color:c.fg===p.white?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.45)", letterSpacing:1.5, textTransform:"uppercase" }}>{c.label}</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:"clamp(11px,1.1vw,13px)", color:c.fg, wordBreak:"break-all", lineHeight:1.4 }}>{c.value}</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, fontWeight:700, color:c.fg===p.white?p.lime:c.accent }}>{c.cta}</div>
            </motion.a>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))", gap:10 }}>
          {chips.map((h,i) => (
            <motion.div key={i} initial={{ opacity:0,scale:0.88 }} animate={vis?{opacity:1,scale:1}:{}} transition={{ delay:0.4+i*0.07 }}
              style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, padding:"14px 12px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <Icon name={h.icon} size={20} stroke="rgba(255,255,255,0.65)" sw={1.5} />
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.65)" }}>{h.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ─────────────────────────────────────────────────────── */
function Footer() {
  return (
    <div style={{ background:p.midnight, borderTop:"1px solid rgba(200,232,74,0.08)", padding:"16px clamp(14px,4.5vw,72px)", textAlign:"center" }}>
      <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:"rgba(255,255,255,0.25)", margin:0 }}>© 2025 Ajith Kumar · Logistics & EXIM Professional · Bangalore, India</p>
    </div>
  );
}

/* ── ACTIVE SECTION ─────────────────────────────────────────────── */
function useActive() {
  const [a,setA] = useState("home");
  useEffect(() => {
    const ids = ["home","about","experience","skills","contact"];
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) setA(e.target.id); }), { threshold:0.3 });
    ids.forEach(id => { const el=document.getElementById(id); if(el) obs.observe(el); });
    return () => obs.disconnect();
  },[]);
  return a;
}

/* ── APP ────────────────────────────────────────────────────────── */
export default function App() {
  const active = useActive();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;font-size:13px;}
        body{font-family:'Poppins',sans-serif;background:#fff;overflow-x:hidden;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#f1f1f1;}
        ::-webkit-scrollbar-thumb{background:#1E3A5F;border-radius:3px;}
        .desk-nav{display:flex!important;}
        .mob-nav{display:none!important;}
        .inner{max-width:min(75vw,1100px);margin:0 auto;}
        @media(max-width:768px){
          .desk-nav{display:none!important;}
          .mob-nav{display:flex!important;}
          .inner{max-width:92vw;}
        }
        @media(max-width:960px){ .skill-grid{grid-template-columns:repeat(2,1fr)!important;} }
        @media(max-width:700px){
          .hero-right{display:none!important;}
          .hero-cards-mobile{display:grid!important;}
        }
        @media(max-width:480px){ .skill-grid{grid-template-columns:1fr!important;} }
      `}</style>
      <Navbar active={active} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
