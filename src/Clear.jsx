import { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/* ─────────────────────────────────────────
   INJECT: Tailwind Play CDN + Google Fonts
───────────────────────────────────────── */
(function injectHead() {
  if (document.getElementById("tw-cdn")) return;

  const tw = document.createElement("script");
  tw.id = "tw-cdn";
  tw.src = "https://cdn.tailwindcss.com";
  document.head.appendChild(tw);

  tw.onload = () => {
    if (window.tailwind) {
      window.tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              poppins: ["Poppins", "sans-serif"],
              roboto: ["Roboto", "sans-serif"],
            },
            colors: {
              accent: "#F7DF1E",
              accentd: "#D4BC00",
              ink: "#010101",
            },
            keyframes: {
              "truck-roll": {
                "0%,100%": { transform: "translateX(0)" },
                "50%": { transform: "translateX(6px)" },
              },
              "globe-spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
              "ship-bob": {
                "0%,100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-5px)" },
              },
              "plane-fly": {
                "0%": { transform: "translate(-8px,8px)" },
                "100%": { transform: "translate(8px,-8px)" },
              },
              "pulse-dot": {
                "0%,100%": { opacity: "1", transform: "scale(1)" },
                "50%": { opacity: "0.4", transform: "scale(1.4)" },
              },
              "chain-pulse": {
                "0%,100%": { opacity: "1" },
                "50%": { opacity: "0.3" },
              },
              "draw-line": {
                "0%": { strokeDashoffset: "100" },
                "100%": { strokeDashoffset: "0" },
              },
              "scan": {
                "0%": { transform: "translateY(0)" },
                "100%": { transform: "translateY(32px)" },
              },
              "float-badge": {
                "0%,100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-8px)" },
              },
              "counter-up": {
                "0%": { opacity: "0", transform: "translateY(16px)" },
                "100%": { opacity: "1", transform: "translateY(0)" },
              },
              "slide-right": {
                "0%": { transform: "scaleX(0)" },
                "100%": { transform: "scaleX(1)" },
              },
              "blink-cursor": {
                "0%,100%": { opacity: "1" },
                "50%": { opacity: "0" },
              },
              "fade-up": {
                "0%": { opacity: "0", transform: "translateY(32px)" },
                "100%": { opacity: "1", transform: "translateY(0)" },
              },
            },
            animation: {
              "truck-roll": "truck-roll 1.8s ease-in-out infinite",
              "globe-spin": "globe-spin 10s linear infinite",
              "ship-bob": "ship-bob 2.5s ease-in-out infinite",
              "plane-fly": "plane-fly 2s ease-in-out infinite alternate",
              "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
              "chain-pulse": "chain-pulse 1.8s ease-in-out infinite",
              "float-badge": "float-badge 2.6s ease-in-out infinite",
              "counter-up": "counter-up 0.7s ease-out forwards",
              "slide-right": "slide-right 0.5s ease-out forwards",
              "blink-cursor": "blink-cursor 1s step-end infinite",
              "fade-up": "fade-up 0.7s ease-out forwards",
            },
          },
        },
      };
    }
  };

  const fonts = document.createElement("link");
  fonts.rel = "stylesheet";
  fonts.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap";
  document.head.appendChild(fonts);

  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #ffffff; color: #010101; font-family: 'Roboto', sans-serif; overflow-x: hidden; }
    ::selection { background: #F7DF1E; color: #010101; }
    a { text-decoration: none; color: inherit; }
    .nav-underline { position: relative; }
    .nav-underline::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: #F7DF1E;
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    .nav-underline:hover::after { width: 100%; }
    .nav-underline:hover { color: #D4BC00 !important; }
    @keyframes spinSvg { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes bobY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
    @keyframes truckX { 0%,100%{transform:translateX(0)} 50%{transform:translateX(7px)} }
    @keyframes planeMove { 0%{transform:translate(-6px,6px) rotate(-15deg)} 100%{transform:translate(6px,-6px) rotate(-15deg)} }
    @keyframes pathDraw { from{stroke-dashoffset:120} to{stroke-dashoffset:0} }
    @keyframes scanLine { 0%{top:0} 100%{top:calc(100% - 3px)} }
    @keyframes ringPop { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(2.2);opacity:0} }
    @keyframes waveDot { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
    @keyframes slideInLeft { from{opacity:0;transform:translateX(-60px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideInRight { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
    @keyframes fadeInUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes scaleInDot { from{transform:scale(0)} to{transform:scale(1)} }
    @keyframes rotateRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes lineDraw { from{transform:scaleY(0)} to{transform:scaleY(1)} }
    .anim-truck { animation: truckX 1.8s ease-in-out infinite; }
    .anim-globe { animation: spinSvg 10s linear infinite; }
    .anim-ship { animation: bobY 2.4s ease-in-out infinite; }
    .anim-plane { animation: planeMove 2s ease-in-out infinite alternate; }
    .anim-float { animation: bobY 2.6s ease-in-out infinite; }
    .ring-pop { animation: ringPop 1.6s ease-out infinite; }
    .wave-dot { animation: waveDot 1.4s ease-in-out infinite; }
  `;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function calcExp() {
  const start = new Date(2023, 9, 1);
  const now = new Date();
  let y = now.getFullYear() - start.getFullYear();
  let m = now.getMonth() - start.getMonth();
  if (m < 0) { y--; m += 12; }
  return { y, m };
}

function useReveal(amt = 0.15) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: amt });
  return { ref, inView };
}

/* ─────────────────────────────────────────
   PROFESSION-SPECIFIC ANIMATED SVG ICONS
───────────────────────────────────────── */

/* 1. Cargo Truck — wheels rolling, body slides */
function IconTruck({ size = 56 }) {
  return (
    <div className="anim-truck" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 56" fill="none" width={size} height={size}>
        {/* Body */}
        <rect x="4" y="14" width="42" height="26" rx="4" fill="#F7DF1E" />
        {/* Cabin */}
        <path d="M46 20h10l8 12v8H46V20Z" fill="#010101" />
        <rect x="48" y="22" width="7" height="8" rx="1.5" fill="#F7DF1E" opacity="0.7" />
        {/* Cargo lines */}
        <line x1="10" y1="22" x2="40" y2="22" stroke="#010101" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="10" y1="27" x2="40" y2="27" stroke="#010101" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="10" y1="32" x2="40" y2="32" stroke="#010101" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        {/* Wheels */}
        <circle cx="16" cy="42" r="7" fill="#010101" />
        <circle cx="16" cy="42" r="3.5" fill="#F7DF1E" />
        <circle cx="56" cy="42" r="7" fill="#010101" />
        <circle cx="56" cy="42" r="3.5" fill="#F7DF1E" />
        {/* Ground shadow */}
        <ellipse cx="36" cy="52" rx="32" ry="3" fill="#010101" opacity="0.06" />
      </svg>
    </div>
  );
}

/* 2. Spinning Globe with shipping routes */
function IconGlobe({ size = 56 }) {
  return (
    <div className="anim-globe" style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 56 56" fill="none" width={size} height={size}>
        <circle cx="28" cy="28" r="24" stroke="#010101" strokeWidth="2.5" fill="none" />
        <ellipse cx="28" cy="28" rx="10" ry="24" stroke="#F7DF1E" strokeWidth="2" fill="none" />
        <line x1="4" y1="28" x2="52" y2="28" stroke="#010101" strokeWidth="1.5" opacity="0.5" />
        <line x1="7" y1="18" x2="49" y2="18" stroke="#010101" strokeWidth="1" opacity="0.3" />
        <line x1="7" y1="38" x2="49" y2="38" stroke="#010101" strokeWidth="1" opacity="0.3" />
        <circle cx="28" cy="28" r="3" fill="#F7DF1E" />
        {/* Route dots */}
        <circle cx="14" cy="22" r="2.5" fill="#F7DF1E" />
        <circle cx="40" cy="34" r="2.5" fill="#F7DF1E" />
      </svg>
    </div>
  );
}

/* 3. Container Ship with bobbing */
function IconShip({ size = 56 }) {
  return (
    <div className="anim-ship" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 56" fill="none" width={size} height={size}>
        {/* Hull */}
        <path d="M8 34 Q40 34 72 34 L66 46 Q40 50 14 46 Z" fill="#010101" />
        {/* Containers */}
        <rect x="12" y="20" width="14" height="14" rx="2" fill="#F7DF1E" />
        <rect x="28" y="20" width="14" height="14" rx="2" fill="#010101" stroke="#F7DF1E" strokeWidth="1.5" />
        <rect x="44" y="20" width="14" height="14" rx="2" fill="#F7DF1E" />
        {/* Mast */}
        <rect x="38" y="8" width="3" height="16" fill="#010101" />
        <path d="M41 8 L52 14 L41 18 Z" fill="#F7DF1E" />
        {/* Waves */}
        <path d="M2 50 Q10 46 18 50 Q26 54 34 50 Q42 46 50 50 Q58 54 68 50 Q74 46 78 50" stroke="#010101" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.2" />
      </svg>
    </div>
  );
}

/* 4. Cargo Plane flying */
function IconPlane({ size = 56 }) {
  return (
    <div className="anim-plane" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" fill="none" width={size} height={size}>
        {/* Fuselage */}
        <path d="M8 30 Q20 26 32 28 Q44 30 56 28 Q52 32 44 33 Q32 35 20 33 Z" fill="#010101" />
        {/* Wings */}
        <path d="M22 28 L10 18 L14 28 Z" fill="#F7DF1E" />
        <path d="M22 30 L10 40 L14 30 Z" fill="#F7DF1E" opacity="0.6" />
        {/* Tail */}
        <path d="M52 28 L58 20 L56 28 Z" fill="#F7DF1E" />
        {/* Nose */}
        <ellipse cx="55" cy="29" rx="4" ry="2.5" fill="#010101" />
        {/* Cargo door */}
        <rect x="26" y="28" width="12" height="5" rx="1" fill="#F7DF1E" opacity="0.5" />
        {/* Engine */}
        <ellipse cx="20" cy="26" rx="3" ry="1.8" fill="#F7DF1E" />
      </svg>
    </div>
  );
}

/* 5. Barcode / Document scanner */
function IconScanner({ size = 56 }) {
  return (
    <div style={{ width: size, height: size, position: "relative", overflow: "hidden" }}>
      <svg viewBox="0 0 56 56" fill="none" width={size} height={size}>
        {/* Document */}
        <rect x="8" y="4" width="34" height="44" rx="3" fill="white" stroke="#010101" strokeWidth="2" />
        {/* Barcode lines */}
        {[12,15,18,21,25,28,31,34,38].map((x, i) => (
          <rect key={i} x={x} y="12" width={i % 3 === 0 ? 2 : 1} height="24" fill="#010101" opacity="0.8" />
        ))}
        {/* Stamp circle */}
        <circle cx="44" cy="44" r="12" fill="#F7DF1E" />
        <path d="M38 44 l4 4 l7-7" stroke="#010101" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Corner folds */}
        <path d="M36 4 L36 12 L44 12" stroke="#010101" strokeWidth="1.5" fill="none" />
        <path d="M36 4 L44 12" stroke="white" strokeWidth="1.5" />
      </svg>
      {/* Scan line */}
      <div style={{
        position: "absolute", left: "14%", right: "36%", height: 2,
        background: "linear-gradient(90deg, transparent, #F7DF1E, transparent)",
        animation: "scanLine 2s linear infinite alternate",
        borderRadius: 2,
      }} />
    </div>
  );
}

/* 6. Customs / Anchor icon */
function IconCustoms({ size = 56 }) {
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 56 56" fill="none" width={size} height={size}>
        {/* Anchor ring */}
        <circle cx="28" cy="14" r="7" stroke="#010101" strokeWidth="2.5" fill="none" />
        <circle cx="28" cy="14" r="3" fill="#F7DF1E" />
        {/* Stem */}
        <line x1="28" y1="21" x2="28" y2="46" stroke="#010101" strokeWidth="2.5" strokeLinecap="round" />
        {/* Cross bar */}
        <line x1="16" y1="28" x2="40" y2="28" stroke="#010101" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bottom arc */}
        <path d="M14 40 Q14 52 28 52 Q42 52 42 40" stroke="#F7DF1E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* End circles */}
        <motion.circle cx="14" cy="40" r="3.5" fill="#F7DF1E"
          animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />
        <motion.circle cx="42" cy="40" r="3.5" fill="#F7DF1E"
          animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.4 }} />
      </svg>
    </div>
  );
}

/* 7. Supply chain network */
function IconSupplyChain({ size = 56 }) {
  return (
    <svg viewBox="0 0 64 56" fill="none" width={size} height={size}>
      {/* Nodes */}
      <motion.circle cx="8" cy="28" r="6" fill="#F7DF1E" stroke="#010101" strokeWidth="2"
        animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }} />
      <motion.circle cx="32" cy="10" r="6" fill="#010101"
        animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} />
      <motion.circle cx="32" cy="46" r="6" fill="#010101"
        animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6 }} />
      <motion.circle cx="56" cy="28" r="6" fill="#F7DF1E" stroke="#010101" strokeWidth="2"
        animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.9 }} />
      {/* Links */}
      <motion.line x1="14" y1="28" x2="26" y2="13" stroke="#F7DF1E" strokeWidth="2" strokeDasharray="4 3"
        animate={{ strokeDashoffset: [0, -14] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
      <motion.line x1="14" y1="28" x2="26" y2="43" stroke="#010101" strokeWidth="2" strokeDasharray="4 3"
        animate={{ strokeDashoffset: [0, -14] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear", delay: 0.3 }} />
      <motion.line x1="38" y1="13" x2="50" y2="25" stroke="#F7DF1E" strokeWidth="2" strokeDasharray="4 3"
        animate={{ strokeDashoffset: [0, -14] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear", delay: 0.6 }} />
      <motion.line x1="38" y1="43" x2="50" y2="31" stroke="#010101" strokeWidth="2" strokeDasharray="4 3"
        animate={{ strokeDashoffset: [0, -14] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear", delay: 0.9 }} />
    </svg>
  );
}

/* 8. Warehouse */
function IconWarehouse({ size = 56 }) {
  return (
    <svg viewBox="0 0 72 56" fill="none" width={size} height={size}>
      {/* Roof */}
      <motion.polygon points="4,28 36,6 68,28" fill="#F7DF1E"
        animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
      {/* Walls */}
      <rect x="8" y="28" width="56" height="24" fill="#010101" opacity="0.9" />
      {/* Door */}
      <rect x="26" y="36" width="14" height="16" rx="1" fill="#F7DF1E" />
      <rect x="32" y="36" width="2" height="16" fill="#010101" opacity="0.3" />
      {/* Windows */}
      <rect x="12" y="32" width="10" height="8" rx="1" fill="#F7DF1E" opacity="0.5" />
      <rect x="50" y="32" width="10" height="8" rx="1" fill="#F7DF1E" opacity="0.5" />
      {/* Ground */}
      <line x1="4" y1="52" x2="68" y2="52" stroke="#010101" strokeWidth="1.5" opacity="0.2" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
const NAV_ITEMS = ["About", "Experience", "Skills", "Contact"];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 50);
    const r = () => setMobile(window.innerWidth < 768);
    window.addEventListener("scroll", s);
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("scroll", s); window.removeEventListener("resize", r); };
  }, []);

  const go = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          height: 68,
          background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "2px solid #F7DF1E" : "none",
          boxShadow: scrolled ? "0 2px 32px rgba(0,0,0,0.07)" : "none",
          transition: "all 0.35s ease",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={() => go("hero")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #F7DF1E, #D4BC00)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(247,223,30,0.45)",
            }}
          >
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15, color: "#010101" }}>AK</span>
          </motion.div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#010101", lineHeight: 1.15 }}>Ajith Kumar</div>
            <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.6rem", color: "#777", letterSpacing: "2px", textTransform: "uppercase" }}>Logistics & EXIM</div>
          </div>
        </motion.button>

        {/* Desktop nav */}
        {!mobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item}
                onClick={() => go(item)}
                className="nav-underline"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 500,
                  fontSize: "0.87rem", letterSpacing: "0.5px", color: "#010101",
                  padding: "8px 16px", transition: "color 0.2s",
                }}
              >{item}</button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 6px 24px rgba(247,223,30,0.6)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => go("contact")}
              style={{
                marginLeft: 8, background: "linear-gradient(135deg, #F7DF1E, #D4BC00)",
                border: "none", cursor: "pointer",
                fontFamily: "'Poppins',sans-serif", fontWeight: 700,
                fontSize: "0.84rem", color: "#010101",
                padding: "10px 22px", borderRadius: 8,
                boxShadow: "0 3px 12px rgba(247,223,30,0.4)",
              }}
            >Hire Me</motion.button>
          </div>
        )}

        {/* Mobile hamburger */}
        {mobile && (
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative", width: 32, height: 24 }}
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={
                  open
                    ? i === 0 ? { top: "50%", rotate: 45, y: "-50%" }
                    : i === 2 ? { top: "50%", rotate: -45, y: "-50%" }
                    : { opacity: 0, scaleX: 0 }
                  : i === 0 ? { top: "0%", rotate: 0, y: "0%" }
                  : i === 1 ? { top: "50%", rotate: 0, y: "-50%", opacity: 1, scaleX: 1 }
                  : { top: "100%", rotate: 0, y: "-100%" }
                }
                transition={{ duration: 0.28 }}
                style={{
                  position: "absolute", left: 0, width: "100%", height: 3,
                  borderRadius: 2, background: "#010101", transformOrigin: "center", display: "block",
                }}
              />
            ))}
          </button>
        )}
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && mobile && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: "78vw", maxWidth: 310,
              background: "#ffffff", zIndex: 999, padding: "88px 28px 32px",
              boxShadow: "-8px 0 48px rgba(0,0,0,0.13)", borderLeft: "4px solid #F7DF1E",
            }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <button
                  onClick={() => go(item)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif", fontWeight: 700,
                    fontSize: "1.4rem", color: "#010101", padding: "14px 0",
                    borderBottom: "1px solid #ECECEC",
                  }}
                >{item}</button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { y: expY, m: expM } = calcExp();

  const [typed, setTyped] = useState("");
  const titles = ["Logistics Professional", "EXIM Specialist", "Supply Chain Expert", "Freight Coordinator"];
  const [tIdx, setTIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const cur = titles[tIdx];
    let timeout;
    if (typing) {
      if (charIdx < cur.length) {
        timeout = setTimeout(() => { setTyped(cur.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 70);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => { setTyped(cur.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, 40);
      } else {
        setTIdx(t => (t + 1) % titles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIdx, typing, tIdx]);

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        minHeight: "100vh", background: "#ffffff",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden", paddingTop: 68,
      }}
    >
      {/* Subtle dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1.2px, transparent 1.2px)",
        backgroundSize: "28px 28px", pointerEvents: "none",
      }} />
      {/* Yellow accent blob */}
      <div style={{
        position: "absolute", top: "5%", right: "3%",
        width: 440, height: 440, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(247,223,30,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Bottom left blob */}
      <div style={{
        position: "absolute", bottom: "-60px", left: "-80px",
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(247,223,30,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <motion.div style={{ y: parallaxY, opacity: fadeOut, width: "100%", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center" }}>

            {/* Left: Text */}
            <div>
              {/* Available badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#ffffff", borderRadius: 100,
                  padding: "6px 16px", border: "1.5px solid #F7DF1E",
                  boxShadow: "0 4px 18px rgba(247,223,30,0.28)", marginBottom: 24,
                }}
              >
                <span className="ring-pop" style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  background: "#22C55E", position: "relative",
                }}>
                  <span style={{
                    position: "absolute", inset: -2, borderRadius: "50%",
                    border: "2px solid #22C55E", animation: "ringPop 1.6s ease-out infinite",
                  }} />
                </span>
                <span style={{ fontFamily: "'Roboto',sans-serif", fontWeight: 500, fontSize: "0.78rem", color: "#555" }}>
                  Open to Opportunities
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 900,
                  fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 1.0,
                  color: "#010101", marginBottom: 6,
                }}
              >
                Ajith
                <br />
                <span style={{
                  background: "linear-gradient(135deg, #D4BC00 0%, #F7DF1E 50%, #D4BC00 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Kumar</span>
              </motion.h1>

              {/* Typewriter */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 22, height: 32 }}
              >
                <div style={{ width: 44, height: 3, background: "#F7DF1E", borderRadius: 2 }} />
                <span style={{
                  fontFamily: "'Roboto',sans-serif", fontWeight: 500,
                  fontSize: "1rem", color: "#444", letterSpacing: "1.5px", textTransform: "uppercase",
                }}>
                  {typed}
                  <span style={{ animation: "blink-cursor 1s step-end infinite", borderRight: "2px solid #F7DF1E", marginLeft: 2 }} />
                </span>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                style={{
                  fontFamily: "'Roboto',sans-serif", fontSize: "1.05rem",
                  lineHeight: 1.85, color: "#444", maxWidth: 520, marginBottom: 36,
                }}
              >
                Driving cross-border trade excellence with{" "}
                <strong style={{ color: "#010101", fontWeight: 700 }}>
                  {expY} yr{expY !== 1 ? "s" : ""} {expM} months
                </strong>{" "}
                of hands-on EXIM and logistics experience.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 32px rgba(247,223,30,0.55)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  style={{
                    background: "linear-gradient(135deg, #F7DF1E, #D4BC00)",
                    border: "none", cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif", fontWeight: 700,
                    fontSize: "0.9rem", color: "#010101",
                    padding: "13px 32px", borderRadius: 10,
                    boxShadow: "0 4px 18px rgba(247,223,30,0.4)",
                  }}
                >Get In Touch →</motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, background: "#f5f5f5" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
                  style={{
                    background: "#ffffff", border: "2px solid #e0e0e0",
                    cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                    fontWeight: 600, fontSize: "0.9rem", color: "#010101",
                    padding: "13px 32px", borderRadius: 10, transition: "all 0.2s",
                  }}
                >View Journey</motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
                style={{ display: "flex", gap: 36, flexWrap: "wrap" }}
              >
                {[
                  { v: `${expY}+ Yrs`, l: "Experience" },
                  { v: "2+", l: "Companies" },
                  { v: "3", l: "Logistics Domains" },
                  { v: "100+", l: "Shipments" },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#010101", lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontFamily: "'Roboto',sans-serif", fontWeight: 400, fontSize: "0.68rem", letterSpacing: "2px", textTransform: "uppercase", color: "#999", marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Animated icon card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.9, type: "spring" }}
              style={{
                width: 320, flexShrink: 0,
                background: "#ffffff", border: "2px solid #ececec",
                borderRadius: 28, padding: "36px 28px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.07)",
                position: "relative",
              }}
            >
              {/* Yellow accent line */}
              <div style={{ position: "absolute", top: 0, left: 28, right: 28, height: 4, background: "linear-gradient(90deg, #F7DF1E, #D4BC00)", borderRadius: "0 0 4px 4px" }} />

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <IconTruck size={72} />
                <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#010101", textAlign: "center" }}>
                  Global Logistics Expert
                </div>
                <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.8rem", color: "#777", textAlign: "center", lineHeight: 1.6 }}>
                  Moving freight across borders with precision & compliance
                </div>

                {/* Icon row */}
                <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                  <div className="anim-float" style={{ animationDelay: "0s" }}><IconGlobe size={36} /></div>
                  <div className="anim-float" style={{ animationDelay: "0.4s" }}><IconShip size={36} /></div>
                  <div className="anim-float" style={{ animationDelay: "0.8s" }}><IconPlane size={36} /></div>
                </div>

                {/* Floating labels */}
                {[
                  { l: "EXIM", top: "12%", right: "-14%", d: 0 },
                  { l: "Customs", bottom: "28%", left: "-16%", d: 0.45 },
                  { l: "Freight", top: "58%", right: "-16%", d: 0.9 },
                ].map(b => (
                  <motion.div
                    key={b.l}
                    animate={{ y: [0, -7, 0] }}
                    transition={{ repeat: Infinity, duration: 2.6, delay: b.d }}
                    style={{
                      position: "absolute", ...(b.top ? { top: b.top } : { bottom: b.bottom }),
                      ...(b.right ? { right: b.right } : { left: b.left }),
                      background: "#ffffff", border: "1.5px solid #F7DF1E",
                      borderRadius: 100, padding: "4px 12px",
                      fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "0.68rem", color: "#010101",
                      boxShadow: "0 4px 14px rgba(247,223,30,0.3)",
                      whiteSpace: "nowrap",
                    }}
                  >{b.l}</motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
          >
            <motion.button
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
            >
              <svg width="24" height="38" viewBox="0 0 24 38" fill="none">
                <rect x="1" y="1" width="22" height="36" rx="11" stroke="#010101" strokeWidth="2" />
                <motion.rect x="10" y="7" width="4" height="8" rx="2" fill="#F7DF1E"
                  animate={{ y: [7, 15, 7] }} transition={{ repeat: Infinity, duration: 1.8 }}
                />
              </svg>
              <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#aaa" }}>Scroll</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────
   ABOUT — RECRUITER-FOCUSED
───────────────────────────────────────── */
function About() {
  const { ref, inView } = useReveal(0.1);
  const { y: expY, m: expM } = calcExp();

  const highlights = [
    { icon: <IconTruck size={36} />, title: "Domestic Logistics", val: "2+ Yrs", sub: "Pan-India freight coordination" },
    { icon: <IconGlobe size={36} />, title: "International", val: "Cross-Border", sub: "Import / Export operations" },
    { icon: <IconShip size={36} />, title: "Sea Freight", val: "FCL / LCL", sub: "Container & breakbulk cargo" },
    { icon: <IconPlane size={36} />, title: "Air Freight", val: "Express", sub: "Time-critical consignments" },
    { icon: <IconScanner size={36} />, title: "Documentation", val: "100%", sub: "BL, LC, COO, AWB, SB" },
    { icon: <IconCustoms size={36} />, title: "Customs", val: "Compliant", sub: "Regulatory & tariff management" },
  ];

  const achievements = [
    { emoji: "🏆", text: "Promoted from Associate to Senior Executive within the same organisation" },
    { emoji: "📦", text: "Managed 100+ domestic and international shipments end-to-end" },
    { emoji: "✅", text: "Zero compliance violations across all EXIM regulatory filings" },
    { emoji: "⚡", text: "Contributed to Ola Electric's rapid EV supply chain expansion" },
    { emoji: "🔄", text: "Designed reverse logistics flow that cut return turnaround time" },
    { emoji: "🤝", text: "Coordinated with 10+ freight forwarders and customs agents" },
  ];

  const coreSkills = [
    "Import / Export", "Customs Clearance", "Freight Forwarding", "Reverse Logistics",
    "Trade Documentation", "BL / LC / AWB", "Rate Negotiation", "Vendor Management",
    "Supply Chain", "SAP / ERP", "Compliance", "Warehouse Ops",
  ];

  return (
    <section id="about" style={{ background: "#ffffff", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Section header */}
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <motion.div
              style={{ width: 32, height: 3, background: "#F7DF1E", borderRadius: 2, transformOrigin: "left" }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5 }}
            />
            <span style={{ fontFamily: "'Roboto',sans-serif", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#777" }}>About Me</span>
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#010101", lineHeight: 1.1, marginBottom: 8 }}>
            Why Hire <span style={{ background: "linear-gradient(135deg, #D4BC00, #F7DF1E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Ajith?</span>
          </h2>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.95rem", color: "#666", marginBottom: 56, maxWidth: 540, lineHeight: 1.7 }}>
            A results-driven professional who thrives at the intersection of operations, compliance, and global trade.
          </p>
        </motion.div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

          {/* LEFT: Bio + Achievements */}
          <div>
            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}
              style={{
                background: "#ffffff", border: "1.5px solid #ececec",
                borderRadius: 20, padding: "28px", marginBottom: 24,
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                borderLeft: "5px solid #F7DF1E",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(135deg, #F7DF1E, #D4BC00)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 20, color: "#010101" }}>AK</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#010101" }}>Ajith Kumar</div>
                  <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.8rem", color: "#777" }}>Senior Executive — Logistics & EXIM</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
                    <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.72rem", color: "#22C55E", fontWeight: 500 }}>Currently at Ola Electric</span>
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.9rem", lineHeight: 1.85, color: "#444" }}>
                I began my logistics career at <strong style={{ color: "#010101" }}>Sree Exim Solutions</strong> in Oct 2023 and rapidly advanced to Senior Executive at <strong style={{ color: "#010101" }}>Ola Electric Technologies</strong> — one of India's most ambitious EV manufacturers. My {expY} yr{expY !== 1 ? "s" : ""} {expM} months of experience span domestic freight, sea/air imports, customs compliance, and reverse logistics.
              </p>
            </motion.div>

            {/* Key value propositions */}
            <motion.div
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}
              style={{
                background: "#010101", borderRadius: 20, padding: "28px",
                marginBottom: 24, color: "#ffffff",
              }}
            >
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F7DF1E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>
                What I Bring to the Table
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "🚢", t: "End-to-end EXIM ownership", d: "From PO to final delivery — I handle it all." },
                  { icon: "📑", t: "Zero-error documentation", d: "BL, LC, AWB, COO, SB — compliant every time." },
                  { icon: "🌍", t: "Multi-modal freight expertise", d: "Sea, air, road — domestic and international." },
                  { icon: "⚡", t: "Fast-paced environment ready", d: "Proved at high-growth EV startup scale." },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                  >
                    <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#ffffff", marginBottom: 2 }}>{item.t}</div>
                      <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.77rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{item.d}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.2 }}
              style={{ background: "#ffffff", border: "1.5px solid #ececec", borderRadius: 20, padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
            >
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#010101", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>
                Notable Achievements
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {achievements.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    whileHover={{ x: 4 }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < achievements.length - 1 ? "1px solid #f5f5f5" : "none", transition: "all 0.2s" }}
                  >
                    <span style={{ fontSize: "1rem", flexShrink: 0 }}>{a.emoji}</span>
                    <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{a.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Expertise cards + skills */}
          <div>
            {/* 6 domain cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(247,223,30,0.25)", borderColor: "#F7DF1E" }}
                  style={{
                    background: "#ffffff", border: "1.5px solid #ececec",
                    borderRadius: 16, padding: "20px 18px",
                    transition: "all 0.3s", cursor: "default",
                  }}
                >
                  <div style={{ marginBottom: 10 }}>{h.icon}</div>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#010101" }}>{h.val}</div>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "#010101", marginBottom: 3 }}>{h.title}</div>
                  <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.72rem", color: "#999", lineHeight: 1.5 }}>{h.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Experience timeline mini */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.15 }}
              style={{ background: "#ffffff", border: "1.5px solid #ececec", borderRadius: 20, padding: "28px", marginBottom: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
            >
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#010101", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 20 }}>
                Career Snapshot
              </div>
              {[
                { role: "Operation Executive", co: "Sree Exim Solutions", period: "Oct 2023 – Sep 2025", color: "#F7DF1E" },
                { role: "Associate EXIM", co: "Ola Electric Technologies", period: "Sep 2025", color: "#010101" },
                { role: "Senior Executive", co: "Ola Electric Technologies", period: "Present", color: "#F7DF1E", current: true },
              ].map((j, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 2 ? 0 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                      style={{ width: 12, height: 12, borderRadius: "50%", background: j.color, border: "2px solid #010101", flexShrink: 0, marginTop: 4 }}
                    />
                    {i < 2 && <div style={{ width: 2, height: 32, background: "#ececec", marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: i < 2 ? 16 : 0 }}>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#010101" }}>{j.role}</div>
                    <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.75rem", color: "#777" }}>{j.co}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                      <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.7rem", color: "#aaa" }}>{j.period}</span>
                      {j.current && (
                        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "0.62rem", background: "#DCFCE7", color: "#15803D", padding: "1px 8px", borderRadius: 100 }}>Current</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Skill tags */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.2 }}
              style={{ background: "#010101", borderRadius: 20, padding: "28px" }}
            >
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F7DF1E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>
                Core Skills
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {coreSkills.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    whileHover={{ background: "#F7DF1E", color: "#010101", scale: 1.08 }}
                    style={{
                      fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: "0.75rem",
                      padding: "5px 13px", borderRadius: 100,
                      background: "rgba(247,223,30,0.12)", color: "#F7DF1E",
                      border: "1px solid rgba(247,223,30,0.25)",
                      cursor: "default", transition: "all 0.2s",
                    }}
                  >{s}</motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   EXPERIENCE — ALTERNATING TIMELINE
───────────────────────────────────────── */
const JOBS = [
  {
    title: "Operation Executive",
    company: "Sree Exim Solutions",
    payroll: null,
    period: "Oct 2023 – Sep 2025",
    type: "Full-Time",
    color: "#F7DF1E",
    emoji: "📋",
    icon: <IconScanner size={32} />,
    points: [
      "Managed domestic & international logistics operations end-to-end",
      "Coordinated shipments, customs clearance and regulatory compliance",
      "Handled import/export documentation — BL, LC, COO, SB, AWB",
      "Implemented reverse logistics workflows reducing turnaround time",
      "Liaisoned with freight forwarders, customs agents, and carriers",
    ],
  },
  {
    title: "Associate EXIM",
    company: "Ola Electric Technologies Pvt Ltd",
    payroll: "Transsafe Global Forwarding Pvt Ltd",
    period: "Sep 2025 – Present",
    type: "Contract",
    color: "#010101",
    textOnColor: "#F7DF1E",
    emoji: "🌐",
    icon: <IconGlobe size={32} />,
    points: [
      "Full-cycle EXIM operations for India's leading EV manufacturer",
      "Cross-border shipment coordination with global freight forwarders",
      "Customs documentation, duty drawback and trade compliance filings",
      "Optimized freight costs through strategic carrier negotiations",
      "Maintained compliance with DGFT, customs & FEMA regulations",
    ],
  },
  {
    title: "Senior Executive",
    company: "Ola Electric Technologies Pvt Ltd",
    payroll: "Transsafe Global Forwarding Pvt Ltd",
    period: "Present",
    type: "Contract",
    color: "#F7DF1E",
    emoji: "⚡",
    icon: <IconSupplyChain size={32} />,
    points: [
      "Leading strategic logistics and supply chain initiatives at scale",
      "Supplier coordination, KPI tracking and carrier performance review",
      "Import duty optimization and landed cost reduction programs",
      "Team oversight across domestic and international freight corridors",
      "Championed process improvements across EXIM documentation workflow",
    ],
  },
];

function TLCard({ job }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 18px 52px rgba(0,0,0,0.09)" }}
      style={{
        background: "#ffffff", borderRadius: 16, padding: "26px 28px",
        border: "1.5px solid #ececec",
        borderTop: `4px solid ${job.color}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)", transition: "all 0.3s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#010101" }}>{job.title}</div>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "0.85rem", color: job.color === "#F7DF1E" ? "#B45309" : "#010101", marginTop: 2 }}>{job.company}</div>
          {job.payroll && (
            <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.7rem", color: "#aaa", fontStyle: "italic", marginTop: 2 }}>
              Payroll via {job.payroll}
            </div>
          )}
        </div>
        <span style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "0.66rem",
          letterSpacing: "0.5px", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100,
          background: job.type === "Full-Time" ? "#DCFCE7" : "#EFF6FF",
          color: job.type === "Full-Time" ? "#15803D" : "#1D4ED8",
        }}>{job.type}</span>
      </div>
      <ul style={{ paddingLeft: 18 }}>
        {job.points.map((pt, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.82rem", lineHeight: 1.8, color: "#555", marginBottom: 2 }}
          >{pt}</motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function Experience() {
  const { ref, inView } = useReveal();
  return (
    <section id="experience" style={{ background: "#ffffff", padding: "100px 40px", borderTop: "1px solid #f0f0f0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <motion.div style={{ width: 32, height: 3, background: "#F7DF1E", borderRadius: 2, transformOrigin: "left" }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5 }} />
            <span style={{ fontFamily: "'Roboto',sans-serif", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#777" }}>Career Timeline</span>
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#010101", marginBottom: 64, lineHeight: 1.1 }}>
            Professional <span style={{ background: "linear-gradient(135deg, #D4BC00, #F7DF1E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Experience</span>
          </h2>
        </motion.div>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              top: 0, bottom: 0, width: 3,
              background: "linear-gradient(to bottom, #F7DF1E, #010101, #F7DF1E)",
              transformOrigin: "top", zIndex: 1, borderRadius: 4,
            }}
          />

          {JOBS.map((job, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", alignItems: "start", marginBottom: 52 }}>
                {/* Left */}
                {isLeft ? (
                  <motion.div
                    initial={{ opacity: 0, x: -64 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    style={{ paddingRight: 32 }}
                  >
                    <TLCard job={job} />
                  </motion.div>
                ) : <div />}

                {/* Center dot */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, paddingTop: 14 }}>
                  <motion.div
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 220 }}
                    style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${job.color}, ${job.color}BB)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 0 0 6px ${job.color}28, 0 6px 20px ${job.color}44`,
                      position: "relative", flexShrink: 0,
                      border: job.color === "#010101" ? "2px solid #F7DF1E" : "2px solid #010101",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
                      style={{ position: "absolute", inset: -9, borderRadius: "50%", border: `2px dashed ${job.color === "#010101" ? "#F7DF1E" : "#010101"}`, opacity: 0.4 }}
                    />
                    <span style={{ fontSize: "1.2rem" }}>{job.emoji}</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.45 }}
                    style={{
                      marginTop: 8, whiteSpace: "nowrap",
                      fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.6rem",
                      color: "#ffffff", background: "#010101",
                      padding: "3px 10px", borderRadius: 100, textAlign: "center",
                    }}
                  >{job.period}</motion.div>
                </div>

                {/* Right */}
                {!isLeft ? (
                  <motion.div
                    initial={{ opacity: 0, x: 64 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    style={{ paddingLeft: 32 }}
                  >
                    <TLCard job={job} />
                  </motion.div>
                ) : <div />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SKILLS
───────────────────────────────────────── */
const SKILL_GROUPS = [
  { label: "Logistics", icon: <IconTruck size={34} />, skills: ["Domestic Freight", "International Logistics", "Reverse Logistics", "Warehouse Mgmt", "Carrier Coordination"] },
  { label: "EXIM", icon: <IconCustoms size={34} />, skills: ["Import / Export", "Customs Clearance", "Trade Compliance", "BL / LC Processing", "Freight Forwarding"] },
  { label: "Operations", icon: <IconScanner size={34} />, skills: ["Documentation", "Rate Negotiation", "Vendor Management", "ERP / SAP", "Supply Chain Planning"] },
  { label: "Global Freight", icon: <IconShip size={34} />, skills: ["Sea Freight (FCL/LCL)", "Air Cargo (AWB)", "Road Transport", "Multi-modal Logistics", "Port Clearance"] },
];

function Skills() {
  const { ref, inView } = useReveal();
  return (
    <section id="skills" style={{ background: "#ffffff", padding: "100px 40px", borderTop: "1px solid #f0f0f0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <motion.div style={{ width: 32, height: 3, background: "#F7DF1E", borderRadius: 2, transformOrigin: "left" }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5 }} />
            <span style={{ fontFamily: "'Roboto',sans-serif", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#777" }}>Expertise</span>
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#010101", marginBottom: 52, lineHeight: 1.1 }}>
            Skills & <span style={{ background: "linear-gradient(135deg, #D4BC00, #F7DF1E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Competencies</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
          {SKILL_GROUPS.map((g, gi) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: gi * 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 18px 52px rgba(247,223,30,0.2)", borderColor: "#F7DF1E" }}
              style={{
                background: "#ffffff", border: "1.5px solid #ececec",
                borderRadius: 20, padding: "28px 22px", transition: "all 0.3s",
              }}
            >
              <div style={{ marginBottom: 14 }}>{g.icon}</div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#010101", marginBottom: 16 }}>{g.label}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {g.skills.map((skill, si) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: gi * 0.06 + si * 0.06 }}
                    style={{ display: "flex", alignItems: "center", gap: 9 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2.8, delay: si * 0.3 }}
                      style={{ width: 6, height: 6, borderRadius: "50%", background: "#F7DF1E", flexShrink: 0, border: "1px solid #D4BC00" }}
                    />
                    <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.83rem", color: "#444" }}>{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CONTACT
───────────────────────────────────────── */
function Contact() {
  const { ref, inView } = useReveal();
  const contacts = [
    { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#F7DF1E" /><rect x="7" y="12" width="26" height="18" rx="2.5" fill="white" /><path d="M7 12 L20 22 L33 12" stroke="#010101" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>, label: "Email", value: "ajithm0216@gmail.com", sub: "Drop me a message anytime", href: "mailto:ajithm0216@gmail.com" },
    { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#010101" /><path d="M12 10h6l2.5 6.5-3 2a14 14 0 006 6l2-3L32 24v6c-14 2-22-9-20-20Z" fill="#F7DF1E" /></svg>, label: "Phone", value: "+91 9786226148", sub: "Call or WhatsApp", href: "tel:+919786226148" },
    { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#0077B5" /><rect x="8" y="16" width="7" height="18" fill="white" /><circle cx="11.5" cy="10" r="3.5" fill="white" /><path d="M22 16v2.5a7 7 0 017 7v8.5H22V26a2.5 2.5 0 00-5 0v7.5h-7V16h7v3" fill="white" /></svg>, label: "LinkedIn", value: "ajith-kumar-ak216", sub: "Connect professionally", href: "https://www.linkedin.com/in/ajith-kumar-ak216" },
  ];

  return (
    <section id="contact" style={{ background: "#ffffff", padding: "100px 40px", borderTop: "1px solid #f0f0f0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <motion.div style={{ width: 32, height: 3, background: "#F7DF1E", borderRadius: 2, transformOrigin: "left" }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5 }} />
            <span style={{ fontFamily: "'Roboto',sans-serif", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#777" }}>Get In Touch</span>
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#010101", marginBottom: 10, lineHeight: 1.1 }}>
            Let's <span style={{ background: "linear-gradient(135deg, #D4BC00, #F7DF1E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Connect</span>
          </h2>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.95rem", color: "#777", marginBottom: 52, maxWidth: 460, lineHeight: 1.75 }}>
            Looking for a dedicated logistics professional to optimize your supply chain? Let's talk.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginBottom: 40 }}>
          {contacts.map((c, i) => (
            <motion.a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              whileHover={{ y: -8, boxShadow: "0 20px 52px rgba(0,0,0,0.09)", borderColor: "#F7DF1E" }}
              style={{ display: "block", background: "#ffffff", border: "1.5px solid #ececec", borderRadius: 20, padding: "32px 26px", transition: "all 0.3s", cursor: "pointer" }}
            >
              <div style={{ marginBottom: 16 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Roboto',sans-serif", fontWeight: 400, fontSize: "0.67rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#aaa", marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "#010101", wordBreak: "break-all", marginBottom: 4 }}>{c.value}</div>
              <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.76rem", color: "#999" }}>{c.sub}</div>
            </motion.a>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{
            background: "#010101", borderRadius: 24, padding: "40px 48px",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24,
          }}
        >
          <div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#ffffff", marginBottom: 6 }}>
              Ready to streamline your logistics?
            </div>
            <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.45)" }}>
              Let's build an efficient supply chain together.
            </div>
          </div>
          <motion.a href="mailto:ajithm0216@gmail.com"
            whileHover={{ scale: 1.06, boxShadow: "0 10px 32px rgba(247,223,30,0.55)" }} whileTap={{ scale: 0.97 }}
            style={{ display: "inline-block", background: "linear-gradient(135deg, #F7DF1E, #D4BC00)", color: "#010101", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.9rem", padding: "14px 32px", borderRadius: 10, letterSpacing: "0.5px" }}
          >Send Email →</motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "#010101", color: "#ffffff", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: "0.87rem" }}>
        © {new Date().getFullYear()} <span style={{ color: "#F7DF1E" }}>Ajith Kumar</span> · Logistics & EXIM Professional
      </div>
      <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>
        React · Tailwind · Framer Motion
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   APP
───────────────────────────────────────── */
export default function Portfolio() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
