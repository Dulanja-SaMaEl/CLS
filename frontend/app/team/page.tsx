"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { executiveCommittee, honorisCausaMembers } from "@/lib/mockData";
import { motion } from "framer-motion";
import {
  Scale,
  Award,
  Mail,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building,
  UserCheck
} from "lucide-react";

export default function TeamPage() {
  const [committee, setCommittee] = useState(executiveCommittee);

  useEffect(() => {
    async function fetchCommittee() {
      try {
        const res = await fetch("/api/committee");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setCommittee(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load live committee:", err);
      }
    }
    fetchCommittee();
  }, []);

  const president = committee.find((m) => m.title === "President") || committee[0];
  const primaryOfficers = committee.filter((m) => m.id !== president.id);

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
                <Scale className="w-3.5 h-3.5" />
                Colombo Law Society &bull; Governing Council 2024 / 2025
              </div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none">
                EXECUTIVE COMMITTEE &amp; <br />
                <span className="font-serif italic font-normal text-[#C5A059] lowercase text-5xl sm:text-7xl lg:text-8xl">
                  governing leadership
                </span>
              </h1>
              <p className="mt-4 text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
                The Colombo Law Society is the largest and most elite branch association of the Bar Association of Sri Lanka (BASL). Guided by an elected executive committee and working council dedicated to practitioner welfare, legal reform, and judicial independence.
              </p>
            </div>

            {/* Quick Navigation to Separate Honour Roll Pages */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/past-presidents"
                className="px-4 py-2.5 bg-[#141414] hover:bg-[#1F1F1F] border border-white/20 text-xs font-mono uppercase tracking-wider text-white transition rounded-sm flex items-center gap-2"
              >
                <span>Past Presidents Roll</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
              <Link
                href="/vice-presidents"
                className="px-4 py-2.5 bg-[#141414] hover:bg-[#1F1F1F] border border-white/20 text-xs font-mono uppercase tracking-wider text-white transition rounded-sm flex items-center gap-2"
              >
                <span>Vice Presidents</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Committee Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        {/* President Spotlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 bg-[#141414] border border-[#C5A059]/40 rounded-sm p-6 sm:p-10 shadow-2xl relative overflow-hidden group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 relative aspect-[3/3.8] overflow-hidden bg-black rounded-sm border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={president.image}
                alt={president.name}
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 border border-[#C5A059] text-[9px] font-mono uppercase text-[#C5A059] font-bold">
                INCUMBENT PRESIDENT
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                  Colombo Law Society Leadership
                </span>
                <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wide text-white mt-1">
                  {president.name}
                </h2>
                <div className="flex items-center gap-3 text-xs font-mono text-stone-400 mt-1">
                  <span>{president.credentials}</span>
                  <span>&bull;</span>
                  <span>{president.court}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed max-w-2xl">
                {president.bio}
              </p>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-stone-400">
                <a
                  href={`mailto:${president.email}`}
                  className="flex items-center gap-2 text-white hover:text-[#C5A059] transition"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{president.email}</span>
                </a>
                <a
                  href={`tel:${president.phone}`}
                  className="flex items-center gap-2 text-white hover:text-[#C5A059] transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{president.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Office Bearers & Council Members */}
        <div className="mb-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
            <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white">
              Office Bearers &amp; Executive Council
            </h3>
            <span className="text-xs font-mono text-[#C5A059] uppercase tracking-widest">
              Hulftsdorp Bar &bull; Colombo 12
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {primaryOfficers.map((officer, idx) => (
              <motion.div
                key={officer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="bg-[#141414] border border-white/10 hover:border-[#C5A059]/50 rounded-sm overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="relative aspect-[3/3.6] overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={officer.image}
                      alt={officer.name}
                      className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/80 border border-white/10 text-[9px] font-mono uppercase text-[#C5A059]">
                      {officer.title}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-semibold">
                      {officer.title}
                    </span>
                    <h4 className="font-display text-xl uppercase tracking-wide text-white leading-tight">
                      {officer.name}
                    </h4>
                    <div className="text-[11px] font-mono text-stone-400">
                      {officer.credentials}
                    </div>
                    <p className="text-xs text-stone-400 font-sans line-clamp-3 leading-relaxed pt-2 border-t border-white/5">
                      {officer.bio}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/5 mt-4 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span className="truncate max-w-[160px]">{officer.court}</span>
                  <a
                    href={`mailto:${officer.email}`}
                    title="Send Email"
                    className="p-1.5 text-stone-400 hover:text-[#C5A059] transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Honoris Causa & Living Legends */}
        <div className="mt-24 pt-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
              Hall of Distinguished Luminaries
            </span>
            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-white">
              HONORIS CAUSA MEMBERS
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-sans mt-3 leading-relaxed">
              Revered advocates and jurists whose indelible service has shaped the jurisprudence and stature of the Colombo Law Society.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {honorisCausaMembers.map((hc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                className="bg-[#141414] border border-white/10 hover:border-[#C5A059]/60 p-5 rounded-sm transition-all duration-300 group hover:bg-[#181818] shadow-lg flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0 group-hover:bg-[#C5A059] group-hover:text-black transition-colors duration-300">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#E7E0D3] transition-colors leading-snug tracking-tight">
                    {hc.name}
                  </h4>
                  <p className="text-xs sm:text-sm font-mono text-[#C5A059] mt-1 leading-normal font-medium">
                    {hc.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 text-[10px] font-mono uppercase tracking-widest text-stone-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60" />
                    <span>Roll of Honour &bull; Hulftsdorp Bar</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
