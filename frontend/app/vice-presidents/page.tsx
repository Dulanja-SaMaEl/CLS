"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vicePresidents, VicePresident } from "@/lib/mockData";
import { motion } from "framer-motion";
import {
  Scale,
  Award,
  Search,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  ChevronRight,
  Briefcase
} from "lucide-react";

export default function VicePresidentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVPs = vicePresidents.filter((vp) =>
    vp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vp.tenure.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vp.portfolio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0A0A0A] text-stone-900 dark:text-[#EDEDED] font-sans selection:bg-[#C5A059] selection:text-[#0A0A0A] overflow-x-hidden transition-colors duration-200">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-36 pb-20 border-b border-stone-200 dark:border-white/10 bg-[#FDFBF7] dark:bg-[#0A0A0A] overflow-hidden transition-colors">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-[#141414] border border-[#9E7D3B]/30 dark:border-[#C5A059]/30 rounded-full text-[10px] tracking-widest uppercase text-[#9E7D3B] dark:text-[#C5A059] mb-4 shadow-sm">
                <Briefcase className="w-3.5 h-3.5" />
                Colombo Law Society &bull; Executive Vice Presidencies &amp; Deputy Leaders
              </div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-stone-900 dark:text-white leading-none">
                VICE PRESIDENTS &amp; <br />
                <span className="font-serif italic font-normal text-[#9E7D3B] dark:text-[#C5A059] lowercase text-5xl sm:text-7xl lg:text-8xl">
                  deputy leadership
                </span>
              </h1>
              <p className="mt-4 text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
                The Deputy Presidents and Vice Presidents of the Colombo Law Society oversee key operational portfolios—including Bar welfare, judicial liaison, continuing legal education, and courtroom infrastructure. Many have subsequently risen to the presidency of the Society and the national Bar.
              </p>
            </div>

            {/* Quick Links to other pages */}
            <div className="flex items-center gap-3">
              <Link
                href="/team"
                className="px-4 py-2.5 bg-white dark:bg-[#141414] hover:bg-stone-100 dark:hover:bg-[#1F1F1F] border border-stone-300 dark:border-white/20 text-xs font-mono uppercase tracking-wider text-stone-800 dark:text-white transition rounded-sm flex items-center gap-2 shadow-sm"
              >
                <span>Executive Team</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9E7D3B] dark:text-[#C5A059]" />
              </Link>
              <Link
                href="/past-presidents"
                className="px-4 py-2.5 bg-white dark:bg-[#141414] hover:bg-stone-100 dark:hover:bg-[#1F1F1F] border border-stone-300 dark:border-white/20 text-xs font-mono uppercase tracking-wider text-stone-800 dark:text-white transition rounded-sm flex items-center gap-2 shadow-sm"
              >
                <span>Past Presidents Roll</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9E7D3B] dark:text-[#C5A059]" />
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-12 max-w-md border-t border-stone-200 dark:border-white/10 pt-8">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, portfolio, or tenure..."
                className="w-full bg-white dark:bg-[#141414] border border-stone-300 dark:border-white/20 pl-10 pr-4 py-2 rounded text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none font-mono shadow-sm dark:shadow-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vice Presidents Cards Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVPs.map((vp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 hover:border-[#9E7D3B]/60 dark:hover:border-[#C5A059]/60 p-6 rounded-sm flex flex-col justify-between group transition-all duration-300 shadow-sm dark:shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/5 pb-3">
                  <span className="font-mono text-xs font-bold text-[#9E7D3B] dark:text-[#C5A059]">
                    {vp.tenure}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-white/5 px-2 py-0.5 rounded font-semibold">
                    {vp.role}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {vp.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={vp.image}
                      alt={vp.name}
                      className="w-14 h-14 rounded-full object-cover border border-[#9E7D3B]/50 dark:border-[#C5A059]/50 shrink-0 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-center justify-center shrink-0 text-[#9E7D3B] dark:text-[#C5A059] font-mono font-bold text-xs">
                      {vp.name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/, '').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide text-stone-900 dark:text-white group-hover:text-[#9E7D3B] dark:group-hover:text-[#E7E0D3] transition-colors leading-tight">
                      {vp.name}
                    </h3>
                    <div className="text-xs text-[#9E7D3B] dark:text-[#C5A059] font-mono mt-0.5 font-semibold">
                      Portfolio: {vp.portfolio}
                    </div>
                    <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                      {vp.court}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed pt-2 border-t border-stone-100 dark:border-white/5">
                  {vp.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-white/5 mt-4 flex items-center justify-between text-[10px] font-mono text-stone-500 dark:text-stone-400 uppercase">
                <span>Working Committee Chair</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  CLS Executive
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredVPs.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 rounded-sm shadow-sm">
            <Briefcase className="w-12 h-12 text-stone-400 dark:text-stone-500 mx-auto mb-3 opacity-40" />
            <h4 className="font-display text-2xl uppercase text-stone-900 dark:text-white">No Record Found</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Please adjust your search keyword.
            </p>
          </div>
        )}

        {/* Portfolios Overview Card */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 rounded-sm space-y-2 shadow-sm">
            <h4 className="font-display text-xl uppercase text-[#9E7D3B] dark:text-[#C5A059]">
              01 &bull; Judicial &amp; Registry Liaison
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
              Addressing day-to-day administrative matters with the Supreme Court, Court of Appeal, Commercial High Court, and Magistrates&apos; courts to streamline motion hearings and filing hours.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 rounded-sm space-y-2 shadow-sm">
            <h4 className="font-display text-xl uppercase text-[#9E7D3B] dark:text-[#C5A059]">
              02 &bull; Member Welfare &amp; Benevolent Trust
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
              Administering medical emergency funds, life assurance, distress assistance, and benevolent grants for advocates and their families.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 rounded-sm space-y-2 shadow-sm">
            <h4 className="font-display text-xl uppercase text-[#9E7D3B] dark:text-[#C5A059]">
              03 &bull; Continuing Legal Education (CLE)
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
              Curating practical masterclasses in appellate brief writing, cross-examination, and emerging legal regimes such as Artificial Intelligence, fintech, and international arbitration.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
