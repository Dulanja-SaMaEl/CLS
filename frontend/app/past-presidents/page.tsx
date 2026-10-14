"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { pastPresidents, PastPresident } from "@/lib/mockData";
import { motion } from "framer-motion";
import {
  Scale,
  Award,
  Search,
  ArrowRight,
  Calendar,
  Building,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function PastPresidentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDecade, setSelectedDecade] = useState("All");

  const decades = ["All", "2020s", "2010s", "2000s", "1990s", "1975-1980s"];

  const filteredPresidents = pastPresidents.filter((pres) => {
    const matchesSearch =
      pres.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pres.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pres.highlight && pres.highlight.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesDecade = true;
    if (selectedDecade === "2020s") {
      matchesDecade = pres.year.startsWith("202");
    } else if (selectedDecade === "2010s") {
      matchesDecade = pres.year.startsWith("201");
    } else if (selectedDecade === "2000s") {
      matchesDecade = pres.year.startsWith("200");
    } else if (selectedDecade === "1990s") {
      matchesDecade = pres.year.startsWith("199");
    } else if (selectedDecade === "1975-1980s") {
      matchesDecade = pres.year.startsWith("197") || pres.year.startsWith("198");
    }

    return matchesSearch && matchesDecade;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-[#C5A059] selection:text-[#0A0A0A] overflow-x-hidden">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-36 pb-20 border-b border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#C5A059]/30 rounded-full text-[10px] tracking-widest uppercase text-[#C5A059] mb-4">
                <Award className="w-3.5 h-3.5" />
                Colombo Law Society &bull; Roll of Honour (1975 – Present)
              </div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none">
                ROLL OF <br />
                <span className="font-serif italic font-normal text-[#C5A059] lowercase text-5xl sm:text-7xl lg:text-8xl">
                  past presidents
                </span>
              </h1>
              <p className="mt-4 text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
                Celebrating five decades of visionary presidents who have steered the Colombo Law Society since its foundation in 1975 under Founding President Mr. Nimal Senanayake, PC, safeguarding the independence, ethics, and welfare of the Bar.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-3">
              <Link
                href="/team"
                className="px-4 py-2.5 bg-[#141414] hover:bg-[#1F1F1F] border border-white/20 text-xs font-mono uppercase tracking-wider text-white transition rounded-sm flex items-center gap-2"
              >
                <span>Current Executive Team</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
              <Link
                href="/vice-presidents"
                className="px-4 py-2.5 bg-[#141414] hover:bg-[#1F1F1F] border border-white/20 text-xs font-mono uppercase tracking-wider text-white transition rounded-sm flex items-center gap-2"
              >
                <span>Vice Presidents Roll</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
            </div>
          </div>

          {/* Search & Decade Filters */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-t border-white/10 pt-8">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search President by name, year, or tenure..."
                className="w-full bg-[#141414] border border-white/20 pl-10 pr-4 py-2 rounded text-xs text-white placeholder-stone-500 focus:border-[#C5A059] focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {decades.map((dec) => (
                <button
                  key={dec}
                  onClick={() => setSelectedDecade(dec)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider transition ${
                    selectedDecade === dec
                      ? "bg-[#C5A059] text-black font-bold shadow-md shadow-[#C5A059]/20"
                      : "bg-[#141414] border border-white/10 text-stone-400 hover:text-white hover:border-white/30"
                  }`}
                >
                  {dec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Presidents Timeline & Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresidents.map((pres, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 6) * 0.08 }}
              className="bg-[#141414] border border-white/10 hover:border-[#C5A059]/60 p-6 rounded-sm flex flex-col justify-between group transition-all duration-300 shadow-xl relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="font-mono text-sm font-bold text-[#C5A059]">
                    {pres.tenure}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                    {pres.credentials || "Attorney-at-Law"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {pres.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pres.image}
                      alt={pres.name}
                      className="w-14 h-14 rounded-full object-cover border border-[#C5A059]/50 shrink-0 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#C5A059] font-mono font-bold text-xs">
                      {pres.year.slice(0, 4)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide text-white group-hover:text-[#E7E0D3] transition-colors leading-tight">
                      {pres.name}
                    </h3>
                    <div className="text-[11px] font-mono text-[#C5A059] mt-0.5">
                      President, Colombo Law Society
                    </div>
                  </div>
                </div>

                {pres.highlight && (
                  <p className="text-xs text-stone-400 font-sans leading-relaxed pt-2 border-t border-white/5">
                    {pres.highlight}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[10px] font-mono text-stone-400 uppercase">
                <span>Supreme Court Bar</span>
                <span className="text-[#C5A059]/80 group-hover:text-[#C5A059] flex items-center gap-1">
                  Verified Roll &bull; CLS
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPresidents.length === 0 && (
          <div className="text-center py-20 bg-[#141414] border border-white/10 rounded-sm">
            <Award className="w-12 h-12 text-stone-500 mx-auto mb-3 opacity-40" />
            <h4 className="font-display text-2xl uppercase text-white">No Record Found</h4>
            <p className="text-xs text-stone-400 mt-1">
              Please adjust your search keyword or selected decade filter.
            </p>
          </div>
        )}

        {/* Founding Tribute Note */}
        <div className="mt-20 p-8 bg-gradient-to-r from-[#141414] to-[#1A1A1A] border-l-4 border-[#C5A059] rounded-sm">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              Founding Charter &bull; 1975
            </span>
            <h4 className="font-display text-2xl uppercase text-white">
              MR. NIMAL SENANAYAKE, PC &bull; FOUNDING PRESIDENT
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
              &quot;The Colombo Law Society was inaugurated in 1975 under the chairmanship of titan of the Bar, Mr. Nimal Senanayake, PC, along with Founding Secretary Mr. K. Kanag-Iswaran, PC. Since that historic inception at Hulftsdorp, each president has contributed tirelessly to building the largest and most influential Bar fraternity in Sri Lanka.&quot;
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
