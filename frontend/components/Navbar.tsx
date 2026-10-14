"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scale, Menu, X, ArrowUpRight, LogOut, User, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cls_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cls_token");
      localStorage.removeItem("cls_admin_token");
      localStorage.removeItem("cls_user");
      document.cookie = "cls_member_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "cls_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setCurrentUser(null);
      router.push("/sign-in");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10">
      {/* Top Micro Ticker */}
      <div className="hidden xl:flex items-center justify-between px-8 py-1.5 text-[10px] tracking-widest uppercase border-b border-white/5 text-[#A0A0A0] font-mono">
        <div className="flex items-center space-x-6">
          <span>SUPERIOR COURTS ENCLAVE • HULFTSDORP • COLOMBO 12</span>
          <span className="text-[#C5A059]">ESTABLISHED 1890 &bull; BASL BRANCH 1975</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-white/60">COLOMBO LAW SOCIETY BAR</span>
          <span className="text-white/20">|</span>
          <Link href="/events" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">
            <span>ANNUAL LAW CONFERENCE REGISTRATION OPEN</span>
            <ArrowUpRight className="w-3 h-3 text-[#C5A059]" />
          </Link>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Brand / Logo (Left) */}
        <Link href="/" className="flex items-center space-x-3 group shrink-0">
          <div className="w-10 h-10 rounded-full border border-[#C5A059]/60 p-0.5 flex items-center justify-center bg-[#141414] overflow-hidden group-hover:border-[#C5A059] transition-all">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/branding/cls-crest-gold.png"
              alt="Colombo Law Society Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-2xl tracking-wider text-white leading-none">
              COLOMBO LAW SOCIETY
            </span>
            <span className="text-[9px] tracking-widest font-mono text-[#A0A0A0] uppercase mt-0.5">
              HULFTSDORP &bull; SRI LANKA
            </span>
          </div>
        </Link>

        {/* Center Multi-column Navigation */}
        <div className="hidden lg:flex items-start space-x-12 text-[11px] font-mono tracking-wider">
          {/* Column 1: Society & Leadership */}
          <div>
            <span className="text-white font-bold uppercase tracking-widest block mb-1">
              THE SOCIETY
            </span>
            <ul className="space-y-0.5 text-[#A0A0A0]">
              <li>
                <Link href="/team" className="hover:text-[#C5A059] transition-colors">
                  Our Team &bull; Council
                </Link>
              </li>
              <li>
                <Link href="/past-presidents" className="hover:text-[#C5A059] transition-colors">
                  Past Presidents
                </Link>
              </li>
              <li>
                <Link href="/vice-presidents" className="hover:text-[#C5A059] transition-colors">
                  Vice Presidents
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#C5A059] transition-colors">
                  50 Years History
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Practices & CLE */}
          <div>
            <span className="text-white font-bold uppercase tracking-widest block mb-1">
              PRACTICES
            </span>
            <ul className="space-y-0.5 text-[#A0A0A0]">
              <li>
                <Link href="/#practices" className="hover:text-[#C5A059] transition-colors">
                  Supreme Court Writs
                </Link>
              </li>
              <li>
                <Link href="/#practices" className="hover:text-[#C5A059] transition-colors">
                  Commercial Arbitration
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#C5A059] transition-colors">
                  CLE &amp; Symposiums
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#C5A059] transition-colors flex items-center gap-1 font-semibold text-[#E7E0D3]">
                  <span>Event Showcase</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                </Link>
              </li>
              <li>
                <Link href="/member" className="hover:text-[#C5A059] transition-colors">
                  Hulftsdorp Bar Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Desk */}
          <div>
            <span className="text-white font-bold uppercase tracking-widest block mb-1">
              CONTACT US
            </span>
            <ul className="space-y-0.5 text-[#A0A0A0]">
              <li>
                <a href="mailto:info@colombolawsociety.com" className="hover:text-white transition-colors">
                  info@colombolawsociety.com
                </a>
              </li>
              <li>
                <a href="tel:+94711923531" className="text-white/80 hover:text-white">
                  +94 71 192 3531
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-[#C5A059] hover:underline flex items-center gap-1 font-semibold">
                  <span>Admin Console</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons (Right) */}
        <div className="hidden sm:flex items-center space-x-3 shrink-0">
          {currentUser ? (
            <>
              {currentUser.role === "admin" || currentUser.email === "admin@cls.com" ? (
                <Link
                  href="/admin"
                  className="px-3.5 py-1.5 text-[11px] tracking-widest uppercase bg-[#C5A059] text-black font-bold border border-[#C5A059] hover:bg-[#d6b168] transition-all font-mono flex items-center gap-1.5 rounded-sm shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </Link>
              ) : (
                <Link
                  href="/member"
                  className="px-3.5 py-1.5 text-[11px] tracking-widest uppercase text-stone-200 hover:text-white border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#141414] transition-all font-mono flex items-center gap-1.5 rounded-sm"
                >
                  <User className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Advocate Hub</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-[11px] tracking-widest uppercase text-stone-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all font-mono flex items-center gap-1 rounded-sm"
                title="Log Out"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-3.5 py-1.5 text-[11px] tracking-widest uppercase text-stone-300 hover:text-white border border-white/20 hover:border-[#C5A059] transition-all font-mono"
              >
                Portal Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-[11px] tracking-widest uppercase bg-[#E7E0D3] text-black hover:bg-white transition-all font-mono font-bold rounded-sm shadow-sm"
              >
                Get In Touch
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-stone-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#141414] border-b border-white/10 px-6 py-6 flex flex-col space-y-4 text-xs uppercase tracking-widest font-mono">
          <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="text-stone-300 hover:text-white">
            About the Society
          </Link>
          <Link href="/team" onClick={() => setMobileMenuOpen(false)} className="text-[#C5A059] hover:text-white font-bold">
            Executive Team &amp; Council
          </Link>
          <Link href="/past-presidents" onClick={() => setMobileMenuOpen(false)} className="text-stone-300 hover:text-white">
            Past Presidents (1975–Present)
          </Link>
          <Link href="/vice-presidents" onClick={() => setMobileMenuOpen(false)} className="text-stone-300 hover:text-white">
            Vice Presidents &amp; Deputies
          </Link>
          <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="text-stone-300 hover:text-white">
            Conferences &amp; CPD
          </Link>
          <Link href="/gallery" onClick={() => setMobileMenuOpen(false)} className="text-[#C5A059] hover:text-white font-bold flex items-center gap-1.5">
            <span>Event Showcase &bull; Gallery</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          </Link>
          <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="text-stone-300 hover:text-white">
            Inquiries &amp; FAQ
          </Link>
          <div className="pt-4 border-t border-white/10 flex flex-col space-y-2.5">
            {currentUser ? (
              <>
                {currentUser.role === "admin" || currentUser.email === "admin@cls.com" ? (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 bg-[#C5A059] text-black font-bold"
                  >
                    Executive Admin Console
                  </Link>
                ) : (
                  <Link
                    href="/member"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 bg-[#1A1A1A] border border-[#C5A059] text-[#C5A059]"
                  >
                    Advocate Hub &bull; Bar Library
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-center py-2 border border-red-500/40 text-red-400"
                >
                  Sign Out of Session
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40"
                >
                  Portal Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-[#E7E0D3] text-black font-bold"
                >
                  Get In Touch &bull; Enrol Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
