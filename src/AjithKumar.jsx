import { useState, useEffect, useRef } from "react";

/* ─── Google Font via style tag ─── */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

/* ════════════════════════════════════════
   STYLES
════════════════════════════════════════ */
const css = `
*{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased}
:root{
  --bg:#F5F4F0;--white:#ffffff;--black:#0D0C20;
  --yellow:#F5E642;--green:#00C896;--lav:#C8C3FC;
  --blue:#3B6FFF;--coral:#FF6B4A;
  --grad:linear-gradient(135deg,#667EEA,#C08BFF,#FF8C94);
  --r:20px;--font:'Poppins',sans-serif;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--black);overflow-x:hidden}

/* ── NAVBAR ── */
.navbar{
  position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:200;
  background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);
  border:1px solid rgba(0,0,0,0.09);border-radius:100px;
  padding:7px 7px 7px 24px;
  display:flex;align-items:center;gap:2px;
  box-shadow:0 4px 24px rgba(0,0,0,0.07);
  width:min(600px,94vw);
}
.nav-brand{font-size:15px;font-weight:900;color:var(--black);letter-spacing:-.5px;margin-right:auto;white-space:nowrap;flex-shrink:0}
.nav-brand span{color:var(--blue)}
.nav-links{display:flex;align-items:center;gap:2px;flex:1;justify-content:center}
.nav-links a{font-size:13px;font-weight:500;color:rgba(0,0,0,.45);text-decoration:none;padding:7px 14px;border-radius:100px;transition:all .2s;white-space:nowrap}
.nav-links a:hover{color:var(--black);background:rgba(0,0,0,.06)}
.nav-links a.active{color:var(--white);background:var(--black)}
.nav-cta{background:var(--black);color:var(--white);font-family:var(--font);font-size:13px;font-weight:700;padding:10px 20px;border-radius:100px;border:none;cursor:pointer;text-decoration:none;white-space:nowrap;transition:transform .15s,box-shadow .15s;flex-shrink:0}
.nav-cta:hover{transform:scale(1.04);box-shadow:0 4px 14px rgba(0,0,0,.2)}
.ham{display:none;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.07);border:none;cursor:pointer;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex-shrink:0}
.ham span{width:15px;height:1.5px;background:var(--black);border-radius:2px;transition:all .3s;display:block}
.ham.open span:nth-child(1){transform:rotate(45deg) translate(4px,4px)}
.ham.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.ham.open span:nth-child(3){transform:rotate(-45deg) translate(4px,-4px)}
@media(max-width:580px){.nav-links{display:none}.ham{display:flex}.navbar{padding:7px 7px 7px 18px}}
.mob-menu{position:fixed;inset:0;z-index:190;background:var(--white);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2rem;transform:translateY(-100%);transition:transform .4s cubic-bezier(.4,0,.2,1)}
.mob-menu.open{transform:translateY(0)}
.mob-menu a{font-size:clamp(28px,8vw,44px);font-weight:900;color:var(--black);text-decoration:none;letter-spacing:-1.5px;transition:color .2s}
.mob-menu a:hover{color:var(--blue)}

/* ── SHARED ── */
.wrap{max-width:1060px;margin:0 auto;padding:0 clamp(16px,4vw,32px)}
.sec-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(0,0,0,.3);display:inline-flex;align-items:center;gap:8px;margin-bottom:10px}
.sec-lbl::before{content:'';width:18px;height:2px;background:currentColor;border-radius:1px}
.sec-h{font-size:clamp(24px,5vw,42px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;color:var(--black);margin-bottom:6px}
.sec-sub{font-size:clamp(13px,2vw,15px);color:rgba(0,0,0,.4);font-weight:500;margin-bottom:2rem}

/* ── BENTO ── */
.bento{display:grid;gap:12px}
.bc{border-radius:var(--r);padding:clamp(20px,3vw,28px);position:relative;overflow:hidden;transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;cursor:default}
.bc:hover{transform:translateY(-4px) scale(1.01);box-shadow:0 18px 44px rgba(0,0,0,.1)}
.bc-black{background:var(--black);color:var(--white)}
.bc-yellow{background:var(--yellow);color:var(--black)}
.bc-green{background:var(--green);color:var(--black)}
.bc-lav{background:var(--lav);color:var(--black)}
.bc-white{background:var(--white);color:var(--black);border:1.5px solid rgba(0,0,0,.08)}
.bc-coral{background:var(--coral);color:var(--white)}
.bc-grad{background:var(--grad);color:var(--white)}
.bc-soft{background:#EEF3FF;color:var(--black)}
.bc-mint{background:#E6FDF7;color:var(--black)}
.c-ttl{font-size:clamp(14px,2.2vw,18px);font-weight:800;letter-spacing:-.3px;margin-bottom:5px}
.c-sub{font-size:12px;opacity:.6;line-height:1.6}
.tag-pill{display:inline-flex;align-items:center;font-size:11px;font-weight:700;padding:4px 12px;border-radius:100px;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px}
.tp-d{background:rgba(255,255,255,.14);color:rgba(255,255,255,.7)}
.tp-l{background:rgba(0,0,0,.09);color:rgba(0,0,0,.55)}
.stat-n{font-size:clamp(40px,8vw,62px);font-weight:900;letter-spacing:-3px;line-height:1}
.stat-l{font-size:11px;font-weight:600;opacity:.5;text-transform:uppercase;letter-spacing:1px;margin-top:5px}
.sk-ic{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:11px;flex-shrink:0}
.sk-dot{position:absolute;bottom:13px;right:13px;width:8px;height:8px;border-radius:50%}

/* ── HERO ── */
#home{padding:clamp(80px,12vw,100px) clamp(16px,4vw,32px) clamp(36px,5vw,48px)}
.hero-bento{grid-template-columns:repeat(3,1fr)}
@media(max-width:760px){.hero-bento{grid-template-columns:repeat(2,1fr)}}
@media(max-width:460px){.hero-bento{grid-template-columns:1fr}}
.bc-name{grid-column:span 2;min-height:clamp(170px,24vw,210px);display:flex;flex-direction:column;justify-content:flex-end}
@media(max-width:460px){.bc-name{grid-column:span 1;min-height:160px}}
.bc-name h1{font-size:clamp(28px,6vw,52px);font-weight:900;color:var(--white);line-height:1.0;letter-spacing:-2px;margin-bottom:8px}
.bc-name h1 em{color:var(--yellow);font-style:normal}
.bc-name p{font-size:clamp(11.5px,1.5vw,13.5px);color:rgba(255,255,255,.5);line-height:1.65;max-width:400px}
.avail{display:inline-flex;align-items:center;gap:7px;background:rgba(0,200,150,.15);border:1px solid rgba(0,200,150,.28);color:#00A876;font-size:11px;font-weight:700;padding:5px 13px;border-radius:100px;margin-bottom:14px;width:fit-content}
.avail::before{content:'';width:7px;height:7px;border-radius:50%;background:#00C896;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}

/* ── ABOUT ── */
#about{padding:clamp(44px,7vw,64px) clamp(16px,4vw,32px);background:var(--bg)}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:1.8rem}
@media(max-width:560px){.about-grid{grid-template-columns:1fr}}

/* ── TIMELINE ── */
#experience{padding:clamp(44px,7vw,64px) clamp(16px,4vw,32px);background:var(--white)}
.timeline{position:relative;margin-top:3rem}
.tl-line{position:absolute;left:50%;top:0;bottom:0;width:2px;background:rgba(0,0,0,.07);transform:translateX(-50%);border-radius:2px}
@media(max-width:720px){.tl-line{left:22px;transform:none}}
.tl-row{display:grid;grid-template-columns:1fr 56px 1fr;align-items:start;margin-bottom:clamp(28px,5vw,48px);position:relative}
@media(max-width:720px){.tl-row{grid-template-columns:44px 1fr}}
.tl-left{padding-right:clamp(16px,3vw,32px);display:flex;justify-content:flex-end}
.tl-right{padding-left:clamp(16px,3vw,32px)}
.tl-left .tl-card,.tl-right .tl-card{width:100%}
@media(max-width:720px){.tl-left{display:none}.tl-right{padding-left:clamp(14px,3vw,24px);grid-column:2}}
.tl-dot-col{display:flex;flex-direction:column;align-items:center;padding-top:20px;position:relative;z-index:2}
@media(max-width:720px){.tl-dot-col{grid-column:1;padding-top:18px}}
.tl-dot{width:16px;height:16px;border-radius:50%;border:3px solid var(--white);box-shadow:0 0 0 2px currentColor;flex-shrink:0}
.tl-card{background:var(--white);border:1.5px solid rgba(0,0,0,.07);border-radius:var(--r);padding:clamp(18px,3vw,26px);box-shadow:0 2px 12px rgba(0,0,0,.04);transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .28s;position:relative;overflow:hidden}
.tl-card:hover{transform:translateY(-4px);box-shadow:0 14px 36px rgba(0,0,0,.09)}
.tl-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;border-radius:var(--r) var(--r) 0 0}
.tc1::before{background:var(--blue)}.tc2::before{background:var(--green)}.tc3::before{background:#8B7FFF}.tc4::before{background:#F5C400}
.tl-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;padding:3px 10px;border-radius:100px;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px}
.tb-blue{background:#EEF3FF;color:var(--blue)}.tb-green{background:#E6FDF7;color:#00A876}.tb-lav{background:#F0EEFF;color:#7C6EF5}.tb-yellow{background:#FDFBE6;color:#8A7D00}
.tl-company{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:rgba(0,0,0,.3);margin-bottom:3px}
.tl-role{font-size:clamp(14px,2.5vw,17px);font-weight:800;letter-spacing:-.3px;color:var(--black);margin-bottom:10px;line-height:1.2}
.tl-meta{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.mpill{font-size:11px;font-weight:500;padding:3px 10px;border-radius:100px;background:#F5F4F0;color:rgba(0,0,0,.45);border:1px solid rgba(0,0,0,.07);display:inline-flex;align-items:center;gap:4px}
.mp-active{background:#E6FDF7;color:#00A876;border-color:#B3F0E2}
.mp-promo{background:#EEF3FF;color:var(--blue);border-color:#C0D0FF}
.tl-pts{list-style:none;padding:0}
.tl-pts li{font-size:12.5px;color:rgba(0,0,0,.5);line-height:1.75;padding-left:16px;position:relative;margin-bottom:2px}
.tl-pts li::before{content:'→';position:absolute;left:0;font-weight:700;font-size:11px;color:rgba(0,0,0,.22)}
.tl-year{font-size:11px;font-weight:700;color:rgba(0,0,0,.3);margin-top:8px;letter-spacing:.3px;text-align:center;white-space:nowrap}

/* ── SKILLS ── */
#skills{padding:clamp(44px,7vw,64px) clamp(16px,4vw,32px);background:var(--bg)}
.sk-bento{display:grid;gap:12px;grid-template-columns:repeat(3,1fr);margin-top:1.8rem}
@media(max-width:640px){.sk-bento{grid-template-columns:repeat(2,1fr)}}
@media(max-width:360px){.sk-bento{grid-template-columns:1fr}}
.sk-card{border-radius:18px;padding:clamp(16px,3vw,22px);transition:transform .25s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden}
.sk-card:hover{transform:translateY(-4px) scale(1.02)}
.sk-nm{font-size:clamp(12px,1.8vw,13.5px);font-weight:800;line-height:1.3;margin-bottom:3px}
.sk-tg{font-size:10px;font-weight:600;opacity:.5;text-transform:uppercase;letter-spacing:.5px}

/* ── CONTACT ── */
#contact{padding:clamp(44px,7vw,64px) clamp(16px,4vw,32px);background:var(--bg)}
.ct-bento{display:grid;gap:12px;grid-template-columns:repeat(3,1fr);margin-top:1.8rem}
@media(max-width:620px){.ct-bento{grid-template-columns:1fr 1fr}}
@media(max-width:380px){.ct-bento{grid-template-columns:1fr}}
.cc{border-radius:20px;padding:clamp(18px,3vw,24px);text-decoration:none;display:flex;flex-direction:column;transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s}
.cc:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 14px 36px rgba(0,0,0,.1)}
.cc-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;opacity:.4;margin-bottom:5px}
.cc-val{font-size:clamp(12px,2vw,14px);font-weight:700;line-height:1.4;word-break:break-all}
.cc-ico{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}

/* ── FOOTER ── */
footer{background:var(--white);border-top:1px solid rgba(0,0,0,.07);padding:20px clamp(16px,4vw,32px);text-align:center}
footer p{font-size:12px;color:rgba(0,0,0,.25);font-weight:500}

/* ── REVEAL ── */
.sr{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
.sr.in{opacity:1;transform:translateY(0)}
.d1{transition-delay:.07s}.d2{transition-delay:.14s}.d3{transition-delay:.21s}.d4{transition-delay:.28s}

/* ── SCROLL TOP ── */
.scroll-top-btn{position:fixed;bottom:20px;right:20px;z-index:100;width:42px;height:42px;border-radius:12px;background:var(--black);color:var(--yellow);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.15);opacity:0;pointer-events:none;transition:opacity .3s,transform .2s}
.scroll-top-btn.show{opacity:1;pointer-events:auto}
.scroll-top-btn:hover{transform:translateY(-2px)}
`;

