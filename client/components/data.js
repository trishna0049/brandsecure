// ─── STATIC DATA + HELPERS ─────────────────────────────────────────────────────

export const STAGE_TASKS = {
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

export const QUIZ_QUESTIONS = [
  {
    id: "q1",
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
    question: "Is your company legally incorporated?",
    options: [
      { value: "no", label: "Not yet", desc: "We haven't registered formally" },
      { value: "sole", label: "Sole Proprietorship", desc: "Running as an individual" },
      { value: "llp", label: "LLP", desc: "Limited Liability Partnership" },
      { value: "pvt", label: "Pvt. Ltd.", desc: "Private Limited Company" },
    ],
  },
  {
    id: "q3",
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
    question: "Have you raised external funding?",
    options: [
      { value: "none", label: "Bootstrapped", desc: "Self-funded only" },
      { value: "friends", label: "Friends & Family", desc: "Informal investment rounds" },
      { value: "angel", label: "Angel / Pre-seed", desc: "Received angel investment" },
      { value: "vc", label: "Seed / Series A+", desc: "Institutional venture capital" },
    ],
  },
];

export const STAGE_LABELS = {
  "pre-idea": { label: "Exploring", color: "#5E35B1", bg: "#EDE7F6", icon: "star" },
  "ideation": { label: "Ideation", color: "#00838F", bg: "#E0F7FA", icon: "sparkles" },
  "pre-revenue": { label: "Pre-Revenue", color: "#E65100", bg: "#FFF3E0", icon: "layers" },
  "early-revenue": { label: "Early Revenue", color: "#2E7D32", bg: "#E8F5E9", icon: "trendingUp" },
  "growth": { label: "Growth Stage", color: "#C9A84C", bg: "#FFF8E1", icon: "award" },
};

export const RISK_CONFIG = {
  high:   { color: "#D32F2F", bg: "#FFEBEE", label: "High Risk" },
  medium: { color: "#E65100", bg: "#FFF3E0", label: "Medium Risk" },
  low:    { color: "#2E7D32", bg: "#E8F5E9", label: "Low Risk" },
};

export const AI_EXAMPLES = [
  "TRADEMARK OBJECTION NOTICE - Case No. TM/2024/001234\n\nThis is to inform you that a trademark objection has been raised against your application for the mark 'BRANDIFY' under Class 42 for software services. The examiner has raised an objection on the grounds of similarity with existing mark 'BRANDIF' registered under the same class...",
  "NOTICE OF GST DEMAND - Reference: GST/2024/KA/8821\n\nYour company has been identified for non-compliance with GST Return filing obligations for the quarters ending March 2024 and June 2024. The total demand including tax, interest, and penalty amounts to ₹2,45,000...",
  "SHAREHOLDERS AGREEMENT CLAUSE 8.2\n\nDrag-Along Rights: In the event that holders of at least sixty percent (60%) of the outstanding shares agree to sell their shares to a third party, such selling shareholders shall have the right to require all other shareholders to sell their shares on the same terms and conditions...",
];

export const PAGES = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "tasks",     label: "My Tasks",  icon: "task" },
  { id: "ai",        label: "AI Assistant", icon: "bot" },
  { id: "profile",   label: "Profile",   icon: "user" },
];

export const makeDefaultTasks = (stage) => {
  const today = new Date();
  return (STAGE_TASKS[stage] || STAGE_TASKS["pre-revenue"]).map((t, i) => ({
    ...t,
    id: i + 1,
    completed: i < 1,
    deadline: new Date(today.getTime() + t.daysFromNow * 86400000).toISOString().split("T")[0],
  }));
};

// Map a backend Compliance doc to the frontend task shape.
export const taskFromApi = (c) => ({
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