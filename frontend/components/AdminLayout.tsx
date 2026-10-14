"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  Users,
  Calendar,
  Radio,
  FileText,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Bell,
  Search,
  CheckCircle,
  Image,
  Award,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Executive Overview", href: "/admin", icon: ShieldCheck },
    { name: "Events & Calendar Manager", href: "/admin/events", icon: Calendar },
    { name: "Event Showcase Gallery", href: "/admin/gallery", icon: Image },
    { name: "Member Directory", href: "/admin/members", icon: Users },
    { name: "Committee Council Editor", href: "/admin/committee", icon: Award },
    { name: "Broadcast Center (SMS/Email)", href: "/admin/broadcast", icon: Radio },
  ];

  return (
    <div className="min-h-screen bg-noir-900 text-stone-100 flex flex-col font-sans selection:bg-bronze selection:text-noir-900">
      {/* Top Admin Bar */}
      <header className="h-16 border-b border-hairline-dark bg-noir-800/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 border border-bronze/40 flex items-center justify-center bg-noir-900 text-bronze group-hover:border-bronze transition-colors">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-wider text-white leading-none">
                COLOMBO LAW SOCIETY
              </span>
              <span className="text-[9px] font-mono tracking-widest text-bronze uppercase">
                EXECUTIVE ADMIN CONSOLE
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-block text-stone-600">|</span>

          <Link
            href="/"
            className="hidden sm:flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Site</span>
          </Link>
        </div>

        {/* Admin User Info */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <span className="text-xs font-mono font-bold text-white block">
              Registrar Chambers
            </span>
            <span className="text-[10px] font-mono text-bronze uppercase">
              Supreme Court Bar Admin
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-sand text-noir-900 font-bold font-mono text-xs flex items-center justify-center border border-white/20">
            RC
          </div>

          <Link
            href="/"
            className="p-2 text-stone-400 hover:text-red-400 transition-colors"
            title="Log Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 border-r border-hairline-dark bg-noir-900 p-6 shrink-0 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-4 px-3">
              MANAGEMENT DOMAINS
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all ${
                      isActive
                        ? "bg-sand text-noir-900 font-bold shadow-md"
                        : "text-stone-300 hover:bg-noir-800 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-noir-900" : "text-bronze"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-10 pt-6 border-t border-hairline-dark">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-3 px-3">
                SYSTEM TELEMETRY
              </div>
              <div className="bg-noir-800 p-3 border border-hairline-dark text-[11px] font-mono space-y-2">
                <div className="flex justify-between text-stone-400">
                  <span>DB Status:</span>
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span>Supabase PG</span>
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>SMS API:</span>
                  <span className="text-bronze">Text.lk Active</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Storage:</span>
                  <span className="text-stone-200">S3 Buckets Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-hairline-dark text-[10px] font-mono text-stone-500 text-center">
            CLS EXECUTIVE OS • v2.6
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-noir-950 p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