/* ════════════════════════════════════════
   SVG ICONS
════════════════════════════════════════ */
const Icon = {
  Box: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    </svg>
  ),
  Doc: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Globe: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
    </svg>
  ),
  Dollar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/>
      <path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  ),
  Monitor: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-1 9H9a2 2 0 01-2-2V9a2 2 0 012-2h11a2 2 0 012 2v8a2 2 0 01-2 2z"/>
    </svg>
  ),
  People: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Lightning: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  Cog: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83"/>
    </svg>
  ),
  Email: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-.6a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  Up: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  Clock: () => (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Home2: () => (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    </svg>
  ),
  Gear: () => (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  Sun: () => (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83"/>
    </svg>
  ),
};

/* ════════════════════════════════════════
   SCROLL REVEAL HOOK
════════════════════════════════════════ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("in"); },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = ["about", "experience", "skills", "contact"];
    const onScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom > 80) { setActive(id); return; }
      }
      setActive("");
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => { setOpen(false); document.body.style.overflow = ""; };
  const toggle = () => {
    setOpen(o => {
      document.body.style.overflow = !o ? "hidden" : "";
      return !o;
    });
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">AK<span>.</span></div>
        <div className="nav-links">
          {["about","experience","skills","contact"].map(id => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>
              {id === "experience" ? "Work" : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
        <a href="#contact" className="nav-cta">Hire Me</a>
        <button className={`ham${open ? " open" : ""}`} onClick={toggle} aria-label="menu">
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`mob-menu${open ? " open" : ""}`}>
        {["About","Work","Skills","Contact"].map((label, i) => (
          <a key={i} href={`#${label === "Work" ? "experience" : label.toLowerCase()}`} onClick={close}>{label}</a>
        ))}
      </div>
    </>
  );
}

/* ════════════════════════════════════════
   HERO
════════════════════════════════════════ */
function Hero() {
  return (
    <section id="home">
      <div className="wrap">
        <div className="bento hero-bento">
          {/* Name */}
          <div className="bc bc-black bc-name sr in">
            <div className="avail">Open to Opportunities</div>
            <h1>Ajith<br/>Kumar<em>.</em></h1>
            <p>Senior Logistics & EXIM Professional · Clearing 45+ shipments/month with zero-compromise compliance across air & sea.</p>
          </div>
          {/* Years */}
          <div className="bc bc-yellow sr in" style={{minHeight:"clamp(170px,24vw,210px)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
            <div style={{position:"absolute",top:20,right:20,fontSize:10,fontWeight:700,opacity:.3,letterSpacing:1,textTransform:"uppercase"}}>Since 2021</div>
            <div className="stat-n">5<sup style={{fontSize:"40%",verticalAlign:"super",letterSpacing:0}}>+</sup></div>
            <div className="stat-l">Years Industry Exp.</div>
          </div>
          {/* Role */}
          <div className="bc bc-white sr in" style={{minHeight:"clamp(130px,17vw,160px)"}}>
            <div className="tag-pill" style={{background:"#EEF3FF",color:"var(--blue)"}}>EXIM Specialist</div>
            <div className="c-ttl">Senior Executive at Ola Electric</div>
            <div className="c-sub">EV supply chain · Import/Export · Air & Sea</div>
            <div style={{position:"absolute",bottom:16,right:16,opacity:.06}}><Icon.Lightning/></div>
          </div>
          {/* Shipments */}
          <div className="bc bc-green sr in" style={{minHeight:"clamp(130px,17vw,160px)"}}>
            <div className="sk-ic" style={{background:"rgba(0,0,0,.1)"}}>
              <span style={{color:"rgba(0,0,0,.6)"}}><Icon.Box/></span>
            </div>
            <div className="stat-n">45<sup style={{fontSize:"40%",verticalAlign:"super",letterSpacing:0}}>+</sup></div>
            <div className="stat-l">Shipments / Month</div>
          </div>
          {/* ICEGATE */}
          <div className="bc bc-lav sr in" style={{minHeight:"clamp(130px,17vw,160px)"}}>
            <div className="tag-pill tp-l">Certified</div>
            <div className="c-ttl">ICEGATE & Customs Filing</div>
            <div className="c-sub">BoE · Shipping Bills · Duty Calculation</div>
          </div>
          {/* Grad */}
          <div className="bc bc-grad sr in" style={{minHeight:"clamp(130px,17vw,160px)"}}>
            <div className="tag-pill tp-d">EV Manufacturing</div>
            <div className="c-ttl">Production-Critical Supply Chain</div>
            <div className="c-sub" style={{color:"rgba(255,255,255,.7)"}}>EPCG · IGCR · Reverse Logistics</div>
            <div style={{position:"absolute",bottom:16,right:16,opacity:.2,color:"white"}}><Icon.Globe/></div>
          </div>
          {/* Compliance */}
          <div className="bc bc-soft sr in" style={{minHeight:"clamp(130px,17vw,160px)"}}>
            <div className="sk-ic" style={{background:"rgba(59,111,255,.12)",color:"var(--blue)"}}><Icon.Shield/></div>
            <div className="c-ttl">Regulatory Compliance</div>
            <div className="c-sub">DGFT · Customs Act · FEMA · SAP/ERP</div>
          </div>
          {/* SAP */}
          <div className="bc bc-black sr in" style={{minHeight:"clamp(130px,17vw,160px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
            <div style={{width:44,height:44,borderRadius:11,transform:"rotate(45deg)",background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
              <div style={{transform:"rotate(-45deg)",color:"white"}}><Icon.Monitor/></div>
            </div>
            <div className="c-ttl" style={{color:"white"}}>SAP / ERP</div>
            <div className="c-sub" style={{color:"rgba(255,255,255,.4)"}}>MIS · PO · Tracking</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   ABOUT
════════════════════════════════════════ */
function About() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();
  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-lbl sr" ref={r1}>About</div>
        <h2 className="sec-h sr" ref={r2}>The professional<br/>behind the shipments.</h2>
        <div className="about-grid">
          <div className="bc bc-black sr d1" ref={r3} style={{gridColumn:"1/-1",padding:"clamp(24px,4vw,36px)"}}>
            <p style={{fontSize:"clamp(13px,2vw,15.5px)",color:"rgba(255,255,255,.72)",lineHeight:1.9,maxWidth:700}}>
              I thrive in fast-paced trade environments — managing{" "}
              <strong style={{color:"var(--yellow)",fontWeight:700}}>end-to-end import & export operations</strong>{" "}
              across air and sea with a compliance-first mindset. Working at Ola Electric in the EV space taught me that a delayed shipment isn't just a logistics problem — it halts an entire production line. I operate with that urgency daily.
            </p>
            <div style={{marginTop:20,display:"flex",flexWrap:"wrap",gap:8}}>
              {[
                {label:"Quick Adapter",bg:"rgba(245,230,66,.15)",color:"var(--yellow)",border:"rgba(245,230,66,.22)"},
                {label:"Detail Oriented",bg:"rgba(0,200,150,.12)",color:"#00C896",border:"rgba(0,200,150,.22)"},
                {label:"Cross-functional",bg:"rgba(59,111,255,.14)",color:"#7FA8FF",border:"rgba(59,111,255,.22)"},
                {label:"Compliance Driven",bg:"rgba(200,195,252,.2)",color:"var(--lav)",border:"rgba(200,195,252,.3)"},
              ].map(t => (
                <span key={t.label} style={{background:t.bg,color:t.color,fontSize:12,fontWeight:600,padding:"5px 13px",borderRadius:100,border:`1px solid ${t.border}`}}>{t.label}</span>
              ))}
            </div>
          </div>
          <div className="bc bc-yellow sr d2" ref={r4} style={{padding:"clamp(20px,3vw,28px)"}}>
            <div className="stat-n">2.5<sup style={{fontSize:"40%",verticalAlign:"super"}}>+</sup></div>
            <div className="stat-l">Years EXIM</div>
            <p style={{fontSize:12.5,color:"rgba(0,0,0,.55)",marginTop:10,lineHeight:1.65}}>Hands-on expertise managing air & sea import/export operations for EV & industrial sectors.</p>
          </div>
          <div className="bc bc-mint sr d3" style={{padding:"clamp(20px,3vw,28px)"}}>
            <div className="sk-ic" style={{background:"rgba(0,168,118,.15)",color:"#00A876"}}><Icon.People/></div>
            <div className="c-ttl">Stakeholder Mgmt.</div>
            <p style={{fontSize:12,color:"rgba(0,0,0,.5)",marginTop:4,lineHeight:1.65}}>CHA, freight forwarders, customs officials, procurement, warehouse & production teams.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   TIMELINE EXPERIENCE
════════════════════════════════════════ */
function TlCard({ colorClass, badgeClass, badgeIcon, badgeText, company, role, meta, points, isMobile }) {
  return (
    <div className={`tl-card ${colorClass}`} style={isMobile ? {} : {}}>
      <div className={`tl-badge ${badgeClass}`}>{badgeIcon}{badgeText}</div>
      <div className="tl-company">{company}</div>
      <div className="tl-role">{role}</div>
      <div className="tl-meta">
        {meta.map((m, i) => <span key={i} className={`mpill ${m.cls || ""}`}>{m.text}</span>)}
      </div>
      <ul className="tl-pts">
        {points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
  );
}

function Experience() {
  const [isMob, setIsMob] = useState(false);
  useEffect(() => {
    const check = () => setIsMob(window.innerWidth <= 720);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const r1=useReveal(),r2=useReveal(),r3=useReveal(),r4=useReveal(),r5=useReveal();

  const jobs = [
    {
      side:"right", colorClass:"tc1", badgeClass:"tb-blue", badgeIcon:<Icon.Clock/>, badgeText:"Current Role",
      company:"Ola Electric Technologies · via Transsafe Global",
      role:"Senior Executive — Logistics & EXIM",
      meta:[{text:"● Active",cls:"mp-active"},{text:"📍 Bangalore"},{text:"Implant / Offroll"}],
      dot:{color:"var(--blue)"},year:"2026\nPresent",
      points:[
        "End-to-end import & export for EV components (air & sea) — from PO to delivery",
        "Customs documentation: BoE, Shipping Bills, BL/AWB, COO, Commercial Invoices, Packing Lists",
        "HSN classification, duty calc (BCD, SWS, IGST) & ICEGATE clearance management",
        "EPCG & IGCR import compliance — documentation, coordination, record maintenance",
        "International reverse logistics — re-imports, returns, repair shipment movements",
        "Domestic reverse logistics — rejected/excess material coordination with transporters",
        "SAP for PO reference, EXIM tracking; MIS reporting; DGFT / Customs Act / FEMA compliance",
      ],
    },
    {
      side:"left", colorClass:"tc2", badgeClass:"tb-green", badgeIcon:<Icon.Home2/>, badgeText:"Same Company · Onroll",
      company:"Ola Electric Technologies Pvt Ltd",
      role:"Associate — Logistics & EXIM",
      meta:[{text:"Oct 2025 – Feb 2026"},{text:"📍 Bangalore"},{text:"↑ Promoted to Senior",cls:"mp-promo"}],
      dot:{color:"var(--green)"},year:"Oct 2025\nFeb 2026",
      points:[
        "Onroll associate driving EXIM operations within Ola Electric's EV supply chain",
        "Managed import documentation, CHA coordination and clearance tracking",
        "Consistent performance over 4 months led to promotion as Senior Executive (implant)",
      ],
    },
    {
      side:"right", colorClass:"tc3", badgeClass:"tb-lav", badgeIcon:<Icon.Gear/>, badgeText:"Operations",
      company:"Sree Exim Solution",
      role:"Operation Executive",
      meta:[{text:"Oct 2023 – Sep 2025"},{text:"📍 Bangalore"}],
      dot:{color:"#8B7FFF"},year:"Oct 2023\nSep 2025",
      points:[
        "Managed 35–45 shipments/month across air & sea at Bengaluru Air Cargo & ICD",
        "Bills of Entry, Shipping Bills, clearance documentation via ICEGATE — end to end",
        "HSN classification, duty calculation (BCD, SWS, IGST), customs compliance checks",
        "Re-imports, amendments & special clearance / reverse logistics documentation",
        "Maintained high-accuracy shipment trackers, clearance MIS and documentation records",
      ],
    },
    {
      side:"left", colorClass:"tc4", badgeClass:"tb-yellow", badgeIcon:<Icon.Sun/>, badgeText:"Manufacturing",
      company:"Passon Industry",
      role:"CNC Machinist",
      meta:[{text:"Sep 2021 – Jul 2023"},{text:"📍 Krishnagiri"}],
      dot:{color:"#F5C400"},year:"Sep 2021\nJul 2023",
      points:[
        "Precision CNC machining — zero-defect execution in a production environment",
        "Gained deep understanding of industrial supply chains and production workflows",
        "This manufacturing foundation directly supports manufacturing EXIM expertise today",
      ],
    },
  ];

  const refs = [r1,r2,r3,r4];

  return (
    <section id="experience">
      <div className="wrap">
        <div className="sec-lbl sr" ref={r5}>Career</div>
        <h2 className="sec-h sr">Work Experience</h2>
        <p className="sec-sub sr">A progressive journey — from precision manufacturing to leading EXIM operations at India's top EV brand.</p>
        <div className="timeline">
          <div className="tl-line"/>
          {jobs.map((job, i) => (
            <div key={i} className={`tl-row sr${i>0?` d${i}`:""}`} ref={refs[i]} style={i===jobs.length-1?{marginBottom:0}:{}}>
              {/* LEFT SLOT */}
              <div className="tl-left">
                {!isMob && job.side === "left" && (
                  <TlCard {...job} />
                )}
              </div>
              {/* DOT */}
              <div className="tl-dot-col">
                <div className="tl-dot" style={{color:job.dot.color}}/>
                <div className="tl-year" style={{whiteSpace:"pre-line"}}>{job.year}</div>
              </div>
              {/* RIGHT SLOT */}
              <div className="tl-right">
                {(job.side === "right" || isMob) && (
                  <TlCard {...job} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   SKILLS
════════════════════════════════════════ */
function Skills() {
  const r = useReveal();
  const skills = [
    { bg:"bc-black", ic:{bg:"rgba(245,230,66,.15)",color:"#F5E642"}, icon:<Icon.Box/>, name:"Import & Export Ops", tag:"Air & Sea · E2E", dotStyle:{background:"rgba(255,255,255,.2)"}, nameStyle:{color:"white"}, tagStyle:{color:"rgba(255,255,255,.3)"} },
    { bg:"bc-lav", ic:{bg:"rgba(0,0,0,.1)",color:"#5046B8"}, icon:<Icon.Doc/>, name:"Customs Documentation", tag:"BoE · Shipping Bills", dotStyle:{background:"rgba(0,0,0,.2)"} },
    { bg:"bc-green", ic:{bg:"rgba(0,0,0,.1)",color:"rgba(0,0,0,.6)"}, icon:<Icon.Shield/>, name:"ICEGATE Filing", tag:"Clearance · Procedures", dotStyle:{background:"rgba(0,0,0,.2)"} },
    { bg:"bc-yellow", ic:{bg:"rgba(0,0,0,.1)",color:"rgba(0,0,0,.6)"}, icon:<Icon.Dollar/>, name:"HSN & Duty Calc.", tag:"BCD · SWS · IGST", dotStyle:{background:"rgba(0,0,0,.15)"} },
    { bg:"bc-soft", ic:{bg:"rgba(59,111,255,.12)",color:"var(--blue)"}, icon:<Icon.Globe/>, name:"DGFT & Regulations", tag:"FEMA · Customs Act", dotStyle:{background:"rgba(59,111,255,.2)"} },
    { bg:"bc-coral", ic:{bg:"rgba(255,255,255,.2)",color:"white"}, icon:<Icon.Refresh/>, name:"EPCG & IGCR", tag:"Compliance Support", nameStyle:{color:"white"}, tagStyle:{color:"rgba(255,255,255,.55)"} },
    { bg:"bc-white", ic:{bg:"#EEF3FF",color:"var(--blue)"}, icon:<Icon.Chat/>, name:"Reverse Logistics", tag:"Intl & Domestic", dotStyle:{background:"rgba(59,111,255,.2)"} },
    { bg:"bc-mint", ic:{bg:"rgba(0,168,118,.12)",color:"#00A876"}, icon:<Icon.Monitor/>, name:"SAP / ERP & Excel", tag:"MIS · Tracking", dotStyle:{background:"rgba(0,168,118,.25)"} },
    { bg:"bc-grad", ic:{bg:"rgba(255,255,255,.2)",color:"white"}, icon:<Icon.People/>, name:"CHA & Forwarder Coord.", tag:"Multi-stakeholder", nameStyle:{color:"white"}, tagStyle:{color:"rgba(255,255,255,.6)"} },
  ];
  return (
    <section id="skills">
      <div className="wrap">
        <div className="sec-lbl sr" ref={r}>Expertise</div>
        <h2 className="sec-h sr">Skills & Capabilities</h2>
        <div className="sk-bento">
          {skills.map((s, i) => (
            <div key={i} className={`sk-card ${s.bg} sr`} style={{}}>
              <div className="sk-ic" style={{background:s.ic.bg,color:s.ic.color}}>{s.icon}</div>
              <div className="sk-nm" style={s.nameStyle||{}}>{s.name}</div>
              <div className="sk-tg" style={s.tagStyle||{}}>{s.tag}</div>
              {s.dotStyle && <div className="sk-dot" style={s.dotStyle}/>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   CONTACT
════════════════════════════════════════ */
function Contact() {
  const r = useReveal();
  return (
    <section id="contact">
      <div className="wrap">
        <div className="sec-lbl sr" ref={r}>Let's Talk</div>
        <h2 className="sec-h sr">Ready to collaborate?</h2>
        <p className="sec-sub sr">Open to EXIM, Logistics & Supply Chain roles across India · Available immediately · Open to relocation.</p>
        <div className="ct-bento">
          <a className="cc bc-black sr" href="mailto:ajithm0216@gmail.com">
            <div className="cc-ico" style={{background:"rgba(59,111,255,.2)",color:"#7FA8FF"}}><Icon.Email/></div>
            <div className="cc-lbl" style={{color:"rgba(255,255,255,.3)"}}>Email</div>
            <div className="cc-val" style={{color:"white"}}>ajithm0216@gmail.com</div>
          </a>
          <a className="cc bc-yellow sr d1" href="tel:+919786226148">
            <div className="cc-ico" style={{background:"rgba(0,0,0,.1)",color:"rgba(0,0,0,.55)"}}><Icon.Phone/></div>
            <div className="cc-lbl">Phone</div>
            <div className="cc-val">+91 97862 26148</div>
          </a>
          <a className="cc bc-lav sr d2" href="https://www.linkedin.com/in/ajith-kumar-ak216" target="_blank" rel="noreferrer">
            <div className="cc-ico" style={{background:"rgba(0,0,0,.1)",color:"#4838C8"}}><Icon.LinkedIn/></div>
            <div className="cc-lbl" style={{opacity:.45}}>LinkedIn</div>
            <div className="cc-val">ajith-kumar-ak216</div>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   SCROLL TOP
════════════════════════════════════════ */
function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 350);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <button className={`scroll-top-btn${show?" show":""}`} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
      <Icon.Up/>
    </button>
  );
}

/* ════════════════════════════════════════
   REVEAL ON MOUNT — inject IntersectionObserver
════════════════════════════════════════ */
function RevealOnMount() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.07 }
    );
    document.querySelectorAll(".sr").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}

/* ════════════════════════════════════════
   ROOT APP
════════════════════════════════════════ */
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      <RevealOnMount/>
      <Navbar/>
      <Hero/>
      <About/>
      <Experience/>
      <Skills/>
      <Contact/>
      <footer>
        <p>© 2025 Ajith Kumar M · Logistics & EXIM Professional · Bangalore, India</p>
      </footer>
      <ScrollTop/>
    </>
  );
}
