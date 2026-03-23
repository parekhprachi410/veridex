"use client";

import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";

// Quiz data (same as before)
const QUIZ = [
  { 
    id: "company", 
    label: "Company Overview", 
    icon: "🏢", 
    questions: [
      { id: "name", text: "Company name?", type: "text", placeholder: "e.g. Acme Corp" },
      { 
        id: "industry", 
        text: "Industry?", 
        type: "select", 
        options: ["SaaS / Technology", "E-Commerce", "FinTech", "HealthTech", "Manufacturing", "Retail", "Consulting", "EdTech", "Other"] 
      },
      { 
        id: "stage", 
        text: "Company stage?", 
        type: "select", 
        options: ["Idea / Pre-seed", "Seed", "Series A", "Series B+", "Growth / Profitable", "SME (Established)"] 
      },
      { 
        id: "founded", 
        text: "Year of founding?", 
        type: "select", 
        options: ["2024–2025", "2022–2023", "2019–2021", "2015–2018", "Before 2015"] 
      },
    ]
  },
  { 
    id: "financials", 
    label: "Financials", 
    icon: "💰", 
    questions: [
      { 
        id: "revenue", 
        text: "Annual revenue (USD)?", 
        type: "select", 
        options: ["Pre-revenue", "$1 – $50k", "$50k – $200k", "$200k – $1M", "$1M – $5M", "$5M+"] 
      },
      { 
        id: "expenses", 
        text: "Monthly operating expenses?", 
        type: "select", 
        options: ["< $5k", "$5k – $20k", "$20k – $100k", "$100k – $500k", "$500k+"] 
      },
      { 
        id: "burn", 
        text: "Monthly burn rate?", 
        type: "select", 
        options: ["Profitable", "< $10k", "$10k – $50k", "$50k – $200k", "$200k+"] 
      },
      { 
        id: "runway", 
        text: "Months of runway?", 
        type: "select", 
        options: ["< 3 months", "3 – 6 months", "6 – 12 months", "12 – 24 months", "24+ months / Profitable"] 
      },
    ]
  },
  { 
    id: "capital", 
    label: "Capital Structure", 
    icon: "📊", 
    questions: [
      { 
        id: "raised", 
        text: "Total capital raised?", 
        type: "select", 
        options: ["Bootstrapped", "< $100k", "$100k – $500k", "$500k – $2M", "$2M – $10M", "$10M+"] 
      },
      { 
        id: "allocation_rnd", 
        text: "R&D / Product spend (%)?", 
        type: "slider", 
        min: 0, 
        max: 100, 
        default: 30 
      },
      { 
        id: "allocation_mkt", 
        text: "Marketing & Sales spend (%)?", 
        type: "slider", 
        min: 0, 
        max: 100, 
        default: 25 
      },
      { 
        id: "allocation_ops", 
        text: "Operations & Admin spend (%)?", 
        type: "slider", 
        min: 0, 
        max: 100, 
        default: 25 
      },
    ]
  },
  { 
    id: "growth", 
    label: "Growth & Strategy", 
    icon: "🚀", 
    questions: [
      { 
        id: "mrr_growth", 
        text: "Revenue growth last 6 months?", 
        type: "select", 
        options: ["Declining > 20%", "Declining 0–20%", "Flat", "Growing 1–20%", "Growing 20–50%", "Growing 50%+"] 
      },
      { 
        id: "customers", 
        text: "Active customers?", 
        type: "select", 
        options: ["0 (Pre-launch)", "1 – 10", "10 – 100", "100 – 1,000", "1,000 – 10,000", "10,000+"] 
      },
      { 
        id: "churn", 
        text: "Monthly churn rate?", 
        type: "select", 
        options: ["< 1%", "1 – 3%", "3 – 7%", "7 – 15%", "> 15%", "N/A"] 
      },
      { 
        id: "strategy", 
        text: "Primary growth strategy?", 
        type: "select", 
        options: ["Product-led growth", "Sales-led growth", "Marketing / content", "Partnerships / BD", "Viral / referral", "Multiple channels"] 
      },
    ]
  },
  { 
    id: "team", 
    label: "Team & Operations", 
    icon: "👥", 
    questions: [
      { 
        id: "headcount", 
        text: "Team size?", 
        type: "select", 
        options: ["Solo founder", "2 – 5", "6 – 15", "16 – 50", "51 – 200", "200+"] 
      },
      { 
        id: "tech_debt", 
        text: "Product / tech quality?", 
        type: "select", 
        options: ["Very poor (lots of debt)", "Below average", "Average", "Good", "Excellent"] 
      },
      { 
        id: "market_fit", 
        text: "Product-Market Fit status?", 
        type: "select", 
        options: ["Still searching", "Early signs", "Moderate PMF", "Strong PMF", "Dominant in niche"] 
      },
      { 
        id: "goal", 
        text: "12-month primary goal?", 
        type: "select", 
        options: ["Survive & extend runway", "Find product-market fit", "Scale revenue aggressively", "Raise next funding round", "Achieve profitability", "Expand to new markets"] 
      },
    ]
  },
];

// Advisory experts data
const ADVISORY_EXPERTS = [
  {
    category: "M&A",
    icon: "🤝",
    experts: [
      { 
        name: "Sarah Chen", 
        firm: "Goldman Sachs", 
        email: "sarah.chen@gs.com", 
        phone: "+1 (212) 357-8923", 
        expertise: "Tech M&A, Cross-border Transactions",
        available: true
      },
      { 
        name: "Michael Rodriguez", 
        firm: "Morgan Stanley", 
        email: "m.rodriguez@morganstanley.com", 
        phone: "+1 (212) 761-4567", 
        expertise: "SaaS, Enterprise Software",
        available: true
      }
    ]
  },
  {
    category: "Legal",
    icon: "⚖️",
    experts: [
      { 
        name: "Jennifer Wu", 
        firm: "Skadden Arps", 
        email: "jennifer.wu@skadden.com", 
        phone: "+1 (212) 735-2345", 
        expertise: "Corporate Law, Fundraising, VC Transactions",
        available: true
      },
      { 
        name: "David Okafor", 
        firm: "Kirkland & Ellis", 
        email: "david.okafor@kirkland.com", 
        phone: "+1 (312) 862-7890", 
        expertise: "M&A, IP, Startup Advisory",
        available: false
      }
    ]
  },
  {
    category: "Investment Banking",
    icon: "🏦",
    experts: [
      { 
        name: "Robert Martinez", 
        firm: "Qatalyst Partners", 
        email: "r.martinez@qatalyst.com", 
        phone: "+1 (415) 123-4567", 
        expertise: "Late-stage, IPOs, Tech",
        available: true
      },
      { 
        name: "Priya Patel", 
        firm: "Evercore", 
        email: "priya.patel@evercore.com", 
        phone: "+1 (212) 822-3456", 
        expertise: "Growth Equity, FinTech, Cross-border",
        available: true
      }
    ]
  },
  {
    category: "Chartered Accountant",
    icon: "📊",
    experts: [
      { 
        name: "James Wilson", 
        firm: "Deloitte", 
        email: "james.wilson@deloitte.com", 
        phone: "+44 20 7303 4567", 
        expertise: "Tax Strategy, Audit, International Tax",
        available: true
      },
      { 
        name: "Aisha Khan", 
        firm: "EY", 
        email: "aisha.khan@ey.com", 
        phone: "+971 4 312 9876", 
        expertise: "Startup Accounting, Compliance, Fund Structuring",
        available: true
      }
    ]
  }
];

