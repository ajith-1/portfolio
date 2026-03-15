import { useState, useEffect, useRef } from "react";

/* ── Google Font ── */
if (!document.querySelector('link[href*="Poppins"]')) {
  const l = document.createElement("link");
  l.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap";
  l.rel = "stylesheet";
  document.head.appendChild(l);
}

/* ════════════════════════════════════════
   GLOBAL CSS
════════════════════════════════════════ */
const CSS = `
*{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased}
:root{
  --bg:#F5F4F0;--white:#fff;--black:#0D0C20;
  --yellow:#F5E642;--green:#00C896;--lav:#C8C3FC;
  --blue:#3B6FFF;--dark:#1A1930;
  --grad:linear-gradient(135deg,#667EEA 0%,#C08BFF 55%,#FF8C94 100%);
  --font:'Poppins',sans-serif;--r:20px;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--black);overflow-x:hidden}

/* ── NAVBAR ── */
.navbar{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:200;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border:1px solid rgba(0,0,0,0.08);border-radius:100px;padding:7px 7px 7px 22px;display:flex;align-items:center;gap:2px;box-shadow:0 4px 20px rgba(0,0,0,0.06);width:min(580px,94vw)}
.nav-brand{font-size:15px;font-weight:900;color:var(--black);letter-spacing:-.5px;margin-right:auto;flex-shrink:0}
.nav-brand span{color:var(--blue)}
.nav-links{display:flex;align-items:center;gap:2px;flex:1;justify-content:center}
.nav-links a{font-size:13px;font-weight:500;color:rgba(0,0,0,.4);text-decoration:none;padding:7px 13px;border-radius:100px;transition:all .2s;white-space:nowrap}
.nav-links a:hover{color:var(--black);background:rgba(0,0,0,.05)}
.nav-links a.act{color:var(--white);background:var(--black)}
.nav-cta{background:var(--black);color:var(--white);font-family:var(--font);font-size:13px;font-weight:700;padding:9px 20px;border-radius:100px;border:none;cursor:pointer;text-decoration:none;white-space:nowrap;transition:transform .15s;flex-shrink:0}
.nav-cta:hover{transform:scale(1.04)}
.ham{display:none;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.06);border:none;cursor:pointer;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex-shrink:0}
.ham span{width:15px;height:1.5px;background:var(--black);border-radius:2px;transition:all .3s;display:block}
.ham.open span:nth-child(1){transform:rotate(45deg) translate(4px,4px)}
.ham.open span:nth-child(2){opacity:0}
.ham.open span:nth-child(3){transform:rotate(-45deg) translate(4px,-4px)}
@media(max-width:560px){.nav-links{display:none}.ham{display:flex}.navbar{padding:7px 7px 7px 16px}}
.mob-menu{position:fixed;inset:0;z-index:190;background:var(--white);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2rem;transform:translateY(-100%);transition:transform .4s cubic-bezier(.4,0,.2,1)}
.mob-menu.open{transform:translateY(0)}
.mob-menu a{font-size:clamp(28px,8vw,42px);font-weight:900;color:var(--black);text-decoration:none;letter-spacing:-1.5px}
.mob-menu a:hover{color:var(--blue)}

/* ── SHARED ── */
.wrap{max-width:1020px;margin:0 auto;padding:0 clamp(16px,4vw,32px)}
.sec-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(0,0,0,.28);display:inline-flex;align-items:center;gap:7px;margin-bottom:8px}
.sec-lbl::before{content:'';width:16px;height:2px;background:currentColor;border-radius:1px}
.sec-h{font-size:clamp(22px,4.5vw,38px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;color:var(--black);margin-bottom:5px}
.sec-sub{font-size:clamp(12.5px,1.8vw,14px);color:rgba(0,0,0,.38);font-weight:500;margin-bottom:1.8rem;line-height:1.6}

/* ── BENTO ── */
.bento{display:grid;gap:11px}
.bc{border-radius:var(--r);padding:clamp(18px,3vw,26px);position:relative;overflow:hidden;transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .28s;cursor:default}
.bc:hover{transform:translateY(-4px) scale(1.01);box-shadow:0 16px 40px rgba(0,0,0,.12)}
.bc-black{background:var(--black);color:var(--white)}
.bc-yellow{background:var(--yellow);color:var(--black)}
.bc-green{background:var(--green);color:var(--black)}
.bc-lav{background:var(--lav);color:var(--black)}
.bc-dark{background:var(--dark);color:var(--white)}
.bc-grad{background:var(--grad);color:var(--white)}
.bc-white{background:var(--white);color:var(--black);border:1px solid rgba(0,0,0,.07)}
.bc-off{background:var(--bg);color:var(--black);border:1px solid rgba(0,0,0,.06)}
.c-ttl{font-size:clamp(13px,2vw,16px);font-weight:800;letter-spacing:-.3px;margin-bottom:4px;line-height:1.25}
.c-sub{font-size:11.5px;line-height:1.6}
.tag-pill{display:inline-flex;align-items:center;font-size:10px;font-weight:700;padding:3px 10px;border-radius:100px;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px}
.tp-dk{background:rgba(255,255,255,.13);color:rgba(255,255,255,.65)}
.stat-n{font-size:clamp(38px,7vw,56px);font-weight:900;letter-spacing:-3px;line-height:1}
.stat-l{font-size:10px;font-weight:600;opacity:.45;text-transform:uppercase;letter-spacing:1px;margin-top:4px}
.sk-ic{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px}

/* ── HERO ── */
#home{padding:clamp(88px,14vw,108px) clamp(16px,4vw,32px) clamp(32px,5vw,48px);background:var(--bg)}
.hero-inner{max-width:1020px;margin:0 auto}
.hero-top{display:grid;grid-template-columns:1fr auto;gap:clamp(14px,3vw,28px);align-items:end;margin-bottom:clamp(18px,3vw,24px)}
@media(max-width:640px){.hero-top{grid-template-columns:1fr}}
.hero-eyebrow{display:inline-flex;align-items:center;gap:7px;background:rgba(0,200,150,.1);border:1px solid rgba(0,200,150,.2);color:#00A876;font-size:11px;font-weight:700;padding:4px 12px;border-radius:100px;margin-bottom:14px}
.hero-eyebrow::before{content:'';width:7px;height:7px;border-radius:50%;background:#00C896;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
.hero-name{font-size:clamp(44px,9vw,84px);font-weight:900;letter-spacing:-3px;line-height:.95;color:var(--black)}
.hero-name em{color:var(--blue);font-style:normal}
.hero-stats{display:flex;flex-direction:column;gap:8px;padding-bottom:4px}
@media(max-width:640px){.hero-stats{flex-direction:row;flex-wrap:wrap}}
.h-stat{background:var(--white);border:1px solid rgba(0,0,0,.08);border-radius:14px;padding:12px 18px;text-align:right;min-width:118px;transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
.h-stat:hover{transform:translateY(-3px)}
@media(max-width:640px){.h-stat{text-align:left;min-width:unset;flex:1}}
.h-stat-n{font-size:clamp(22px,4vw,28px);font-weight:900;letter-spacing:-1px;line-height:1;color:var(--black)}
.h-stat-n span{color:var(--blue)}
.h-stat-l{font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:rgba(0,0,0,.32);margin-top:2px}
.hero-bottom{display:grid;grid-template-columns:auto 1fr;gap:clamp(14px,3vw,24px);align-items:start;padding-top:clamp(14px,2.5vw,20px);border-top:1px solid rgba(0,0,0,.08)}
@media(max-width:580px){.hero-bottom{grid-template-columns:1fr}}
.hero-role-card{background:var(--black);color:var(--white);border-radius:14px;padding:16px 20px;white-space:nowrap}
@media(max-width:580px){.hero-role-card{white-space:normal}}
.hrc-co{font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.3);margin-bottom:5px}
.hrc-title{font-size:clamp(12px,1.8vw,14px);font-weight:700;color:var(--white);line-height:1.35}
.hrc-sub{font-size:11px;color:rgba(255,255,255,.35);margin-top:4px}
.hero-desc{font-size:clamp(13px,1.8vw,14.5px);color:rgba(0,0,0,.48);line-height:1.85;padding-top:4px}
.hero-desc strong{color:var(--black);font-weight:600}
.hero-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.chip{font-size:11.5px;font-weight:600;padding:5px 13px;border-radius:100px;background:var(--white);color:rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.08);transition:all .2s}
.chip:hover{background:var(--black);color:var(--white);border-color:var(--black)}
.chip-g{background:#E6FDF7;color:#00A876;border-color:rgba(0,200,150,.18)}
.chip-b{background:#EEF3FF;color:var(--blue);border-color:rgba(59,111,255,.15)}

/* ── ABOUT ── */
#about{padding:clamp(44px,7vw,60px) clamp(16px,4vw,32px);background:var(--white)}
.about-bento{grid-template-columns:2fr 1fr 1fr;margin-top:1.6rem}
@media(max-width:720px){.about-bento{grid-template-columns:1fr 1fr}}
@media(max-width:460px){.about-bento{grid-template-columns:1fr}}
.ab-tall{grid-row:span 2}
@media(max-width:720px){.ab-tall{grid-row:span 1}}

/* ── EXPERIENCE ── */
#experience{padding:clamp(44px,7vw,60px) clamp(16px,4vw,32px);background:var(--bg)}
.timeline{position:relative;margin-top:2rem}
.tl-track{position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(0,0,0,.1);transform:translateX(-50%)}
@media(max-width:680px){.tl-track{left:16px;transform:none}}
.tl-row{display:grid;grid-template-columns:1fr 40px 1fr;margin-bottom:clamp(16px,3vw,24px);position:relative;align-items:start}
@media(max-width:680px){.tl-row{grid-template-columns:36px 1fr}}
.tl-l{padding-right:clamp(12px,2.5vw,24px);display:flex;justify-content:flex-end}
.tl-r{padding-left:clamp(12px,2.5vw,24px)}
@media(max-width:680px){.tl-l{display:none}.tl-r{padding-left:12px;grid-column:2}}
.tl-mid{display:flex;flex-direction:column;align-items:center;padding-top:14px;z-index:2}
@media(max-width:680px){.tl-mid{grid-column:1;padding-top:12px}}
.tl-dot{width:11px;height:11px;border-radius:50%;border:2px solid var(--bg);box-shadow:0 0 0 1.5px currentColor;flex-shrink:0}
.tl-yr{font-size:9.5px;font-weight:600;color:rgba(0,0,0,.26);margin-top:5px;text-align:center;line-height:1.4;white-space:pre-line}

/* neutral white timeline card — no color */
.tl-card{background:var(--white);border:1px solid rgba(0,0,0,.07);border-radius:var(--r);padding:clamp(14px,2.5vw,20px);box-shadow:0 1px 5px rgba(0,0,0,.04);transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .28s;width:100%}
.tl-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.08)}
.tl-co{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:rgba(0,0,0,.27);margin-bottom:3px}
.tl-role{font-size:clamp(13px,2vw,15px);font-weight:800;letter-spacing:-.3px;color:var(--black);margin-bottom:7px;line-height:1.2}
.tl-meta{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:9px}
.mpill{font-size:10px;font-weight:500;padding:3px 9px;border-radius:100px;background:var(--bg);color:rgba(0,0,0,.4);border:1px solid rgba(0,0,0,.07);display:inline-flex;align-items:center;gap:3px}
.mp-on{background:#E6FDF7;color:#00A876;border-color:#B3F0E2}
.mp-pr{background:#EEF3FF;color:var(--blue);border-color:#C0D0FF}
.tl-pts{list-style:none;padding:0}
.tl-pts li{font-size:11.5px;color:rgba(0,0,0,.45);line-height:1.7;padding-left:13px;position:relative;margin-bottom:2px}
.tl-pts li::before{content:'·';position:absolute;left:0;font-size:14px;font-weight:900;color:rgba(0,0,0,.2);line-height:1.5}

/* ── SKILLS ── */
#skills{padding:clamp(44px,7vw,60px) clamp(16px,4vw,32px);background:var(--white)}
.sk-bento{grid-template-columns:repeat(3,1fr);margin-top:1.6rem}
@media(max-width:600px){.sk-bento{grid-template-columns:repeat(2,1fr)}}
@media(max-width:340px){.sk-bento{grid-template-columns:1fr}}
.sk-wide{grid-column:span 3}
@media(max-width:600px){.sk-wide{grid-column:span 2}}
@media(max-width:340px){.sk-wide{grid-column:span 1}}
.sk-nm{font-size:clamp(12px,1.6vw,13px);font-weight:700;line-height:1.3;margin-bottom:2px}
.sk-tg{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.4px;opacity:.5}

/* ── CONTACT ── */
#contact{padding:clamp(44px,7vw,60px) clamp(16px,4vw,32px);background:var(--bg)}
.ct-bento{grid-template-columns:repeat(3,1fr);margin-top:1.6rem}
@media(max-width:580px){.ct-bento{grid-template-columns:1fr 1fr}}
@media(max-width:340px){.ct-bento{grid-template-columns:1fr}}
.cc-card{text-decoration:none;display:flex;flex-direction:column}
.cc-ic{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
.cc-lbl{font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:3px}
.cc-val{font-size:clamp(11.5px,1.8vw,13px);font-weight:700;line-height:1.4;word-break:break-all}

footer{background:var(--white);border-top:1px solid rgba(0,0,0,.06);padding:18px clamp(16px,4vw,32px);text-align:center}
footer p{font-size:11.5px;color:rgba(0,0,0,.22);font-weight:500}

.sr{opacity:0;transform:translateY(20px);transition:opacity .55s ease,transform .55s ease}
.sr.in{opacity:1;transform:translateY(0)}
.d1{transition-delay:.07s}.d2{transition-delay:.14s}.d3{transition-delay:.21s}.d4{transition-delay:.28s}

.scroll-top{position:fixed;bottom:20px;right:20px;z-index:100;width:40px;height:40px;border-radius:12px;background:var(--black);color:var(--white);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s,transform .2s;box-shadow:0 4px 12px rgba(0,0,0,.15)}
.scroll-top.show{opacity:1;pointer-events:auto}
.scroll-top:hover{transform:translateY(-2px)}
`;

