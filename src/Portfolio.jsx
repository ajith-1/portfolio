import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const EXPERIENCES = [
  {
    id: 1,
    side: "right",
    badge: "Current",
    badgeType: "now",
    period: "Feb 2026\nPresent",
    role: "Senior Executive – Logistics & EXIM",
    company: "Ola Electric Technologies Pvt. Ltd.",
    companySub: "via Transsafe Global Forwarding",
    location: "Bangalore",
    bullets: [
      "End-to-end import & export operations (air & sea) for EV components and production-critical materials",
      "Customs documentation: Bills of Entry, Shipping Bills, Commercial Invoices, Packing Lists, BL/AWB, COO",
      "HSN classification, customs duty calculation (BCD, SWS, IGST) & ICEGATE clearance",
      "EPCG and IGCR imports — documentation coordination, record maintenance & compliance tracking",
      "Coordination with CHA, freight forwarders, customs officials, procurement, warehouse & production teams",
      "Handling reverse logistics for international & domestic shipments",
      "SAP for PO reference, EXIM tracking & shipment coordination",
      "Shipment tracking, MIS reporting, DGFT / Customs Act / FEMA & internal SOP compliance",
    ],
  },
  {
    id: 2,
    side: "left",
    badge: "Oct 2025 – Feb 2026",
    badgeType: "old",
    period: "Oct 2025\nFeb 2026",
    role: "Associate – Logistics & EXIM",
    company: "Ola Electric Technologies Pvt. Ltd.",
    companySub: null,
    location: "Bangalore",
    bullets: [
      "End-to-end import & export operations for EV components",
      "Preparing and reviewing full customs documentation sets",
      "HSN classification, duty calculation & ICEGATE clearance",
      "EPCG and IGCR compliance support and documentation coordination",
      "Reverse logistics — international re-imports, returns & repair movements",
      "MIS reporting and adherence to DGFT, Customs Act, FEMA, and SOPs",
    ],
  },
  {
    id: 3,
    side: "right",
    badge: "Oct 2023 – Sep 2025",
    badgeType: "old",
    period: "Oct 2023\nSep 2025",
    role: "Operations Executive",
    company: "Sree Exim Solution",
    companySub: null,
    location: "Bangalore",
    bullets: [
      "Handled 35–45 import & export shipments per month (air & sea) at Bengaluru Air Cargo & ICD",
      "Prepared and processed Bills of Entry, Shipping Bills & clearance documentation via ICEGATE",
      "HSN classification, duty calculation (BCD, SWS, IGST) & compliance checks",
      "Supported re-imports, amendments, and special clearance cases including reverse logistics",
      "Maintained high-accuracy shipment trackers, clearance MIS & documentation records",
    ],
  },
  {
    id: 4,
    side: "left",
    badge: "Sep 2021 – Jul 2023",
    badgeType: "old",
    period: "Sep 2021\nJul 2023",
    role: "CNC Machinist",
    company: "Passon Industry",
    companySub: null,
    location: "Krishnagiri",
    bullets: [
      "Precision CNC machining and manufacturing operations",
      "Built strong foundations in supply chain sequencing, quality control and process adherence",
      "Developed systematic workflow management — a bedrock for logistics precision",
    ],
  },
];

