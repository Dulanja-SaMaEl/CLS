"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    // Check local session
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cls_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAdminUser(parsed);
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cls_admin_token");
      localStorage.removeItem("cls_user");
      document.cookie = "cls_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/sign-in");
    }
  };

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
      <header className="h-16 border-b border-hairline-dark bg-noir-800/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-white border border-white/10 rounded"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 border border-bronze/40 flex items-center justify-center bg-noir-900 text-bronze group-hover:border-bronze transition-colors">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg sm:text-xl tracking-wider text-white leading-none">
                COLOMBO LAW SOCIETY
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase">
                EXECUTIVE ADMIN CONSOLE
              </span>
            </div>
          </Link>

          <span className="hidden md:inline-block text-stone-600">|</span>

          <Link
            href="/"
            className="hidden md:flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>
        </div>

        {/* Admin User Info & Logout Button */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-mono font-bold text-white block">
              {adminUser?.name || "Chambers Executive Admin"}
            </span>
            <span className="text-[10px] font-mono text-[#C5A059] uppercase">
              {adminUser?.email || "admin@cls.com"}
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#C5A059] text-noir-900 font-bold font-mono text-xs flex items-center justify-center border border-white/20 select-none">
            AD
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
            title="Log Out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-noir-900 border-b border-hairline-dark p-4 space-y-2 z-30">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all ${
                    isActive
                      ? "bg-[#C5A059] text-noir-900 font-bold shadow-md"
                      : "text-stone-300 hover:bg-noir-800 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-noir-900" : "text-[#C5A059]"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex justify-between">
              <Link
                href="/"
                className="text-xs font-mono text-stone-400 hover:text-white flex items-center gap-1 p-2"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Public Site</span>
              </Link>
            </div>
          </div>
        )}

        {/* Desktop Sidebar Nav */}
        <aside className="hidden md:flex w-64 border-r border-hairline-dark bg-noir-900 p-6 shrink-0 flex-col justify-between">
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
                        ? "bg-[#C5A059] text-noir-900 font-bold shadow-md"
                        : "text-stone-300 hover:bg-noir-800 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-noir-900" : "text-[#C5A059]"}`} />
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
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span>Supabase Live</span>
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Logged In:</span>
                  <span className="text-[#C5A059] text-[10px] truncate max-w-[120px]">
                    admin@cls.com
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Gateway:</span>
                  <span className="text-stone-200">REST API Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-hairline-dark text-[10px] font-mono text-stone-500 text-center">
            CLS EXECUTIVE OS • v2.6
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-noir-950 p-4 sm:p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