// Scoring engine (same as before)
function analyzeAnswers(answers) {
  let score = 50;
  const insights = [];
  const flags = [];
  
  // Revenue score
  const revenueMap = {
    "Pre-revenue": 0,
    "$1   $50k": 1,
    "$50k   $200k": 2,
    "$200k   $1M": 3,
    "$1M   $5M": 4,
    "$5M+": 5
  };
  
  // Growth score
  const growthMap = {
    "Declining > 20%": -2,
    "Declining 0 20%": -1,
    "Flat": 0,
    "Growing 1 20%": 1,
    "Growing 20 50%": 2,
    "Growing 50%+": 3
  };
  
  // Burn rate score
  const burnMap = {
    "Profitable": 3,
    "< $10k": 2,
    "$10k   $50k": 1,
    "$50k   $200k": -1,
    "$200k+": -2
  };
  
  // Runway score
  const runwayMap = {
    "< 3 months": -3,
    "3   6 months": -1,
    "6   12 months": 1,
    "12   24 months": 2,
    "24+ months / Profitable": 3
  };
  
  // PMF score
  const pmfMap = {
    "Still searching": 0,
    "Early signs": 1,
    "Moderate PMF": 2,
    "Strong PMF": 3,
    "Dominant in niche": 4
  };
  
  // Churn score
  const churnMap = {
    "< 1%": 3,
    "1   3%": 2,
    "3   7%": 1,
    "7   15%": -1,
    "> 15%": -3,
    "N/A": 0
  };

  // Calculate score
  score += (revenueMap[answers.revenue] || 0) * 4;
  score += (growthMap[answers.mrr_growth] || 0) * 5;
  score += (burnMap[answers.burn] || 0) * 3;
  score += (runwayMap[answers.runway] || 0) * 4;
  score += (pmfMap[answers.market_fit] || 0) * 4;
  score += (churnMap[answers.churn] || 0) * 3;
  
  // Clamp score between 5 and 99
  score = Math.max(5, Math.min(99, score));

  // Add flags based on answers
  if (answers.runway === "< 3 months") {
    flags.push({ type: "danger", msg: "Critical: Less than 3 months runway — immediate action required." });
  }
  if (answers.mrr_growth?.includes("Declining")) {
    flags.push({ type: "warning", msg: "Revenue decline detected. Revisit pricing & churn strategy." });
  }
  if (answers.market_fit === "Still searching") {
    flags.push({ type: "warning", msg: "PMF not found. Narrow your ICP before scaling spend." });
  }
  if (answers.churn === "> 15%") {
    flags.push({ type: "danger", msg: "Critical: Very high churn rate. Investigate customer satisfaction urgently." });
  }
  if (answers.burn === "$200k+" && answers.runway === "< 3 months") {
    flags.push({ type: "danger", msg: "Severe cash burn with low runway. Immediate cost reduction needed." });
  }

  // Add insights
  if (score >= 70) {
    insights.push("Strong financial indicators. Consider raising to accelerate growth.");
  } else if (score >= 50) {
    insights.push("Moderate health — clear levers to pull. Prioritise runway and PMF.");
  } else {
    insights.push("Significant risks detected. Focus on unit economics before scaling.");
  }
  
  if (answers.burn === "Profitable") {
    insights.push("Profitable operation gives leverage with investors.");
  }
  
  if (answers.strategy === "Product-led growth" && answers.market_fit !== "Still searching") {
    insights.push("PLG + validated PMF is powerful. Double down on referral loops.");
  }

  // Generate pie chart data for capital allocation
  const rnd = parseInt(answers.allocation_rnd) || 30;
  const mkt = parseInt(answers.allocation_mkt) || 25;
  const ops = parseInt(answers.allocation_ops) || 25;
  const other = Math.max(0, 100 - rnd - mkt - ops);
  
  const pieData = [
    { name: "R&D / Product", value: rnd, color: "#00C896" },
    { name: "Marketing & Sales", value: mkt, color: "#2E7EFF" },
    { name: "Operations", value: ops, color: "#F0B429" },
    { name: "Other", value: other, color: "#5C7A99" },
  ].filter(d => d.value > 0);

  // Generate forecast data
  const baseRev = {
    "Pre-revenue": 0,
    "$1   $50k": 25,
    "$50k   $200k": 125,
    "$200k   $1M": 600,
    "$1M   $5M": 3000,
    "$5M+": 7500
  }[answers.revenue] || 100;

  const growthMultiplier = {
    "Declining > 20%": 0.75,
    "Declining 0 20%": 0.9,
    "Flat": 1.0,
    "Growing 1 20%": 1.1,
    "Growing 20 50%": 1.35,
    "Growing 50%+": 1.6
  }[answers.mrr_growth] || 1.1;

  const lineData = Array.from({ length: 8 }, (_, i) => {
    const quarter = `Q${(i % 4) + 1} ${2024 + Math.floor(i / 4)}`;
    const rev = Math.round(baseRev * Math.pow(growthMultiplier, i * 0.75));
    const expenses = Math.round(rev * (0.75 + (score - 50) / 200));
    return {
      quarter,
      Revenue: rev,
      Expenses: expenses,
      Profit: rev - expenses
    };
  });

  return {
    score,
    insights,
    flags,
    pieData,
    lineData,
    verdict: score >= 65 ? "PROFIT" : score >= 45 ? "BREAKEVEN" : "LOSS",
    strategyRating: score >= 70 ? "STRONG" : score >= 50 ? "MODERATE" : "WEAK"
  };
}

// Input component
const Input = ({ label, type = "text", value, onChange, placeholder, error, hint, C, readOnly }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: 1.8,
          marginBottom: 7,
          fontFamily: "'DM Mono', monospace"
        }}>
          {label.toUpperCase()}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          value={value}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          type={type === "password" ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          readOnly={readOnly}
          style={{
            width: "100%",
            background: readOnly ? C.surfaceAlt : C.inputBg,
            border: `1.5px solid ${error ? C.red : C.border}`,
            borderRadius: 8,
            padding: "11px 14px",
            color: C.text,
            fontSize: 14,
            outline: "none",
            paddingRight: type === "password" ? 44 : 14,
            fontFamily: "'Syne', sans-serif",
            cursor: readOnly ? "not-allowed" : "text"
          }}
          onFocus={(e) => { if (!readOnly && !error) e.target.style.borderColor = C.accent; }}
          onBlur={(e) => e.target.style.borderColor = error ? C.red : C.border}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.textMuted,
              fontSize: 15,
              padding: 0
            }}
          >
            {show ? "🙈" : "👁"}
          </button>
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: C.red, marginTop: 5 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{hint}</p>}
    </div>
  );
};

// Alert component
const Alert = ({ bg, color, msg }) => (
  <div style={{
    background: bg,
    border: `1px solid ${color}40`,
    borderRadius: 8,
    padding: "10px 14px",
    marginBottom: 16,
    fontSize: 12,
    color,
    lineHeight: 1.5
  }}>
    {msg}
  </div>
);