const SKILLS = [
  {
    title: "Import & Export Operations",
    icon: "globe",
    chips: [
      { label: "Air & Sea Shipments", on: true },
      { label: "ICEGATE Filing", on: false },
      { label: "Bills of Entry", on: false },
      { label: "Shipping Bills", on: false },
      { label: "BL / AWB", on: false },
      { label: "COO Documentation", on: false },
      { label: "Reverse Logistics", on: false },
      { label: "35–45 Shipments/Month", on: false },
    ],
  },
  {
    title: "Customs & Compliance",
    icon: "shield",
    chips: [
      { label: "HSN Classification", on: true },
      { label: "BCD / SWS / IGST", on: true },
      { label: "DGFT Regulations", on: false },
      { label: "EPCG Compliance", on: false },
      { label: "IGCR Support", on: false },
      { label: "FEMA & Customs Act", on: false },
      { label: "Re-imports & Amendments", on: false },
    ],
  },
  {
    title: "Systems & Reporting",
    icon: "monitor",
    chips: [
      { label: "SAP / ERP", on: true },
      { label: "MS Excel (MIS)", on: true },
      { label: "Shipment Tracking", on: false },
      { label: "MIS Reporting", on: false },
      { label: "Documentation Records", on: false },
      { label: "SOP Compliance", on: false },
    ],
  },
  {
    title: "Coordination & Liaison",
    icon: "users",
    chips: [
      { label: "CHA Coordination", on: true },
      { label: "Freight Forwarders", on: false },
      { label: "Customs Officials", on: false },
      { label: "Warehouse Teams", on: false },
      { label: "Procurement Teams", on: false },
      { label: "Domestic Transporters", on: false },
    ],
  },
];

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const Icon = ({ name, size = 17, color = "white", strokeWidth = 2 }) => {
  const p = { fill: "none", stroke: color, strokeWidth, width: size, height: size, viewBox: "0 0 24 24", style: { display: "block", flexShrink: 0 } };
  switch (name) {
    case "globe":
      return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "shield":
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "monitor":
      return <svg {...p}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
    case "users":
      return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "mail":
      return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>;
    case "phone":
      return <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case "linkedin":
      return <svg fill={color} width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
    case "mappin":
      return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "briefcase":
      return <svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
    case "activity":
      return <svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
    default:
      return null;
  }
};

/* ─────────────────────────────────────────
   FADE WRAPPER  (IntersectionObserver)
───────────────────────────────────────── */
const Fade = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────
   GLOBAL CSS  (injected once)
───────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --w:#ffffff;--g500:#0D0C20;--g400:#1A1A1A;--g300:#333333;
  --g200:#6C6B77;--g100:#9E9EA6;--g75:#E7E7E9;--g50:#F7F7F7;
  --rSm:8px;--rMd:14px;--rLg:20px;
}
html{scroll-behavior:smooth}
body{font-family:'Poppins',sans-serif;background:var(--w);color:var(--g400);overflow-x:hidden;-webkit-font-smoothing:antialiased;line-height:1.6}
a{color:inherit;text-decoration:none}
section{width:100%;padding:72px 20px}
@media(min-width:900px){section{padding:88px 48px}}

/* NAV */
.pf-nav{position:fixed;top:0;left:0;right:0;z-index:900;height:60px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.96);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--g75)}
.pf-logo{font-size:19px;font-weight:800;color:var(--g500);letter-spacing:-0.5px}
.pf-logo span{color:var(--g200)}

/* HAMBURGER */
.pf-hbtn{width:42px;height:42px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:5px;padding:9px;background:var(--w);border:1.5px solid var(--g75);border-radius:11px;cursor:pointer;outline:none;transition:border-color 0.2s;flex-shrink:0}
.pf-hbtn:hover{border-color:var(--g200)}
.pf-sq{background:var(--g500);border-radius:2.5px;transition:transform 0.32s cubic-bezier(.77,0,.18,1)}
.pf-hbtn.open .pf-sq:nth-child(1){transform:rotate(45deg) translate(4px,4px)}
.pf-hbtn.open .pf-sq:nth-child(2){transform:rotate(-45deg) translate(-4px,4px)}
.pf-hbtn.open .pf-sq:nth-child(3){transform:rotate(-45deg) translate(4px,-4px)}
.pf-hbtn.open .pf-sq:nth-child(4){transform:rotate(45deg) translate(-4px,-4px)}

/* MENU OVERLAY */
.pf-ov{position:fixed;inset:0;z-index:800;background:var(--w);display:flex;flex-direction:column;justify-content:center;padding:0 8vw;gap:4px;opacity:0;pointer-events:none;transition:opacity 0.28s ease}
.pf-ov.open{opacity:1;pointer-events:all}
.pf-ov .ov-label{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--g100);margin-bottom:20px}
.pf-ov a{font-size:clamp(40px,10vw,72px);font-weight:800;letter-spacing:-2px;line-height:1.08;color:var(--g75);text-decoration:none;transition:color 0.18s}
.pf-ov a:hover,.pf-ov a:focus{color:var(--g500)}

