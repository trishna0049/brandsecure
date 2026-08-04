"use client";
import { useState, useEffect, useRef } from "react";
import API from "@/lib/api";
import { PasswordInput } from "./common";

// ─── THEME & GLOBAL STYLES ───────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0A0A0F;
      --ink2: #1A1A2E;
      --surface: #F4F3EE;
      --surface2: #ECEAE0;
      --surface3: #E0DDD4;
      --white: #FFFFFF;
      --accent: #E8500A;
      --accent2: #FF7A3D;
      --gold: #C9A84C;
      --teal: #00897B;
      --sky: #2979C8;
      --red: #D32F2F;
      --green: #2E7D32;
      --amber: #E65100;
      --purple: #5E35B1;
      --border: rgba(10,10,15,0.10);
      --border2: rgba(10,10,15,0.06);
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
      --shadow: 0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.07);
      --shadow-lg: 0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08);
      --r: 14px;
      --r-sm: 8px;
      --r-lg: 22px;
      --ff-head: 'Syne', sans-serif;
      --ff-body: 'DM Sans', sans-serif;
    }

    html, body, #root {
      height: 100%; background: var(--surface); color: var(--ink);
      font-family: var(--ff-body); font-size: 15px; line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--surface2); }
    ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 10px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideRight {
      from { transform: translateX(-20px); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes progressFill {
      from { width: 0%; }
      to   { width: var(--target-width); }
    }
    @keyframes countUp {
      from { opacity: 0; transform: scale(0.8); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes ripple {
      from { transform: scale(0); opacity: 0.6; }
      to   { transform: scale(2.5); opacity: 0; }
    }

    .anim-fadeUp  { animation: fadeUp 0.5s ease forwards; }
    .anim-fadeIn  { animation: fadeIn 0.4s ease forwards; }
    .anim-slide   { animation: slideRight 0.4s ease forwards; }
    .anim-float   { animation: float 3s ease-in-out infinite; }

    button { cursor: pointer; font-family: var(--ff-body); }
    input, textarea, select { font-family: var(--ff-body); }

    /* Scrollable containers */
    .scroll-y { overflow-y: auto; }
  `}</style>
);

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    shield: <><path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5l-8-3z"/></>,
    home: <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H14v-6h-4v6H4a1 1 0 01-1-1V9.5z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    bot: <><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h1M15 15h1"/></>,
    task: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6"/></>,
    chevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    chevronLeft: <><polyline points="15 18 9 12 15 6"/></>,
    alertTriangle: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    fileText: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    trendingUp: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/><line x1="4" y1="6" x2="9" y2="6"/><line x1="4" y1="10" x2="9" y2="10"/><line x1="4" y1="14" x2="9" y2="14"/></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    sparkles: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z"/><path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STAGE_TASKS = {
  "pre-idea": [
    { title: "Choose Business Structure", category: "Formation", risk: "high", daysFromNow: 30, desc: "Decide between sole proprietorship, LLC, or corporation before any formal steps." },
    { title: "Conduct IP & Name Search", category: "Trademark", risk: "medium", daysFromNow: 14, desc: "Verify your business name is available for trademark registration." },
    { title: "Draft NDA for Co-founders", category: "Agreements", risk: "medium", daysFromNow: 7, desc: "Protect confidential business ideas when discussing with potential partners." },
  ],
  "ideation": [
    { title: "Draft Founders' Agreement", category: "Formation", risk: "high", daysFromNow: 14, desc: "Formalize equity split, roles, and vesting schedule between co-founders." },
    { title: "File Trademark Application", category: "Trademark", risk: "high", daysFromNow: 21, desc: "Protect your brand name and logo early before competitors can." },
    { title: "Obtain DSC & DIN", category: "Registration", risk: "medium", daysFromNow: 10, desc: "Digital Signature Certificate and Director Identification Number required for incorporation." },
    { title: "Draft IP Assignment Agreement", category: "Agreements", risk: "medium", daysFromNow: 14, desc: "Ensure all IP created by founders is assigned to the company." },
  ],
  "pre-revenue": [
    { title: "Incorporate Company (Pvt. Ltd.)", category: "Registration", risk: "high", daysFromNow: 21, desc: "Register as a Private Limited Company with MCA for legal entity status." },
    { title: "Apply for PAN & TAN", category: "Tax", risk: "high", daysFromNow: 14, desc: "Required for tax filings and TDS deductions once incorporated." },
    { title: "Open Business Bank Account", category: "Finance", risk: "high", daysFromNow: 7, desc: "Separate business account required for financial compliance and auditing." },
    { title: "File GST Registration", category: "Tax", risk: "high", daysFromNow: 30, desc: "Mandatory if projected revenue exceeds ₹20L/year or operating in specific sectors." },
    { title: "Draft Employee Offer Letters", category: "HR", risk: "medium", daysFromNow: 10, desc: "Standardized offer letters protect against disputes and ensure legal compliance." },
    { title: "Trademark Class Selection", category: "Trademark", risk: "medium", daysFromNow: 21, desc: "File trademark under the correct class to maximize protection scope." },
    { title: "Draft Privacy Policy & ToS", category: "Compliance", risk: "medium", daysFromNow: 30, desc: "Mandatory for any digital product under IT Act 2000 and GDPR if serving EU users." },
  ],
  "early-revenue": [
    { title: "GST Return Filing (GSTR-1)", category: "Tax", risk: "high", daysFromNow: 11, desc: "Monthly/quarterly sales return — mandatory for all GST-registered businesses." },
    { title: "GST Return Filing (GSTR-3B)", category: "Tax", risk: "high", daysFromNow: 20, desc: "Monthly summary return with tax payment details." },
    { title: "TDS Compliance", category: "Tax", risk: "high", daysFromNow: 7, desc: "Deduct and deposit TDS on employee salaries and contractor payments." },
    { title: "Startup India Registration", category: "Registration", risk: "low", daysFromNow: 45, desc: "Get DPIIT recognition for tax benefits and easier fundraising." },
    { title: "Auditor Appointment", category: "Finance", risk: "medium", daysFromNow: 30, desc: "Appoint a CA firm as statutory auditor within 30 days of incorporation." },
    { title: "Employee PF/ESI Registration", category: "HR", risk: "high", daysFromNow: 30, desc: "Mandatory when headcount exceeds 20 employees." },
    { title: "Annual MCA Filing (AOC-4)", category: "Compliance", risk: "high", daysFromNow: 180, desc: "File financial statements with Ministry of Corporate Affairs annually." },
    { title: "MSME Registration (Udyam)", category: "Registration", risk: "low", daysFromNow: 60, desc: "Unlock government schemes, subsidies, and priority lending." },
  ],
  "growth": [
    { title: "ROC Annual Return (MGT-7)", category: "Compliance", risk: "high", daysFromNow: 60, desc: "Annual return to ROC — non-compliance attracts heavy penalties." },
    { title: "Transfer Pricing Documentation", category: "Tax", risk: "high", daysFromNow: 90, desc: "Required if receiving foreign investment or making cross-border transactions." },
    { title: "ESOP Policy Drafting", category: "HR", risk: "medium", daysFromNow: 45, desc: "Create a formal ESOP plan compliant with Companies Act 2013." },
    { title: "Board Resolution for Fundraising", category: "Finance", risk: "high", daysFromNow: 14, desc: "Pass board resolution before issuing new shares or accepting investment." },
    { title: "Shareholder Agreement (SHA)", category: "Agreements", risk: "high", daysFromNow: 21, desc: "Govern rights and obligations of shareholders during fundraise." },
    { title: "Due Diligence Data Room Setup", category: "Finance", risk: "medium", daysFromNow: 30, desc: "Organize all corporate docs, financials, and IP for investor review." },
    { title: "Data Protection Audit", category: "Compliance", risk: "medium", daysFromNow: 45, desc: "Ensure PDPB 2023 compliance for handling user data at scale." },
  ],
};

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    type: "select",
    question: "What best describes where your startup is right now?",
    options: [
      { value: "pre-idea", label: "Still Exploring", desc: "I have a general interest but no specific idea yet" },
      { value: "ideation", label: "Ideation Stage", desc: "I have an idea and I'm validating it with research" },
      { value: "pre-revenue", label: "Building Stage", desc: "I'm building the product, no revenue yet" },
      { value: "early-revenue", label: "Early Revenue", desc: "I have paying customers but under ₹50L ARR" },
      { value: "growth", label: "Growth Stage", desc: "Scaling with significant revenue and/or investors" },
    ],
  },
  {
    id: "q2",
    type: "select",
    question: "Is your company legally incorporated?",
    options: [
      { value: "no", label: "Not Registered Yet", desc: "We haven't formally registered" },
      { value: "sole", label: "Sole Proprietorship", desc: "Running as an individual" },
      { value: "llp", label: "LLP", desc: "Limited Liability Partnership" },
      { value: "pvt", label: "Pvt. Ltd.", desc: "Private Limited Company" },
    ],
  },
  {
    id: "q3",
    type: "select",
    question: "What's your team size?",
    options: [
      { value: "solo", label: "Solo Founder", desc: "Just me!" },
      { value: "small", label: "2–5 people", desc: "Small founding team" },
      { value: "medium", label: "6–20 people", desc: "Growing team" },
      { value: "large", label: "20+ people", desc: "Significant headcount" },
    ],
  },
  {
    id: "q4",
    type: "select",
    question: "Have you raised external funding?",
    options: [
      { value: "none", label: "Bootstrapped", desc: "Self-funded only" },
      { value: "friends", label: "Friends & Family", desc: "Informal investment rounds" },
      { value: "angel", label: "Angel / Pre-seed", desc: "Received angel investment" },
      { value: "vc", label: "Seed / Series A+", desc: "Institutional venture capital" },
    ],
  },
  {
    id: "q5",
    type: "select",
    question: "When did you start working on your startup?",
    options: [
      { value: "lt-1m", label: "Less than 1 month ago", desc: "Just getting started" },
      { value: "1-3m", label: "1–3 months ago", desc: "Early days" },
      { value: "3-6m", label: "3–6 months ago", desc: "Gaining momentum" },
      { value: "6-12m", label: "6–12 months ago", desc: "Established routine" },
      { value: "gt-1y", label: "More than 1 year ago", desc: "Long-running effort" },
    ],
  },
  {
    id: "registerDate",
    type: "date",
    question: "When was your business registered?",
    sub: "Select the official date of incorporation or registration.",
    visible: (a) => a.q2 !== "no",
  },
  {
    id: "state",
    type: "state",
    question: "Which state does your startup primarily operate in?",
    sub: "Search for your state or union territory.",
  },
  {
    id: "industry",
    type: "select",
    question: "Which industry best describes your startup?",
    options: [
      { value: "saas", label: "SaaS / Software" },
      { value: "ai", label: "AI / Machine Learning" },
      { value: "fintech", label: "FinTech" },
      { value: "healthtech", label: "HealthTech" },
      { value: "edtech", label: "EdTech" },
      { value: "ecommerce", label: "E-commerce" },
      { value: "marketplace", label: "Marketplace" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "food-beverage", label: "Food & Beverage" },
      { value: "consulting", label: "Consulting / Services" },
      { value: "media", label: "Media & Content" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "assets",
    type: "multi",
    question: "Which of the following do you already have?",
    sub: "Select all that apply.",
    options: [
      { value: "pan", label: "PAN" },
      { value: "tan", label: "TAN" },
      { value: "gst", label: "GST Registration" },
      { value: "udyam", label: "UDYAM / MSME Registration" },
      { value: "startup-india", label: "Startup India Recognition" },
      { value: "trademark", label: "Trademark Registration" },
      { value: "bank", label: "Business Current Account" },
      { value: "none", label: "None of the Above" },
    ],
  },
  {
    id: "goal",
    type: "select",
    question: "What is your primary goal right now?",
    options: [
      { value: "register", label: "Register my business" },
      { value: "compliance", label: "Complete legal compliances" },
      { value: "launch", label: "Launch my product" },
      { value: "funding", label: "Raise funding" },
      { value: "brand", label: "Protect my brand" },
      { value: "hire", label: "Hire employees" },
      { value: "stay-compliant", label: "Stay compliant" },
    ],
  },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const STAGE_LABELS = {
  "pre-idea": { label: "Exploring", color: "#5E35B1", bg: "#EDE7F6", icon: "star" },
  "ideation": { label: "Ideation", color: "#00838F", bg: "#E0F7FA", icon: "sparkles" },
  "pre-revenue": { label: "Pre-Revenue", color: "#E65100", bg: "#FFF3E0", icon: "layers" },
  "early-revenue": { label: "Early Revenue", color: "#2E7D32", bg: "#E8F5E9", icon: "trendingUp" },
  "growth": { label: "Growth Stage", color: "#C9A84C", bg: "#FFF8E1", icon: "award" },
};

const RISK_CONFIG = {
  high:   { color: "#D32F2F", bg: "#FFEBEE", label: "High Risk" },
  medium: { color: "#E65100", bg: "#FFF3E0", label: "Medium Risk" },
  low:    { color: "#2E7D32", bg: "#E8F5E9", label: "Low Risk" },
};

const AI_EXAMPLES = [
  "TRADEMARK OBJECTION NOTICE - Case No. TM/2024/001234\n\nThis is to inform you that a trademark objection has been raised against your application for the mark 'BRANDIFY' under Class 42 for software services. The examiner has raised an objection on the grounds of similarity with existing mark 'BRANDIF' registered under the same class...",
  "NOTICE OF GST DEMAND - Reference: GST/2024/KA/8821\n\nYour company has been identified for non-compliance with GST Return filing obligations for the quarters ending March 2024 and June 2024. The total demand including tax, interest, and penalty amounts to ₹2,45,000...",
  "SHAREHOLDERS AGREEMENT CLAUSE 8.2\n\nDrag-Along Rights: In the event that holders of at least sixty percent (60%) of the outstanding shares agree to sell their shares to a third party, such selling shareholders shall have the right to require all other shareholders to sell their shares on the same terms and conditions...",
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const Btn = ({ children, variant = "primary", onClick, style = {}, icon, size = "md", disabled }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 7, border: "none",
    borderRadius: "var(--r-sm)", fontFamily: "var(--ff-body)", fontWeight: 600,
    transition: "all 0.18s", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    ...(size === "sm" ? { padding: "7px 14px", fontSize: 13 } :
        size === "lg" ? { padding: "13px 26px", fontSize: 15.5 } :
                        { padding: "10px 20px", fontSize: 14.5 }),
  };
  const variants = {
    primary: { background: "var(--ink)", color: "#fff" },
    accent:  { background: "var(--accent)", color: "#fff" },
    ghost:   { background: "transparent", color: "var(--ink)", border: "1.5px solid var(--border)" },
    soft:    { background: "var(--surface2)", color: "var(--ink)" },
    danger:  { background: "#FFEBEE", color: "#D32F2F" },
    teal:    { background: "#E0F2F1", color: "#00695C" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(0.92)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; }}>
      {icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};

const Badge = ({ risk }) => {
  const c = RISK_CONFIG[risk];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px",
      borderRadius: 20, background: c.bg, color: c.color,
      fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />
      {c.label}
    </span>
  );
};

const Card = ({ children, style = {}, hover = true }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => hover && setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: "var(--r)", border: "1.5px solid var(--border2)",
        boxShadow: hov ? "var(--shadow)" : "var(--shadow-sm)",
        transition: "box-shadow 0.2s, transform 0.2s",
        transform: hov ? "translateY(-1px)" : "none",
        ...style,
      }}>
      {children}
    </div>
  );
};

const ProgressRing = ({ pct, size = 80, stroke = 7 }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;
  const color = pct >= 75 ? "#2E7D32" : pct >= 40 ? "#E65100" : "#D32F2F";
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0EEE8" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ fontSize: size * 0.22, fontWeight: 700, fontFamily: "var(--ff-head)", fill: color }}>
        {pct}%
      </text>
    </svg>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const PAGES = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "tasks",     label: "My Tasks",  icon: "task" },
  { id: "ai",        label: "AI Assistant", icon: "bot" },
  { id: "profile",   label: "Profile",   icon: "user" },
];

const Sidebar = ({ page, setPage, stage, onLogout }) => {
  const stageInfo = STAGE_LABELS[stage] || STAGE_LABELS["pre-revenue"];
  return (
    <aside style={{
      width: 256, height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 100,
      background: "var(--ink)", display: "flex", flexDirection: "column",
      padding: "28px 0 24px",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 22px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", minWidth: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Icon name="shield" size={20} color="#fff" />
          </div>
          <span style={{
            fontFamily: "var(--ff-head)", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: -0.5,
            minWidth: 0, whiteSpace: "nowrap",
          }}>
            Brand<span style={{ color: "var(--accent)" }}>Secure</span>
          </span>
        </div>
      </div>

      {/* Stage badge */}
      <div style={{ padding: "14px 22px 18px" }}>
        <div style={{
          background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: stageInfo.color, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Your Stage</div>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{stageInfo.label}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 10px" }}>
        {PAGES.map(p => (
          <button key={p.id} onClick={() => setPage(p.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 11,
              padding: "10px 12px", borderRadius: 10, border: "none",
              background: page === p.id ? "rgba(232,80,10,0.2)" : "transparent",
              color: page === p.id ? "var(--accent2)" : "rgba(255,255,255,0.55)",
              fontFamily: "var(--ff-body)", fontWeight: page === p.id ? 600 : 400,
              fontSize: 14, marginBottom: 2, cursor: "pointer",
              transition: "all 0.15s",
              borderLeft: page === p.id ? "3px solid var(--accent)" : "3px solid transparent",
            }}
            onMouseEnter={e => { if (page !== p.id) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            onMouseLeave={e => { if (page !== p.id) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
            <Icon name={p.icon} size={17} />
            {p.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0 10px" }}>
        <button onClick={onLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 11,
            padding: "10px 12px", borderRadius: 10, border: "none",
            background: "transparent", color: "rgba(255,255,255,0.35)",
            fontFamily: "var(--ff-body)", fontSize: 13, cursor: "pointer",
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
          <Icon name="logout" size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const Topbar = ({ title, subtitle, tasks }) => {
  const pending = tasks.filter(t => !t.completed && new Date(t.deadline) < new Date(Date.now() + 7 * 86400000)).length;
  return (
    <header style={{
      height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", background: "#fff", borderBottom: "1.5px solid var(--border2)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div>
        <h1 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 20, letterSpacing: -0.4 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12.5, color: "#888", marginTop: -1 }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Icon name="bell" size={20} color="#666" />
          {pending > 0 && (
            <span style={{
              position: "absolute", top: -5, right: -5, width: 16, height: 16,
              borderRadius: "50%", background: "var(--accent)", color: "#fff",
              fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{pending}</span>
          )}
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: "var(--ink2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>F</span>
        </div>
      </div>
    </header>
  );
};

// ─── ONBOARDING QUIZ ──────────────────────────────────────────────────────────
const Quiz = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);

  const visible = QUIZ_QUESTIONS.filter(qq => (typeof qq.visible === "function" ? qq.visible(answers) : true));
  const q = visible[step];
  const total = Math.max(visible.length, 1);
  const progress = ((step + 1) / total) * 100;

  const isReady = (qq, ans) => {
    const v = ans[qq.id];
    if (qq.type === "multi") return Array.isArray(v) && v.length > 0;
    return v !== undefined && v !== null && v !== "";
  };

  const choose = (id, val) => {
    setAnswers(a => ({ ...a, [id]: val }));
  };

  const toggleMulti = (id, val) => {
    setAnswers(a => {
      const cur = a[id] ? [...a[id]] : [];
      if (val === "none") {
        return { ...a, [id]: cur.includes("none") ? [] : ["none"] };
      }
      let arr = cur.filter(v => v !== "none");
      arr = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
      return { ...a, [id]: arr };
    });
  };

  const goNext = () => {
    if (!isReady(q, answers)) return;
    if (step < visible.length - 1) {
      setStep(step + 1);
      setSearch("");
      setShowList(false);
    } else {
      onComplete(answers);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setSearch("");
      setShowList(false);
    }
  };

  const selected = answers[q.id];
  const filteredStates = INDIAN_STATES.filter(s => s.toLowerCase().includes(search.toLowerCase()));
  const stateDisplay = search !== "" ? search : (selected || "");
  const todayStr = new Date().toISOString().split("T")[0];
  const isFirst = step === 0;
  const ready = isReady(q, answers);

  const optionBtn = (opt) => {
    const multi = q.type === "multi";
    const on = multi ? (selected || []).includes(opt.value) : selected === opt.value;
    return (
      <button key={opt.value} className="quiz-opt"
        onClick={() => multi ? toggleMulti(q.id, opt.value) : choose(q.id, opt.value)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 16px", border: "1.5px solid rgba(255,255,255,0.1)",
          borderRadius: 12, background: on ? "rgba(232,80,10,0.15)" : "rgba(255,255,255,0.04)",
          cursor: "pointer", transition: "all 0.18s", textAlign: "left",
          borderColor: on ? "var(--accent)" : undefined,
        }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{opt.desc}</div>}
        </div>
        {on
          ? <Icon name="check" size={16} color="#E8500A" />
          : <Icon name={multi ? "plus" : "chevronRight"} size={16} color="rgba(255,255,255,0.35)" />}
      </button>
    );
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <style>{`
        .quiz-opt:hover { transform: translateX(4px); border-color: var(--accent) !important; }
        .qz-input {
          width: 100%; padding: 13px 16px; border-radius: 12; border: 1.5px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.05); color: #fff; font-size: 14.5; font-family: var(--ff-body);
          outline: none; transition: all 0.18s;
        }
        .qz-input:focus { border-color: var(--accent); }
        .qz-input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; cursor: pointer; }
        .qz-state-list { max-height: 220px; overflow-y: auto; margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
        .qz-state-list::-webkit-scrollbar { width: 5px; }
        .qz-state-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="shield" size={22} color="#fff" />
        </div>
        <span style={{ fontFamily: "var(--ff-head)", fontWeight: 800, fontSize: 22, color: "#fff" }}>
          Brand<span style={{ color: "var(--accent)" }}>Secure</span>
        </span>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 560, background: "rgba(255,255,255,0.04)",
        border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: "36px 36px 28px",
        animation: "fadeUp 0.4s ease",
      }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--accent)", borderRadius: 10, transition: "width 0.4s ease" }} />
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
            {step + 1} / {total}
          </span>
        </div>

        <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>
          {q.question}
        </h2>
        {q.sub && (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>{q.sub}</p>
        )}

        <div key={q.id} style={{ animation: "fadeIn 0.25s ease" }}>
          {q.type === "select" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map(optionBtn)}
            </div>
          )}

          {q.type === "multi" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map(optionBtn)}
            </div>
          )}

          {q.type === "state" && (
            <div style={{ position: "relative" }}>
              <input
                className="qz-input"
                value={stateDisplay}
                placeholder="Type to search your state..."
                onFocus={() => setShowList(true)}
                onChange={(e) => { setSearch(e.target.value); setShowList(true); }}
                onBlur={() => setTimeout(() => setShowList(false), 150)}
              />
              {selected && (
                <div style={{ fontSize: 12.5, color: "var(--accent2)", marginTop: 8 }}>
                  Selected: {selected}
                </div>
              )}
              {showList && (
                <div className="qz-state-list">
                  {filteredStates.length === 0 && (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", padding: "10px 4px" }}>
                      No matching state found.
                    </div>
                  )}
                  {filteredStates.map(s => (
                    <button key={s} className="quiz-opt"
                      onMouseDown={(e) => { e.preventDefault(); choose(q.id, s); setSearch(s); setShowList(false); }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "11px 14px", border: "1.5px solid rgba(255,255,255,0.1)",
                        borderRadius: 10, background: selected === s ? "rgba(232,80,10,0.15)" : "rgba(255,255,255,0.04)",
                        cursor: "pointer", transition: "all 0.18s", textAlign: "left", color: "#fff", fontSize: 14,
                        borderColor: selected === s ? "var(--accent)" : undefined,
                      }}>
                      <span>{s}</span>
                      {selected === s && <Icon name="check" size={15} color="#E8500A" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {q.type === "date" && (
            <div>
              <input
                type="date"
                className="qz-input"
                value={selected || ""}
                max={todayStr}
                onChange={(e) => choose(q.id, e.target.value)}
              />
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
                You can change this later at any time.
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 26 }}>
          {!isFirst && (
            <button onClick={goBack} style={{
              padding: "10px 18px", background: "transparent", color: "rgba(255,255,255,0.6)",
              border: "1.5px solid rgba(255,255,255,0.14)", borderRadius: 10, fontSize: 13.5,
              fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
            }}>
              Back
            </button>
          )}
          <button onClick={goNext} disabled={!ready} style={{
            flex: 1, padding: "12px 18px", background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 700, cursor: "pointer",
            opacity: ready ? 1 : 0.45, transition: "all 0.18s",
          }}>
            {step === visible.length - 1 ? "Finish →" : "Continue →"}
          </button>
        </div>
      </div>

      <p style={{ marginTop: 18, fontSize: 12.5, color: "rgba(255,255,255,0.3)" }}>
        This helps us personalize your compliance roadmap
      </p>
    </div>
  );
};

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const Dashboard = ({ tasks, setTasks, stage, setPage }) => {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;
  const overdue   = tasks.filter(t => !t.completed && new Date(t.deadline) < new Date()).length;
  const score     = total === 0 ? 0 : Math.round((completed / total) * 100);

  const upcoming = [...tasks].filter(t => !t.completed)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const byCategory = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || { total: 0, done: 0 });
    acc[t.category].total++;
    if (t.completed) acc[t.category].done++;
    return acc;
  }, {});

  const riskCounts = {
    high: tasks.filter(t => t.risk === "high" && !t.completed).length,
    medium: tasks.filter(t => t.risk === "medium" && !t.completed).length,
    low: tasks.filter(t => t.risk === "low" && !t.completed).length,
  };

  const stageInfo = STAGE_LABELS[stage];
  const delaysInDays = (deadline) => {
    const d = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    if (d < 0) return { text: `${Math.abs(d)}d overdue`, color: "#D32F2F" };
    if (d === 0) return { text: "Due today", color: "#E65100" };
    if (d <= 7) return { text: `${d}d left`, color: "#E65100" };
    return { text: `${d}d left`, color: "#2E7D32" };
  };

  const statCards = [
    { label: "Compliance Score", value: score + "%", icon: "award", color: "var(--teal)", bg: "#E0F2F1" },
    { label: "Total Tasks", value: total, icon: "task", color: "var(--sky)", bg: "#E3F2FD" },
    { label: "Completed", value: completed, icon: "check", color: "#2E7D32", bg: "#E8F5E9" },
    { label: "Overdue", value: overdue, icon: "alertTriangle", color: "#D32F2F", bg: "#FFEBEE" },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1080, margin: "0 auto" }}>

      {/* Stage Banner */}
      <div style={{
        background: `linear-gradient(135deg, var(--ink), var(--ink2))`,
        borderRadius: "var(--r-lg)", padding: "22px 28px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        animation: "fadeUp 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: stageInfo.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={stageInfo.icon} size={24} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 1 }}>Your Startup Stage</p>
            <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 20, fontWeight: 700, color: "#fff" }}>{stageInfo.label}</h2>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <ProgressRing pct={score} size={72} stroke={6} />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Compliance Score</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <Card key={i} style={{ padding: "18px 20px", animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={18} color={s.color} />
              </div>
            </div>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 26, fontWeight: 800, color: "var(--ink)" }}>{s.value}</div>
            <div style={{ fontSize: 12.5, color: "#888", marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
        {/* Upcoming Tasks */}
        <Card style={{ padding: 22, animation: "fadeUp 0.4s ease 0.2s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 15 }}>Upcoming Deadlines</h3>
            <Btn variant="ghost" size="sm" onClick={() => setPage("tasks")}>View All</Btn>
          </div>
          {upcoming.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#aaa", fontSize: 13 }}>
              🎉 All tasks completed!
            </div>
          ) : (
            upcoming.map(t => {
              const dl = delaysInDays(t.deadline);
              return (
                <div key={t.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: "1px solid var(--border2)",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                    <div style={{ fontSize: 11.5, color: "#999", marginTop: 1 }}>{t.category}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <Badge risk={t.risk} />
                    <span style={{ fontSize: 12, color: dl.color, fontWeight: 600, whiteSpace: "nowrap" }}>{dl.text}</span>
                  </div>
                </div>
              );
            })
          )}
        </Card>

        {/* Risk Breakdown */}
        <Card style={{ padding: 22, animation: "fadeUp 0.4s ease 0.25s both" }}>
          <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Risk Breakdown (Pending)</h3>
          {["high", "medium", "low"].map(r => {
            const c = RISK_CONFIG[r];
            const count = riskCounts[r];
            const maxVal = Math.max(...Object.values(riskCounts), 1);
            const pct = Math.round((count / maxVal) * 100);
            return (
              <div key={r} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{count} tasks</span>
                </div>
                <div style={{ height: 6, background: "#F0EEE8", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: 10, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 20, borderTop: "1px solid var(--border2)", paddingTop: 16 }}>
            <h4 style={{ fontFamily: "var(--ff-head)", fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#666" }}>By Category</h4>
            {Object.entries(byCategory).slice(0, 4).map(([cat, data]) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, flex: 1, color: "#555" }}>{cat}</span>
                <div style={{ width: 80, height: 4, background: "#F0EEE8", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(data.done / data.total) * 100}%`, background: "var(--teal)", borderRadius: 10 }} />
                </div>
                <span style={{ fontSize: 12, color: "#888", minWidth: 30, textAlign: "right" }}>{data.done}/{data.total}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Action */}
      <Card style={{ padding: "18px 22px", animation: "fadeUp 0.4s ease 0.3s both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="zap" size={20} color="var(--accent)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: 14 }}>Have a legal document to analyze?</p>
            <p style={{ fontSize: 12.5, color: "#888" }}>Paste any legal text and our AI will break it down and generate compliance tasks automatically.</p>
          </div>
          <Btn variant="accent" icon="bot" onClick={() => setPage("ai")}>Open AI Assistant</Btn>
        </div>
      </Card>
    </div>
  );
};

// ─── TASKS PAGE ───────────────────────────────────────────────────────────────
const TasksPage = ({ tasks, setTasks, stage }) => {
  const [filter, setFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [sortBy, setSortBy] = useState("deadline");
  const [editTask, setEditTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", category: "Compliance", risk: "medium", deadline: "", desc: "" });

  const categories = [...new Set(tasks.map(t => t.category))];

  const filtered = tasks
    .filter(t => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    })
    .filter(t => riskFilter === "all" || t.risk === riskFilter)
    .filter(t => catFilter === "all" || t.category === catFilter)
    .sort((a, b) => {
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === "risk") { const r = { high: 0, medium: 1, low: 2 }; return r[a.risk] - r[b.risk]; }
      return a.title.localeCompare(b.title);
    });

  const toggle = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === "Completed" ? "Not Started" : "Completed";
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status: newStatus, completed: newStatus === "Completed" } : t));
    try {
      await API.put(`/api/compliance/${id}`, { status: newStatus });
    } catch (err) {
      alert("Failed to update task");
    }
  };
  const remove = async (id) => {
    try {
      await API.delete(`/api/compliance/${id}`);
      setTasks(ts => ts.filter(t => t.id !== id));
    } catch (err) {
      alert("Failed to delete task");
    }
  };
  const addTask = async () => {
    if (!newTask.title || !newTask.deadline) return;
    try {
      const res = await API.post("/api/compliance", {
        category: newTask.category,
        title: newTask.title,
        deadline: newTask.deadline,
      });
      setTasks(ts => [...ts, taskFromApi(res.data)]);
      setNewTask({ title: "", category: "Compliance", risk: "medium", deadline: "", desc: "" });
      setShowAdd(false);
    } catch (err) {
      alert("Failed to add task");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/api/compliance");
        setTasks((res.data?.data || []).map(taskFromApi));
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    })();
  }, []);

  const inputStyle = {
    width: "100%", padding: "9px 12px", border: "1.5px solid var(--border)",
    borderRadius: "var(--r-sm)", fontFamily: "var(--ff-body)", fontSize: 13.5,
    background: "var(--surface)", outline: "none",
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900, margin: "0 auto" }}>
      {/* Header Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "pending", "completed"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: "1.5px solid",
                borderColor: filter === f ? "var(--ink)" : "var(--border)",
                background: filter === f ? "var(--ink)" : "transparent",
                color: filter === f ? "#fff" : "var(--ink)",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                fontFamily: "var(--ff-body)", textTransform: "capitalize",
                transition: "all 0.15s",
              }}>
              {f === "all" ? `All (${tasks.length})` :
               f === "completed" ? `Done (${tasks.filter(t => t.completed).length})` :
               `Pending (${tasks.filter(t => !t.completed).length})`}
            </button>
          ))}
        </div>
        <Btn variant="accent" icon="plus" onClick={() => setShowAdd(true)}>Add Task</Btn>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
          style={{ ...inputStyle, width: "auto", padding: "6px 10px" }}>
          <option value="all">All Risks</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ ...inputStyle, width: "auto", padding: "6px 10px" }}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ ...inputStyle, width: "auto", padding: "6px 10px" }}>
          <option value="deadline">Sort: Deadline</option>
          <option value="risk">Sort: Risk</option>
          <option value="title">Sort: Name</option>
        </select>
      </div>

      {/* Add Task Modal */}
      {showAdd && (
        <Card style={{ padding: 22, marginBottom: 18, border: "1.5px solid var(--accent)", animation: "fadeUp 0.3s ease" }}>
          <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>
            Add New Compliance Task
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Task Title *</label>
              <input style={inputStyle} placeholder="e.g. File GSTR-1 Return"
                value={newTask.title} onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Category</label>
              <select style={inputStyle} value={newTask.category} onChange={e => setNewTask(n => ({ ...n, category: e.target.value }))}>
                {["Tax", "Registration", "Compliance", "Trademark", "HR", "Finance", "Agreements", "Formation"].map(c =>
                  <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Risk Level</label>
              <select style={inputStyle} value={newTask.risk} onChange={e => setNewTask(n => ({ ...n, risk: e.target.value }))}>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Deadline *</label>
              <input type="date" style={inputStyle} value={newTask.deadline}
                onChange={e => setNewTask(n => ({ ...n, deadline: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Description</label>
              <input style={inputStyle} placeholder="Brief description..."
                value={newTask.desc} onChange={e => setNewTask(n => ({ ...n, desc: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="accent" onClick={addTask} icon="plus">Add Task</Btn>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "50px 0", color: "#aaa" }}>
            <Icon name="task" size={40} color="#ddd" />
            <p style={{ marginTop: 10, fontSize: 14 }}>No tasks match your filters.</p>
          </div>
        )}
        {filtered.map((t, i) => {
          const daysLeft = Math.ceil((new Date(t.deadline) - new Date()) / 86400000);
          const isOverdue = daysLeft < 0 && !t.completed;
          return (
            <Card key={t.id} style={{
              padding: "16px 20px",
              animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
              opacity: t.completed ? 0.65 : 1,
              borderLeft: isOverdue ? "3px solid #D32F2F" : t.completed ? "3px solid #2E7D32" : "3px solid transparent",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                {/* Checkbox */}
                <button onClick={() => toggle(t.id)}
                  style={{
                    width: 22, height: 22, borderRadius: 6, border: `2px solid ${t.completed ? "#2E7D32" : "#CCC"}`,
                    background: t.completed ? "#2E7D32" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, marginTop: 1, transition: "all 0.15s",
                  }}>
                  {t.completed && <Icon name="check" size={13} color="#fff" />}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 14.5, textDecoration: t.completed ? "line-through" : "none" }}>
                      {t.title}
                    </span>
                    <Badge risk={t.risk} />
                    <span style={{
                      background: "var(--surface2)", padding: "2px 8px", borderRadius: 20,
                      fontSize: 11.5, color: "#666",
                    }}>{t.category}</span>
                    {t.aiGenerated && (
                      <span style={{
                        background: "#E8EAF6", padding: "2px 8px", borderRadius: 20,
                        fontSize: 11.5, color: "#5E35B1", display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <Icon name="sparkles" size={10} color="#5E35B1" /> AI
                      </span>
                    )}
                  </div>
                  {t.desc && <p style={{ fontSize: 12.5, color: "#777", marginBottom: 4 }}>{t.desc}</p>}
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: isOverdue ? "#D32F2F" : daysLeft <= 7 ? "#E65100" : "#888" }}>
                      <Icon name="calendar" size={13} />
                      {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `Due: ${new Date(t.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                    </span>
                  </div>
                </div>

                <button onClick={() => remove(t.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, opacity: 0.5 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>
                  <Icon name="trash" size={15} color="#D32F2F" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ─── AI ASSISTANT PAGE (BACKEND CONNECTED & FIXED) ──────────────────────────

const AIPage = ({ tasks, setTasks }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const ACCEPTED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/rtf",
    "application/rtf",
  ];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  };

  const extractFileText = (f) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => resolve("");
      reader.readAsText(f);
    });

  const handleFile = (f) => {
    if (!f) return;
    const isAllowed = [...ACCEPTED_TYPES, "application/octet-stream"].includes(f.type) ||
      /\.(pdf|doc|docx|txt|rtf)$/i.test(f.name);
    if (!isAllowed) {
      setFile(null);
      setFileError("Unsupported file type. Please upload a PDF, Word (.doc/.docx), Text (.txt), or Rich Text (.rtf) file.");
      setResult(null);
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setFile(null);
      setFileError("File is too large. The maximum allowed size is 10 MB.");
      setResult(null);
      return;
    }
    setFile(f);
    setFileError("");
    setResult(null);
  };

  const removeFile = () => {
    setFile(null);
    setFileError("");
    setResult(null);
  };

  const analyze = async () => {
    if (!input.trim() && !file) return;

    setLoading(true);
    setResult(null);
    setAdded(false);
    setError("");
    setFileError("");

    try {
      let legalText = input;
      if (!legalText.trim() && file) {
        legalText = await extractFileText(file);
        if (!legalText.trim()) {
          setError("Unable to read the selected document. Please paste the text manually and try again.");
          setLoading(false);
          return;
        }
      }

      const res = await API.post("/api/ai/simplify", {
        legalText,
      });

      console.log("AI RAW RESPONSE:", res.data);

      // 🔥 FIX: Adapt backend structure to frontend structure
      const data = res.data?.simplifiedOutput;

      if (!data) {
        setError("Invalid AI response format.");
        setLoading(false);
        return;
      }

      setResult({
        summary: data.plainEnglishExplanation,
        whyMatters: data.whyThisMatters,
        risk: data.riskLevel,
        actions: Array.isArray(data.actionSteps)
          ? data.actionSteps.map((step, index) => ({
              title: step,
              desc: "",
              risk: data.riskLevel,
              deadline: null,
            }))
          : [],
      });

    } catch (err) {
      console.error("AI Error:", err);
      setError("Failed to analyze document. Please try again.");
    }

    setLoading(false);
  };

  const addAllTasks = () => {
    if (!result?.actions?.length) return;

    const newTasks = result.actions.map((a) => ({
      id: Date.now() + Math.random(),
      title: a.title,
      desc: a.desc,
      risk: a.risk,
      deadline: a.deadline,
      completed: false,
      aiGenerated: true,
    }));

    setTasks((ts) => [...ts, ...newTasks]);
    setAdded(true);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 800, margin: "0 auto" }}>
      
      {/* Header */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        AI Compliance Assistant
      </h2>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste legal notice, agreement clause, GST notice, trademark objection..."
        style={{
          width: "100%",
          minHeight: 130,
          border: "1.5px solid #ddd",
          borderRadius: 8,
          padding: 14,
          fontSize: 14,
          resize: "vertical",
          marginBottom: 12,
        }}
      />

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 12px" }}>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>
          or upload a document
        </span>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      </div>

      {/* Upload area */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf,application/pdf,application/msword,text/plain,text/rtf,application/rtf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: "none" }}
        onChange={(e) => { handleFile(e.target.files && e.target.files[0]); e.target.value = ""; }}
      />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files && e.dataTransfer.files[0]); }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={{
          border: `1.5px dashed ${fileError ? "#F87171" : dragOver ? "#5B21B6" : "#CBD5E1"}`,
          background: dragOver ? "#F5F0FF" : file ? "#F9FAFB" : "#FAFAF9",
          borderRadius: 10,
          padding: "20px 16px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.15s",
          marginBottom: 12,
        }}
      >
        {file ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Icon name="fileText" size={18} color="#5B21B6" />
              <span style={{ fontWeight: 600, fontSize: 14, wordBreak: "break-word" }}>{file.name}</span>
            </div>
            <div style={{ fontSize: 12.5, color: "#6B7280", margin: "6px 0 12px" }}>{formatBytes(file.size)}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current && fileInputRef.current.click(); }}
                style={{
                  padding: "7px 14px", background: "#FFF", color: "#5B21B6", border: "1px solid #5B21B6",
                  borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                Replace
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
                  background: "#FEE2E2", color: "#B91C1C", border: "none", borderRadius: 6,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                <Icon name="trash" size={14} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div>
            <Icon name="fileText" size={28} color="#9CA3AF" />
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 8 }}>Drag & drop your document here</div>
            <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>
              or click to browse · PDF, Word, TXT, RTF · max 10 MB · single file
            </div>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 7, marginTop: 14,
                padding: "9px 18px", background: "#5B21B6", color: "#fff", borderRadius: 6,
                fontSize: 13.5, fontWeight: 600,
              }}
            >
              Upload Document
            </div>
          </div>
        )}
      </div>

      {/* Upload error */}
      {fileError && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#FEF2F2", border: "1px solid #FECACA",
          color: "#B91C1C", padding: "10px 12px", borderRadius: 6,
          marginBottom: 12, fontSize: 13, fontWeight: 600,
        }}>
          <Icon name="alertTriangle" size={15} color="#B91C1C" />
          {fileError}
        </div>
      )}

      <button
        onClick={analyze}
        disabled={loading || (!input.trim() && !file)}
        style={{
          padding: "10px 18px",
          background: "#5B21B6",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          opacity: loading || (!input.trim() && !file) ? 0.6 : 1,
          marginBottom: 20,
        }}
      >
        {loading ? "Analyzing..." : "Analyze Document"}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          background: "#FFEBEE",
          padding: 12,
          borderRadius: 6,
          marginBottom: 16,
          color: "#D32F2F",
          fontWeight: 600
        }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div>

          {/* Risk */}
          <div style={{ marginBottom: 14 }}>
            <strong>Risk Level:</strong> {result.risk}
          </div>

          {/* Summary */}
          <div style={{
            background: "#F5F5F5",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16
          }}>
            <h4 style={{ fontWeight: 700, marginBottom: 6 }}>
              Plain English Summary
            </h4>
            <p>{result.summary}</p>

            {result.whyMatters && (
              <>
                <h4 style={{
                  fontWeight: 700,
                  marginTop: 12,
                  marginBottom: 6
                }}>
                  Why This Matters
                </h4>
                <p>{result.whyMatters}</p>
              </>
            )}
          </div>

          {/* Actions */}
          {result.actions.length > 0 && (
            <div style={{
              background: "#F9FAFB",
              padding: 16,
              borderRadius: 8
            }}>
              <h4 style={{ fontWeight: 700, marginBottom: 10 }}>
                What You Should Do Now
              </h4>

              {result.actions.map((a, i) => (
                <div key={i} style={{
                  padding: 10,
                  borderBottom: "1px solid #eee"
                }}>
                  {i + 1}. {a.title}
                </div>
              ))}

              <button
                onClick={addAllTasks}
                style={{
                  marginTop: 14,
                  padding: "8px 14px",
                  background: "#16A34A",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                {added ? "Tasks Added ✔" : "Add All Tasks to Dashboard"}
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};


// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
const ProfilePage = ({ stage, tasks }) => {
  const stageInfo = STAGE_LABELS[stage];
  const completed = tasks.filter(t => t.completed).length;
  const score = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 700, margin: "0 auto" }}>
      {/* Profile Header */}
      <Card style={{ padding: 28, marginBottom: 20, animation: "fadeUp 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--ink), var(--accent))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "var(--ff-head)" }}>F</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 800, fontSize: 22, marginBottom: 3 }}>Founder</h2>
            <p style={{ fontSize: 13.5, color: "#888", marginBottom: 8 }}>founder@startup.in</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: stageInfo.bg, padding: "4px 12px", borderRadius: 20, width: "fit-content" }}>
              <Icon name={stageInfo.icon} size={14} color={stageInfo.color} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: stageInfo.color }}>{stageInfo.label}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Tasks", value: tasks.length, icon: "task", color: "var(--sky)" },
          { label: "Completed", value: completed, icon: "check", color: "#2E7D32" },
          { label: "Score", value: score + "%", icon: "award", color: "var(--accent)" },
        ].map((s, i) => (
          <Card key={i} style={{ padding: 18, textAlign: "center", animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
            <Icon name={s.icon} size={24} color={s.color} />
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 24, fontWeight: 800, marginTop: 8 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Compliance Score */}
      <Card style={{ padding: 22, marginBottom: 20, animation: "fadeUp 0.4s ease 0.2s both" }}>
        <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Compliance Progress</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <ProgressRing pct={score} size={100} stroke={8} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              {score < 30 ? "🚨 Needs Immediate Attention" :
               score < 60 ? "⚠️ Making Progress" :
               score < 85 ? "✅ On Track" : "🏆 Excellent Compliance"}
            </p>
            <p style={{ fontSize: 13, color: "#777" }}>
              {score < 30 ? "You have several high-priority compliance items that need urgent attention. Start with high-risk tasks." :
               score < 60 ? "Good start! Focus on completing pending high-risk items to improve your score." :
               score < 85 ? "You're doing well. Keep completing tasks to maintain good standing." :
               "Outstanding compliance management! Your startup is well-protected legally."}
            </p>
          </div>
        </div>
      </Card>

      {/* Stage Info */}
      <Card style={{ padding: 22, animation: "fadeUp 0.4s ease 0.3s both" }}>
        <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Your Stage: {stageInfo.label}</h3>
        <div style={{ padding: "14px 16px", background: stageInfo.bg, borderRadius: 12 }}>
          <p style={{ fontSize: 13.5, color: "#444", lineHeight: 1.7 }}>
            {stage === "pre-idea" && "You're in the exploration phase. Focus on protecting any initial IP and understanding the legal landscape before committing to a business structure."}
            {stage === "ideation" && "You have a concrete idea and are validating it. Key priorities are formalizing founder relationships and protecting your brand name through trademark."}
            {stage === "pre-revenue" && "You're building your product. This is the most critical legal phase — proper incorporation, tax registrations, and compliance foundations set you up for everything ahead."}
            {stage === "early-revenue" && "You have paying customers! Now recurring compliance obligations kick in — GST returns, TDS, MCA filings. Staying on top of these is non-negotiable."}
            {stage === "growth" && "Scaling rapidly brings complex compliance. Fundraising documents, ESOP plans, international operations, and annual filings all require careful legal management."}
          </p>
        </div>
      </Card>
    </div>
  );
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

const Login = ({ onLogin }) => {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("founder@startup.in");
  const [pass, setPass] = useState("password");
  const [loading, setLoading] = useState(false);

const submit = async () => {
  if (!email || !pass) return;

  try {
    setLoading(true);

    const endpoint =
      tab === "login"
        ? "/api/auth/login"
        : "/api/auth/signup";

    const res = await API.post(endpoint, {
      email,
      password: pass,
    });

    if (tab === "login") {
      localStorage.setItem("token", res.data.token);
      onLogin();
    } else {
      alert("Signup successful! Please login.");
      setTab("login");
    }

  } catch (err) {
    console.log(err.response);
    alert(err.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};

  const inputStyle = {
    width: "100%", padding: "11px 14px", border: "1.5px solid rgba(255,255,255,0.12)",
    borderRadius: 10, fontFamily: "var(--ff-body)", fontSize: 14, outline: "none",
    background: "rgba(255,255,255,0.07)", color: "#fff",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--ink)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", padding: 24,
    }}>
      {/* BG decoration */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "rgba(232,80,10,0.06)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: -50, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(41,121,200,0.06)", filter: "blur(80px)" }} />
      </div>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, animation: "fadeUp 0.4s ease" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="shield" size={24} color="#fff" />
        </div>
        <span style={{ fontFamily: "var(--ff-head)", fontWeight: 800, fontSize: 26, color: "#fff" }}>
          Brand<span style={{ color: "var(--accent)" }}>Secure</span>
        </span>
      </div>

      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.09)",
        borderRadius: 20, padding: "32px 32px 28px", animation: "fadeUp 0.5s ease 0.1s both",
      }}>
        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 3, marginBottom: 24 }}>
          {["login", "signup"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                background: tab === t ? "rgba(255,255,255,0.12)" : "transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.45)",
                fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 14,
                textTransform: "capitalize", transition: "all 0.15s",
              }}>{t}</button>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Email</label>
          <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@startup.in"
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Password</label>
          <PasswordInput inputStyle={inputStyle} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
            autoComplete={tab === "login" ? "current-password" : "new-password"}
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
        </div>

        <button onClick={submit}
          style={{
            width: "100%", padding: "12px 20px", borderRadius: 10, border: "none",
            background: "var(--accent)", color: "#fff", fontSize: 15, fontWeight: 700,
            fontFamily: "var(--ff-body)", cursor: "pointer", transition: "all 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent2)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}>
          {loading ? (
            <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          ) : (
            <><Icon name="shield" size={17} color="#fff" /> {tab === "login" ? "Sign In" : "Create Account"}</>
          )}
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 14 }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      <p style={{ marginTop: 20, fontSize: 12.5, color: "rgba(255,255,255,0.3)", animation: "fadeIn 0.6s ease 0.4s both" }}>
        AI-powered legal compliance for founders who hate legalese
      </p>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

const classifyTask = (task) => {
  const t = `${task.title || ""} ${task.category || ""}`.toLowerCase();
  if (/aoc|roc|mgt|annual|yearly|statutory auditor|transfer pricing/.test(t)) return "annual";
  if (/gst|gstr|tds|return|filing|monthly|advance tax|payroll|pf\/esi|\bpf\b|\besi\b/.test(t)) return "recurring";
  if (/incorporat|register|registrat|formation|structure|pan|tan|bank account|bank acc|dsc|din|udyam|msme|startup india/.test(t)) return "formation";
  if (/trademark|\bip\b|nda|agreement|contract|shareholder|privacy|policy|terms|esop|offer letter/.test(t)) return "document";
  return "general";
};

const riskForDays = (daysLeft) => {
  if (daysLeft < 0 || daysLeft <= 14) return "high";
  if (daysLeft <= 60) return "medium";
  return "low";
};

const iso = (d) => d.toISOString().split("T")[0];
const DOC_OFF = [7, 14, 21, 30, 45, 60, 75, 90];
const GEN_OFF = [15, 30, 45, 60, 75, 90, 120];
const RECUR_DAY = [7, 11, 20, 25];

const makeDefaultTasks = (profile) => {
  const stage = (profile && profile.stage) || "pre-revenue";
  const now = today0();
  const registered = !!(profile && profile.legalStatus && profile.legalStatus !== "no");
  const regDate = registered && profile.registrationDate
    ? (() => { const d = new Date(profile.registrationDate); d.setHours(0, 0, 0, 0); return d; })()
    : null;
  const businessAge = regDate ? Math.max(Math.round((now - regDate) / 86400000), 0) : 0;

  const base = STAGE_TASKS[stage] || STAGE_TASKS["pre-revenue"];
  const items = base.map((t, i) => ({ ...t, kind: classifyTask(t), idx: i }));
  if (!registered) {
    items.sort((a, b) => {
      const pa = a.kind === "formation" ? 0 : 1;
      const pb = b.kind === "formation" ? 0 : 1;
      return pa !== pb ? pa - pb : a.idx - b.idx;
    });
  }

  let f = 0, r = 0, d = 0, g = 0, a = 0;

  return items.map((t, i) => {
    let due;
    switch (t.kind) {
      case "formation":
        due = !registered ? addDays(now, 3 + Math.min(f, 4))
          : businessAge < 60 ? addDays(now, 5 + f * 3)
          : addDays(now, 15 + f * 7);
        f++;
        break;
      case "recurring": {
        const dd = RECUR_DAY[r % RECUR_DAY.length];
        due = new Date(now.getFullYear(), now.getMonth(), dd);
        if (Math.round((due - now) / 86400000) > 15) due = new Date(now.getFullYear(), now.getMonth() - 1, dd);
        r++;
        break;
      }
      case "annual":
        due = regDate ? addDays(regDate, 365 * (a + 1)) : addDays(now, 180 + a * 60);
        a++;
        break;
      case "document":
        due = addDays(now, DOC_OFF[d % DOC_OFF.length]);
        d++;
        break;
      default:
        due = addDays(now, GEN_OFF[g % GEN_OFF.length]);
        g++;
        break;
    }
    const daysLeft = Math.round((due - now) / 86400000);
    if (daysLeft < -30) due = addDays(now, -3);

    return {
      ...t,
      id: i + 1,
      completed: i < 1,
      deadline: iso(due),
      risk: riskForDays(Math.round((due - now) / 86400000)),
    };
  });
};

const taskFromApi = (c) => ({
  id: c._id,
  title: c.title,
  category: c.category,
  risk: (c.riskLevel || "").toLowerCase(),
  deadline: new Date(c.deadline).toISOString().split("T")[0],
  status: c.status,
  completed: c.status === "Completed",
  desc: Array.isArray(c.requiredDocuments) ? c.requiredDocuments.join(", ") : "",
  aiGenerated: false,
});

function BrandSecureApp() {
  const [screen, setScreen] = useState("login"); // login | quiz | app
  const [page, setPage] = useState("dashboard");
  const [stage, setStage] = useState("pre-revenue");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await API.get("/api/compliance");
        setTasks((res.data?.data || []).map(taskFromApi));
        setScreen("app");
      } catch (err) {
        localStorage.removeItem("token");
        setScreen("login");
      }
    })();
  }, []);

  const handleLogin = () => setScreen("quiz");
  const handleQuiz = async (answers) => {
    try {
      const res = await API.post("/api/onboarding", {
        businessType: answers.q2 || "",
        state: answers.state || "",
        employees: answers.q3 || "",
        revenueStage: answers.q1 || "pre-revenue",
        funding: answers.q4 || "",
        businessStart: answers.q5 || "",
        registrationDate: answers.registerDate || "",
        industry: answers.industry || "",
        assets: Array.isArray(answers.assets) ? answers.assets : [],
        goal: answers.goal || "",
      });
      setTasks((res.data?.tasks || []).map(taskFromApi));
      setStage(answers.q1 || "pre-revenue");
      setScreen("app");
    } catch (err) {
      console.error("ONBOARDING ERROR:", err);
      setTasks(makeDefaultTasks({
        stage: answers.q1 || "pre-revenue",
        legalStatus: answers.q2 || "",
        registrationDate: answers.registerDate || "",
        businessStart: answers.q5 || "",
      }));
      setStage(answers.q1 || "pre-revenue");
      setScreen("app");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setScreen("login");
    setPage("dashboard");
    setTasks([]);
  };

  if (screen === "login") return (<><GlobalStyle /><Login onLogin={handleLogin} /></>);
  if (screen === "quiz") return (<><GlobalStyle /><Quiz onComplete={handleQuiz} /></>);

  const pageConfig = {
    dashboard: { title: "Dashboard", subtitle: "Your compliance overview at a glance" },
    tasks:     { title: "My Tasks", subtitle: "Manage all your compliance obligations" },
    ai:        { title: "AI Assistant", subtitle: "Analyze legal documents instantly" },
    profile:   { title: "Profile", subtitle: "Your account and compliance score" },
  }[page];

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar page={page} setPage={setPage} stage={stage} onLogout={handleLogout} />
        <main style={{ marginLeft: 256, flex: 1, minHeight: "100vh", background: "var(--surface)" }}>
          <Topbar {...pageConfig} tasks={tasks} />
          {page === "dashboard" && <Dashboard tasks={tasks} setTasks={setTasks} stage={stage} setPage={setPage} />}
          {page === "tasks"     && <TasksPage tasks={tasks} setTasks={setTasks} stage={stage} />}
          {page === "ai"        && <AIPage tasks={tasks} setTasks={setTasks} />}
          {page === "profile"   && <ProfilePage stage={stage} tasks={tasks} />}
        </main>
      </div>
    </>
  );
}
export default BrandSecureApp;