// Score ring component
const ScoreRing = ({ score, C }) => {
  const color = score >= 65 ? C.accent : score >= 45 ? C.gold : C.red;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  
  return (
    <div style={{ position: "relative", width: 128, height: 128 }}>
      <svg width="128" height="128" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={C.border}
          strokeWidth="8"
        />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <span style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>
          {score}
        </span>
        <span style={{ fontSize: 9, color: C.textMuted, letterSpacing: 1.5 }}>HEALTH</span>
      </div>
    </div>
  );
};

// Chart tooltip
const ChartTip = ({ active, payload, label, C }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: "10px 14px"
    }}>
      <p style={{ color: C.textMuted, fontSize: 11, marginBottom: 5, fontFamily: "'DM Mono', monospace" }}>
        {label}
      </p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontSize: 12, margin: "2px 0" }}>
          {p.name}: <strong>${p.value?.toLocaleString()}k</strong>
        </p>
      ))}
    </div>
  );
};

// Chip component
const Chip = ({ color, label }) => (
  <div style={{
    padding: "5px 11px",
    borderRadius: 6,
    border: `1.5px solid ${color}`,
    background: `${color}18`,
    color,
    fontSize: 10,
    fontWeight: 700,
    fontFamily: "'DM Mono', monospace",
    whiteSpace: "nowrap"
  }}>
    {label}
  </div>
);