/* HERO */
.pf-hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:80px 20px 60px;background:var(--g50);position:relative;overflow:hidden}
@media(min-width:900px){.pf-hero{padding:80px 48px 60px}}
.pf-deco{position:absolute;border-radius:50%;background:var(--g75);pointer-events:none}
.pf-deco.d1{width:340px;height:340px;right:-100px;bottom:-100px;opacity:0.5}
.pf-deco.d2{width:110px;height:110px;right:80px;top:90px;opacity:0.3}
.pf-hero-inner{position:relative;z-index:1;max-width:580px}
.pf-badge{display:inline-flex;align-items:center;gap:8px;background:var(--g500);color:var(--w);font-size:10.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:7px 15px;border-radius:100px;margin-bottom:22px}
.pf-pulse{width:7px;height:7px;border-radius:50%;background:#4ade80;flex-shrink:0;animation:pfblink 2s ease-in-out infinite}
@keyframes pfblink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.5)}}
.pf-h1{font-size:clamp(54px,14vw,100px);font-weight:800;line-height:0.92;letter-spacing:-3px;color:var(--g500);margin-bottom:18px;word-break:break-word}
.pf-hsub{font-size:clamp(13px,3.5vw,17px);color:var(--g200);line-height:1.7;margin-bottom:32px}
.pf-hsub strong{color:var(--g400);font-weight:600}

/* STATS */
.pf-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:32px}
.pf-stat{background:var(--w);border:1.5px solid var(--g75);border-radius:var(--rMd);padding:16px 10px;text-align:center}
.pf-sn{font-size:clamp(22px,5.5vw,34px);font-weight:800;color:var(--g500);letter-spacing:-1px;line-height:1;display:block}
.pf-sl{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--g100);margin-top:5px;display:block}

/* BUTTONS */
.pf-btnrow{display:flex;gap:10px;flex-wrap:wrap}
.pf-btn-fill{display:inline-flex;align-items:center;gap:8px;background:var(--g500);color:var(--w);padding:12px 24px;border-radius:var(--rSm);font-family:'Poppins',sans-serif;font-size:13.5px;font-weight:600;border:none;cursor:pointer;text-decoration:none;transition:background 0.2s,transform 0.15s;white-space:nowrap}
.pf-btn-fill:hover{background:var(--g300);transform:translateY(-2px)}
.pf-btn-stroke{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--g500);padding:12px 24px;border-radius:var(--rSm);font-family:'Poppins',sans-serif;font-size:13.5px;font-weight:600;border:2px solid var(--g75);cursor:pointer;text-decoration:none;transition:border-color 0.2s,transform 0.15s;white-space:nowrap}
.pf-btn-stroke:hover{border-color:var(--g300);transform:translateY(-2px)}

/* SECTION HEADINGS */
.pf-sec-tag{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--g100);margin-bottom:8px}
.pf-sec-h{font-size:clamp(28px,7vw,52px);font-weight:800;letter-spacing:-1.5px;line-height:1.05;color:var(--g500);margin-bottom:36px}

/* ABOUT */
.pf-about-box{background:var(--g50);border:1.5px solid var(--g75);border-radius:var(--rLg);padding:28px 24px}
@media(min-width:900px){.pf-about-box{padding:36px 32px}}
.pf-about-p{font-size:14px;color:var(--g300);line-height:1.85;margin-bottom:18px}
.pf-highlights{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:24px}
@media(max-width:400px){.pf-highlights{grid-template-columns:1fr}}
.pf-hl{background:var(--w);border:1.5px solid var(--g75);border-radius:var(--rMd);padding:14px;display:flex;align-items:flex-start;gap:11px}
.pf-hl-ico{width:36px;height:36px;flex-shrink:0;border-radius:9px;background:var(--g500);display:flex;align-items:center;justify-content:center}
.pf-hl-txt{font-size:12px;font-weight:500;color:var(--g300);line-height:1.5;padding-top:1px}

