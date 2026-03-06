import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SHEET_ID = "1XKsYofCUfwoCXFWjKlVKH0uug1HIAf9gGGwpFYbQPO0";
const SHEET_NAMES = { intl: "International", courier: "AirCourier" };

// Google Sheets public CSV export
const csvUrl = (sheetName) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

const ENTITIES = ["OET-FF", "OET-RMZ", "OCT-GF", "OCT-BIC"];
const MODES_INTL = ["Air", "Sea", "Road", "Rail"];
const MODES_COURIER = ["Air Courier", "Express", "Standard"];
const INCO_TERMS = ["EXW", "FOB", "CIF", "DDP", "DAP", "FCA", "CPT", "CIP"];
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CNY", "AUD", "SGD"];
const PAYMENT_STATUS = ["Pending", "Paid", "Partial", "On Hold"];

// ─── STYLES ─────────────────────────────────────────────────────────────────
const theme = {
  primary: "#1B4F72",
  primaryLight: "#2980B9",
  accent: "#F39C12",
  success: "#27AE60",
  danger: "#E74C3C",
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  surfaceAlt: "#EBF2FA",
  border: "#D5E8F5",
  text: "#1A2530",
  textSub: "#5D7A8C",
  textLight: "#8FA8BA",
};

const styles = {
  app: {
    minHeight: "100vh",
    background: theme.bg,
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    color: theme.text,
  },
  sidebar: {
    width: 240,
    background: theme.primary,
    minHeight: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 24px rgba(27,79,114,0.18)",
  },
  main: {
    marginLeft: 240,
    padding: "32px 36px",
    minHeight: "100vh",
  },
  card: {
    background: theme.surface,
    borderRadius: 12,
    boxShadow: "0 2px 16px rgba(27,79,114,0.08)",
    border: `1px solid ${theme.border}`,
    padding: 24,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: "9px 13px",
    border: `1.5px solid ${theme.border}`,
    borderRadius: 8,
    fontSize: 13,
    color: theme.text,
    background: "#fff",
    outline: "none",
    transition: "border 0.2s",
    boxSizing: "border-box",
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: theme.textSub,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 4,
    display: "block",
  },
  btn: {
    padding: "10px 22px",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.18s",
    letterSpacing: "0.03em",
  },
  btnPrimary: {
    background: theme.primary,
    color: "#fff",
  },
  btnAccent: {
    background: theme.accent,
    color: "#fff",
  },
  btnOutline: {
    background: "transparent",
    color: theme.primary,
    border: `1.5px solid ${theme.primary}`,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
};

// ─── FIELD DEFINITIONS ──────────────────────────────────────────────────────
const intlFields = [
  { key: "shipmentId", label: "Shipment ID", type: "text", required: true },
  { key: "entity", label: "Entity", type: "select", options: ENTITIES, required: true },
  { key: "userSPOC", label: "User SPOC", type: "text" },
  { key: "userRequestedDate", label: "User Requested Date", type: "date" },
  { key: "mode", label: "MODE", type: "select", options: MODES_INTL },
  { key: "incoTerm", label: "INCO TERM", type: "select", options: INCO_TERMS },
  { key: "dgNonDg", label: "DG / NON-DG", type: "select", options: ["DG", "NON-DG"] },
  { key: "rdProgramDetails", label: "R&D Program Details", type: "text" },
  { key: "supplierPO", label: "Supplier PO", type: "text" },
  { key: "shipper", label: "SHIPPER", type: "text" },
  { key: "itemDescription", label: "ITEM DESCRIPTION", type: "textarea" },
  { key: "hsCode", label: "HS CODE", type: "text" },
  { key: "originPort", label: "Origin Port", type: "text" },
  { key: "countryName", label: "Country Name", type: "text" },
  { key: "commercialInvNo", label: "Commercial INV. NO", type: "text" },
  { key: "commercialInvDate", label: "Commercial INV DATE", type: "date" },
  { key: "invoiceValue", label: "INVOICE VALUE", type: "number" },
  { key: "currency", label: "Currency", type: "select", options: CURRENCIES },
  { key: "qty", label: "QTY", type: "number" },
  { key: "qtyType", label: "QTY TYPE", type: "text" },
  { key: "noOfPackage", label: "No of Package", type: "number" },
  { key: "ff", label: "FF", type: "text" },
  { key: "hawbBlNo", label: "HAWB/BL NO", type: "text" },
  { key: "etd", label: "ETD", type: "date" },
  { key: "eta", label: "ETA", type: "date" },
  { key: "pickupDateTarget", label: "Pickup Date Target", type: "date" },
  { key: "pickupDateActual", label: "Pickup Date Actual", type: "date" },
  { key: "deliveryDateTarget", label: "Delivery Date Target", type: "date" },
  { key: "deliveryDateActual", label: "Delivery Date Actual", type: "date" },
  { key: "tatTarget", label: "TAT Target (days)", type: "computed", readOnly: true },
  { key: "tatActual", label: "TAT Actual (days)", type: "computed", readOnly: true },
  { key: "noOfContainers", label: "No. of Containers", type: "number" },
  { key: "destinationPortCode", label: "Destination Port Code", type: "text" },
  { key: "boeNumber", label: "BOE NUMBER", type: "text" },
  { key: "boeDate", label: "BOE DATE", type: "date" },
  { key: "exRate", label: "EX RATE", type: "number" },
  { key: "boeFreightInr", label: "BOE FREIGHT INR", type: "number" },
  { key: "insuranceFc", label: "INSURANCE in (FC)", type: "number" },
  { key: "taxableValue", label: "Taxable Value", type: "number" },
  { key: "bcd", label: "BCD", type: "number" },
  { key: "sws", label: "SWS", type: "number" },
  { key: "igst", label: "IGST", type: "number" },
  { key: "penalty", label: "Penalty", type: "number" },
  { key: "beGrossDuty", label: "BE GROSS Duty", type: "number" },
  { key: "generalEpcg", label: "General / EPCG", type: "select", options: ["General", "EPCG"] },
  { key: "epcgLicense", label: "EPCG License", type: "text" },
  { key: "demurrageCharges", label: "Demurrage Charges", type: "number" },
  { key: "clearanceTaxInvNoCha", label: "Clearance Tax Invoice No (CHA)", type: "text" },
  { key: "clearanceCost", label: "Clearance COST", type: "number" },
  { key: "taxInvNoFf", label: "Tax Invoice No (FF Invoice)", type: "text" },
  { key: "landingFreightCost", label: "LANDING FREIGHT COST", type: "number" },
  { key: "logisticsOlaPo", label: "Logistics OLA PO NO", type: "text" },
  { key: "grn", label: "GRN", type: "text" },
  { key: "paymentStatus", label: "Payment status", type: "select", options: PAYMENT_STATUS },
  { key: "utrDetails", label: "UTR Details", type: "text" },
  { key: "paymentDate", label: "Payment Date", type: "date" },
  { key: "remarks", label: "REMARKS", type: "textarea" },
];

const courierFields = [
  { key: "shipmentId", label: "Shipment ID", type: "text", required: true },
  { key: "entity", label: "Entity", type: "select", options: ENTITIES, required: true },
  { key: "userSPOC", label: "User SPOC", type: "text" },
  { key: "userRequestedDate", label: "User Requested Date", type: "date" },
  { key: "mode", label: "MODE", type: "select", options: MODES_COURIER },
  { key: "incoTerm", label: "INCO TERM", type: "select", options: INCO_TERMS },
  { key: "rdProgramDetails", label: "R&D Program Details", type: "text" },
  { key: "supplierPO", label: "Supplier PO", type: "text" },
  { key: "shipper", label: "SHIPPER", type: "text" },
  { key: "itemDescription", label: "ITEM DESCRIPTION", type: "textarea" },
  { key: "hsCode", label: "HS CODE", type: "text" },
  { key: "originPort", label: "Origin Port", type: "text" },
  { key: "countryName", label: "Country Name", type: "text" },
  { key: "commercialInvNo", label: "Commercial INV. NO", type: "text" },
  { key: "commercialInvDate", label: "Commercial INV DATE", type: "date" },
  { key: "invoiceValue", label: "INVOICE VALUE", type: "number" },
  { key: "currency", label: "Currency", type: "select", options: CURRENCIES },
  { key: "qty", label: "QTY", type: "number" },
  { key: "qtyType", label: "QTY TYPE", type: "text" },
  { key: "noOfPackage", label: "No of Package", type: "number" },
  { key: "ff", label: "FF", type: "text" },
  { key: "hawbBlNo", label: "HAWB/BL NO", type: "text" },
  { key: "etd", label: "ETD", type: "date" },
  { key: "eta", label: "ETA", type: "date" },
  { key: "pickupDateTarget", label: "Pickup Date Target", type: "date" },
  { key: "pickupDateActual", label: "Pickup Date Actual", type: "date" },
  { key: "deliveryDateTarget", label: "Delivery Date Target", type: "date" },
  { key: "deliveryDateActual", label: "Delivery Date Actual", type: "date" },
  { key: "tatTarget", label: "TAT Target (days)", type: "computed", readOnly: true },
  { key: "tatActual", label: "TAT Actual (days)", type: "computed", readOnly: true },
  { key: "destinationPortCode", label: "Destination Port Code", type: "text" },
  { key: "boeNumber", label: "BOE NUMBER", type: "text" },
  { key: "boeDate", label: "BOE DATE", type: "date" },
  { key: "exRate", label: "EX RATE", type: "number" },
  { key: "beGrossDuty", label: "BE GROSS Duty", type: "number" },
  { key: "dutyInvoice", label: "Duty Invoice", type: "text" },
  { key: "clearanceTaxInvNoCha", label: "Clearance Tax Invoice No (CHA)", type: "text" },
  { key: "clearanceCost", label: "Clearance COST", type: "number" },
  { key: "taxInvNo", label: "Tax Invoice No", type: "text" },
  { key: "landingFreightCost", label: "LANDING FREIGHT COST", type: "number" },
  { key: "utrDetails", label: "UTR Details", type: "text" },
  { key: "paymentDate", label: "Payment Date", type: "date" },
  { key: "remarks", label: "REMARKS", type: "textarea" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
const dateDiffDays = (d1, d2) => {
  if (!d1 || !d2) return "";
  const diff = (new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24);
  return isNaN(diff) ? "" : Math.round(diff);
};

const computeTAT = (data) => ({
  ...data,
  tatTarget: dateDiffDays(data.pickupDateTarget, data.deliveryDateTarget),
  tatActual: dateDiffDays(data.pickupDateActual, data.deliveryDateActual),
  epcgLicense: data.generalEpcg === "General" ? "-" : data.epcgLicense || "",
});

const emptyForm = (fields) =>
  fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});

// ─── GOOGLE SHEETS INTEGRATION ──────────────────────────────────────────────
async function appendToSheet(sheetName, rowData, fields) {
  // Build a row array in field order
  const values = fields.map((f) => rowData[f.key] ?? "");
  // Using Google Sheets API via fetch (public append via web app would need App Script)
  // Here we build a deep-link to pre-fill a Google Form, OR show a direct sheet link
  // For demo, we'll use the Apps Script web app endpoint pattern
  const APPS_SCRIPT_URL = ""; // User must deploy Apps Script
  if (!APPS_SCRIPT_URL) return { success: false, noScript: true };
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ sheet: sheetName, values }),
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ─── NAV ITEMS ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "intl-form", label: "International Shipment", icon: "✈️" },
  { id: "courier-form", label: "Air Courier", icon: "📦" },
  { id: "intl-records", label: "Intl Records", icon: "🗂️" },
  { id: "courier-records", label: "Courier Records", icon: "📋" },
  { id: "reports", label: "Reports", icon: "📈" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Sidebar({ page, setPage }) {
  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg,#F39C12,#E67E22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 4px 12px rgba(243,156,18,0.4)"
            }}>🚢</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.02em" }}>LogiTrack</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Global Logistics</div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {NAV.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setPage(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "10px 14px", marginBottom: 4,
              borderRadius: 9, border: "none", cursor: "pointer", textAlign: "left",
              background: page === item.id ? "rgba(255,255,255,0.15)" : "transparent",
              color: page === item.id ? "#fff" : "rgba(255,255,255,0.6)",
              fontWeight: page === item.id ? 600 : 400,
              fontSize: 13, transition: "all 0.18s",
              borderLeft: page === item.id ? `3px solid ${theme.accent}` : "3px solid transparent",
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </motion.button>
        ))}
      </nav>
      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
          Connected to Google Sheets
        </div>
        <a
          href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}`}
          target="_blank" rel="noreferrer"
          style={{ color: theme.accent, fontSize: 11, fontWeight: 600 }}
        >
          Open Spreadsheet ↗
        </a>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  const isDisabled =
    field.readOnly ||
    (field.key === "epcgLicense" && value === "-");

  const baseInput = { ...styles.input, ...(isDisabled ? { background: "#F4F6F9", color: theme.textSub } : {}) };

  if (field.type === "computed") {
    return (
      <input
        style={{ ...baseInput, background: "#EBF2FA", fontWeight: 600, color: theme.primary }}
        value={value !== "" && value !== undefined ? `${value} days` : "—"}
        readOnly
      />
    );
  }
  if (field.type === "select") {
    return (
      <select style={baseInput} value={value} onChange={(e) => onChange(e.target.value)} disabled={isDisabled}>
        <option value="">— Select —</option>
        {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea
        style={{ ...baseInput, resize: "vertical", minHeight: 68 }}
        value={value} onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      style={baseInput}
      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={isDisabled}
    />
  );
}

// Group fields into sections
const INTL_SECTIONS = [
  { title: "🔖 Basic Information", keys: ["shipmentId","entity","userSPOC","userRequestedDate","mode","incoTerm","dgNonDg","rdProgramDetails","supplierPO"] },
  { title: "📦 Shipment Details", keys: ["shipper","itemDescription","hsCode","originPort","countryName","commercialInvNo","commercialInvDate","invoiceValue","currency","qty","qtyType","noOfPackage"] },
  { title: "🛳️ Transport", keys: ["ff","hawbBlNo","etd","eta","pickupDateTarget","pickupDateActual","deliveryDateTarget","deliveryDateActual","tatTarget","tatActual","noOfContainers","destinationPortCode"] },
  { title: "📜 BOE & Duty", keys: ["boeNumber","boeDate","exRate","boeFreightInr","insuranceFc","taxableValue","bcd","sws","igst","penalty","beGrossDuty","generalEpcg","epcgLicense","demurrageCharges"] },
  { title: "💳 Clearance & Payment", keys: ["clearanceTaxInvNoCha","clearanceCost","taxInvNoFf","landingFreightCost","logisticsOlaPo","grn","paymentStatus","utrDetails","paymentDate","remarks"] },
];

const COURIER_SECTIONS = [
  { title: "🔖 Basic Information", keys: ["shipmentId","entity","userSPOC","userRequestedDate","mode","incoTerm","rdProgramDetails","supplierPO"] },
  { title: "📦 Shipment Details", keys: ["shipper","itemDescription","hsCode","originPort","countryName","commercialInvNo","commercialInvDate","invoiceValue","currency","qty","qtyType","noOfPackage"] },
  { title: "✈️ Transport", keys: ["ff","hawbBlNo","etd","eta","pickupDateTarget","pickupDateActual","deliveryDateTarget","deliveryDateActual","tatTarget","tatActual","destinationPortCode"] },
  { title: "📜 BOE & Duty", keys: ["boeNumber","boeDate","exRate","beGrossDuty","dutyInvoice"] },
  { title: "💳 Clearance & Payment", keys: ["clearanceTaxInvNoCha","clearanceCost","taxInvNo","landingFreightCost","utrDetails","paymentDate","remarks"] },
];

function ShipmentForm({ type }) {
  const fields = type === "intl" ? intlFields : courierFields;
  const sections = type === "intl" ? INTL_SECTIONS : COURIER_SECTIONS;
  const sheetName = type === "intl" ? SHEET_NAMES.intl : SHEET_NAMES.courier;

  const [form, setForm] = useState(emptyForm(fields));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [localRecords, setLocalRecords] = useState([]);

  const handleChange = useCallback((key, val) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      // Auto-handle EPCG
      if (key === "generalEpcg" && val === "General") next.epcgLicense = "-";
      if (key === "generalEpcg" && val === "EPCG") next.epcgLicense = "";
      return computeTAT(next);
    });
  }, []);

  const handleSubmit = async () => {
    if (!form.shipmentId || !form.entity) {
      setToast({ type: "error", msg: "Shipment ID and Entity are required." });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setSaving(true);
    // Save locally (simulated) + attempt sheet
    const rec = { ...computeTAT(form), _savedAt: new Date().toISOString(), _type: type };
    const storedKey = `logitrack_${type}`;
    const existing = JSON.parse(sessionStorage.getItem(storedKey) || "[]");
    existing.push(rec);
    sessionStorage.setItem(storedKey, JSON.stringify(existing));
    setLocalRecords(existing);

    // Attempt Google Sheets
    const result = await appendToSheet(sheetName, rec, fields);
    setSaving(false);

    if (result?.noScript) {
      setToast({ type: "warn", msg: "Saved locally. Configure Apps Script to sync with Google Sheets." });
    } else if (result?.success) {
      setToast({ type: "success", msg: "Saved to Google Sheets!" });
    } else {
      setToast({ type: "warn", msg: "Saved in session. Enable Apps Script for cloud sync." });
    }
    setTimeout(() => setToast(null), 4000);
    setForm(emptyForm(fields));
  };

  const getField = (key) => fields.find((f) => f.key === key);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.primary, margin: 0 }}>
          {type === "intl" ? "✈️ International Shipment" : "📦 Air Courier"}
        </h1>
        <p style={{ color: theme.textSub, marginTop: 6, fontSize: 14 }}>
          Enter shipment details below. TAT fields are calculated automatically.
        </p>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              padding: "12px 18px", borderRadius: 9, marginBottom: 20, fontSize: 13, fontWeight: 600,
              background: toast.type === "success" ? "#D5F5E3" : toast.type === "error" ? "#FADBD8" : "#FEF9E7",
              color: toast.type === "success" ? "#1E8449" : toast.type === "error" ? "#C0392B" : "#9A7D0A",
              border: `1px solid ${toast.type === "success" ? "#ABEBC6" : toast.type === "error" ? "#F1948A" : "#F9E79F"}`,
            }}
          >
            {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "⚠️"} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections */}
      {sections.map((sec, si) => (
        <motion.div
          key={sec.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.07 }}
          style={styles.card}
        >
          <div style={{ fontWeight: 700, fontSize: 15, color: theme.primary, marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${theme.border}` }}>
            {sec.title}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px 20px" }}>
            {sec.keys.map((key) => {
              const field = getField(key);
              if (!field) return null;
              return (
                <div key={key} style={field.type === "textarea" ? { gridColumn: "1 / -1" } : {}}>
                  <label style={styles.label}>
                    {field.label}
                    {field.required && <span style={{ color: theme.danger }}> *</span>}
                  </label>
                  <FieldInput
                    field={field}
                    value={form[key] ?? ""}
                    onChange={(v) => handleChange(key, v)}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          style={{ ...styles.btn, ...styles.btnPrimary, opacity: saving ? 0.7 : 1 }}
          onClick={handleSubmit} disabled={saving}
        >
          {saving ? "⏳ Saving…" : "💾 Save Shipment"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ ...styles.btn, ...styles.btnOutline }}
          onClick={() => setForm(emptyForm(fields))}
        >
          🔄 Reset
        </motion.button>
      </div>
    </motion.div>
  );
}

function RecordsTable({ type }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("local");

  useEffect(() => {
    const key = `logitrack_${type}`;
    setRecords(JSON.parse(sessionStorage.getItem(key) || "[]"));
  }, [type]);

  const loadSheetData = async () => {
    setLoading(true);
    const sheetName = type === "intl" ? SHEET_NAMES.intl : SHEET_NAMES.courier;
    try {
      const res = await fetch(csvUrl(sheetName));
      const text = await res.text();
      const rows = text.split("\n").map((r) =>
        r.split(",").map((c) => c.replace(/^"|"$/g, "").trim())
      );
      const headers = rows[0];
      const data = rows.slice(1).filter((r) => r.some((c) => c)).map((r) =>
        headers.reduce((acc, h, i) => ({ ...acc, [h]: r[i] || "" }), {})
      );
      setSheetData(data);
    } catch (e) {
      setSheetData([{ Error: "Unable to load. Ensure sheet is public." }]);
    }
    setLoading(false);
    setActiveTab("sheet");
  };

  const display = activeTab === "local" ? records : sheetData;
  const fields = type === "intl" ? intlFields : courierFields;

  const filtered = display.filter((r) => {
    const matchSearch = !search || Object.values(r).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    );
    const matchEntity = !filterEntity || r.entity === filterEntity || r.Entity === filterEntity;
    return matchSearch && matchEntity;
  });

  const colKeys = activeTab === "local"
    ? ["shipmentId", "entity", "shipper", "mode", "originPort", "countryName", "etd", "eta", "tatTarget", "tatActual", "paymentStatus"]
    : (sheetData[0] ? Object.keys(sheetData[0]).slice(0, 12) : []);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.primary, margin: 0 }}>
          {type === "intl" ? "🗂️ International Records" : "📋 Courier Records"}
        </h1>
      </div>

      {/* Tabs + Filters */}
      <div style={styles.card}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["local", "sheet"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); if (tab === "sheet" && !sheetData.length) loadSheetData(); }}
                style={{
                  ...styles.btn, padding: "7px 16px", fontSize: 12,
                  background: activeTab === tab ? theme.primary : theme.surfaceAlt,
                  color: activeTab === tab ? "#fff" : theme.textSub,
                }}
              >
                {tab === "local" ? "📁 Session Data" : "📊 Google Sheet"}
              </button>
            ))}
          </div>
          <input
            style={{ ...styles.input, width: 200, padding: "7px 12px" }}
            placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={{ ...styles.input, width: 140, padding: "7px 12px" }}
            value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)}
          >
            <option value="">All Entities</option>
            {ENTITIES.map((e) => <option key={e}>{e}</option>)}
          </select>
          {activeTab === "sheet" && (
            <button style={{ ...styles.btn, ...styles.btnOutline, padding: "7px 14px", fontSize: 12 }} onClick={loadSheetData}>
              🔄 Refresh
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: theme.textSub }}>⏳ Loading from Google Sheets…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: theme.textLight, fontSize: 14 }}>
            {activeTab === "local" ? "No session records. Submit a form to see data here." : "No data found."}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: theme.surfaceAlt }}>
                  {colKeys.map((k) => (
                    <th key={k} style={{ padding: "10px 12px", textAlign: "left", color: theme.textSub, fontWeight: 600, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: `1.5px solid ${theme.border}`, whiteSpace: "nowrap" }}>
                      {fields.find((f) => f.key === k)?.label || k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, ri) => (
                  <motion.tr
                    key={ri}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: ri * 0.03 }}
                    style={{ borderBottom: `1px solid ${theme.border}`, background: ri % 2 === 0 ? "#fff" : "#FAFCFF" }}
                  >
                    {colKeys.map((k) => {
                      const val = row[k] ?? row[fields.find(f=>f.key===k)?.label] ?? "";
                      const isStatus = k === "paymentStatus";
                      return (
                        <td key={k} style={{ padding: "9px 12px", color: theme.text, whiteSpace: "nowrap" }}>
                          {isStatus ? (
                            <span style={{
                              ...styles.tag,
                              background: val === "Paid" ? "#D5F5E3" : val === "Pending" ? "#FEF9E7" : val === "On Hold" ? "#FADBD8" : "#EBF5FB",
                              color: val === "Paid" ? "#1E8449" : val === "Pending" ? "#9A7D0A" : val === "On Hold" ? "#C0392B" : "#1A5276",
                            }}>{val || "—"}</span>
                          ) : (val || "—")}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: 12, fontSize: 12, color: theme.textLight }}>
          Showing {filtered.length} record(s)
        </div>
      </div>
    </motion.div>
  );
}

function Reports() {
  const [intlData, setIntlData] = useState([]);
  const [courierData, setCourierData] = useState([]);

  useEffect(() => {
    setIntlData(JSON.parse(sessionStorage.getItem("logitrack_intl") || "[]"));
    setCourierData(JSON.parse(sessionStorage.getItem("logitrack_courier") || "[]"));
  }, []);

  const all = [...intlData.map(r=>({...r,_shipType:"International"})), ...courierData.map(r=>({...r,_shipType:"Courier"}))];

  // Stats
  const totalShipments = all.length;
  const byEntity = ENTITIES.map(e=>({ entity: e, count: all.filter(r=>r.entity===e).length }));
  const byType = [
    { label: "International", count: intlData.length },
    { label: "Air Courier", count: courierData.length },
  ];
  const paymentSummary = PAYMENT_STATUS.map(s=>({ status: s, count: all.filter(r=>r.paymentStatus===s).length }));
  const avgTatTarget = all.filter(r=>r.tatTarget!=="").reduce((a,r)=>a+(Number(r.tatTarget)||0), 0) / (all.filter(r=>r.tatTarget!=="").length||1);
  const avgTatActual = all.filter(r=>r.tatActual!=="").reduce((a,r)=>a+(Number(r.tatActual)||0), 0) / (all.filter(r=>r.tatActual!=="").length||1);

  const StatCard = ({ label, value, sub, color = theme.primary }) => (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(27,79,114,0.13)" }}
      style={{ ...styles.card, marginBottom: 0, flex: 1, minWidth: 160 }}
    >
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: theme.textSub, marginTop: 2 }}>{sub}</div>}
    </motion.div>
  );

  const BarRow = ({ label, value, max, color = theme.primary }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: theme.text, fontWeight: 500 }}>{label}</span>
        <span style={{ color: theme.textSub }}>{value}</span>
      </div>
      <div style={{ height: 8, background: theme.border, borderRadius: 4, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: max ? `${(value/max)*100}%` : "0%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", background: color, borderRadius: 4 }}
        />
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.primary, margin: 0 }}>📈 Reports & Analytics</h1>
        <p style={{ color: theme.textSub, marginTop: 6, fontSize: 14 }}>
          Summary of session data. Connect Google Sheets for persistent analytics.
        </p>
      </div>

      {totalShipments === 0 ? (
        <div style={{ ...styles.card, textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: theme.textSub }}>No data yet</div>
          <div style={{ fontSize: 13, color: theme.textLight, marginTop: 6 }}>Submit shipments to see reports here</div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <StatCard label="Total Shipments" value={totalShipments} />
            <StatCard label="International" value={intlData.length} color={theme.primaryLight} />
            <StatCard label="Air Courier" value={courierData.length} color={theme.accent} />
            <StatCard label="Avg TAT Target" value={`${avgTatTarget.toFixed(1)}d`} sub="days" color={theme.success} />
            <StatCard label="Avg TAT Actual" value={`${avgTatActual.toFixed(1)}d`} sub="days" color={theme.danger} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            {/* By Entity */}
            <div style={styles.card}>
              <div style={{ fontWeight: 700, fontSize: 15, color: theme.primary, marginBottom: 16 }}>Shipments by Entity</div>
              {byEntity.map((e) => (
                <BarRow key={e.entity} label={e.entity} value={e.count} max={Math.max(...byEntity.map(x=>x.count),1)} color={theme.primary} />
              ))}
            </div>

            {/* Payment Status */}
            <div style={styles.card}>
              <div style={{ fontWeight: 700, fontSize: 15, color: theme.primary, marginBottom: 16 }}>Payment Status</div>
              {paymentSummary.map((p) => (
                <BarRow key={p.status} label={p.status} value={p.count} max={Math.max(...paymentSummary.map(x=>x.count),1)}
                  color={p.status==="Paid"?theme.success:p.status==="Pending"?theme.accent:p.status==="On Hold"?theme.danger:theme.primaryLight}
                />
              ))}
            </div>
          </div>

          {/* Recent Shipments Table */}
          <div style={styles.card}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.primary, marginBottom: 16 }}>Recent Shipments</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: theme.surfaceAlt }}>
                    {["Type","Shipment ID","Entity","Shipper","Country","ETD","ETA","TAT Target","TAT Actual","Payment"].map(h => (
                      <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: theme.textSub, fontWeight: 600, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: `1.5px solid ${theme.border}`, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {all.slice(-20).reverse().map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${theme.border}`, background: i%2===0?"#fff":"#FAFCFF" }}>
                      {[r._shipType||"—",r.shipmentId||"—",r.entity||"—",r.shipper||"—",r.countryName||"—",r.etd||"—",r.eta||"—",
                        r.tatTarget!==""?`${r.tatTarget}d`:"—",r.tatActual!==""?`${r.tatActual}d`:"—"].map((v,j)=>(
                        <td key={j} style={{ padding: "8px 12px", color: theme.text, whiteSpace: "nowrap" }}>{v}</td>
                      ))}
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{
                          ...styles.tag,
                          background: r.paymentStatus==="Paid"?"#D5F5E3":r.paymentStatus==="Pending"?"#FEF9E7":"#EBF5FB",
                          color: r.paymentStatus==="Paid"?"#1E8449":r.paymentStatus==="Pending"?"#9A7D0A":"#1A5276",
                        }}>{r.paymentStatus||"—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

function Dashboard({ setPage }) {
  const intlCount = JSON.parse(sessionStorage.getItem("logitrack_intl")||"[]").length;
  const courierCount = JSON.parse(sessionStorage.getItem("logitrack_courier")||"[]").length;

  const cards = [
    { icon: "✈️", title: "International Shipment", desc: "Log full international freight with BOE, duties & customs", page: "intl-form", color: theme.primary },
    { icon: "📦", title: "Air Courier", desc: "Quick entry for courier & express shipments", page: "courier-form", color: "#1A5276" },
    { icon: "🗂️", title: "Intl Records", desc: `${intlCount} session record(s)`, page: "intl-records", color: theme.primaryLight },
    { icon: "📋", title: "Courier Records", desc: `${courierCount} session record(s)`, page: "courier-records", color: "#2471A3" },
    { icon: "📈", title: "Reports", desc: "Analytics & shipment summary", page: "reports", color: theme.accent },
    { icon: "📊", title: "Open Google Sheet", desc: "View & edit the source spreadsheet", page: null, color: theme.success, external: `https://docs.google.com/spreadsheets/d/${SHEET_ID}` },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 32 }}>
        <motion.h1
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 28, fontWeight: 800, color: theme.primary, margin: 0 }}
        >
          🚢 LogiTrack Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ color: theme.textSub, marginTop: 8, fontSize: 14 }}
        >
          Global logistics tracking system — International Shipments & Air Courier
        </motion.p>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ ...styles.card, background: "#EBF5FB", border: "1px solid #AED6F1", marginBottom: 28 }}
      >
        <div style={{ fontSize: 13, color: "#1A5276", fontWeight: 500 }}>
          <strong>📌 Google Sheets Integration:</strong> This app reads from and writes to your Google Sheet.
          Data entered in session is stored locally. To enable full cloud sync, deploy a Google Apps Script web app and update the <code>APPS_SCRIPT_URL</code> constant in the code.
          {" "}<a href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}`} target="_blank" rel="noreferrer" style={{ color: theme.primary, fontWeight: 700 }}>Open Sheet ↗</a>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        {[
          { label: "Intl Shipments", value: intlCount, icon: "✈️" },
          { label: "Courier Shipments", value: courierCount, icon: "📦" },
          { label: "Total Records", value: intlCount + courierCount, icon: "📊" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
            style={{ ...styles.card, marginBottom: 0, flex: 1, minWidth: 140, textAlign: "center" }}
          >
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: theme.primary, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: theme.textSub, marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Nav Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
            whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(27,79,114,0.14)" }}
            onClick={() => c.external ? window.open(c.external, "_blank") : setPage(c.page)}
            style={{ ...styles.card, cursor: "pointer", marginBottom: 0, borderTop: `4px solid ${c.color}` }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.text, marginBottom: 6 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: theme.textSub }}>{c.desc}</div>
            <div style={{ marginTop: 14, fontSize: 12, fontWeight: 600, color: c.color }}>
              {c.external ? "Open ↗" : "Go →"}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard setPage={setPage} />;
      case "intl-form": return <ShipmentForm type="intl" />;
      case "courier-form": return <ShipmentForm type="courier" />;
      case "intl-records": return <RecordsTable type="intl" />;
      case "courier-records": return <RecordsTable type="courier" />;
      case "reports": return <Reports />;
      default: return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <div style={styles.app}>
      <Sidebar page={page} setPage={setPage} />
      <main style={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
