"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#E7E0D3] dark:bg-[#111111] text-[#0A0A0A] dark:text-[#EDEDED] pt-20 border-t border-black/10 dark:border-white/10 overflow-hidden transition-colors duration-200">
      {/* Top Pre-Footer Section with Sand / Dark Background */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main prompt */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.88] text-[#0A0A0A] dark:text-white">
              LET’S ADVANCE <br />
              LEGAL <span className="font-serif italic lowercase text-4xl sm:text-5xl md:text-6xl text-stone-600 dark:text-[#C5A059] font-normal">&amp;</span> PRACTICE
            </h2>
            <p className="mt-6 text-xs sm:text-sm text-stone-700 dark:text-stone-400 max-w-sm font-sans leading-relaxed">
              The Colombo Law Society is the premier and largest branch association of the Bar Association of Sri Lanka (BASL), serving over a thousand advocates and judicial practitioners across Hulftsdorp since 1975.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/sign-up"
                className="px-6 py-3.5 bg-[#0A0A0A] text-[#E7E0D3] dark:bg-[#C5A059] dark:text-black hover:bg-stone-800 dark:hover:bg-[#b08e4d] text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-md rounded-sm"
              >
                Enroll as Member →
              </Link>
              <Link
                href="/team"
                className="px-5 py-3.5 border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white text-stone-900 dark:text-stone-200 text-xs font-mono uppercase tracking-widest font-bold transition-all rounded-sm"
              >
                Executive Council
              </Link>
            </div>
          </motion.div>

          {/* 4 Link Columns matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 text-[11px] font-mono tracking-wider uppercase"
          >
            <div>
              <span className="font-bold text-[#0A0A0A] dark:text-white block mb-4 border-b border-black/15 dark:border-white/10 pb-2">
                PRACTICE
              </span>
              <ul className="space-y-2.5 text-stone-600 dark:text-stone-400">
                <li><Link href="/#practices" className="hover:text-black dark:hover:text-white transition-colors">Constitutional</Link></li>
                <li><Link href="/#practices" className="hover:text-black dark:hover:text-white transition-colors">Commercial</Link></li>
                <li><Link href="/#practices" className="hover:text-black dark:hover:text-white transition-colors">Arbitration</Link></li>
                <li><Link href="/#practices" className="hover:text-black dark:hover:text-white transition-colors">High Court</Link></li>
                <li><Link href="/#practices" className="hover:text-black dark:hover:text-white transition-colors">Appellate Bar</Link></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#0A0A0A] dark:text-white block mb-4 border-b border-black/15 dark:border-white/10 pb-2">
                LEADERSHIP
              </span>
              <ul className="space-y-2.5 text-stone-600 dark:text-stone-400">
                <li><Link href="/team" className="hover:text-black dark:hover:text-white transition-colors font-semibold text-[#0A0A0A] dark:text-stone-200">Executive Team</Link></li>
                <li><Link href="/past-presidents" className="hover:text-black dark:hover:text-white transition-colors">Past Presidents</Link></li>
                <li><Link href="/vice-presidents" className="hover:text-black dark:hover:text-white transition-colors">Vice Presidents</Link></li>
                <li><Link href="/team" className="hover:text-black dark:hover:text-white transition-colors">Honoris Causa</Link></li>
                <li><Link href="/#about" className="hover:text-black dark:hover:text-white transition-colors">Working Council</Link></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#0A0A0A] dark:text-white block mb-4 border-b border-black/15 dark:border-white/10 pb-2">
                PORTALS
              </span>
              <ul className="space-y-2.5 text-stone-600 dark:text-stone-400">
                <li><Link href="/member" className="hover:text-black dark:hover:text-white transition-colors">Member Bar Pass</Link></li>
                <li><Link href="/events" className="hover:text-black dark:hover:text-white transition-colors">CLE Symposiums</Link></li>
                <li><Link href="/gallery" className="hover:text-black dark:hover:text-white transition-colors font-medium text-stone-900 dark:text-stone-200">Event Showcase</Link></li>
                <li><Link href="/admin" className="hover:text-black dark:hover:text-[#C5A059] font-bold text-[#9E7D3B] dark:text-[#C5A059]">Admin Console</Link></li>
                <li><Link href="/sign-up" className="hover:text-black dark:hover:text-white transition-colors">New Enrolment</Link></li>
                <li><Link href="/#faq" className="hover:text-black dark:hover:text-white transition-colors">Dues &amp; FAQ</Link></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#0A0A0A] dark:text-white block mb-4 border-b border-black/15 dark:border-white/10 pb-2">
                VISIT
              </span>
              <p className="text-stone-600 dark:text-stone-400 normal-case font-sans text-xs leading-relaxed">
                Colombo Law Society Hall,<br />
                129, Hulftsdorp Street,<br />
                Superior Courts Enclave,<br />
                Colombo 12, Sri Lanka.
              </p>
              <span className="inline-block mt-3 text-[11px] font-mono font-bold text-[#0A0A0A] dark:text-[#C5A059]">
                +94 71 192 3531
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Monumental Wordmark Photo Banner matching the screenshot bottom */}
      <div className="relative border-t border-black/15 dark:border-white/10 bg-[#0A0A0A] text-white overflow-hidden pt-12 pb-6 select-none">
        {/* Background panoramic city roofs and courthouse architecture image */}
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center mix-blend-luminosity pointer-events-none scale-105"
          style={{
            backgroundImage: `url('/images/sri-lanka/hero-old-parliament.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/60 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[clamp(3.8rem,7.5vw,6.8rem)] xl:text-[7.5rem] leading-none tracking-tight uppercase text-[#E7E0D3]/95 font-extrabold drop-shadow-2xl"
          >
            COLOMBO LAW SOCIETY
          </motion.h1>
        </div>

        {/* Bottom copyright line */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono tracking-widest text-stone-400 border-t border-white/10 uppercase gap-2">
          <span>&copy; {new Date().getFullYear()} COLOMBO LAW SOCIETY. ALL RIGHTS RESERVED.</span>
          <span>129, HULFTSDORP STREET &bull; SUPERIOR COURTS ENCLAVE &bull; COLOMBO 12</span>
        </div>
      </div>
    </footer>
  );
}
