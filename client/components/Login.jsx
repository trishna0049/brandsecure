"use client";
import { useState } from "react";
import API from "@/lib/api";
import { Icon } from "./common";

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
          <input type="password" style={inputStyle} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
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

export default Login;