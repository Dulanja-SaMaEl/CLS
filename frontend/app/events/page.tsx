"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { initialEvents, CLSEvent } from "@/lib/mockData";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  Ticket,
  Scale,
  Sparkles,
  Download,
  Camera,
  X
} from "lucide-react";

export default function PublicEventsPage() {
  const [events, setEvents] = useState<CLSEvent[]>(initialEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEventModal, setActiveEventModal] = useState<CLSEvent | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  useEffect(() => {
    async function fetchLiveEvents() {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setEvents(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live events, using mock:", err);
      }
    }
    fetchLiveEvents();
  }, []);
  const [bookingFormData, setBookingFormData] = useState({
    name: "Naveen Shanaka",
    sc_en: "SC/EN/2018/2210",
    email: "naveen.shanaka@colombolaw.org",
    mobile: "+94 71 892 3341",
    ticketType: "Member Delegate Pass (LKR 2,000)",
  });

  const categories = [
    "All",
    "Annual Symposium",
    "Continuing Legal Education",
    "Constitutional Law",
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesCategory =
      selectedCategory === "All" || ev.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationSuccess(false);
      setActiveEventModal(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E7E0D3] selection:bg-[#C5A059] selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 border-b border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#C5A059]/30 rounded-full text-[10px] tracking-widest uppercase text-[#C5A059] mb-4">
            <Scale className="w-3 h-3" />
            Superior Courts Complex &bull; Hulftsdorp Academic Roster
          </div>

          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
            CONTINUING LEGAL <br />
            <span className="font-serif italic font-normal text-[#C5A059] lowercase text-5xl sm:text-7xl">
              education &amp; conferences
            </span>
          </h1>

          <p className="mt-4 text-sm text-[#A0A0A0] max-w-2xl leading-relaxed">
            Elevating advocacy standards across the Sri Lankan Bar. Rigorous symposiums, judicial seminars, and accredited masterclasses conducted by eminent jurists, President&apos;s Counsel, and visiting international academics.
          </p>

          {/* Search & Filter Controls */}
          <div className="mt-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search symposiums, speakers, or jurisprudence topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-white/20 pl-10 pr-4 py-2.5 rounded text-xs text-white placeholder-white/30 focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                    selectedCategory === cat
                      ? "bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/20"
                      : "bg-[#141414] border border-white/10 text-[#A0A0A0] hover:text-white hover:border-white/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        {/* Showcase Highlight Banner */}
        <div className="mb-12 bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#C5A059]/30 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block">
                Historical &amp; Assembly Archives
              </span>
              <h3 className="text-base sm:text-lg font-display uppercase tracking-wide text-white">
                Looking for Photographs of Past Conferences &amp; Bar Dinners?
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Browse our curated public showcase of golden jubilee assemblies, junior bar robings, and ceremonial court welcomes.
              </p>
            </div>
          </div>
          <Link
            href="/gallery"
            className="shrink-0 px-5 py-2.5 bg-[#C5A059] hover:bg-[#d6b168] text-black text-xs font-mono uppercase tracking-widest font-bold transition rounded shadow flex items-center gap-2"
          >
            <span>Explore Image Showcase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-[#141414] border border-white/10 rounded-lg">
            <Calendar className="w-12 h-12 text-[#A0A0A0] mx-auto mb-3 opacity-40" />
            <h3 className="font-display text-2xl uppercase tracking-wider text-white">
              No Conferences Found
            </h3>
            <p className="text-xs text-[#A0A0A0] mt-1">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((ev) => {
              const startDate = new Date(ev.startDateTime);
              const formattedDate = startDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const formattedTime = startDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={ev.id}
                  className="bg-[#141414] border border-white/10 hover:border-[#C5A059]/50 transition-all duration-300 rounded-lg overflow-hidden flex flex-col group shadow-xl"
                >
                  {/* Poster Image with Overlays */}
                  <div className="relative h-52 overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ev.posterUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />

                    {/* Category Stamp */}
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono uppercase tracking-wider rounded font-bold">
                        {ev.category}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-xs bg-black/70 px-3 py-1 rounded backdrop-blur-sm border border-white/10">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="font-mono font-semibold">{formattedDate}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h2 className="font-display text-2xl uppercase tracking-wide text-white group-hover:text-[#C5A059] transition-colors leading-snug">
                        {ev.title}
                      </h2>
                      <p className="text-xs text-[#A0A0A0] line-clamp-3 leading-relaxed">
                        {ev.description}
                      </p>

                      <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs text-[#A0A0A0]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                          <span className="truncate">{ev.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                          <span>{formattedTime} Sri Lanka Standard Time</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                          <span>{ev.attendeeCount || 120} Advocates Enrolled</span>
                        </div>
                      </div>

                      {ev.speakers && ev.speakers.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] block mb-1">
                            Keynote Jurists &amp; Faculty
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {ev.speakers.map((spk) => (
                              <span
                                key={spk}
                                className="px-2 py-0.5 bg-[#1F1F1F] text-[10px] text-white/80 rounded border border-white/5"
                              >
                                {spk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer with Price and Action */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-[#A0A0A0] block">
                          Subscription Fee
                        </span>
                        <span className="font-mono text-base font-bold text-[#C5A059]">
                          LKR {ev.price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveEventModal(ev)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-xs uppercase tracking-wider transition rounded shadow"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        Reserve Pass
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Ticket Reservation Modal */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#C5A059] max-w-lg w-full p-8 rounded-xl shadow-2xl relative animate-scaleUp">
            <button
              type="button"
              onClick={() => setActiveEventModal(null)}
              className="absolute top-4 right-4 text-[#A0A0A0] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {reservationSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                  PASS ALLOCATED &amp; VERIFIED
                </div>
                <h3 className="font-display text-3xl uppercase tracking-wide text-white">
                  Delegate Pass Reserved
                </h3>
                <p className="text-xs text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
                  Your seat has been reserved for <strong className="text-white">{activeEventModal.title}</strong>. A digital admission barcode has been synchronized to your{" "}
                  <Link href="/member" className="text-[#C5A059] underline">
                    Member Dashboard
                  </Link>.
                </p>
                <div className="p-4 bg-[#1C1C1C] border border-white/10 rounded font-mono text-xs text-[#C5A059]">
                  ENTRY TOKEN: CLS-CONF-2026-{Math.floor(1000 + Math.random() * 9000)}
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookTicket} className="space-y-6">
                <div>
                  <span className="px-2 py-0.5 bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-mono uppercase tracking-wider rounded border border-[#C5A059]/30">
                    {activeEventModal.category}
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-white mt-2 leading-tight">
                    {activeEventModal.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#A0A0A0] mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> {activeEventModal.venue}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                      Delegate / Advocate Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.name}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                      className="w-full bg-[#1C1C1C] border border-white/20 px-4 py-2 rounded text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                        SC Enrolment No.
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingFormData.sc_en}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, sc_en: e.target.value })}
                        className="w-full bg-[#1C1C1C] border border-white/20 px-4 py-2 rounded text-white font-mono focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                        Contact Mobile
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingFormData.mobile}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, mobile: e.target.value })}
                        className="w-full bg-[#1C1C1C] border border-white/20 px-4 py-2 rounded text-white font-mono focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#A0A0A0] mb-1 font-semibold">
                      Admission Classification &amp; Rate
                    </label>
                    <select
                      value={bookingFormData.ticketType}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, ticketType: e.target.value })}
                      className="w-full bg-[#1C1C1C] border border-white/20 px-4 py-2 rounded text-white focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="Member Delegate Pass (LKR 2,000)">
                        Colombo Law Society Member Rate — LKR 2,000.00
                      </option>
                      <option value="Non-Member Supreme Court Bar Pass (LKR 3,500)">
                        Supreme Court Bar / Non-Member — LKR 3,500.00
                      </option>
                      <option value="Junior Advocate (Under 3 Years) — LKR 1,000">
                        Junior Advocate (Under 3 Years Call) — LKR 1,000.00
                      </option>
                      <option value="Life Member Complimentary Pass (Free)">
                        Permanent Life Member — Complimentary
                      </option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-[#A0A0A0]">
                    Payment handled via online card gateway or secretariat counter.
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-xs uppercase tracking-wider rounded transition shadow"
                  >
                    Confirm Reservation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
