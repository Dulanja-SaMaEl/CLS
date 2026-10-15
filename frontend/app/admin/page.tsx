"use client";

import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { initialMembers, initialEvents, initialBroadcastLogs } from "@/lib/mockData";
import {
  Users,
  Award,
  Radio,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  UserPlus,
  PlusCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "TOTAL ENROLLED ADVOCATES",
      value: "1,248",
      sub: "+14 pending review",
      icon: Users,
      trend: "Up 12% YOY",
    },
    {
      title: "ACTIVE ORDINARY MEMBERS",
      value: "842",
      sub: "LKR 2,000 / annum",
      icon: Clock,
      trend: "94% renewed",
    },
    {
      title: "PERMANENT LIFE MEMBERS",
      value: "326",
      sub: "LKR 5,000 lifetime fee",
      icon: Award,
      trend: "Supreme Court Bar",
    },
    {
      title: "BROADCASTS DISPATCHED",
      value: "148",
      sub: "Email & Text.lk SMS",
      icon: Radio,
      trend: "Active Official Notices",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hairline-dark pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] block mb-1">
              Chambers Executive Governance &bull; Est. 1890
            </span>
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider text-white">
              EXECUTIVE OVERVIEW
            </h1>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/events"
              className="px-3.5 py-2 bg-[#C5A059] text-black text-xs font-mono uppercase tracking-widest font-bold hover:bg-[#d6b168] transition-all flex items-center space-x-1.5 shadow"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar Scheduler</span>
            </Link>

            <Link
              href="/admin/gallery"
              className="px-3.5 py-2 bg-stone-800 border border-white/20 text-white text-xs font-mono uppercase tracking-widest font-bold hover:border-[#C5A059] transition-all flex items-center space-x-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Showcase Media</span>
            </Link>

            <Link
              href="/admin/members"
              className="px-3.5 py-2 bg-sand text-noir-900 text-xs font-mono uppercase tracking-widest font-bold hover:bg-white transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Directory</span>
            </Link>

            <Link
              href="/admin/broadcast"
              className="px-3.5 py-2 border border-bronze/40 text-bronze hover:bg-bronze hover:text-noir-900 text-xs font-mono uppercase tracking-widest font-bold transition-all flex items-center space-x-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-noir-900 border border-hairline-dark p-6 relative overflow-hidden group hover:border-bronze/40 transition-all"
              >
                <div className="flex items-center justify-between text-stone-400 mb-4">
                  <span className="text-[11px] font-mono tracking-widest uppercase">
                    {stat.title}
                  </span>
                  <Icon className="w-4 h-4 text-bronze" />
                </div>
                <div className="font-display text-4xl text-white tracking-wide">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs font-mono text-stone-400 flex items-center justify-between">
                  <span>{stat.sub}</span>
                  <span className="text-emerald-400 text-[10px]">{stat.trend}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-Column Middle Section: Recent Registrations & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Enrolled Members Table */}
          <div className="lg:col-span-8 bg-noir-900 border border-hairline-dark p-6">
            <div className="flex items-center justify-between border-b border-hairline-dark pb-4 mb-6">
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                  RECENT ENROLLED PRACTITIONERS
                </h3>
                <span className="text-xs font-mono text-stone-400">
                  Real-time synchronization with Supreme Court Bar registrations
                </span>
              </div>
              <Link
                href="/admin/members"
                className="text-xs font-mono text-bronze hover:text-white uppercase tracking-widest flex items-center space-x-1"
              >
                <span>View All Directory</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 uppercase tracking-widest text-[10px]">
                    <th className="pb-3">Advocate Name</th>
                    <th className="pb-3">SC Enrolment</th>
                    <th className="pb-3">Practice Area</th>
                    <th className="pb-3">Tier</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {initialMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 font-sans font-medium text-stone-200">
                        {m.name}
                      </td>
                      <td className="py-3.5 text-stone-400">{m.sc_en}</td>
                      <td className="py-3.5 text-stone-400 max-w-[180px] truncate">
                        {m.practiceArea}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                            m.membershipTier === "Life"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                              : m.membershipTier === "Ordinary"
                              ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                              : "bg-stone-800 text-stone-400 border border-stone-700"
                          }`}
                        >
                          {m.membershipTier}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center space-x-1 text-[10px] uppercase ${
                            m.status === "Active" ? "text-emerald-400" : "text-stone-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              m.status === "Active" ? "bg-emerald-400" : "bg-stone-600"
                            }`}
                          />
                          <span>{m.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href="/admin/members"
                          className="text-stone-300 hover:text-sand text-[11px] uppercase tracking-wider underline underline-offset-4"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Upcoming Events & System Reminders */}
          <div className="lg:col-span-4 space-y-8">
            {/* Upcoming CLE Conferences */}
            <div className="bg-noir-900 border border-hairline-dark p-6">
              <div className="flex items-center justify-between border-b border-hairline-dark pb-3 mb-4">
                <h3 className="font-display text-xl uppercase tracking-wider text-white">
                  CLE CALENDAR
                </h3>
                <Link
                  href="/admin/events"
                  className="text-[10px] font-mono text-bronze hover:text-white uppercase"
                >
                  Manage →
                </Link>
              </div>

              <div className="space-y-4">
                {initialEvents.slice(0, 2).map((evt) => (
                  <div key={evt.id} className="p-3 bg-noir-800 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-bronze uppercase tracking-widest block">
                      {evt.category}
                    </span>
                    <h4 className="text-xs font-sans font-semibold text-stone-200 line-clamp-1">
                      {evt.title}
                    </h4>
                    <div className="text-[10px] font-mono text-stone-400 flex items-center justify-between pt-1">
                      <span>LKR {evt.price.toLocaleString()}</span>
                      <span className="text-emerald-400 font-bold">{evt.attendeeCount} Enrolled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduled Expiry Audit Engine */}
            <div className="bg-noir-900 border border-hairline-dark p-6">
              <div className="flex items-center space-x-2 text-bronze mb-3">
                <Clock className="w-4 h-4" />
                <h3 className="font-display text-lg uppercase tracking-wider text-white">
                  AUTOMATED EXPIRY AUDIT
                </h3>
              </div>
              <p className="text-xs font-sans text-stone-400 leading-relaxed mb-4">
                Spring `@Scheduled` automated renewal reminders running daily at 08:00 AM (Asia/Colombo).
              </p>
              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex justify-between p-2 bg-noir-800 border border-white/5">
                  <span className="text-stone-300">30-Day Reminder:</span>
                  <span className="text-stone-400">42 Queued</span>
                </div>
                <div className="flex justify-between p-2 bg-noir-800 border border-white/5">
                  <span className="text-stone-300">7-Day Urgent:</span>
                  <span className="text-amber-400">18 Queued</span>
                </div>
                <div className="flex justify-between p-2 bg-noir-800 border border-white/5">
                  <span className="text-stone-300">1-Day Final Notice:</span>
                  <span className="text-red-400">5 Final</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
