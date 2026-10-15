"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentMockMember, CLSEvent } from "@/lib/mockData";
import {
  Scale,
  Award,
  Calendar,
  CreditCard,
  QrCode,
  Download,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight,
  Camera,
  Sparkles,
  RefreshCw,
  Bell,
  LogOut,
} from "lucide-react";

export default function MemberDashboardPage() {
  const router = useRouter();
  const [member, setMember] = useState(currentMockMember);
  const [activeTab, setActiveTab] = useState<"card" | "events" | "history" | "profile">("card");
  const [selectedTicket, setSelectedTicket] = useState<{
    eventId: number;
    eventTitle: string;
    venue: string;
    date: string;
    ticketType: string;
    status: string;
    qrCode: string;
  } | null>(null);

  const [renewalSuccess, setRenewalSuccess] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMemberToken = localStorage.getItem("cls_token");
      const storedAdminToken = localStorage.getItem("cls_admin_token");
      const storedUser = localStorage.getItem("cls_user");
      const hasMemberCookie = document.cookie.includes("cls_member_session=true");
      const hasAdminCookie = document.cookie.includes("cls_admin_session=true");

      const isAuthed =
        hasMemberCookie ||
        hasAdminCookie ||
        Boolean(storedMemberToken) ||
        Boolean(storedAdminToken) ||
        Boolean(storedUser);

      if (!isAuthed) {
        setIsAuthorized(false);
        window.location.href = "/sign-in?redirect=/member";
      } else {
        setIsAuthorized(true);
        const isSecure = window.location.protocol === "https:";
        const secureFlag = isSecure ? "; Secure" : "";
        if (!hasMemberCookie && !hasAdminCookie) {
          document.cookie = `cls_member_session=true; path=/; max-age=604800; SameSite=Lax${secureFlag}`;
        }
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed.name) {
              setMember((prev) => ({
                ...prev,
                name: parsed.name,
                email: parsed.email || prev.email,
                sc_en: parsed.sc_en || prev.sc_en,
                membershipTier: parsed.membershipTier || prev.membershipTier,
              }));
            }
          } catch (e) {}
        }
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cls_token");
      localStorage.removeItem("cls_admin_token");
      localStorage.removeItem("cls_user");
      document.cookie = "cls_member_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "cls_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "cls_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "cls_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/sign-in";
    }
  };

  const handleSimulateRenewal = () => {
    setIsRenewing(true);
    setTimeout(() => {
      setMember((prev) => ({
        ...prev,
        validUntil: "31 Dec, 2027",
        recentTransactions: [
          {
            receiptNo: `CLS-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            description: "Annual Ordinary Membership Subscription (2027 Renewal)",
            amount: 2000.0,
            date: "Today, Just Now",
            method: "Online Bar Card Gateway",
            status: "Completed",
          },
          ...prev.recentTransactions,
        ],
      }));
      setIsRenewing(false);
      setRenewalSuccess(true);
      setTimeout(() => setRenewalSuccess(false), 5000);
    }, 1200);
  };

  if (isAuthorized === null || isAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-full border border-[#C5A059]/40 p-2 flex items-center justify-center bg-[#141414] mb-6 shadow-2xl relative">
          <Scale className="w-8 h-8 text-[#C5A059] animate-pulse" />
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A059] block mb-2">
          Colombo Law Society &bull; Bar Library &amp; Advocate Hub
        </span>
        <h2 className="text-xl sm:text-2xl font-display text-white uppercase tracking-wider mb-2">
          Verifying Advocate Membership
        </h2>
        <p className="text-xs font-mono text-stone-400 max-w-md mb-6">
          Access to the Bar Library and Advocate Hub requires an active Colombo Law Society membership session. Redirecting to sign in...
        </p>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div className="w-1/2 h-full bg-[#C5A059] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E7E0D3] selection:bg-[#C5A059] selection:text-black">
      <Navbar />

      {/* Hero / Header Bar */}
      <section className="pt-32 pb-10 border-b border-white/10 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full border-2 border-[#C5A059] overflow-hidden bg-[#1A1A1A] relative shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  title="Upload New Photograph"
                  className="absolute bottom-0 right-0 p-1.5 bg-[#C5A059] text-black rounded-full shadow hover:bg-[#b08e4d] transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-white">
                    {member.salutation} {member.name}
                  </h1>
                  <span className="px-2.5 py-0.5 bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] text-[11px] font-mono tracking-wider rounded-full uppercase font-bold">
                    {member.membershipTier} Member
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Enrolment Active
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-[#A0A0A0] flex-wrap">
                  <span className="font-mono text-white/90">SC/EN: {member.sc_en}</span>
                  <span>&bull;</span>
                  <span className="font-mono">BASL: {member.ba_en}</span>
                  <span>&bull;</span>
                  <span>Member Since {member.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSimulateRenewal}
                disabled={isRenewing}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-xs uppercase tracking-wider transition rounded shadow-lg shadow-[#C5A059]/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRenewing ? "animate-spin" : ""}`} />
                {isRenewing ? "Processing Renewal..." : "Renew 2027 Subscription (LKR 2,000)"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-semibold text-xs uppercase tracking-wider transition rounded"
                title="End Advocate Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {renewalSuccess && (
            <div className="mt-6 p-4 bg-emerald-500/15 border border-emerald-500/40 rounded flex items-center gap-3 text-emerald-300 text-xs animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Subscription Successfully Extended!</strong> Your Ordinary Membership has been renewed through <strong>31 Dec, 2027</strong>. Receipt No. #CLS-REC-2026-9042 logged.
              </span>
            </div>
          )}

          {/* Navigation Sub-Tabs */}
          <div className="flex gap-2 sm:gap-6 mt-10 border-b border-white/10 overflow-x-auto no-scrollbar">
            {[
              { id: "card", label: "Digital Bar Card & Identification", icon: Award },
              { id: "events", label: "CLE Symposiums & Passes", icon: Calendar },
              { id: "history", label: "Receipts & Dues Ledger", icon: CreditCard },
              { id: "profile", label: "Chambers & Judicial Listing", icon: Building },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-4 px-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all border-b-2 ${
                    isActive
                      ? "border-[#C5A059] text-[#C5A059]"
                      : "border-transparent text-[#A0A0A0] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        {/* TAB 1: DIGITAL BAR CARD */}
        {activeTab === "card" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* The Digital Card Component */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative group perspective-1000">
                {/* Visual Glassmorphism Bar Card */}
                <div className="w-full bg-gradient-to-br from-[#1C1C1C] via-[#121212] to-[#0A0A0A] border-2 border-[#C5A059] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  {/* Subtle Background Watermark & Guilloche Pattern */}
                  <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
                    <Scale className="w-80 h-80 text-white" />
                  </div>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-[#C5A059]/30 pb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow">
                        <Scale className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-display tracking-widest text-white text-base uppercase leading-none">
                          COLOMBO LAW SOCIETY
                        </div>
                        <div className="text-[10px] uppercase font-mono tracking-wider text-[#C5A059] mt-1">
                          Hulftsdorp Superior Courts Enclave &bull; Est. 1890
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-[#C5A059]">
                        {member.membershipId}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                        VERIFIED BAR PASS
                      </div>
                    </div>
                  </div>

                  {/* Card Main Info */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
                    {/* Portrait Frame */}
                    <div className="w-28 h-36 rounded-lg border-2 border-[#C5A059]/70 overflow-hidden relative shadow-lg flex-shrink-0 bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale contrast-125"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/80 py-0.5 text-center text-[8px] font-mono uppercase text-[#C5A059]">
                        AUTHENTICATED
                      </div>
                    </div>

                    {/* Legal Identity Details */}
                    <div className="flex-1 space-y-3 text-center sm:text-left">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#A0A0A0]">
                          Attorney-at-Law / Advocate
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-white leading-tight">
                          {member.name}
                        </h2>
                        <div className="text-xs text-[#C5A059] font-serif italic">
                          Supreme Court of Sri Lanka
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-white/10">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-[#A0A0A0]">SC Enrolment</div>
                          <div className="font-mono text-xs text-white font-semibold">{member.sc_en}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-[#A0A0A0]">BASL Enrolment</div>
                          <div className="font-mono text-xs text-white font-semibold">{member.ba_en}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-[#A0A0A0]">Classification</div>
                          <div className="text-xs text-[#C5A059] font-bold">{member.membershipTier} Member</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-[#A0A0A0]">Valid Through</div>
                          <div className="font-mono text-xs text-emerald-400 font-bold">{member.validUntil}</div>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Security Stamp */}
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-md flex-shrink-0">
                      <div className="w-20 h-20 bg-black flex items-center justify-center relative p-1 rounded">
                        <QrCode className="w-full h-full text-white" />
                      </div>
                      <span className="text-[8px] font-mono tracking-tighter text-black uppercase mt-1.5 font-bold">
                        SECURE ID SCAN
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Micro-Bar */}
                  <div className="mt-6 pt-4 border-t border-[#C5A059]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#A0A0A0] relative z-10">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                      Admitted to the Superior Courts Bar Library &amp; Chambers Roster
                    </span>
                    <span className="font-mono text-[#C5A059]">CHAMBERS: COLOMBO 12</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-between items-center bg-[#141414] p-4 border border-white/10 rounded">
                <div className="text-xs text-[#A0A0A0]">
                  Presented for identity verification at the Hulftsdorp Bar Library &amp; AGM Quorum.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => alert("Digital Bar Card export initiated in high-resolution PDF format.")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/20 text-xs font-semibold uppercase tracking-wider text-white transition rounded"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                    Save PDF Card
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Bar Privileges & CPD Progression */}
            <div className="lg:col-span-5 space-y-6">
              {/* CPD Progress Meter */}
              <div className="bg-[#141414] border border-white/10 p-6 rounded relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                      Continuing Professional Development
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-wide text-white mt-0.5">
                      2026 CPD Credit Progression
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <div className="text-3xl font-display text-white">
                    {member.cpdCreditsEarned}{" "}
                    <span className="text-xs font-normal text-[#A0A0A0] font-sans">
                      / {member.cpdCreditsTarget} Mandatory Units
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#C5A059]">
                    {Math.round((member.cpdCreditsEarned / member.cpdCreditsTarget) * 100)}% Fulfilled
                  </span>
                </div>

                {/* Meter Bar */}
                <div className="w-full h-2.5 bg-[#252525] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#E7E0D3] rounded-full transition-all duration-700"
                    style={{
                      width: `${(member.cpdCreditsEarned / member.cpdCreditsTarget) * 100}%`,
                    }}
                  />
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-[#A0A0A0] border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Supreme Court Annual Symposium</span>
                    <span className="font-mono text-[#C5A059] font-bold">+8 Credits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Commercial Arbitration Masterclass</span>
                    <span className="font-mono text-[#C5A059] font-bold">+6 Credits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Appellate Advocacy Workshop</span>
                    <span className="font-mono text-[#C5A059] font-bold">+4 Credits</span>
                  </div>
                </div>

                <Link
                  href="/events"
                  className="mt-5 block w-full text-center py-2.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/20 text-xs uppercase tracking-wider text-white font-semibold transition rounded"
                >
                  Browse Accredited CLE Courses
                </Link>
              </div>

              {/* Society Privileges Overview */}
              <div className="bg-[#141414] border border-white/10 p-6 rounded space-y-4">
                <h4 className="font-display text-base uppercase tracking-wider text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#C5A059]" />
                  Active Hulftsdorp Privileges
                </h4>
                <ul className="text-xs text-[#A0A0A0] space-y-2.5">
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                    Unlimited access to Hulftsdorp Bar Library archives &amp; NLR Law Reports.
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                    Reserved robing room and private consultation booths at Superior Courts.
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                    Member preferential pricing on all CLE conferences and Law Dinners.
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                    Emergency Advocate Benevolent Fund coverage.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTERED EVENTS & ENTRY PASSES */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                  My Enrolled Conferences &amp; Masterclasses
                </h2>
                <p className="text-xs text-[#A0A0A0] mt-1">
                  Access admission bar codes for scanning at the registration desks of the Superior Courts Complex or BMICH.
                </p>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-xs uppercase tracking-wider transition rounded"
              >
                Register for More Events
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {member.registeredEvents.map((ev) => (
                <div
                  key={ev.eventId}
                  className="bg-[#141414] border border-white/10 hover:border-[#C5A059]/50 rounded-lg p-6 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-mono uppercase tracking-wider rounded">
                        {ev.ticketType}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {ev.status}
                      </span>
                    </div>

                    <h3 className="font-display text-xl uppercase tracking-wide text-white leading-snug">
                      {ev.eventTitle}
                    </h3>

                    <div className="text-xs text-[#A0A0A0] space-y-1.5 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{ev.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-xs text-[#A0A0A0]">{ev.qrCode}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(ev)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/20 text-xs font-medium text-white transition rounded"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#C5A059]" />
                      View Entry QR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DUES & RECEIPTS HISTORY */}
        {activeTab === "history" && (
          <div className="bg-[#141414] border border-white/10 rounded-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                  Official Society Receipts &amp; Dues Ledger
                </h2>
                <p className="text-xs text-[#A0A0A0] mt-1">
                  Verified receipts for membership dues and continuing legal education subscriptions.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-[#A0A0A0] block">Current Standing</span>
                <span className="text-sm font-bold text-emerald-400">Dues Cleared (No Arrears)</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1C1C] text-[#A0A0A0] uppercase tracking-wider font-mono text-[11px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-6">Receipt No.</th>
                    <th className="py-3 px-6">Description</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Payment Mode</th>
                    <th className="py-3 px-6 text-right">Amount (LKR)</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#E7E0D3]">
                  {member.recentTransactions.map((tx) => (
                    <tr key={tx.receiptNo} className="hover:bg-white/5 transition">
                      <td className="py-4 px-6 font-mono text-[#C5A059] font-bold">
                        {tx.receiptNo}
                      </td>
                      <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="py-4 px-6 text-[#A0A0A0] whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-4 px-6 text-[#A0A0A0]">
                        {tx.method}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-white">
                        {tx.amount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => alert(`Downloading stamped PDF receipt for ${tx.receiptNo}`)}
                          className="p-1.5 hover:text-[#C5A059] text-[#A0A0A0] transition"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CHAMBERS & PROFILE DATA */}
        {activeTab === "profile" && (
          <div className="bg-[#141414] border border-white/10 rounded-lg p-8 max-w-4xl space-y-8">
            <div>
              <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                Chamber Registry &amp; Directory Listing
              </h2>
              <p className="text-xs text-[#A0A0A0] mt-1">
                Your professional contact details as catalogued in the Colombo Law Society official roster.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                  Official Full Name
                </label>
                <input
                  type="text"
                  value={member.name}
                  disabled
                  className="w-full bg-[#1C1C1C] border border-white/10 px-4 py-2.5 rounded text-sm text-white/70"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                  Supreme Court Enrolment Number
                </label>
                <input
                  type="text"
                  value={member.sc_en}
                  disabled
                  className="w-full bg-[#1C1C1C] border border-white/10 px-4 py-2.5 rounded text-sm text-[#C5A059] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                  Chambers Address
                </label>
                <input
                  type="text"
                  value={member.chamberAddress}
                  onChange={(e) => setMember({ ...member, chamberAddress: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-white/20 px-4 py-2.5 rounded text-sm text-white focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                  City / District
                </label>
                <input
                  type="text"
                  value={member.city}
                  onChange={(e) => setMember({ ...member, city: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-white/20 px-4 py-2.5 rounded text-sm text-white focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                  Primary Mobile Number
                </label>
                <input
                  type="text"
                  value={member.mobile}
                  onChange={(e) => setMember({ ...member, mobile: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-white/20 px-4 py-2.5 rounded text-sm text-white focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                  Office Chambers Telephone
                </label>
                <input
                  type="text"
                  value={member.officePhone}
                  onChange={(e) => setMember({ ...member, officePhone: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-white/20 px-4 py-2.5 rounded text-sm text-white focus:border-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A0A0] mb-2 font-semibold">
                Recognized Areas of Practice &amp; Advocacy
              </label>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="px-3 py-1 bg-[#1C1C1C] border border-white/20 text-xs text-white rounded-full flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => alert("Chambers directory profile updated successfully.")}
                className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-xs uppercase tracking-wider transition rounded"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Modal for Ticket QR Code View */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#C5A059] max-w-sm w-full p-6 rounded-xl shadow-2xl relative animate-scaleUp">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 border border-[#C5A059] flex items-center justify-center text-[#C5A059] mx-auto mb-3">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold">
                CLS DIGITAL ADMISSION PASS
              </div>
              <h3 className="font-display text-lg uppercase text-white mt-1 leading-snug">
                {selectedTicket.eventTitle}
              </h3>
              <p className="text-xs text-[#A0A0A0] mt-1">{selectedTicket.venue}</p>

              <div className="my-6 p-4 bg-white rounded-lg flex flex-col items-center justify-center shadow-inner">
                <QrCode className="w-40 h-40 text-black" />
                <span className="font-mono text-xs text-black font-bold mt-2">
                  {selectedTicket.qrCode}
                </span>
              </div>

              <div className="text-xs text-[#A0A0A0] mb-6">
                Present this digital pass at the Hulftsdorp reception console for rapid badge check-in.
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="w-full py-2.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded transition"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
