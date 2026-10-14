"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/member");
      }
    }, 600);
  };

  const setDemoCredentials = (targetRole: "member" | "admin") => {
    setRole(targetRole);
    if (targetRole === "admin") {
      setEmail("admin@colombolaw.org");
      setPassword("ColomboLawAdmin@2026");
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
              onClick={() => setRole("member")}
              className={`py-2 text-center transition-all ${
                role === "member"
                  ? "bg-sand text-noir-900 font-bold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Member Advocate
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`py-2 text-center transition-all ${
                role === "admin"
                  ? "bg-bronze text-noir-900 font-bold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Chambers Admin
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
                ? "Enter your executive credentials to manage membership and events."
                : "Enter your registered email and password to access member privileges."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
            <div>
              <label className="block text-stone-300 uppercase tracking-widest mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="counsel@bar.lk"
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
                  onClick={() => alert("Password reset instructions dispatched to your registered email.")}
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
              className="w-full py-3 bg-sand text-noir-900 font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Authenticating..." : "Authorize Access"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-8 pt-6 border-t border-hairline-dark">
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block mb-2 text-center">
              QUICK DEMO CREDENTIALS
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setDemoCredentials("member")}
                className="py-1.5 px-2 border border-white/10 text-stone-400 hover:text-white hover:border-white/30 text-center"
              >
                Autofill Advocate
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("admin")}
                className="py-1.5 px-2 border border-bronze/30 text-bronze hover:bg-bronze/10 text-center"
              >
                Autofill Admin
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