/* ════════════════════════════
   SCROLL REVEAL HOOK
════════════════════════════ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("in"); },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ════════════════════════════
   ICONS
════════════════════════════ */
const Icon = {
  Shield:  ({ c = "currentColor", s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  People:  ({ c = "currentColor", s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>,
  Doc:     ({ c = "currentColor", s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Globe:   ({ c = "currentColor", s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
  Dollar:  ({ c = "currentColor", s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Refresh: ({ c = "currentColor", s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  Monitor: ({ c = "currentColor", s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  Chat:    ({ c = "currentColor", s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-1 9H9a2 2 0 01-2-2V9a2 2 0 012-2h11a2 2 0 012 2v8a2 2 0 01-2 2z"/></svg>,
  Email:   ({ c = "currentColor", s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Phone:   ({ c = "currentColor", s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-.6a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  LinkedIn:({ c = "currentColor", s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  Up:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>,
};

/* ════════════════════════════
   NAVBAR
════════════════════════════ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const ids = ["about", "experience", "skills", "contact"];
    const fn = () => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= 80 && r.bottom > 80) { setActive(id); return; }
      }
      setActive("");
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const close = () => { setOpen(false); document.body.style.overflow = ""; };
  const toggle = () => { setOpen(o => { document.body.style.overflow = !o ? "hidden" : ""; return !o; }); };

  const links = [
    { id: "about", label: "About" },
    { id: "experience", label: "Work" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">AK<span>.</span></div>
        <div className="nav-links">
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? "act" : ""}>{l.label}</a>
          ))}
        </div>
        <a href="#contact" className="nav-cta">Hire Me</a>
        <button className={`ham${open ? " open" : ""}`} onClick={toggle} aria-label="menu">
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`mob-menu${open ? " open" : ""}`}>
        {links.map(l => (
          <a key={l.id} href={`#${l.id}`} onClick={close}>{l.label}</a>
        ))}
      </div>
    </>
  );
}

/* ════════════════════════════
   HERO
════════════════════════════ */
function Hero() {
  return (
    <section id="home">
      <div className="hero-inner">
        <div className="hero-top sr in">
          <div>
            <div className="hero-eyebrow">Open to Opportunities</div>
            <div className="hero-name">Ajith<br />Kumar<em>.</em></div>
          </div>
          <div className="hero-stats">
            {[["5","Years Experience"],["45","Shipments / Month"],["2.5","Years in EXIM"]].map(([n, l]) => (
              <div className="h-stat" key={l}>
                <div className="h-stat-n">{n}<span>+</span></div>
                <div className="h-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-bottom sr in d1">
          <div className="hero-role-card">
            <div className="hrc-co">Current · Ola Electric</div>
            <div className="hrc-title">Senior Executive<br />Logistics & EXIM</div>
            <div className="hrc-sub">Bangalore · Feb 2026 – Present</div>
          </div>
          <div>
            <p className="hero-desc">
              Logistics & EXIM professional with <strong>5+ years of industrial experience</strong> and deep command of import/export operations. Managing <strong>production-critical EV supply chains</strong> at Ola Electric — every shipment cleared on time, in full compliance.
            </p>
            <div className="hero-chips">
              <span className="chip chip-g">● Available Now</span>
              <span className="chip chip-b">ICEGATE Certified</span>
              <span className="chip">DGFT · FEMA · Customs Act</span>
              <span className="chip">SAP / ERP</span>
              <span className="chip">Air & Sea Freight</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════
   ABOUT
════════════════════════════ */
function About() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal();
  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-lbl sr" ref={r1}>About</div>
        <h2 className="sec-h sr" ref={r2}>The person behind<br />the clearances.</h2>
        <div className="bento about-bento">

          <div className="bc bc-black ab-tall sr d1" ref={r3}
            style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end", minHeight:"clamp(200px,28vw,280px)" }}>
            <div style={{ position:"absolute", top:22, right:22, fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"rgba(255,255,255,.18)" }}>Since 2021</div>
            <p style={{ fontSize:"clamp(13px,1.8vw,15px)", color:"rgba(255,255,255,.68)", lineHeight:1.85, marginBottom:18 }}>
              I work at the intersection of{" "}
              <strong style={{ color:"var(--yellow)", fontWeight:700 }}>trade compliance and operational speed</strong>
              {" "}— managing end-to-end shipments with a mindset shaped by both the factory floor and the customs desk.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {["Quick Adapter","Detail Oriented","Compliance Driven"].map(t => (
                <span key={t} style={{ background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.6)", fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:100, border:"1px solid rgba(255,255,255,.1)" }}>{t}</span>
              ))}
            </div>
          </div>

          <div className="bc bc-yellow sr d1" style={{ minHeight:"clamp(130px,17vw,150px)", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
            <div className="stat-n">2.5<sup style={{ fontSize:"40%", verticalAlign:"super" }}>+</sup></div>
            <div className="stat-l">Years EXIM</div>
          </div>

          <div className="bc bc-green sr d2" style={{ minHeight:"clamp(130px,17vw,150px)" }}>
            <div className="sk-ic" style={{ background:"rgba(0,0,0,.1)" }}><Icon.Shield c="rgba(0,0,0,.6)" /></div>
            <div className="c-ttl">Compliance First</div>
            <div className="c-sub" style={{ opacity:.55 }}>DGFT · Customs Act · FEMA</div>
          </div>

          <div className="bc bc-lav sr d3" style={{ minHeight:"clamp(130px,17vw,150px)" }}>
            <div className="sk-ic" style={{ background:"rgba(0,0,0,.08)" }}><Icon.People c="rgba(0,0,0,.5)" /></div>
            <div className="c-ttl">Stakeholder Mgmt.</div>
            <div className="c-sub" style={{ opacity:.55 }}>CHA · Forwarders · Customs</div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════
   EXPERIENCE TIMELINE
════════════════════════════ */
function TlCard({ company, role, meta, points }) {
  return (
    <div className="tl-card">
      <div className="tl-co">{company}</div>
      <div className="tl-role">{role}</div>
      <div className="tl-meta">
        {meta.map((m, i) => (
          <span key={i} className={`mpill${m.cls ? " " + m.cls : ""}`}>{m.text}</span>
        ))}
      </div>
      <ul className="tl-pts">
        {points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
  );
}

const JOBS = [
  {
    side: "right", dotColor: "var(--blue)", year: "Feb 2026\nPresent",
    company: "Ola Electric · via Transsafe Global",
    role: "Senior Executive — Logistics & EXIM",
    meta: [{ text:"● Current", cls:"mp-on" }, { text:"Bangalore" }, { text:"Offroll / Implant" }],
    points: [
      "End-to-end import & export for EV components — air & sea modes",
      "Customs docs: BoE, Shipping Bills, BL/AWB, COO, Invoices, Packing Lists",
      "HSN classification, duty calc (BCD, SWS, IGST) & ICEGATE clearance",
      "EPCG & IGCR compliance — documentation, coordination, record keeping",
      "International & domestic reverse logistics management",
      "SAP coordination, MIS reporting, DGFT / Customs Act / FEMA compliance",
    ],
  },
  {
    side: "left", dotColor: "rgba(0,0,0,.25)", year: "Oct 2025\nFeb 2026",
    company: "Ola Electric Technologies Pvt Ltd",
    role: "Associate — Logistics & EXIM",
    meta: [{ text:"Oct 2025 – Feb 2026" }, { text:"Bangalore" }, { text:"↑ Promoted", cls:"mp-pr" }],
    points: [
      "Onroll associate managing EXIM operations within Ola Electric",
      "Import documentation, CHA coordination and clearance tracking",
      "Promoted to Senior Executive within 4 months",
    ],
    mobPoints: ["Onroll EXIM associate at Ola Electric — promoted within 4 months"],
  },
  {
    side: "right", dotColor: "rgba(0,0,0,.2)", year: "Oct 2023\nSep 2025",
    company: "Sree Exim Solution",
    role: "Operation Executive",
    meta: [{ text:"Oct 2023 – Sep 2025" }, { text:"Bangalore" }],
    points: [
      "35–45 shipments/month at Bengaluru Air Cargo & ICD — air & sea",
      "Bills of Entry, Shipping Bills, clearance docs via ICEGATE",
      "HSN classification, duty calculation, customs compliance checks",
      "Re-imports, amendments and reverse logistics documentation",
      "High-accuracy shipment trackers, MIS and documentation records",
    ],
  },
  {
    side: "left", dotColor: "rgba(0,0,0,.15)", year: "Sep 2021\nJul 2023",
    company: "Passon Industry",
    role: "CNC Machinist",
    meta: [{ text:"Sep 2021 – Jul 2023" }, { text:"Krishnagiri" }],
    points: [
      "Precision CNC machining — zero-defect execution in production",
      "Industrial supply chain foundation that underpins EXIM expertise today",
    ],
    mobPoints: ["Precision manufacturing foundation for today's EXIM expertise"],
  },
];

function Experience() {
  const [isMob, setIsMob] = useState(false);
  const refs = [useReveal(), useReveal(), useReveal(), useReveal()];
  const hRef = useReveal();

  useEffect(() => {
    const check = () => setIsMob(window.innerWidth <= 680);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="experience">
      <div className="wrap">
        <div className="sec-lbl sr" ref={hRef}>Career</div>
        <h2 className="sec-h sr">Work Experience</h2>
        <p className="sec-sub sr">From the factory floor to EV supply chains — consistent growth and ownership.</p>
        <div className="timeline">
          <div className="tl-track" />
          {JOBS.map((job, i) => (
            <div key={i} className={`tl-row sr${i > 0 ? ` d${i}` : ""}`}
              ref={refs[i]}
              style={i === JOBS.length - 1 ? { marginBottom: 0 } : {}}>

              <div className="tl-l">
                {!isMob && job.side === "left" && <TlCard {...job} />}
              </div>

              <div className="tl-mid">
                <div className="tl-dot" style={{ color: job.dotColor }} />
                <div className="tl-yr">{job.year}</div>
              </div>

              <div className="tl-r">
                {job.side === "right" && <TlCard {...job} />}
                {isMob && job.side === "left" && (
                  <TlCard {...job} points={job.mobPoints || job.points} />
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════
   SKILLS
════════════════════════════ */
const SKILLS = [
  { bc:"bc-yellow", icBg:"rgba(0,0,0,.08)", icon:<Icon.Doc c="rgba(0,0,0,.55)"/>,            name:"Customs Documentation", tag:"BoE · Shipping Bills · AWB" },
  { bc:"bc-green",  icBg:"rgba(0,0,0,.08)", icon:<Icon.Shield c="rgba(0,0,0,.55)"/>,          name:"ICEGATE Filing",        tag:"Clearance · Procedures" },
  { bc:"bc-lav",    icBg:"rgba(0,0,0,.08)", icon:<Icon.Dollar c="rgba(0,0,0,.55)"/>,          name:"HSN & Duty Calc.",      tag:"BCD · SWS · IGST" },
  { bc:"bc-white",  icBg:"rgba(0,0,0,.05)", icon:<Icon.Globe c="rgba(0,0,0,.5)"/>,            name:"DGFT & Regulations",    tag:"FEMA · Customs Act" },
  { bc:"bc-black",  icBg:"rgba(255,255,255,.1)",  icon:<Icon.Refresh c="rgba(255,255,255,.7)"/>, name:"EPCG & IGCR",        tag:"Compliance Support",  light:true },
  { bc:"bc-grad",   icBg:"rgba(255,255,255,.15)", icon:<Icon.Chat c="rgba(255,255,255,.8)"/>,    name:"Reverse Logistics",  tag:"International & Domestic", light:true },
  { bc:"bc-yellow", icBg:"rgba(0,0,0,.08)", icon:<Icon.Monitor c="rgba(0,0,0,.55)"/>,         name:"SAP / ERP & Excel",    tag:"MIS · PO · Tracking" },
  { bc:"bc-green",  icBg:"rgba(0,0,0,.08)", icon:<Icon.People c="rgba(0,0,0,.55)"/>,          name:"CHA & Forwarder Coord.", tag:"Multi-stakeholder Mgmt." },
];

function Skills() {
  const r = useReveal();
  return (
    <section id="skills">
      <div className="wrap">
        <div className="sec-lbl sr" ref={r}>Expertise</div>
        <h2 className="sec-h sr">Skills & Capabilities</h2>
        <div className="bento sk-bento">

          <div className="bc bc-dark sk-wide sr d1"
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <div className="tag-pill tp-dk">Core Competency</div>
              <div style={{ fontSize:"clamp(15px,3vw,20px)", fontWeight:900, color:"var(--white)", letterSpacing:"-.5px", lineHeight:1.1 }}>Import & Export Operations</div>
              <div style={{ fontSize:11.5, color:"rgba(255,255,255,.38)", marginTop:4 }}>End-to-end air & sea · 45+ shipments/month</div>
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {["Air Freight","Sea Freight","ICD Clearance"].map(t => (
                <span key={t} style={{ background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.5)", fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:100, border:"1px solid rgba(255,255,255,.1)" }}>{t}</span>
              ))}
            </div>
          </div>

          {SKILLS.map((s, i) => (
            <div key={i} className={`bc ${s.bc} sr`}>
              <div className="sk-ic" style={{ background: s.icBg }}>{s.icon}</div>
              <div className="sk-nm" style={s.light ? { color:"white" } : {}}>{s.name}</div>
              <div className="sk-tg" style={s.light ? { color:"rgba(255,255,255,.35)" } : {}}>{s.tag}</div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════
   CONTACT
════════════════════════════ */
function Contact() {
  const r = useReveal();
  return (
    <section id="contact">
      <div className="wrap">
        <div className="sec-lbl sr" ref={r}>Contact</div>
        <h2 className="sec-h sr">Let's connect.</h2>
        <p className="sec-sub sr">Open to EXIM, Logistics & Supply Chain roles across India. Available immediately.</p>
        <div className="bento ct-bento">

          <a className="bc bc-black cc-card sr" href="mailto:ajithm0216@gmail.com">
            <div className="cc-ic" style={{ background:"rgba(255,255,255,.1)" }}><Icon.Email c="rgba(255,255,255,.7)" /></div>
            <div className="cc-lbl" style={{ color:"rgba(255,255,255,.3)" }}>Email</div>
            <div className="cc-val" style={{ color:"white" }}>ajithm0216@gmail.com</div>
          </a>

          <a className="bc bc-yellow cc-card sr d1" href="tel:+919786226148">
            <div className="cc-ic" style={{ background:"rgba(0,0,0,.08)" }}><Icon.Phone c="rgba(0,0,0,.55)" /></div>
            <div className="cc-lbl" style={{ opacity:.45 }}>Phone</div>
            <div className="cc-val">+91 97862 26148</div>
          </a>

          <a className="bc bc-lav cc-card sr d2" href="https://www.linkedin.com/in/ajith-kumar-ak216" target="_blank" rel="noreferrer">
            <div className="cc-ic" style={{ background:"rgba(0,0,0,.08)" }}><Icon.LinkedIn c="rgba(0,0,0,.55)" /></div>
            <div className="cc-lbl" style={{ opacity:.45 }}>LinkedIn</div>
            <div className="cc-val">ajith-kumar-ak216</div>
          </a>

        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════
   SCROLL TOP
════════════════════════════ */
function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <button className={`scroll-top${show ? " show" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <Icon.Up />
    </button>
  );
}

/* ════════════════════════════
   GLOBAL REVEAL INIT
════════════════════════════ */
function GlobalReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.06 }
    );
    document.querySelectorAll(".sr").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}

/* ════════════════════════════
   ROOT APP
════════════════════════════ */
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      <GlobalReveal />
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Contact />
      <footer>
        <p>© 2025 Ajith Kumar M · Logistics & EXIM Professional · Bangalore, India</p>
      </footer>
      <ScrollTop />
    </>
  );
}
