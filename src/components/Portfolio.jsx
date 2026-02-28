import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import {
  Box, Typography, Container, Grid, Chip, LinearProgress,
  Divider, IconButton, Tooltip
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// ─── THEME ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#F5A623" },
    secondary: { main: "#00D4FF" },
    background: { default: "#080A0F", paper: "#0D1017" },
    text: { primary: "#E8E8E8", secondary: "#7A8494" },
  },
  typography: {
    fontFamily: "'Space Mono', monospace",
    h1: { fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" },
    h2: { fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" },
    h3: { fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" },
    h4: { fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" },
  },
});

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const calculateExperience = () => {
  const start = new Date("2023-10-01");
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return { years, months: remMonths, total: months };
};

const exp = calculateExperience();

// ─── DATA ─────────────────────────────────────────────────────────────────────
const experiences = [
  {
    id: "01",
    role: "Operation Executive",
    company: "Sree Exim Solutions",
    period: "Oct 2023 – Sep 2025",
    type: "EXIM & Logistics",
    color: "#F5A623",
    desc: "Managed end-to-end export-import operations, coordinated with freight forwarders, customs agents, and shipping lines. Handled documentation for domestic and international shipments.",
    tags: ["EXIM", "Customs", "Documentation", "Freight"],
    icon: "🚢",
  },
  {
    id: "02",
    role: "Associate EXIM",
    company: "Ola Electric Technologies Pvt Ltd",
    payroll: "via Transsafe Global Forwarding Pvt Ltd",
    period: "Oct 2025 – Present",
    type: "International Logistics",
    color: "#00D4FF",
    desc: "Handling EXIM operations for electric mobility components. Managing international procurement logistics, import documentation, and compliance for Ola Electric's supply chain.",
    tags: ["EXIM", "EV Supply Chain", "Import", "Compliance"],
    icon: "⚡",
    current: true,
  },
  {
    id: "03",
    role: "Senior Executive",
    company: "Ola Electric Technologies Pvt Ltd",
    payroll: "via Transsafe Global Forwarding Pvt Ltd",
    period: "Ongoing",
    type: "Senior Operations",
    color: "#7C3AED",
    desc: "Elevated to Senior Executive overseeing comprehensive logistics strategy, reverse logistics management, and cross-functional coordination for international and domestic freight operations.",
    tags: ["Senior Ops", "Reverse Logistics", "Strategy", "Team Lead"],
    icon: "🏆",
    current: true,
  },
];

const skills = [
  { name: "International Logistics", level: 92 },
  { name: "Domestic Logistics", level: 95 },
  { name: "EXIM Documentation", level: 90 },
  { name: "Reverse Logistics", level: 85 },
  { name: "Customs & Compliance", level: 88 },
  { name: "Freight Forwarding", level: 87 },
  { name: "Supply Chain Management", level: 83 },
  { name: "SAP / ERP Systems", level: 75 },
];

const stats = [
  { value: `${exp.years}Y ${exp.months}M`, label: "Total Experience" },
  { value: "3+", label: "Companies" },
  { value: "500+", label: "Shipments Handled" },
  { value: "15+", label: "Countries Covered" },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

// Animated counter
function Counter({ value, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ textAlign: "center", px: 2 }}>
        <Typography
          variant="h2"
          sx={{ color: "#F5A623", fontSize: { xs: "2.5rem", md: "3.5rem" }, lineHeight: 1 }}
        >
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: "#7A8494", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

// Skill bar
function SkillBar({ name, level, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: "#E8E8E8", fontSize: "0.78rem", letterSpacing: "0.1em" }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#F5A623", fontSize: "0.78rem" }}>
            {level}%
          </Typography>
        </Box>
        <Box sx={{ position: "relative", height: 4, bgcolor: "#1A1E2A", borderRadius: 2, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${level}%` } : {}}
            transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #F5A623, #FF6B35)",
              borderRadius: 2,
              boxShadow: "0 0 8px #F5A62388",
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );
}

// Experience card
function ExpCard({ exp, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Box
        sx={{
          position: "relative",
          p: 3,
          border: `1px solid ${exp.color}33`,
          borderRadius: "2px",
          bgcolor: "#0D1017",
          overflow: "hidden",
          height: "100%",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "3px",
            height: "100%",
            bgcolor: exp.color,
          },
          "&:hover": {
            border: `1px solid ${exp.color}66`,
            boxShadow: `0 0 30px ${exp.color}15`,
          },
          transition: "all 0.3s ease",
        }}
      >
        {exp.current && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00FF88",
              }}
            />
            <Typography sx={{ fontSize: "0.65rem", color: "#00FF88", letterSpacing: "0.12em" }}>ACTIVE</Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Typography sx={{ fontSize: "1.8rem" }}>{exp.icon}</Typography>
          <Box>
            <Typography sx={{ fontSize: "0.65rem", color: exp.color, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {exp.type}
            </Typography>
            <Typography variant="body2" sx={{ color: "#4A5568", fontSize: "0.72rem" }}>
              {exp.id}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h4" sx={{ color: "#E8E8E8", fontSize: { xs: "1.4rem", md: "1.6rem" }, mb: 0.3 }}>
          {exp.role}
        </Typography>
        <Typography sx={{ color: exp.color, fontSize: "0.85rem", fontWeight: 600, mb: 0.3 }}>
          {exp.company}
        </Typography>
        {exp.payroll && (
          <Typography sx={{ color: "#4A5568", fontSize: "0.7rem", mb: 1, fontStyle: "italic" }}>
            {exp.payroll}
          </Typography>
        )}
        <Typography sx={{ color: "#7A8494", fontSize: "0.72rem", letterSpacing: "0.1em", mb: 2 }}>
          {exp.period}
        </Typography>

        <Typography variant="body2" sx={{ color: "#9AA3B0", lineHeight: 1.7, fontSize: "0.8rem", mb: 2 }}>
          {exp.desc}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
          {exp.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                bgcolor: `${exp.color}15`,
                color: exp.color,
                border: `1px solid ${exp.color}33`,
                fontSize: "0.65rem",
                height: 22,
                borderRadius: "2px",
                letterSpacing: "0.08em",
              }}
            />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}

// Floating route dots
function RouteAnimation() {
  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#F5A62366" : "#00D4FF44",
            top: `${15 + i * 13}%`,
            left: "-10px",
          }}
          animate={{ left: ["−10px", "110%"] }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear",
          }}
        />
      ))}
    </Box>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);
  const [activeSection, setActiveSection] = useState("home");

  return (
    <ThemeProvider theme={theme}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; }
        body { background: #080A0F; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080A0F; }
        ::-webkit-scrollbar-thumb { background: #F5A623; border-radius: 2px; }
      `}</style>

      {/* Progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, #F5A623, #FF6B35)",
          transformOrigin: "0%",
          scaleX: scrollYProgress,
          zIndex: 9999,
        }}
      />

      {/* NAV */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #1A1E2A",
          backdropFilter: "blur(12px)",
          background: "rgba(8,10,15,0.85)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              width: 28,
              height: 28,
              border: "2px solid #F5A623",
              borderRadius: "50%",
              borderTopColor: "transparent",
            }}
          />
          <Typography sx={{ color: "#F5A623", fontFamily: "'Bebas Neue'", fontSize: "1.3rem", letterSpacing: "0.12em" }}>
            EXIM PRO
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 3 }}>
          {["About", "Experience", "Skills", "Contact"].map((item) => (
            <Typography
              key={item}
              component="a"
              href={`#${item.toLowerCase()}`}
              sx={{
                color: "#7A8494",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textDecoration: "none",
                "&:hover": { color: "#F5A623" },
                transition: "color 0.2s",
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>
      </motion.nav>

      {/* ── HERO ── */}
      <Box
        id="about"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          pt: "80px",
          background: "linear-gradient(135deg, #080A0F 0%, #0D1017 50%, #080A0F 100%)",
        }}
      >
        <RouteAnimation />

        {/* Grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#1A1E2A22 1px, transparent 1px), linear-gradient(90deg, #1A1E2A22 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        {/* Glow */}
        <Box
          sx={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, #F5A62308 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Box sx={{ width: 40, height: 1, bgcolor: "#F5A623" }} />
                  <Typography sx={{ color: "#F5A623", fontSize: "0.72rem", letterSpacing: "0.2em" }}>
                    LOGISTICS & EXIM PROFESSIONAL
                  </Typography>
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "3.5rem", md: "6rem" },
                    lineHeight: 0.95,
                    mb: 1,
                    color: "#E8E8E8",
                  }}
                >
                  GLOBAL
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "3.5rem", md: "6rem" },
                    lineHeight: 0.95,
                    mb: 1,
                    WebkitTextStroke: "1px #F5A623",
                    color: "transparent",
                  }}
                >
                  LOGISTICS
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "3.5rem", md: "6rem" },
                    lineHeight: 0.95,
                    mb: 3,
                    color: "#E8E8E8",
                  }}
                >
                  EXPERT
                </Typography>

                <Typography
                  sx={{
                    color: "#9AA3B0",
                    fontSize: "0.88rem",
                    lineHeight: 1.8,
                    maxWidth: 500,
                    mb: 4,
                  }}
                >
                  {exp.years} year{exp.years !== 1 ? "s" : ""} & {exp.months} months of experience in International & Domestic
                  Logistics, EXIM Operations, and Reverse Logistics. Currently driving supply chain excellence
                  at Ola Electric Technologies.
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {["International Logistics", "Domestic Logistics", "Reverse Logistics", "EXIM Ops"].map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        bgcolor: "#1A1E2A",
                        color: "#F5A623",
                        border: "1px solid #F5A62333",
                        borderRadius: "2px",
                        fontSize: "0.7rem",
                        letterSpacing: "0.08em",
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    p: 4,
                    border: "1px solid #1A1E2A",
                    borderRadius: "2px",
                    bgcolor: "#0D1017",
                  }}
                >
                  {/* Corner accents */}
                  {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((pos) => (
                    <Box
                      key={pos}
                      sx={{
                        position: "absolute",
                        width: 16,
                        height: 16,
                        ...(pos.includes("top") ? { top: -1 } : { bottom: -1 }),
                        ...(pos.includes("Left") ? { left: -1 } : { right: -1 }),
                        borderTop: pos.includes("top") ? "2px solid #F5A623" : "none",
                        borderBottom: pos.includes("bottom") ? "2px solid #F5A623" : "none",
                        borderLeft: pos.includes("Left") ? "2px solid #F5A623" : "none",
                        borderRight: pos.includes("Right") ? "2px solid #F5A623" : "none",
                      }}
                    />
                  ))}

                  <Typography sx={{ color: "#4A5568", fontSize: "0.65rem", letterSpacing: "0.18em", mb: 3 }}>
                    // CURRENT STATUS
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ width: 8, height: 8, borderRadius: "50%", background: "#00FF88" }}
                    />
                    <Typography sx={{ color: "#00FF88", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                      AVAILABLE FOR OPPORTUNITIES
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "#1A1E2A", mb: 3 }} />

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    {[
                      { label: "Current Role", value: "Senior Executive" },
                      { label: "Company", value: "Ola Electric" },
                      { label: "Domain", value: "EXIM / Logistics" },
                      { label: "Experience", value: `${exp.years}Y ${exp.months}M` },
                      { label: "Int'l Logistics", value: "Active" },
                      { label: "Reverse Logistics", value: "Active" },
                    ].map((item) => (
                      <Box key={item.label}>
                        <Typography sx={{ color: "#4A5568", fontSize: "0.6rem", letterSpacing: "0.12em", mb: 0.3 }}>
                          {item.label.toUpperCase()}
                        </Typography>
                        <Typography sx={{ color: "#E8E8E8", fontSize: "0.8rem", fontWeight: 700 }}>
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Box
              sx={{
                mt: 8,
                p: 4,
                border: "1px solid #1A1E2A",
                borderRadius: "2px",
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
                gap: 3,
                bgcolor: "#0D1017",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "linear-gradient(90deg, #F5A623, #FF6B35, transparent)",
                },
              }}
            >
              {stats.map((s, i) => (
                <Counter key={i} value={s.value} label={s.label} />
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── EXPERIENCE ── */}
      <Box id="experience" sx={{ py: 12, bgcolor: "#080A0F" }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box sx={{ width: 50, height: 1, bgcolor: "#F5A623" }} />
              <Typography sx={{ color: "#F5A623", fontSize: "0.72rem", letterSpacing: "0.2em" }}>
                WORK HISTORY
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, color: "#E8E8E8", mb: 1 }}>
              PROFESSIONAL
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, WebkitTextStroke: "1px #F5A623", color: "transparent", mb: 6 }}>
              EXPERIENCE
            </Typography>
          </motion.div>

          {/* Timeline */}
          <Box sx={{ position: "relative", mb: 8 }}>
            <Box
              sx={{
                position: "absolute",
                left: { xs: 16, md: "50%" },
                top: 0,
                bottom: 0,
                width: 1,
                bgcolor: "#1A1E2A",
              }}
            />
            {experiences.map((exp, index) => (
              <Box
                key={exp.id}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: index % 2 === 0 ? "flex-start" : "flex-end" },
                  mb: 6,
                  position: "relative",
                }}
              >
                {/* Timeline dot */}
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: 12, md: "calc(50% - 6px)" },
                    top: 20,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: exp.color,
                    boxShadow: `0 0 12px ${exp.color}`,
                    zIndex: 2,
                  }}
                />
                <Box sx={{ width: { xs: "calc(100% - 40px)", md: "46%" }, ml: { xs: 6, md: 0 } }}>
                  <ExpCard exp={exp} index={index} />
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── SKILLS ── */}
      <Box id="skills" sx={{ py: 12, bgcolor: "#0D1017" }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                  <Box sx={{ width: 50, height: 1, bgcolor: "#F5A623" }} />
                  <Typography sx={{ color: "#F5A623", fontSize: "0.72rem", letterSpacing: "0.2em" }}>
                    EXPERTISE
                  </Typography>
                </Box>
                <Typography variant="h2" sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, color: "#E8E8E8", mb: 1 }}>
                  CORE
                </Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, WebkitTextStroke: "1px #F5A623", color: "transparent", mb: 3 }}>
                  SKILLS
                </Typography>
                <Typography sx={{ color: "#9AA3B0", fontSize: "0.85rem", lineHeight: 1.8, mb: 4 }}>
                  Built across diverse logistics environments — from EXIM documentation to reverse logistics
                  and supply chain coordination at scale.
                </Typography>

                {/* Expertise boxes */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  {[
                    { icon: "🌐", label: "International Logistics" },
                    { icon: "🏭", label: "Domestic Operations" },
                    { icon: "🔄", label: "Reverse Logistics" },
                    { icon: "📋", label: "EXIM Documentation" },
                    { icon: "🛃", label: "Customs Clearance" },
                    { icon: "📊", label: "Supply Chain" },
                  ].map((item) => (
                    <motion.div key={item.label} whileHover={{ scale: 1.03 }}>
                      <Box
                        sx={{
                          p: 2,
                          border: "1px solid #1A1E2A",
                          borderRadius: "2px",
                          bgcolor: "#080A0F",
                          "&:hover": { borderColor: "#F5A62344", boxShadow: "0 0 20px #F5A62308" },
                          transition: "all 0.3s",
                        }}
                      >
                        <Typography sx={{ fontSize: "1.3rem", mb: 0.5 }}>{item.icon}</Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: "#9AA3B0", letterSpacing: "0.05em" }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box sx={{ pt: { md: 8 } }}>
                {skills.map((skill, i) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} index={i} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── SERVICES / WHAT I DO ── */}
      <Box sx={{ py: 12, bgcolor: "#080A0F" }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography sx={{ color: "#F5A623", fontSize: "0.72rem", letterSpacing: "0.2em", mb: 1 }}>
                SERVICE AREAS
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, color: "#E8E8E8" }}>
                WHAT I HANDLE
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {[
              {
                icon: "🚢",
                title: "International Logistics",
                desc: "End-to-end management of cross-border shipments including sea, air, and multimodal freight. Experience with major trade lanes and global forwarders.",
                color: "#00D4FF",
              },
              {
                icon: "🚛",
                title: "Domestic Logistics",
                desc: "Coordinating FTL/LTL movement, last-mile delivery, warehouse coordination, and inland distribution across India.",
                color: "#F5A623",
              },
              {
                icon: "🔄",
                title: "Reverse Logistics",
                desc: "Managing return shipments, RMA processes, re-export documentation, and closed-loop supply chains for electric mobility components.",
                color: "#7C3AED",
              },
              {
                icon: "📄",
                title: "EXIM Documentation",
                desc: "Bill of Lading, LC documentation, customs BOE, DGFT coordination, shipping bills, and all regulatory export-import filings.",
                color: "#00FF88",
              },
              {
                icon: "🛃",
                title: "Customs & Compliance",
                desc: "Handling customs clearance, HS code classification, duty optimization, and maintaining regulatory compliance for import/export.",
                color: "#FF6B35",
              },
              {
                icon: "⚡",
                title: "EV Supply Chain",
                desc: "Specialized experience in EV component logistics at Ola Electric — managing import of battery cells, motor parts, and critical sub-assemblies.",
                color: "#F5A623",
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                >
                  <Box
                    sx={{
                      p: 3,
                      border: `1px solid ${item.color}22`,
                      borderRadius: "2px",
                      bgcolor: "#0D1017",
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        border: `1px solid ${item.color}55`,
                        boxShadow: `0 0 40px ${item.color}10`,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -30,
                        right: -30,
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${item.color}08 0%, transparent 70%)`,
                      }}
                    />
                    <Typography sx={{ fontSize: "2rem", mb: 2 }}>{item.icon}</Typography>
                    <Typography variant="h4" sx={{ color: "#E8E8E8", fontSize: "1.1rem", mb: 1.5 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "#7A8494", fontSize: "0.8rem", lineHeight: 1.7 }}>
                      {item.desc}
                    </Typography>
                    <Box sx={{ mt: 2, width: 30, height: 2, bgcolor: item.color }} />
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CONTACT ── */}
      <Box id="contact" sx={{ py: 12, bgcolor: "#0D1017", position: "relative", overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#1A1E2A11 1px, transparent 1px), linear-gradient(90deg, #1A1E2A11 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Typography sx={{ color: "#F5A623", fontSize: "0.72rem", letterSpacing: "0.2em", mb: 2 }}>
              GET IN TOUCH
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.5rem", md: "5rem" }, color: "#E8E8E8", mb: 1 }}>
              LET'S MOVE
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.5rem", md: "5rem" }, WebkitTextStroke: "1px #F5A623", color: "transparent", mb: 4 }}>
              FREIGHT FORWARD
            </Typography>
            <Typography sx={{ color: "#9AA3B0", fontSize: "0.88rem", mb: 6, maxWidth: 500, mx: "auto", lineHeight: 1.8 }}>
              Open to opportunities in Logistics Management, EXIM Operations, and Supply Chain roles.
              Let's connect and explore what we can build together.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
              {[
                { label: "LinkedIn", icon: "in", color: "#0077B5" },
                { label: "Email", icon: "@", color: "#F5A623" },
                { label: "Phone", icon: "☎", color: "#00FF88" },
              ].map((item) => (
                <motion.div key={item.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Box
                    sx={{
                      px: 4,
                      py: 2,
                      border: `1px solid ${item.color}44`,
                      borderRadius: "2px",
                      bgcolor: `${item.color}11`,
                      color: item.color,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      "&:hover": { bgcolor: `${item.color}22`, boxShadow: `0 0 20px ${item.color}22` },
                      transition: "all 0.3s",
                    }}
                  >
                    <Typography sx={{ fontFamily: "'Bebas Neue'", letterSpacing: "0.1em" }}>
                      {item.icon} {item.label}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ py: 4, borderTop: "1px solid #1A1E2A", bgcolor: "#080A0F" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Typography sx={{ color: "#F5A623", fontFamily: "'Bebas Neue'", fontSize: "1.1rem", letterSpacing: "0.12em" }}>
              EXIM PRO PORTFOLIO
            </Typography>
            <Typography sx={{ color: "#4A5568", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
              © {new Date().getFullYear()} · LOGISTICS & EXIM SPECIALIST · OLA ELECTRIC
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88" }}
              />
              <Typography sx={{ color: "#00FF88", fontSize: "0.65rem", letterSpacing: "0.12em" }}>
                ACTIVELY SHIPPING
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
