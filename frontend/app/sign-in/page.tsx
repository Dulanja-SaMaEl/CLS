"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle, AlertTriangle } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"member" | "admin">("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem("cls_admin_token", data.token);
        }
        if (data.user) {
          localStorage.setItem("cls_user", JSON.stringify(data.user));
        }

        if (data.user?.role === "admin" || role === "admin") {
          router.push("/admin");
        } else {
          router.push("/member");
        }
      } else {
        setErrorMessage(data.error || "Authentication failed. Please verify your credentials.");
      }
    } catch (err: any) {
      setErrorMessage("Network error connecting to authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (targetRole: "member" | "admin") => {
    setRole(targetRole);
    setErrorMessage(null);
    if (targetRole === "admin") {
      setEmail("admin@cls.com");
      setPassword("Password@123");
    } else {
      setEmail("asoka.desilva@lawchambers.lk");
      setPassword("AdvocatePassword#123");
    }
  };

  return (
    <div className="min-h-screen bg-noir-900 text-stone-100 flex flex-col justify-between selection:bg-bronze selection:text-noir-900 font-sans">
      {/* Top Header */}
      <div className="p-6 lg:p-8 flex items-center justify-between border-b border-hairline-dark">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 border border-bronze/40 flex items-center justify-center bg-noir-800 text-bronze group-hover:border-bronze transition-colors">
            <Scale className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-wider text-white leading-none">
              COLOMBO LAW SOCIETY
            </span>
            <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase">
              ESTABLISHED 1890 • HULFTSDORP
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-white transition-colors"
        >
          ← Back to Main Site
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-noir-800/90 border border-hairline-dark p-8 md:p-10 shadow-2xl relative">
          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-noir-900 border border-white/10 mb-8 font-mono text-xs uppercase tracking-wider">
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setErrorMessage(null);
              }}
              className={`py-2 text-center transition-all ${
                role === "admin"
                  ? "bg-[#C5A059] text-noir-900 font-bold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Chambers Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("member");
                setErrorMessage(null);
              }}
              className={`py-2 text-center transition-all ${
                role === "member"
                  ? "bg-sand text-noir-900 font-bold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Member Advocate
            </button>
          </div>

          <div className="mb-6">
            <span className="text-[10px] font-mono text-bronze uppercase tracking-widest block mb-1">
              SECURE PORTAL ACCESS
            </span>
            <h2 className="font-display text-3xl uppercase tracking-wider text-white">
              {role === "admin" ? "ADMINISTRATIVE LOGIN" : "ADVOCATE SIGN IN"}
            </h2>
            <p className="text-xs text-stone-400 font-sans mt-1">
              {role === "admin"
                ? "Enter your executive credentials to manage membership, events, and showcase."
                : "Enter your registered email and password to access member privileges."}
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Admin Credential Notice */}
          {role === "admin" && (
            <div className="mb-6 p-3 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded text-stone-300 text-xs font-mono space-y-1">
              <div className="text-[10px] text-[#C5A059] uppercase font-bold tracking-wider">
                Executive Admin Access
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-400">Username:</span>
                <span className="text-white font-semibold select-all">admin@cls.com</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-400">Password:</span>
                <span className="text-white font-semibold select-all">Password@123</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
            <div>
              <label className="block text-stone-300 uppercase tracking-widest mb-1.5">
                {role === "admin" ? "Administrator Email" : "Official Email Address"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "admin" ? "admin@cls.com" : "counsel@bar.lk"}
                  className="w-full pl-10 pr-4 py-2.5 bg-noir-900 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-bronze"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-stone-300 uppercase tracking-widest">
                  Password
                </label>
                <Link
                  href="/sign-in"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Admin password reset protocol: Please consult Secretariat Chambers.");
                  }}
                  className="text-[10px] text-bronze hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-noir-900 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-bronze"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#C5A059] text-noir-900 font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#d6b168] transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? "Authenticating..." : "Authorize Access"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-8 pt-6 border-t border-hairline-dark">
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block mb-2 text-center">
              ONE-CLICK CREDENTIAL AUTOFILL
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setDemoCredentials("admin")}
                className="py-2 px-2 border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059]/20 text-center font-bold transition"
              >
                Autofill Admin (admin@cls.com)
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("member")}
                className="py-2 px-2 border border-white/10 text-stone-400 hover:text-white hover:border-white/30 text-center transition"
              >
                Autofill Advocate
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs font-mono text-stone-400">
            <span>Not yet enrolled? </span>
            <Link href="/sign-up" className="text-sand font-bold hover:underline">
              Submit Membership Application →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <div className="p-6 text-center text-[11px] font-mono text-stone-500 uppercase tracking-widest border-t border-hairline-dark">
        &copy; {new Date().getFullYear()} COLOMBO LAW SOCIETY • SUPERIOR COURTS COMPLEX
      </div>
    </div>
  );
}