/* TIMELINE */
.pf-tl{position:relative;width:100%}
.pf-tl::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:2px;background:var(--g75);transform:translateX(-50%)}
.pf-tl-item{position:relative;width:100%;display:flex;align-items:flex-start;margin-bottom:40px}
.pf-tl-item.right{justify-content:flex-end}
.pf-tl-item.right .pf-tl-card{width:calc(50% - 28px)}
.pf-tl-item.left{justify-content:flex-start}
.pf-tl-item.left .pf-tl-card{width:calc(50% - 28px)}
.pf-tl-period{position:absolute;top:22px;font-size:11px;font-weight:700;color:var(--g100);letter-spacing:0.3px;line-height:1.5;width:calc(50% - 36px);white-space:pre-line}
.pf-tl-item.right .pf-tl-period{left:0;text-align:right}
.pf-tl-item.left .pf-tl-period{right:0;text-align:left}
.pf-tl-dot{position:absolute;left:50%;top:24px;width:14px;height:14px;border-radius:50%;background:var(--g500);border:3px solid var(--g50);box-shadow:0 0 0 2px var(--g500);transform:translateX(-50%);z-index:2;flex-shrink:0}
.pf-tl-card{background:var(--w);border:1.5px solid var(--g75);border-radius:var(--rMd);padding:20px;transition:border-color 0.22s,transform 0.22s}
.pf-tl-card:hover{border-color:var(--g300);transform:translateY(-4px)}
.pf-tc-badge{display:inline-block;padding:3px 11px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:0.4px;margin-bottom:9px}
.pf-tc-badge.now{background:var(--g500);color:var(--w)}
.pf-tc-badge.old{background:var(--g75);color:var(--g300)}
.pf-tc-role{font-size:13.5px;font-weight:700;color:var(--g500);line-height:1.3;margin-bottom:3px}
.pf-tc-co{font-size:12px;font-weight:600;color:var(--g200);margin-bottom:3px;line-height:1.4}
.pf-tc-co span{font-weight:400;color:var(--g100)}
.pf-tc-loc{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--g100);margin-bottom:13px}
.pf-tc-ul{list-style:none;padding:0}
.pf-tc-ul li{font-size:11.5px;color:var(--g300);line-height:1.65;padding:2.5px 0 2.5px 14px;position:relative}
.pf-tc-ul li::before{content:'';position:absolute;left:0;top:9px;width:5px;height:5px;border-radius:50%;background:var(--g75)}

/* MOBILE TIMELINE */
@media(max-width:639px){
  .pf-tl::before{left:18px;transform:none}
  .pf-tl-item.right,.pf-tl-item.left{justify-content:flex-end;padding-left:44px}
  .pf-tl-item.right .pf-tl-card,.pf-tl-item.left .pf-tl-card{width:100%;margin:0}
  .pf-tl-period{display:none}
  .pf-tl-dot{left:18px;transform:translateX(-50%)}
}

