"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Plus,
  Minus,
  Scale,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Users
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState(1); // 0: Corporate, 1: Litigation (matches screenshot), 2: Regulatory, 3: IP
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default like screenshot
  const [activeDiscipline, setActiveDiscipline] = useState<number | null>(0);

  const { scrollYProgress } = useScroll();
  const heroImageY = useTransform(scrollYProgress, [0, 0.3], [0, 50]);

  // Section 4 Tabs Data (Exact match to screenshot)
  const tabData = [
    {
      id: "01",
      tabTitle: "CORPORATE & FINANCE",
      title: "CORPORATE & CAPITAL FINANCE",
      description:
        "Guiding corporate leaders and financial institutions through complex cross-border restructurings, regulatory compliances, and capital market offerings with meticulous legal precision.",
      image: "/images/sri-lanka/colombo-skyline.jpg",
      tag: "COMMERCIAL HIGH COURT • COLOMBO",
    },
    {
      id: "02",
      tabTitle: "LITIGATION & DISPUTES",
      title: "CONSTITUTIONAL & APPELLATE REVIEW",
      description:
        "Providing decisive representation in high-stakes appellate reviews, commercial arbitration, and constitutional writ proceedings before the Supreme Court and Superior Benches.",
      image: "/images/sri-lanka/hero-old-parliament.jpg",
      tag: "SUPREME COURT & SUPERIOR BENCHES",
    },
    {
      id: "03",
      tabTitle: "REGULATORY & COMPLIANCE",
      title: "PUBLIC & REGULATORY JURISPRUDENCE",
      description:
        "Advising on state compliance, statutory tribunals, anti-money laundering frameworks, and central bank directives to safeguard institutional continuity.",
      image: "/images/sri-lanka/colombo-civic-palace.jpg",
      tag: "STATUTORY TRIBUNALS • COLOMBO",
    },
    {
      id: "04",
      tabTitle: "INTELLECTUAL PROPERTY",
      title: "INTELLECTUAL PROPERTY & FINTECH",
      description:
        "Defending proprietary technological patents, digital assets, trademarks, and cross-border licensing rights in the Commercial High Court of Sri Lanka.",
      image: "/images/sri-lanka/colombo-colonnade.jpg",
      tag: "COMMERCIAL BENCHES • HULFTSDORP",
    },
  ];

  // Section 3 Disciplines Data
  const disciplines = [
    {
      num: "01",
      title: "Supreme Court Advocacy & Constitutional Writs",
      desc: "Milestone representation in fundamental rights petitions under Article 126 and appellate review before the highest constitutional bench of Sri Lanka.",
    },
    {
      num: "02",
      title: "Commercial Arbitration & Cross-Border Contracts",
      desc: "Domestic and international tribunal representation under UNCITRAL and ICLP rules governing energy, infrastructure, and maritime disputes.",
    },
    {
      num: "03",
      title: "Appellate & High Court Criminal Trial Practice",
      desc: "Strategic defense advocacy in white-collar financial crimes, fiscal tribunals, and Court of Appeal capital revisions.",
    },
    {
      num: "04",
      title: "Intellectual Property, Fintech & Corporate Governance",
      desc: "Defending intellectual capital, AI regulation compliance, shareholder pacts, and enterprise equity structuring.",
    },
  ];

  // Section 6 FAQ Data (Exact match to screenshot text)
  const faqs = [
    {
      q: "WHAT LEGAL SERVICES DO YOU PROVIDE?",
      a: "The Colombo Law Society and our affiliated counsel provide institutional advocacy, continuing legal education, Supreme Court appellate brief preparation, commercial dispute representation, and direct liaison with the Judiciary of Sri Lanka across all civil, criminal, and commercial jurisdictions.",
    },
    {
      q: "WHAT ARE YOUR FEE STRUCTURES AND BILLING?",
      a: "Our annual Ordinary Membership subscription is LKR 2,000 renewable annually on 31 December. Permanent Life Fellowship is available for a one-time fee of LKR 5,000 for advocates with at least five years of standing. Professional legal briefs are governed by the Supreme Court Advocates Remuneration Scale.",
    },
    {
      q: "HOW DO I GET STARTED AND WHAT IS THE PROCESS?",
      a: "Attorneys-at-Law can enroll immediately online by verifying their Supreme Court Enrolment Number (SC/EN) and BASL Registration on our digital portal. Upon identity authentication, your verified digital bar card is generated instantly.",
    },
    {
      q: "CAN YOU HANDLE CASES INTERNATIONALLY?",
      a: "Yes. Our senior counsel and President's Counsel frequently appear in international commercial arbitrations seated in London, Singapore, Dubai, and Hong Kong, as well as bilateral investment treaty disputes.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-[#C5A059] selection:text-[#0A0A0A] overflow-x-hidden">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (DARK OBSIDIAN — EXACT REPLICA OF TOP HERO IN IMAGE)      */}
      {/* ========================================================================= */}
      <section className="relative pt-6 pb-16 px-6 lg:px-8 border-b border-white/10 overflow-hidden bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          {/* Top Label matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-stone-400 mb-6"
          >
            <span>COLOMBO LAW SOCIETY &bull; HULFTSDORP &bull; EST. 1890 / BASL 1975</span>
            <span className="hidden sm:inline text-[#C5A059]">50 YEARS OF EXCELLENCE</span>
          </motion.div>

          {/* Monumental Hero Architecture Frame */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] lg:aspect-[2.4/1] rounded-sm overflow-hidden border border-white/15 bg-stone-900 group">
            <motion.div
              className="w-full h-[115%] -mt-[7%] bg-cover bg-center filter contrast-110 brightness-95"
              style={{
                y: heroImageY,
                backgroundImage: `url('/images/sri-lanka/hero-old-parliament.jpg')`,
              }}
            />

            {/* Subtle Gradient Overlays matching warm golden dusk photography */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-black/20" />

            {/* Overlaid Giant Headline: "LEGAL" on Left, "CLARITY" on Right */}
            <div className="absolute inset-x-0 bottom-4 sm:bottom-8 lg:bottom-10 px-6 sm:px-10 lg:px-14 flex items-end justify-between select-none pointer-events-none">
              <motion.h1
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[16vw] sm:text-[14vw] lg:text-[13vw] leading-[0.78] tracking-tight uppercase text-white font-extrabold drop-shadow-2xl"
              >
                LEGAL
              </motion.h1>

              {/* Center subtle label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="hidden md:flex flex-col items-center mb-4 text-center"
              >
                <span className="font-serif italic text-xs lg:text-sm text-[#C5A059] tracking-wider">
                  for practitioners and society
                </span>
                <div className="w-12 h-px bg-[#C5A059]/40 mt-1" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[16vw] sm:text-[14vw] lg:text-[13vw] leading-[0.78] tracking-tight uppercase text-[#E7E0D3] font-extrabold drop-shadow-2xl"
              >
                CLARITY
              </motion.h1>
            </div>
          </div>

          {/* Two-Column Area Below Image (Exact Match to Screenshot) */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            {/* Left Column: Bold statement + button + tags */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-8 space-y-6"
            >
              <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-[#141414] border border-[#C5A059]/40 rounded-full text-xs font-mono text-[#C5A059] uppercase tracking-wider">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/branding/cls-50th-anniversary.jpg"
                  alt="CLS 50th Anniversary"
                  className="w-7 h-7 rounded-full object-cover border border-[#C5A059]/50"
                />
                <span>1975 – 2025 &bull; 50 Years of Hulftsdorp Bar Excellence</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide leading-snug text-[#EDEDED] max-w-2xl">
                BUILT ON TRUST, DRIVEN BY{" "}
                <span className="font-serif italic text-[#C5A059] lowercase text-3xl sm:text-4xl font-normal">
                  experience
                </span>
                . WE STAND AS YOUR — LONG-TERM PARTNER IN NAVIGATING COMPLEX LEGAL CHALLENGES.
              </h2>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#EDEDED] hover:bg-white text-[#0A0A0A] font-mono text-xs uppercase tracking-widest font-bold transition rounded-sm shadow-lg"
                >
                  Contact Us
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/events"
                  className="px-5 py-3 border border-white/20 hover:border-white text-stone-300 hover:text-white font-mono text-xs uppercase tracking-widest transition rounded-sm"
                >
                  CLE Conferences →
                </Link>
              </div>

              {/* Audience and micro-tags matching bottom row of screenshot */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-stone-400">
                <span className="text-white/60">Audience:</span>
                <span className="text-stone-300 underline underline-offset-4 decoration-[#C5A059]">
                  Attorneys-at-Law
                </span>
                <span className="text-stone-300 underline underline-offset-4 decoration-white/40">
                  Judicial Officers
                </span>
                <div className="h-3 w-px bg-white/20 mx-2" />
                <span className="px-2.5 py-1 bg-[#141414] border border-white/10 rounded">
                  500+ Members
                </span>
                <span className="px-2.5 py-1 bg-[#141414] border border-white/10 rounded">
                  Superior Courts
                </span>
                <span className="px-2.5 py-1 bg-[#141414] border border-[#C5A059]/40 text-[#C5A059] rounded">
                  Est. 1890
                </span>
              </div>
            </motion.div>

            {/* Right Column: Framed architectural cityscape photo matching screenshot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-4"
            >
              <div className="bg-[#141414] border border-white/15 p-2 rounded-sm group hover:border-[#C5A059]/50 transition duration-500 shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-black rounded-sm">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                    style={{
                      backgroundImage: `url('/images/sri-lanka/colombo-civic-palace.jpg')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-[#EDEDED] uppercase">
                    <span>Hulftsdorp Court Enclave</span>
                    <span className="text-[#C5A059]">001</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION 2: HOW WE HELP YOUR BUSINESS ADVANCE (SAND BG — EXACT MATCH)  */}
      {/* ========================================================================= */}
      <section id="about" className="bg-[#E7E0D3] text-[#0A0A0A] py-28 px-6 lg:px-8 border-b border-black/15 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Top Label Row matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-black/15"
          >
            <div className="text-xs font-mono uppercase tracking-widest text-stone-700">
              ( 50 YEARS OF EXCELLENCE &bull; 1975–2025 )
            </div>
            <div className="max-w-md flex flex-col items-start md:items-end text-left md:text-right gap-3">
              <p className="text-xs text-stone-700 font-sans leading-relaxed">
                The Colombo Law Society is undoubtedly the largest and most elite Branch Association of the Bar Association of Sri Lanka (BASL). Uniting over a thousand advocates who have stood together in crisis and triumph to protect the rule of law.
              </p>
              <div className="flex gap-2">
                <Link
                  href="/team"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A0A0A] hover:bg-stone-800 text-[#E7E0D3] text-[11px] font-mono uppercase tracking-widest font-bold transition rounded-sm shadow"
                >
                  <span>Our Team</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/past-presidents"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-black/30 hover:border-black text-[#0A0A0A] text-[11px] font-mono uppercase tracking-widest font-bold transition rounded-sm"
                >
                  <span>History Roll</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Colossal Headline matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 select-none"
          >
            <h2 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10.5vw] uppercase tracking-tighter leading-[0.84] text-[#0A0A0A] font-extrabold">
              HOW WE HELP YOUR <br />
              BUSINESS ADVANCE
            </h2>
          </motion.div>

          {/* Bottom Dual Framed Photos matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 flex justify-end"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full">
              {/* Photo 1: Classical archway street */}
              <div className="bg-sand-100 border border-black/20 p-2 group hover:border-black transition duration-500 shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-300">
                  <div
                    className="w-full h-full bg-cover bg-center filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    style={{
                      backgroundImage: `url('/images/sri-lanka/colombo-colonnade.jpg')`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-700 uppercase mt-2 px-1">
                  <span>Hulftsdorp Passage</span>
                  <span>002</span>
                </div>
              </div>

              {/* Photo 2: Neoclassical columns */}
              <div className="bg-sand-100 border border-black/20 p-2 group hover:border-black transition duration-500 shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-300">
                  <div
                    className="w-full h-full bg-cover bg-center filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    style={{
                      backgroundImage: `url('/images/sri-lanka/hero-old-parliament.jpg')`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-700 uppercase mt-2 px-1">
                  <span>Hulftsdorp Colonnade</span>
                  <span>003</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 3: STRATEGIC LEGAL SUPPORT (DARK OBSIDIAN — EXACT MATCH)       */}
      {/* ========================================================================= */}
      <section id="practices" className="py-28 px-6 lg:px-8 border-b border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Row matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-white/10 mb-16"
          >
            <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-md leading-relaxed">
              Whether representing before the Supreme Court, arbitrating cross-border disputes, or defending the constitutional order, we provide strategic legal counsel that champions client rights and institutional dignity.
            </p>
            <div className="text-left md:text-right">
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-[0.9]">
                STRATEGIC LEGAL SUPPORT <br />
                FOR BUSINESS — <span className="text-[#C5A059]">GROWTH</span>
              </h2>
            </div>
          </motion.div>

          {/* Main Content Split: Left Numbered List | Right Dual Photos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Numbered Discipline List */}
            <div className="lg:col-span-7 divide-y divide-white/10">
              {disciplines.map((item, idx) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  onClick={() => setActiveDiscipline(activeDiscipline === idx ? null : idx)}
                  className="py-6 group cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <span className="font-mono text-xs sm:text-sm text-[#C5A059] font-bold">
                        {item.num}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl md:text-3xl uppercase tracking-wide text-stone-200 group-hover:text-[#E7E0D3] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-stone-400 group-hover:text-white transition">
                      {activeDiscipline === idx ? "—" : "+"}
                    </span>
                  </div>

                  <AnimatePresence>
                    {activeDiscipline === idx && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 pl-12 text-xs sm:text-sm text-stone-400 font-sans leading-relaxed max-w-xl"
                      >
                        {item.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Right Dual Architectural Cards matching screenshot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 grid grid-cols-2 gap-4 items-end"
            >
              {/* Photo 1: Stone arcade */}
              <div className="bg-[#141414] border border-white/15 p-2 rounded-sm group hover:border-[#C5A059]/40 transition">
                <div className="relative aspect-[3/4] overflow-hidden bg-black rounded-sm">
                  <div
                    className="w-full h-full bg-cover bg-center filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    style={{
                      backgroundImage: `url('/images/sri-lanka/colombo-colonnade.jpg')`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 uppercase mt-2 px-1">
                  <span>Colombo Colonnade</span>
                  <span>004</span>
                </div>
              </div>

              {/* Photo 2: Taller Neoclassical Monument */}
              <div className="bg-[#141414] border border-white/15 p-2 rounded-sm group hover:border-[#C5A059]/40 transition">
                <div className="relative aspect-[3/4.8] overflow-hidden bg-black rounded-sm">
                  <div
                    className="w-full h-full bg-cover bg-center filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    style={{
                      backgroundImage: `url('/images/sri-lanka/independence-hall.jpg')`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 uppercase mt-2 px-1">
                  <span>Constitutional Hall</span>
                  <span>005</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 4: NAVIGATING COMPLEX CHALLENGES (TABS + BAR EXACT MATCH)      */}
      {/* ========================================================================= */}
      <section className="py-28 px-6 lg:px-8 border-b border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Title matching screenshot typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mb-14"
          >
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white leading-[0.88]">
              NAVIGATING{" "}
              <span className="font-serif italic text-stone-400 font-normal lowercase text-4xl sm:text-6xl md:text-7xl">
                through
              </span>{" "}
              COMPLEX <br />
              BUSINESS CHALLENGES WITH <br />
              CONFIDENCE
            </h2>
          </motion.div>

          {/* Center Visual + Right Explanatory Box matching screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
            {/* Center Image */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8 bg-[#141414] border border-white/15 p-2 rounded-sm shadow-2xl"
            >
              <div className="relative aspect-[16/8] overflow-hidden bg-black rounded-sm">
                <div
                  className="w-full h-full bg-cover bg-center filter grayscale contrast-125"
                  style={{ backgroundImage: `url('${tabData[activeTab].image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                    {tabData[activeTab].tag} &bull; CASE REF 2026
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Information Block with Compass/Scale icon */}
            <motion.div
              key={`text-${activeTab}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-4 space-y-4 p-4"
            >
              <div className="w-10 h-10 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wide text-white">
                {tabData[activeTab].title}
              </h3>
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                {tabData[activeTab].description}
              </p>
              <div className="pt-2">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/20 hover:border-white text-xs font-mono uppercase tracking-widest text-[#EDEDED] transition rounded-sm"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom 4 Tabs with Sliding Underline Bar matching screenshot */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            {tabData.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(idx)}
                  className="text-left pt-3 pb-4 transition-all relative group"
                >
                  {/* Active Indicator Underline Bar */}
                  {isActive ? (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute -top-[17px] inset-x-0 h-[2px] bg-[#EDEDED]"
                    />
                  ) : (
                    <div className="absolute -top-[17px] inset-x-0 h-[1px] bg-transparent group-hover:bg-white/20 transition" />
                  )}

                  <span className="font-mono text-xs text-[#C5A059] block font-bold mb-1">
                    {tab.id}
                  </span>
                  <span
                    className={`font-display text-sm sm:text-base uppercase tracking-wider block transition-colors ${
                      isActive ? "text-white font-bold" : "text-stone-400 group-hover:text-stone-200"
                    }`}
                  >
                    {tab.tabTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 5: THE EMINENT PEOPLE BEHIND (PORTRAITS MATCHING SCREENSHOT)   */}
      {/* ========================================================================= */}
      <section id="committee" className="py-28 px-6 lg:px-8 border-b border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Heading & Introductory paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4 space-y-6"
            >
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                Our distinguished council brings over a century of courtroom excellence, constitutional scholarship, and legal leadership across superior jurisdictions.
              </p>

              <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white leading-[0.88]">
                THE{" "}
                <span className="font-serif italic text-stone-400 font-normal lowercase text-4xl sm:text-5xl md:text-6xl">
                  eminent
                </span>{" "}
                <br />
                PEOPLE BEHIND — <br />
                OUR LEGAL <br />
                EXPERTISE
              </h2>
            </motion.div>

            {/* Right Column: 3 Portrait Cards with prominent leader badge */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
              {/* Card 1: Main Leader with prominent white name badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-[#141414] border border-white/15 p-2 rounded-sm shadow-2xl relative group"
              >
                <div className="relative aspect-[3/3.8] overflow-hidden bg-stone-900 rounded-sm">
                  <div
                    className="w-full h-full bg-cover bg-center filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                    style={{
                      backgroundImage: `url('/images/team/sandun-nagahawatta.jpg')`,
                    }}
                  />
                </div>
                {/* Prominent White Name Card matching screenshot */}
                <div className="mt-2 bg-white text-black p-3 rounded-sm">
                  <h3 className="font-display text-lg uppercase tracking-wider leading-none">
                    SANDUN NAGAHAWATTA
                  </h3>
                  <p className="text-[10px] text-stone-600 font-sans mt-0.5 uppercase tracking-wider font-semibold">
                    President &bull; Colombo Law Society
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Secretary Portrait */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-[#141414] border border-white/15 p-2 rounded-sm group shadow-xl"
              >
                <div className="relative aspect-[3/3.8] overflow-hidden bg-stone-900 rounded-sm">
                  <div
                    className="w-full h-full bg-cover bg-center filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                    style={{
                      backgroundImage: `url('/images/team/lahiru-walgama.jpg')`,
                    }}
                  />
                </div>
                <div className="mt-2 p-2">
                  <h3 className="font-display text-base uppercase tracking-wider text-white">
                    LAHIRU WELGAMA
                  </h3>
                  <p className="text-[10px] text-stone-400 font-sans uppercase">
                    Secretary &bull; Superior Courts Complex
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Treasurer Portrait + Separate Pages Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-[#141414] border border-white/15 p-2 rounded-sm group shadow-xl">
                  <div className="relative aspect-[3/3.8] overflow-hidden bg-stone-900 rounded-sm">
                    <div
                      className="w-full h-full bg-cover bg-center filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                      style={{
                        backgroundImage: `url('/images/team/gamali-amarathunga.jpg')`,
                      }}
                    />
                  </div>
                  <div className="mt-2 p-2">
                    <h3 className="font-display text-base uppercase tracking-wider text-white">
                      GAMALI AMARATHUNGA
                    </h3>
                    <p className="text-[10px] text-stone-400 font-sans uppercase">
                      Treasurer &bull; Colombo Bar
                    </p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Link
                    href="/team"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-[11px] font-mono uppercase tracking-widest transition rounded-sm w-full justify-center shadow"
                  >
                    <span>View All Team Members</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex gap-2">
                    <Link
                      href="/past-presidents"
                      className="flex-1 text-center py-2 border border-white/20 hover:border-white text-[10px] font-mono uppercase tracking-wider text-stone-300 hover:text-white transition rounded-sm"
                    >
                      Past Presidents
                    </Link>
                    <Link
                      href="/vice-presidents"
                      className="flex-1 text-center py-2 border border-white/20 hover:border-white text-[10px] font-mono uppercase tracking-wider text-stone-300 hover:text-white transition rounded-sm"
                    >
                      Vice Presidents
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 6: FREQUENTLY ASKED QUESTIONS (ACCORDION MATCHING SCREENSHOT)  */}
      {/* ========================================================================= */}
      <section id="faq" className="py-28 px-6 lg:px-8 border-b border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Framed photo of classical cathedral / court dome over city */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4"
            >
              <div className="bg-[#141414] border border-white/15 p-2 rounded-sm group shadow-2xl">
                <div className="relative aspect-[3/4] overflow-hidden bg-black rounded-sm">
                  <div
                    className="w-full h-full bg-cover bg-center filter contrast-110 group-hover:scale-105 transition-transform duration-700"
                    style={{
                      backgroundImage: `url('/images/sri-lanka/colombo-civic-palace.jpg')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                      Colombo Civic Palace • Hulftsdorp
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: FAQ Accordion matching screenshot typography and open state */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8"
            >
              <div className="mb-10">
                <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white leading-[0.88]">
                  FREQUENTLY <br />
                  ASKED <span className="font-serif italic text-stone-400 font-normal lowercase text-4xl sm:text-5xl md:text-6xl">&amp;</span> QUESTIONS
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-stone-400 font-sans max-w-xl">
                  Essential inquiries regarding enrollment, Supreme Court bar privileges, continuing legal education credits, and fee structures.
                </p>
              </div>

              {/* Accordion Cards */}
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="bg-[#141414] border border-white/10 rounded-sm overflow-hidden transition"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-5 flex items-center justify-between text-left group transition hover:bg-white/5"
                      >
                        <span className="font-display text-lg sm:text-xl uppercase tracking-wider text-stone-200 group-hover:text-white transition-colors pr-4">
                          {faq.q}
                        </span>
                        <div className="w-7 h-7 rounded border border-white/20 flex items-center justify-center shrink-0 text-stone-400 group-hover:text-white transition">
                          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-400 font-sans leading-relaxed border-t border-white/5">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRE-FOOTER & MONUMENTAL BANNER (EXACT MATCH TO BOTTOM OF SCREENSHOT)   */}
      {/* ========================================================================= */}
      <Footer />
    </div>
  );
}