// Expert Card component
const ExpertCard = ({ expert, C }) => (
  <div style={{
    background: C.surfaceAlt,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "16px",
    marginBottom: 12,
    position: "relative",
    opacity: expert.available ? 1 : 0.7
  }}>
    {!expert.available && (
      <div style={{
        position: "absolute",
        top: 12,
        right: 12,
        background: C.gold,
        color: "#000",
        fontSize: 10,
        padding: "2px 8px",
        borderRadius: 12,
        fontWeight: 600
      }}>
        Busy
      </div>
    )}
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "#fff",
        fontWeight: 600
      }}>
        {expert.name.charAt(0)}
      </div>
      <div>
        <div style={{ fontWeight: 600, color: C.text }}>{expert.name}</div>
        <div style={{ fontSize: 11, color: C.accent }}>{expert.firm}</div>
      </div>
    </div>
    <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 12, lineHeight: 1.5 }}>
      {expert.expertise}
    </p>
    <div style={{ fontSize: 11, color: C.textMuted, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span>✉️</span>
        <a href={`mailto:${expert.email}`} style={{ color: C.accent, textDecoration: "none" }}>
          {expert.email}
        </a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span>📞</span>
        <span>{expert.phone}</span>
      </div>
    </div>
    {expert.available && (
      <button style={{
        width: "100%",
        marginTop: 12,
        padding: "8px",
        background: "transparent",
        border: `1.5px solid ${C.accent}`,
        borderRadius: 6,
        color: C.accent,
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s"
      }}>
        Request Introduction
      </button>
    )}
  </div>
);

export default function Veridex() {
  const [dark, setDark] = useState(true);
  const [screen, setScreen] = useState("landing");
  const [users, setUsers] = useState({});
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    company: ""
  });
  
  const [authErrors, setAuthErrors] = useState({});
  const [authMsg, setAuthMsg] = useState("");
  
  // Forgot password flow
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPw, setNewPw] = useState("");

  // Profile state
  const [editProfile, setEditProfile] = useState({ name: "", company: "", email: "" });
  const [profileMsg, setProfileMsg] = useState("");

  // Quiz state
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load data from localStorage on initial mount
  useEffect(() => {
    const loadData = () => {
      try {
        // Load users
        const savedUsers = localStorage.getItem('veridex_users');
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        }

        // Load session
        const savedSession = localStorage.getItem('veridex_session');
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          setSession(sessionData.email);
          
          // Load user's answers if they exist
          const savedAnswers = localStorage.getItem(`veridex_answers_${sessionData.email}`);
          if (savedAnswers) {
            const answersData = JSON.parse(savedAnswers);
            setAnswers(answersData);
            
            // Re-analyze answers
            const result = analyzeAnswers(answersData);
            setAnalysis(result);
            setScreen("dashboard");
          }
        }

        // Load theme preference
        const savedTheme = localStorage.getItem('veridex_theme');
        if (savedTheme !== null) {
          setDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('veridex_users', JSON.stringify(users));
    }
  }, [users, isLoading]);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      if (session) {
        localStorage.setItem('veridex_session', JSON.stringify({ email: session }));
      } else {
        localStorage.removeItem('veridex_session');
      }
    }
  }, [session, isLoading]);

  // Save theme preference
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('veridex_theme', dark ? 'dark' : 'light');
    }
  }, [dark, isLoading]);

  // Save answers when they change (only for logged-in users)
  useEffect(() => {
    if (!isLoading && session && Object.keys(answers).length > 0) {
      localStorage.setItem(`veridex_answers_${session}`, JSON.stringify(answers));
    }
  }, [answers, session, isLoading]);

  const currentUser = session ? users[session] : null;

  // Theme colors
  const C = dark ? {
    bg: "#060C18",
    surface: "#0E1826",
    surfaceAlt: "#131F30",
    border: "#1C2E45",
    borderLight: "#243852",
    accent: "#00C896",
    accentDim: "#00C89618",
    blue: "#2E7EFF",
    blueDim: "#2E7EFF18",
    gold: "#F0B429",
    goldDim: "#F0B42918",
    red: "#F04E5E",
    redDim: "#F04E5E18",
    text: "#E2EAF8",
    textMuted: "#5C7A99",
    textFaint: "#253A52",
    inputBg: "#060C18",
  } : {
    bg: "#F0F4FA",
    surface: "#FFFFFF",
    surfaceAlt: "#F7F9FC",
    border: "#D5E0EE",
    borderLight: "#E2EBF5",
    accent: "#007A5A",
    accentDim: "#007A5A14",
    blue: "#1A5FCC",
    blueDim: "#1A5FCC14",
    gold: "#B07D0A",
    goldDim: "#B07D0A14",
    red: "#C8303E",
    redDim: "#C8303E14",
    text: "#0F1E30",
    textMuted: "#4A6280",
    textFaint: "#A0B4C8",
    inputBg: "#FFFFFF",
  };

  // Navigation functions
  const goHome = () => {
    setMenuOpen(false);
    if (session && analysis) {
      setScreen("dashboard");
      setActiveTab("overview");
    } else if (session) {
      setScreen("quiz");
    } else {
      setScreen("landing");
    }
  };
  
  const toLogin = () => {
    setScreen("login");
    setAuthErrors({});
    setAuthMsg("");
    setAuthForm({ name: "", email: "", password: "", confirm: "", company: "" });
  };
  
  const toRegister = () => {
    setScreen("register");
    setAuthErrors({});
    setAuthMsg("");
    setAuthForm({ name: "", email: "", password: "", confirm: "", company: "" });
  };

  const logout = () => {
    setSession(null);
    setAnalysis(null);
    setAnswers({});
    setScreen("landing");
    setMenuOpen(false);
    localStorage.removeItem('veridex_session');
  };

  const openProfile = () => {
    if (currentUser) {
      setEditProfile({
        name: currentUser.name || "",
        company: currentUser.company || "",
        email: session || ""
      });
    }
    setProfileMsg("");
    setScreen("profile");
  };

  const saveProfile = () => {
    if (!editProfile.name.trim()) {
      setProfileMsg("Name cannot be empty.");
      return;
    }
    
    // Update user data
    setUsers(prev => ({
      ...prev,
      [session]: {
        ...prev[session],
        name: editProfile.name,
        company: editProfile.company
      }
    }));
    
    setProfileMsg("Profile updated!");
    setTimeout(() => setProfileMsg(""), 3000);
  };

  // Password strength checker
  const pwRules = (pw) => [
    { label: "8+ characters", ok: pw.length >= 8 },
    { label: "Uppercase (A–Z)", ok: /[A-Z]/.test(pw) },
    { label: "Lowercase (a–z)", ok: /[a-z]/.test(pw) },
    { label: "Number (0–9)", ok: /\d/.test(pw) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(pw) },
  ];

  // Quiz functions
  const handleAnswer = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const nextStep = () => {
    if (step < QUIZ.length - 1) {
      setStep(s => s + 1);
    } else {
      setScreen("loading");
      setTimeout(() => {
        const result = analyzeAnswers(answers);
        setAnalysis(result);
        setScreen("dashboard");
        setActiveTab("overview");
      }, 2000);
    }
  };

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        width: "100%",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            margin: "0 auto 20px",
            borderRadius: "50%",
            border: `3px solid ${C.border}`,
            borderTopColor: C.accent,
            animation: "spin 0.9s linear infinite"
          }} />
          <p style={{ color: C.textMuted }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Navigation Bar Component
  const NavBar = () => (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 200,
      background: dark ? "rgba(6,12,24,0.93)" : "rgba(240,244,250,0.93)",
      backdropFilter: "blur(14px)",
      borderBottom: `1px solid ${C.border}`,
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      height: 58,
      width: "100%"
    }}>
      {/* Logo - click to go home */}
      <button
        onClick={goHome}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>
          VERIDEX
        </span>
      </button>

      <div style={{ flex: 1 }} />

      {/* Theme Toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: `1.5px solid ${C.border}`,
          background: dark ? C.accent : C.surfaceAlt,
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "0 3px",
          marginRight: 12
        }}
      >
        <div style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: dark ? "#fff" : C.text,
          transform: dark ? "translateX(20px)" : "translateX(0)",
          transition: "transform 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9
        }}>
          {dark ? "🌙" : "🌤️"}
        </div>
      </button>

      {/* Auth buttons or user menu */}
      {!session && screen === "landing" && (
        <>
          <button
            onClick={toLogin}
            style={{
              background: "transparent",
              border: `1.5px solid ${C.border}`,
              borderRadius: 8,
              color: C.textMuted,
              cursor: "pointer",
              padding: "8px 16px",
              fontSize: 13,
              marginRight: 8
            }}
          >
            Log In
          </button>
          <button
            onClick={toRegister}
            style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
              padding: "8px 16px",
              fontSize: 13
            }}
          >
            Get Started
          </button>
        </>
      )}

      {session && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={openProfile}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#fff",
              fontWeight: 700
            }}
          >
            {currentUser?.name?.[0]?.toUpperCase() || "U"}
          </button>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: `1.5px solid ${C.border}`,
              borderRadius: 8,
              color: C.textMuted,
              cursor: "pointer",
              padding: "7px 14px",
              fontSize: 12
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER BASED ON SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  
  // LANDING PAGE
  if (screen === "landing") {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: C.bg, color: C.text }}>
        <NavBar />
        
        {/* Animated background grid */}
        <div style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
          opacity: dark ? 0.05 : 0.04
        }}>
          <svg width="100%" height="100%" style={{ animation: "gridScroll 10s linear infinite" }}>
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke={C.accent} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div style={{
            position: "absolute",
            top: "15%",
            left: "5%",
            width: "clamp(200px, 25vw, 380px)",
            aspectRatio: "1",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.accentDim}, transparent)`,
            filter: "blur(60px)"
          }} />
          <div style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "clamp(160px, 20vw, 300px)",
            aspectRatio: "1",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.blueDim}, transparent)`,
            filter: "blur(60px)"
          }} />
        </div>

        {/* Main content */}
        <div style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(50px, 10vw, 110px) clamp(20px, 6vw, 80px)",
          textAlign: "center",
          animation: "fadeUp 0.7s ease both"
        }}>
          <div style={{
            display: "inline-block",
            padding: "5px 16px",
            background: C.accentDim,
            border: `1px solid ${C.accent}44`,
            borderRadius: 20,
            color: C.accent,
            fontSize: 10,
            letterSpacing: 2,
            marginBottom: 24,
            fontFamily: "'DM Mono', monospace"
          }}>
            BUSINESS INTELLIGENCE PORTAL
          </div>
          
          <h1 style={{
            fontSize: "clamp(34px, 7vw, 78px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -2,
            marginBottom: 20
          }}>
            Maintain your<br />
            <span style={{
              backgroundImage: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              display: "inline"
            }}>
              portfolio.
            </span>
          </h1>
          
          <p style={{
            fontSize: "clamp(14px, 2vw, 18px)",
            color: C.textMuted,
            maxWidth: 520,
            margin: "0 auto 36px",
            lineHeight: 1.75
          }}>
            Answer 20 questions. Get CA-grade analysis, profit forecasts, capital charts — and an AI advisor that thinks like a consultant.
          </p>
          
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={toRegister}
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
                border: "none",
                borderRadius: 8,
                color: "#fff",
                cursor: "pointer",
                padding: "14px 30px",
                fontSize: 15
              }}
            >
              Build Your Portfolio →
            </button>
            <button
              onClick={toLogin}
              style={{
                background: "transparent",
                border: `1.5px solid ${C.border}`,
                borderRadius: 8,
                color: C.textMuted,
                cursor: "pointer",
                padding: "14px 30px",
                fontSize: 15
              }}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Feature grid */}
        <div style={{
          position: "relative",
          zIndex: 1,
          padding: "32px clamp(20px, 6vw, 80px) 60px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14
        }}>
          {[
            { icon: "📊", title: "Live Charts", desc: "P&L forecasts & capital pie charts from your data" },
            { icon: "🤖", title: "AI Advisor", desc: "Claude-powered analysis like a chartered accountant" },
            { icon: "🎯", title: "Strategy Score", desc: "Know if your strategy is STRONG, MODERATE or WEAK" },
            { icon: "🔐", title: "Secure Portal", desc: "Your data stays private and protected" },
          ].map(f => (
            <div key={f.title} style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "20px 22px"
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (screen === "login") {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: C.bg, color: C.text }}>
        <NavBar />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 58px)",
          padding: "32px 20px"
        }}>
          <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.45s ease both" }}>
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "clamp(20px, 4vw, 36px)"
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Welcome back</h2>
              <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 24 }}>
                Sign in to your Veridex portal
              </p>
              
              {authMsg && <Alert bg={C.accentDim} color={C.accent} msg={authMsg} />}
              
              <Input
                label="Email"
                type="email"
                value={authForm.email}
                onChange={(v) => setAuthForm(f => ({ ...f, email: v }))}
                placeholder="you@company.com"
                error={authErrors.email}
                C={C}
              />
              
              <Input
                label="Password"
                type="password"
                value={authForm.password}
                onChange={(v) => setAuthForm(f => ({ ...f, password: v }))}
                placeholder="Your password"
                error={authErrors.password}
                C={C}
              />
              
              <div style={{ textAlign: "right", marginBottom: 18, marginTop: -8 }}>
                <button
                  onClick={() => {
                    setScreen("forgot");
                    setForgotStep(1);
                    setAuthMsg("");
                    setForgotEmail("");
                    setNewPw("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: C.accent,
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  Forgot password?
                </button>
              </div>
              
              <button
                onClick={() => {
                  if (!authForm.email) {
                    setAuthErrors({ email: "Email required" });
                  } else if (!authForm.password) {
                    setAuthErrors({ password: "Password required" });
                  } else {
                    // Check if user exists
                    if (users[authForm.email]) {
                      setSession(authForm.email);
                      
                      // Load existing answers
                      const savedAnswers = localStorage.getItem(`veridex_answers_${authForm.email}`);
                      if (savedAnswers) {
                        const answersData = JSON.parse(savedAnswers);
                        setAnswers(answersData);
                        const result = analyzeAnswers(answersData);
                        setAnalysis(result);
                        setScreen("dashboard");
                      } else {
                        setScreen("quiz");
                        setStep(0);
                        setAnswers({});
                      }
                    } else {
                      setAuthErrors({ email: "User not found. Please register first." });
                    }
                  }
                }}
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  cursor: "pointer",
                  padding: 13,
                  fontSize: 14,
                  width: "100%"
                }}
              >
                Sign In →
              </button>
              
              <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 18 }}>
                No account?{" "}
                <button
                  onClick={toRegister}
                  style={{
                    background: "none",
                    border: "none",
                    color: C.accent,
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  Create one
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REGISTER SCREEN
  if (screen === "register") {
    const rules = pwRules(authForm.password);
    
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: C.bg, color: C.text }}>
        <NavBar />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 58px)",
          padding: "32px 20px"
        }}>
          <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.45s ease both" }}>
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "clamp(20px, 4vw, 36px)"
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Create account</h2>
              <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 24 }}>
                Start building your business portfolio
              </p>
              
              <Input
                label="Full Name"
                value={authForm.name}
                onChange={(v) => setAuthForm(f => ({ ...f, name: v }))}
                placeholder="Jane Smith"
                error={authErrors.name}
                C={C}
              />
              
              <Input
                label="Work Email"
                type="email"
                value={authForm.email}
                onChange={(v) => setAuthForm(f => ({ ...f, email: v }))}
                placeholder="jane@company.com"
                error={authErrors.email}
                C={C}
              />
              
              <Input
                label="Company Name (optional)"
                value={authForm.company}
                onChange={(v) => setAuthForm(f => ({ ...f, company: v }))}
                placeholder="Acme Corp"
                C={C}
              />
              
              <Input
                label="Password"
                type="password"
                value={authForm.password}
                onChange={(v) => setAuthForm(f => ({ ...f, password: v }))}
                placeholder="Create a strong password"
                error={authErrors.password}
                C={C}
              />
              
              {authForm.password && (
                <div style={{
                  marginTop: -8,
                  marginBottom: 14,
                  background: C.surfaceAlt,
                  borderRadius: 8,
                  padding: "10px 14px"
                }}>
                  {rules.map(r => (
                    <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: r.ok ? C.accent : C.textFaint }}>
                        {r.ok ? "✓" : "○"}
                      </span>
                      <span style={{ fontSize: 11, color: r.ok ? C.accent : C.textMuted }}>
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <Input
                label="Confirm Password"
                type="password"
                value={authForm.confirm}
                onChange={(v) => setAuthForm(f => ({ ...f, confirm: v }))}
                placeholder="Repeat password"
                error={authErrors.confirm}
                C={C}
              />
              
              <button
                onClick={() => {
                  if (!authForm.name) {
                    setAuthErrors({ name: "Name is required" });
                  } else if (!authForm.email.includes("@")) {
                    setAuthErrors({ email: "Valid email required" });
                  } else if (!rules.every(r => r.ok)) {
                    setAuthErrors({ password: "Password doesn't meet requirements" });
                  } else if (authForm.password !== authForm.confirm) {
                    setAuthErrors({ confirm: "Passwords don't match" });
                  } else if (users[authForm.email]) {
                    setAuthErrors({ email: "Email already registered" });
                  } else {
                    // Create user
                    setUsers(prev => ({
                      ...prev,
                      [authForm.email]: {
                        name: authForm.name,
                        company: authForm.company || "My Company"
                      }
                    }));
                    setSession(authForm.email);
                    setScreen("quiz");
                    setStep(0);
                    setAnswers({});
                  }
                }}
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  cursor: "pointer",
                  padding: 13,
                  fontSize: 14,
                  width: "100%",
                  marginTop: 4
                }}
              >
                Create Account →
              </button>
              
              <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 18 }}>
                Already registered?{" "}
                <button
                  onClick={toLogin}
                  style={{
                    background: "none",
                    border: "none",
                    color: C.accent,
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FORGOT PASSWORD SCREEN
  if (screen === "forgot") {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: C.bg, color: C.text }}>
        <NavBar />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 58px)",
          padding: "32px 20px"
        }}>
          <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.45s ease both" }}>
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "clamp(20px, 4vw, 36px)"
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
                {forgotStep === 1 ? "Forgot password" : "Reset password"}
              </h2>
              <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 24 }}>
                {forgotStep === 1 
                  ? "Enter your registered email address" 
                  : `New password for ${forgotEmail}`}
              </p>
              
              {authMsg && (
                <Alert 
                  bg={forgotStep === 1 ? C.redDim : C.accentDim} 
                  color={forgotStep === 1 ? C.red : C.accent} 
                  msg={authMsg} 
                />
              )}
              
              {forgotStep === 1 && (
                <>
                  <Input
                    label="Email"
                    type="email"
                    value={forgotEmail}
                    onChange={setForgotEmail}
                    placeholder="you@company.com"
                    C={C}
                  />
                  <button
                    onClick={() => {
                      if (!forgotEmail) {
                        setAuthMsg("Please enter your email");
                      } else if (!users[forgotEmail]) {
                        setAuthMsg("No account found with that email");
                      } else {
                        setForgotStep(2);
                        setAuthMsg("");
                      }
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      cursor: "pointer",
                      padding: 13,
                      fontSize: 14,
                      width: "100%"
                    }}
                  >
                    Continue →
                  </button>
                </>
              )}
              
              {forgotStep === 2 && (
                <>
                  <Input
                    label="New Password"
                    type="password"
                    value={newPw}
                    onChange={setNewPw}
                    placeholder="Create new password"
                    C={C}
                  />
                  {newPw && (
                    <div style={{
                      marginTop: -8,
                      marginBottom: 14,
                      background: C.surfaceAlt,
                      borderRadius: 8,
                      padding: "10px 14px"
                    }}>
                      {pwRules(newPw).map(r => (
                        <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: r.ok ? C.accent : C.textFaint }}>
                            {r.ok ? "✓" : "○"}
                          </span>
                          <span style={{ fontSize: 11, color: r.ok ? C.accent : C.textMuted }}>
                            {r.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!pwRules(newPw).every(r => r.ok)) {
                        setAuthMsg("Password doesn't meet requirements");
                      } else {
                        // Update password (in a real app, this would be hashed)
                        setUsers(prev => ({
                          ...prev,
                          [forgotEmail]: {
                            ...prev[forgotEmail],
                            password: newPw
                          }
                        }));
                        setAuthMsg("Password reset! Please sign in.");
                        setTimeout(() => {
                          setScreen("login");
                          setForgotStep(1);
                          setForgotEmail("");
                          setNewPw("");
                        }, 1500);
                      }
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      cursor: "pointer",
                      padding: 13,
                      fontSize: 14,
                      width: "100%"
                    }}
                  >
                    Reset Password →
                  </button>
                </>
              )}
              
              <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 18 }}>
                <button
                  onClick={toLogin}
                  style={{
                    background: "none",
                    border: "none",
                    color: C.accent,
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  ← Back to login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PROFILE SCREEN
  if (screen === "profile") {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: C.bg, color: C.text }}>
        <NavBar />
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "36px clamp(16px, 4vw, 40px)"
        }}>
          <div style={{ width: "100%", maxWidth: 480, animation: "fadeUp 0.4s ease both" }}>
            <button
              onClick={goHome}
              style={{
                background: "none",
                border: "none",
                color: C.textMuted,
                cursor: "pointer",
                fontSize: 13,
                marginBottom: 22,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              ← Back to Dashboard
            </button>
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "clamp(20px, 4vw, 36px)"
            }}>
              <div style={{ textAlign: "center", marginBottom: 26 }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  color: "#fff",
                  fontWeight: 700,
                  margin: "0 auto 10px"
                }}>
                  {editProfile.name?.[0]?.toUpperCase() || "U"}
                </div>
                <p style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 1.8 }}>
                  EDIT PROFILE
                </p>
              </div>
              
              {profileMsg && <Alert bg={C.accentDim} color={C.accent} msg={profileMsg} />}
              
              <Input
                label="Full Name"
                value={editProfile.name}
                onChange={(v) => setEditProfile(p => ({ ...p, name: v }))}
                placeholder="Jane Smith"
                C={C}
              />
              
              <Input
                label="Company Name"
                value={editProfile.company}
                onChange={(v) => setEditProfile(p => ({ ...p, company: v }))}
                placeholder="Acme Corp"
                C={C}
              />
              
              <Input
                label="Email (read-only)"
                value={editProfile.email}
                onChange={() => {}}
                readOnly
                C={C}
                hint="Email cannot be changed after registration"
              />
              
              <button
                onClick={saveProfile}
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  cursor: "pointer",
                  padding: 13,
                  fontSize: 14,
                  width: "100%",
                  marginTop: 4
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (screen === "quiz") {
    const section = QUIZ[step];
    const progress = ((step + 1) / QUIZ.length) * 100;
    
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: C.bg, color: C.text }}>
        <NavBar />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 72px" }}>
          
          {/* Progress bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
              SECTION {step + 1} / {QUIZ.length}
            </span>
            <span style={{ fontSize: 11, color: C.accent, fontFamily: "'DM Mono', monospace" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{
            height: 4,
            background: C.border,
            borderRadius: 2,
            marginBottom: 28,
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${C.accent}, ${C.blue})`,
              borderRadius: 2,
              transition: "width 0.5s ease"
            }} />
          </div>

          {/* Section content */}
          <div style={{ animation: "fadeUp 0.35s ease both" }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>{section.icon}</div>
            <h2 style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 800, marginBottom: 4 }}>
              {section.label}
            </h2>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 22 }}>
              Tell us about your {section.label.toLowerCase()}
            </p>

            {/* Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {section.questions.map((q, qi) => (
                <div key={q.id} style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "16px 18px"
                }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                    <span style={{
                      color: C.accent,
                      fontFamily: "'DM Mono', monospace",
                      marginRight: 8,
                      fontSize: 10
                    }}>
                      {String(qi + 1).padStart(2, "0")}
                    </span>
                    {q.text}
                  </label>

                  {/* Text input */}
                  {q.type === "text" && (
                    <input
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder}
                      style={{
                        width: "100%",
                        background: C.inputBg,
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 8,
                        padding: "10px 12px",
                        color: C.text,
                        fontSize: 14,
                        outline: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = C.accent}
                      onBlur={(e) => e.target.style.borderColor = C.border}
                    />
                  )}

                  {/* Select options */}
                  {q.type === "select" && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {q.options.map(opt => {
                        const selected = answers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleAnswer(q.id, opt)}
                            style={{
                              padding: "7px 13px",
                              borderRadius: 6,
                              border: `1.5px solid ${selected ? C.accent : C.border}`,
                              background: selected ? C.accentDim : "transparent",
                              color: selected ? C.accent : C.textMuted,
                              fontSize: 12,
                              cursor: "pointer",
                              transition: "all 0.15s"
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Slider */}
                  {q.type === "slider" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 12, color: C.textMuted }}>0%</span>
                        <span style={{
                          color: C.accent,
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 14,
                          fontWeight: 600
                        }}>
                          {answers[q.id] || q.default}%
                        </span>
                        <span style={{ fontSize: 12, color: C.textMuted }}>100%</span>
                      </div>
                      <input
                        type="range"
                        min={q.min}
                        max={q.max}
                        value={answers[q.id] || q.default}
                        onChange={(e) => handleAnswer(q.id, parseInt(e.target.value))}
                        style={{ width: "100%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{
                    background: "transparent",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.textMuted,
                    cursor: "pointer",
                    padding: 13,
                    fontSize: 14,
                    flex: 1
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={nextStep}
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  cursor: "pointer",
                  padding: 13,
                  fontSize: 14,
                  flex: step > 0 ? 2 : 1
                }}
              >
                {step < QUIZ.length - 1 ? "Continue →" : "Generate Portfolio →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOADING SCREEN
  if (screen === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        width: "100%",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 64,
            height: 64,
            margin: "0 auto 20px",
            borderRadius: "50%",
            border: `3px solid ${C.border}`,
            borderTopColor: C.accent,
            animation: "spin 0.9s linear infinite"
          }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            Building your portfolio
          </h2>
          <p style={{
            color: C.textMuted,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: 2,
            animation: "pulse 1.5s infinite"
          }}>
            RUNNING FINANCIAL MODELS...
          </p>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  if (screen === "dashboard" && analysis) {
    const verdictColor = analysis.verdict === "PROFIT" ? C.accent : analysis.verdict === "BREAKEVEN" ? C.gold : C.red;
    const strategyColor = analysis.strategyRating === "STRONG" ? C.accent : analysis.strategyRating === "MODERATE" ? C.gold : C.red;

    const tabs = [
      { id: "overview", icon: "📃", label: "Overview" },
      { id: "charts", icon: "📊", label: "Charts" },
      { id: "strategy", icon: "🧠", label: "Strategy" },
      { id: "advisory", icon: "🎯", label: "High-end Advisory" },
    ];

    // Overview tab content
    const renderOverview = () => (
      <div style={{ animation: "fadeUp 0.35s ease both" }}>
        {/* KPI Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 11,
          marginBottom: 18
        }}>
          {[
            { label: "Health Score", value: `${analysis.score}/100`, color: analysis.score >= 65 ? C.accent : analysis.score >= 45 ? C.gold : C.red },
            { label: "Verdict", value: analysis.verdict, color: verdictColor },
            { label: "Strategy", value: analysis.strategyRating, color: strategyColor },
            { label: "Runway", value: answers.runway || "—", color: answers.runway === "< 3 months" ? C.red : C.accent },
            { label: "Revenue", value: answers.revenue || "—", color: C.text },
            { label: "Growth", value: answers.mrr_growth || "—", color: answers.mrr_growth?.includes("Growing") ? C.accent : C.red },
          ].map(k => (
            <div key={k.label} style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "13px 15px"
            }}>
              <p style={{ fontSize: 9, color: C.textMuted, letterSpacing: 1.5, fontFamily: "'DM Mono', monospace", marginBottom: 5 }}>
                {k.label.toUpperCase()}
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: k.color }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Score Ring and Alerts */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 14,
          marginBottom: 16
        }}>
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10
          }}>
            <ScoreRing score={analysis.score} C={C} />
            <p style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 1, textAlign: "center" }}>
              {analysis.score >= 65 ? "HEALTHY" : analysis.score >= 45 ? "AT RISK" : "CRITICAL"}
            </p>
          </div>

          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 18,
            minWidth: 0
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Risk Alerts</h3>
            {analysis.flags.length === 0 ? (
              <p style={{ color: C.accent, fontSize: 13 }}>✓ No critical flags detected</p>
            ) : (
              analysis.flags.map((f, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 10,
                  padding: "10px 12px",
                  background: f.type === "danger" ? C.redDim : C.goldDim,
                  borderLeft: `3px solid ${f.type === "danger" ? C.red : C.gold}`,
                  borderRadius: "0 8px 8px 0"
                }}>
                  <span style={{ flexShrink: 0 }}>{f.type === "danger" ? "🔴" : "🟡"}</span>
                  <p style={{ fontSize: 12, color: f.type === "danger" ? C.red : C.gold, lineHeight: 1.5 }}>
                    {f.msg}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Insights */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 18
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Portfolio Insights</h3>
          {analysis.insights.map((ins, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 10,
              marginBottom: 10,
              padding: "12px 14px",
              background: C.accentDim,
              borderRadius: 8
            }}>
              <span style={{ color: C.accent, fontSize: 13, flexShrink: 0 }}>◈</span>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{ins}</p>
            </div>
          ))}
        </div>
      </div>
    );

    // Charts tab content
    const renderCharts = () => (
      <div style={{ animation: "fadeUp 0.35s ease both", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* P&L Forecast */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 20
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>Projected P&L — 8 Quarter Forecast</h3>
          <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 18 }}>
            Based on current trajectory (USD thousands)
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analysis.lineData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.accent} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blue} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="quarter" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={(p) => <ChartTip {...p} C={C} />} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke={C.accent}
                fill="url(#revenueGradient)"
                strokeWidth={2}
                dot={{ fill: C.accent, r: 3 }}
              />
              <Area
                type="monotone"
                dataKey="Expenses"
                stroke={C.red}
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={{ fill: C.red, r: 3 }}
              />
              <Area
                type="monotone"
                dataKey="Profit"
                stroke={C.blue}
                fill="url(#profitGradient)"
                strokeWidth={2}
                dot={{ fill: C.blue, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Capital Distribution */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 20
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>Capital Distribution</h3>
          <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>
            Allocation across business functions
          </p>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <ResponsiveContainer width={190} height={190}>
              <PieChart>
                <Pie
                  data={analysis.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {analysis.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `${v}%`}
                  contentStyle={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, minWidth: 150 }}>
              {analysis.pieData.map((d, i) => (
                <div key={i} style={{ marginBottom: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, display: "inline-block" }} />
                      {d.name}
                    </span>
                    <span style={{ fontSize: 12, color: d.color, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
                      {d.value}%
                    </span>
                  </div>
                  <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${d.value}%`, background: d.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    // Strategy tab content
    const renderStrategy = () => (
      <div style={{ animation: "fadeUp 0.35s ease both", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Verdict Banner */}
        <div style={{
          background: C.surface,
          border: `1px solid ${verdictColor}`,
          borderRadius: 12,
          padding: 24,
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: `${verdictColor}08`
          }} />
          <p style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 1.8, marginBottom: 8 }}>
            FINANCIAL VERDICT
          </p>
          <h2 style={{ fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 800, color: verdictColor, letterSpacing: -2, marginBottom: 8 }}>
            {analysis.verdict}
          </h2>
          <p style={{ color: C.textMuted, fontSize: 13 }}>
            {analysis.verdict === "PROFIT" 
              ? "Your financial model suggests a profitable trajectory with current strategy."
              : analysis.verdict === "BREAKEVEN"
              ? "Near break-even. Minor optimisations could push you into profit."
              : "Loss indicators detected. Strategic restructuring recommended urgently."}
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 13 }}>
          {[
            { label: "Growth Trajectory", value: answers.mrr_growth, score: getGrowthScore(answers.mrr_growth) },
            { label: "Unit Economics", value: answers.burn, score: getBurnScore(answers.burn) },
            { label: "Market Position", value: answers.market_fit, score: getPMFScore(answers.market_fit) },
            { label: "Capital Efficiency", value: answers.runway, score: getRunwayScore(answers.runway) },
          ].map(item => {
            const color = item.score >= 70 ? C.accent : item.score >= 45 ? C.gold : C.red;
            return (
              <div key={item.label} style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 16
              }}>
                <p style={{ fontSize: 9, color: C.textMuted, letterSpacing: 1.5, fontFamily: "'DM Mono', monospace", marginBottom: 5 }}>
                  {item.label.toUpperCase()}
                </p>
                <p style={{ fontSize: 12, color: C.text, marginBottom: 11 }}>{item.value}</p>
                <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${item.score}%`, background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: C.textFaint }}>0</span>
                  <span style={{ fontSize: 10, color, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{item.score}</span>
                  <span style={{ fontSize: 9, color: C.textFaint }}>100</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategy Evaluation */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 18
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Strategy Evaluation</h3>
          {[
            { q: "Growth strategy", a: answers.strategy, note: getStrategyNote(answers.strategy) },
            { q: "12-month goal", a: answers.goal, note: getGoalNote(answers.goal) },
            { q: "Team vs stage", a: `${answers.headcount} (${answers.stage})`, note: "Validate hiring velocity against revenue milestones." },
          ].map((row, i) => (
            <div key={i} style={{
              background: C.bg,
              borderRadius: 8,
              padding: "12px 14px",
              borderLeft: `3px solid ${C.border}`,
              marginBottom: 10
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
                  {row.q.toUpperCase()}
                </span>
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>{row.a}</span>
              </div>
              <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>→ {row.note}</p>
            </div>
          ))}
        </div>
      </div>
    );

    // Advisory tab content with expandable category boxes
    const renderAdvisory = () => (
      <div style={{ animation: "fadeUp 0.35s ease both" }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.accentDim}, ${C.blueDim})`,
          border: `1px solid ${C.accent}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          textAlign: "center"
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: C.accent }}>
            High-end Advisory Network
          </h3>
          <p style={{ color: C.textMuted, fontSize: 14, maxWidth: 500, margin: "0 auto" }}>
            Click on any category to connect with top-tier advisors
          </p>
        </div>

        {/* Category Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: 16 
        }}>
          {ADVISORY_EXPERTS.map((category) => (
            <div key={category.category}>
              {/* Category Box */}
              <div 
                onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                style={{
                  background: C.surface,
                  border: `2px solid ${expandedCategory === category.category ? C.accent : C.border}`,
                  borderRadius: 12,
                  padding: 24,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Hover effect */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 30% 30%, ${C.accentDim}, transparent 70%)`,
                  opacity: 0,
                  transition: "opacity 0.2s",
                  pointerEvents: "none"
                }} />
                
                <div style={{ fontSize: 48, marginBottom: 12 }}>{category.icon}</div>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 8 }}>
                  {category.category}
                </h4>
                <p style={{ color: C.textMuted, fontSize: 12 }}>
                  {category.experts.length} advisor{category.experts.length > 1 ? 's' : ''} available
                </p>
                
                {/* Expand/collapse indicator */}
                <div style={{
                  marginTop: 12,
                  color: C.accent,
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4
                }}>
                  {expandedCategory === category.category ? (
                    <>▲ Click to collapse</>
                  ) : (
                    <>▼ Click to expand</>
                  )}
                </div>
              </div>

              {/* Expanded Experts Section */}
              {expandedCategory === category.category && (
                <div style={{
                  marginTop: 12,
                  marginBottom: 12,
                  padding: 16,
                  background: C.surfaceAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  animation: "fadeUp 0.3s ease"
                }}>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                    gap: 12 
                  }}>
                    {category.experts.map((expert, idx) => (
                      <ExpertCard key={idx} expert={expert} C={C} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 24,
          padding: 16,
          background: C.goldDim,
          border: `1px solid ${C.gold}`,
          borderRadius: 8,
          textAlign: "center"
        }}>
          <p style={{ fontSize: 13, color: C.gold, lineHeight: 1.6 }}>
            ⚡ Premium advisory services available for qualified enterprises. 
            Our relationship managers will facilitate personalized introductions.
          </p>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: "100vh", width: "100%", background: C.bg, color: C.text }}>
        <NavBar />
        
        {/* Main dashboard layout */}
        <div style={{ display: "flex", minHeight: "calc(100vh - 58px)" }}>
          {/* Desktop sidebar */}
          <div style={{
            width: 210,
            flexShrink: 0,
            background: C.surface,
            borderRight: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 58,
            height: "calc(100vh - 58px)",
            overflowY: "auto"
          }}>
            <div style={{ padding: "18px 14px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 3, letterSpacing: 1.5 }}>
                  LOGGED IN AS
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{currentUser?.name}</p>
                <p style={{ fontSize: 11, color: C.textMuted }}>{currentUser?.company}</p>
              </div>
            </div>
            
            <nav style={{ padding: "12px 10px", flex: 1 }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    setExpandedCategory(null); // Reset expanded category when switching tabs
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: activeTab === t.id ? C.accentDim : "transparent",
                    color: activeTab === t.id ? C.accent : C.textMuted,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: 2,
                    transition: "all 0.15s",
                    textAlign: "left"
                  }}
                >
                  <span style={{ fontSize: 14 }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>

            <div style={{ padding: 12, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 1.2 }}>THEME</span>
                <button
                  onClick={() => setDark(!dark)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    border: `1.5px solid ${C.border}`,
                    background: dark ? C.accent : C.surfaceAlt,
                    cursor: "pointer",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 3px"
                  }}
                >
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: dark ? "#fff" : C.text,
                    transform: dark ? "translateX(20px)" : "translateX(0)",
                    transition: "transform 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9
                  }}>
                    {dark ? "🌙" : "☀"}
                  </div>
                </button>
              </div>
              <button
                onClick={openProfile}
                style={{
                  background: "transparent",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.textMuted,
                  cursor: "pointer",
                  padding: 9,
                  fontSize: 12,
                  width: "100%"
                }}
              >
                ✏ Edit Profile
              </button>
              <button
                onClick={() => {
                  setScreen("quiz");
                  setStep(0);
                  setAnswers({});
                  setAnalysis(null);
                  // Clear saved answers for this user
                  localStorage.removeItem(`veridex_answers_${session}`);
                }}
                style={{
                  background: "transparent",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.textMuted,
                  cursor: "pointer",
                  padding: 9,
                  fontSize: 12,
                  width: "100%"
                }}
              >
                ↺ Retake Quiz
              </button>
              <button
                onClick={logout}
                style={{
                  background: "transparent",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.textMuted,
                  cursor: "pointer",
                  padding: 9,
                  fontSize: 12,
                  width: "100%"
                }}
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "28px 32px" }}>
            {/* Header */}
            <div style={{ marginBottom: 22, animation: "fadeUp 0.4s ease both" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h1 style={{ fontSize: "clamp(17px, 3vw, 23px)", fontWeight: 800, marginBottom: 3 }}>
                    {currentUser?.company || answers.name || "Company"} Portfolio
                  </h1>
                  <p style={{ color: C.textMuted, fontSize: 12 }}>
                    {answers.industry} · {answers.stage}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Chip color={verdictColor} label={analysis.verdict} />
                  <Chip color={strategyColor} label={`STRATEGY: ${analysis.strategyRating}`} />
                </div>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === "overview" && renderOverview()}
            {activeTab === "charts" && renderCharts()}
            {activeTab === "strategy" && renderStrategy()}
            {activeTab === "advisory" && renderAdvisory()}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Helper functions for strategy tab (same as before)
function getGrowthScore(growth) {
  const scores = {
    "Declining > 20%": 20,
    "Declining 0–20%": 35,
    "Flat": 50,
    "Growing 1–20%": 65,
    "Growing 20–50%": 80,
    "Growing 50%+": 95
  };
  return scores[growth] || 50;
}

function getBurnScore(burn) {
  const scores = {
    "Profitable": 95,
    "< $10k": 75,
    "$10k – $50k": 55,
    "$50k – $200k": 35,
    "$200k+": 15
  };
  return scores[burn] || 50;
}

function getPMFScore(pmf) {
  const scores = {
    "Still searching": 20,
    "Early signs": 40,
    "Moderate PMF": 60,
    "Strong PMF": 80,
    "Dominant in niche": 95
  };
  return scores[pmf] || 50;
}

function getRunwayScore(runway) {
  const scores = {
    "< 3 months": 10,
    "3 – 6 months": 30,
    "6 – 12 months": 55,
    "12 – 24 months": 75,
    "24+ months / Profitable": 95
  };
  return scores[runway] || 50;
}

function getStrategyNote(strategy) {
  const notes = {
    "Product-led growth": "PLG is capital-efficient. Ensure activation loop is tight.",
    "Sales-led growth": "Requires strong sales team. Monitor CAC payback period.",
    "Marketing / content": "Focus on ROI metrics. Content takes time to compound.",
    "Partnerships / BD": "Good for reach, but control can be diluted.",
    "Viral / referral": "High leverage if product has network effects.",
    "Multiple channels": "Diversified but harder to optimize. Prioritize top performers."
  };
  return notes[strategy] || "Measure ROI carefully across your chosen channel.";
}

function getGoalNote(goal) {
  const notes = {
    "Survive & extend runway": "Critical phase. Cut non-essential spend and focus on core product.",
    "Find product-market fit": "Talk to customers daily. Pivot until you see pull.",
    "Scale revenue aggressively": "Pour fuel on what works. Double down on growth channels.",
    "Raise next funding round": "Build metrics story. Show traction and clear path to scale.",
    "Achieve profitability": "Aligns with capital-efficient growth. Good investor signal.",
    "Expand to new markets": "Validate demand before heavy investment. Start with adjacent markets."
  };
  return notes[goal] || "Focus on one priority — spreading too thin is a common startup killer.";
}