/* SKILLS */
.pf-sk-grid{display:grid;grid-template-columns:1fr;gap:14px}
@media(min-width:640px){.pf-sk-grid{grid-template-columns:1fr 1fr}}
.pf-sk-card{background:var(--g50);border:1.5px solid var(--g75);border-radius:var(--rMd);padding:22px}
.pf-sk-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.pf-sk-ico{width:36px;height:36px;border-radius:9px;background:var(--g500);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pf-sk-title{font-size:13.5px;font-weight:700;color:var(--g500)}
.pf-chips{display:flex;flex-wrap:wrap;gap:7px}
.pf-chip{background:var(--w);border:1.5px solid var(--g75);border-radius:6px;padding:5px 13px;font-size:11.5px;font-weight:500;color:var(--g300);cursor:default;transition:all 0.18s;white-space:nowrap;font-family:'Poppins',sans-serif}
.pf-chip:hover,.pf-chip.on{background:var(--g500);color:var(--w);border-color:var(--g500)}

/* CONTACT */
.pf-contact{background:var(--g500);padding:72px 20px}
@media(min-width:900px){.pf-contact{padding:88px 48px}}
.pf-contact .pf-sec-tag{color:rgba(255,255,255,0.35)}
.pf-contact .pf-sec-h{color:#ffffff}
.pf-c-sub{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8;margin-bottom:32px;max-width:520px}
.pf-c-grid{display:grid;grid-template-columns:1fr;gap:10px}
@media(min-width:640px){.pf-c-grid{grid-template-columns:1fr 1fr}}
.pf-c-card{display:flex;align-items:center;gap:15px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.11);border-radius:var(--rMd);padding:16px 18px;text-decoration:none;transition:background 0.2s,transform 0.18s;cursor:pointer}
.pf-c-card:hover{background:rgba(255,255,255,0.13);transform:translateY(-3px)}
.pf-c-ico{width:44px;height:44px;flex-shrink:0;border-radius:11px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center}
.pf-c-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.38);margin-bottom:3px}
.pf-c-val{font-size:13.5px;font-weight:600;color:#ffffff;word-break:break-all}
.pf-footer{margin-top:52px;padding-top:22px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;font-size:11.5px;color:rgba(255,255,255,0.22)}

/* SMALL SCREEN MISC */
@media(max-width:400px){
  .pf-btnrow{flex-direction:column}
  .pf-btn-fill,.pf-btn-stroke{width:100%;justify-content:center}
}
`;

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function AjithKumarPortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Inject global CSS once
  useEffect(() => {
    const id = "pf-global-css";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    return () => {};
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ── NAV ── */}
      <nav className="pf-nav">
        <a className="pf-logo" href="#hero">AK<span>.</span></a>
        <button
          className={`pf-hbtn${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="pf-sq" />
          <div className="pf-sq" />
          <div className="pf-sq" />
          <div className="pf-sq" />
        </button>
      </nav>

      {/* ── MENU OVERLAY ── */}
      <div className={`pf-ov${menuOpen ? " open" : ""}`}>
        <p className="ov-label">Navigation</p>
        {["Home", "About", "Experience", "Skills", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={closeMenu}
          >
            {item}
          </a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section id="home" className="pf-hero">
        <div className="pf-deco d1" />
        <div className="pf-deco d2" />
        <div className="pf-hero-inner">
          <Fade delay={80}>
            <div className="pf-badge">
              <span className="pf-pulse" />
              Available for Opportunities
            </div>
          </Fade>
          <Fade delay={160}>
            <h1 className="pf-h1">Ajith<br />Kumar.</h1>
          </Fade>
          <Fade delay={240}>
            <p className="pf-hsub">
              Senior Executive – <strong>Logistics &amp; EXIM</strong><br />
              Import &nbsp;·&nbsp; Export &nbsp;·&nbsp; Customs Compliance &nbsp;·&nbsp; Supply Chain
            </p>
          </Fade>
          <Fade delay={300}>
            <div className="pf-stats">
              {[["5+", "Years Exp."], ["2.5+", "EXIM Yrs"], ["45+", "Ships/Mo"]].map(([n, l]) => (
                <div className="pf-stat" key={l}>
                  <span className="pf-sn">{n}</span>
                  <span className="pf-sl">{l}</span>
                </div>
              ))}
            </div>
          </Fade>
          <Fade delay={360}>
            <div className="pf-btnrow">
              <a className="pf-btn-fill" href="#contact">
                <Icon name="mail" size={15} />
                Get in Touch
              </a>
              <a className="pf-btn-stroke" href="#experience">
                <Icon name="briefcase" size={15} color="#0D0C20" />
                View Experience
              </a>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: "#ffffff" }}>
        <Fade><p className="pf-sec-tag">Who I Am</p></Fade>
        <Fade delay={80}><h2 className="pf-sec-h">Precision in Motion</h2></Fade>
        <Fade delay={140}>
          <div className="pf-about-box">
            <p className="pf-about-p">
              A results-driven Logistics &amp; EXIM professional with over 5 years of industrial experience,
              including 2.5+ years specialising in end-to-end import/export operations, customs compliance,
              and supply chain coordination. Currently serving as Senior Executive – Logistics &amp; EXIM
              at Ola Electric Technologies, managing critical cross-border movements for EV components and
              production-critical materials.
            </p>
            <p className="pf-about-p">
              I thrive at the intersection of speed, regulation, and coordination — anticipating bottlenecks,
              optimising documentation workflows, and keeping every stakeholder aligned, from CHAs to warehouse
              and production teams. My manufacturing background in CNC machining adds a unique operational lens
              that bridges shop-floor realities with international trade compliance.
            </p>
            <p className="pf-about-p" style={{ marginBottom: 0 }}>
              Continuously developing expertise in DGFT regulations, SAP-based ERP workflows, EPCG/IGCR schemes,
              and evolving trade compliance frameworks — driven by genuine curiosity for complex logistics
              challenges and a commitment to measurable operational impact.
            </p>
            <div className="pf-highlights">
              {[
                { icon: "shield", text: "Customs Compliance & ICEGATE Filing" },
                { icon: "globe",  text: "Air & Sea Import / Export Ops" },
                { icon: "activity", text: "MIS Reporting & Shipment Tracking" },
                { icon: "users",  text: "CHA & Freight Forwarder Coordination" },
              ].map(({ icon, text }) => (
                <div className="pf-hl" key={text}>
                  <div className="pf-hl-ico"><Icon name={icon} /></div>
                  <div className="pf-hl-txt">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </Fade>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ background: "#F7F7F7" }}>
        <Fade><p className="pf-sec-tag">Career Journey</p></Fade>
        <Fade delay={80}><h2 className="pf-sec-h">Experience</h2></Fade>

        <div className="pf-tl">
          {EXPERIENCES.map((exp, i) => (
            <Fade key={exp.id} delay={i * 80}>
              <div className={`pf-tl-item ${exp.side}`}>
                <span className="pf-tl-period">{exp.period}</span>
                <div className="pf-tl-dot" />
                <div className="pf-tl-card">
                  <span className={`pf-tc-badge ${exp.badgeType}`}>{exp.badge}</span>
                  <p className="pf-tc-role">{exp.role}</p>
                  <p className="pf-tc-co">
                    {exp.company}
                    {exp.companySub && <span> {exp.companySub}</span>}
                  </p>
                  <p className="pf-tc-loc">
                    <Icon name="mappin" size={11} color="#9E9EA6" />
                    {exp.location}
                  </p>
                  <ul className="pf-tc-ul">
                    {exp.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ background: "#ffffff" }}>
        <Fade><p className="pf-sec-tag">What I Bring</p></Fade>
        <Fade delay={80}><h2 className="pf-sec-h">Core Skills</h2></Fade>
        <Fade delay={140}>
          <div className="pf-sk-grid">
            {SKILLS.map((grp) => (
              <div className="pf-sk-card" key={grp.title}>
                <div className="pf-sk-head">
                  <div className="pf-sk-ico"><Icon name={grp.icon} /></div>
                  <span className="pf-sk-title">{grp.title}</span>
                </div>
                <div className="pf-chips">
                  {grp.chips.map((c) => (
                    <span className={`pf-chip${c.on ? " on" : ""}`} key={c.label}>{c.label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Fade>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="pf-contact">
        <p className="pf-sec-tag">Let's Connect</p>
        <h2 className="pf-sec-h">Get in Touch</h2>
        <p className="pf-c-sub">
          Open to roles in logistics, EXIM, customs compliance and supply chain management.
          Proven track record in precision documentation, regulatory adherence and cross-functional
          coordination — ready to contribute from day one.
        </p>
        <div className="pf-c-grid">
          <a className="pf-c-card" href="mailto:ajithm0216@gmail.com">
            <div className="pf-c-ico"><Icon name="mail" size={21} /></div>
            <div><p className="pf-c-lbl">Email</p><p className="pf-c-val">ajithm0216@gmail.com</p></div>
          </a>
          <a className="pf-c-card" href="tel:+919786226148">
            <div className="pf-c-ico"><Icon name="phone" size={21} /></div>
            <div><p className="pf-c-lbl">Phone</p><p className="pf-c-val">+91 97862 26148</p></div>
          </a>
          <a className="pf-c-card" href="https://www.linkedin.com/in/ajith-kumar-ak216" target="_blank" rel="noopener noreferrer">
            <div className="pf-c-ico"><Icon name="linkedin" size={21} /></div>
            <div><p className="pf-c-lbl">LinkedIn</p><p className="pf-c-val">ajith-kumar-ak216</p></div>
          </a>
          <div className="pf-c-card" style={{ pointerEvents: "none", opacity: 0.45 }}>
            <div className="pf-c-ico"><Icon name="mappin" size={21} /></div>
            <div><p className="pf-c-lbl">Location</p><p className="pf-c-val">Bangalore, India</p></div>
          </div>
        </div>
        <div className="pf-footer">Designed with care &nbsp;·&nbsp; Ajith Kumar © 2026</div>
      </section>
    </>
  );
}
