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
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("cls_admin_token");
      const storedUser = localStorage.getItem("cls_user");
      const hasCookie = document.cookie.includes("cls_admin_session=true");

      let userObj: any = null;
      if (storedUser) {
        try {
          userObj = JSON.parse(storedUser);
        } catch (e) {}
      }

      const isAdmin =
        hasCookie ||
        Boolean(storedToken) ||
        (userObj && (userObj.role === "admin" || userObj.email === "admin@cls.com"));

      if (!isAdmin) {
        setIsAuthorized(false);
        window.location.href = `/sign-in?redirect=${encodeURIComponent(pathname)}`;
      } else {
        setIsAuthorized(true);
        const isSecure = window.location.protocol === "https:";
        const secureFlag = isSecure ? "; Secure" : "";
        if (!hasCookie) {
          document.cookie = `cls_admin_session=true; path=/; max-age=604800; SameSite=Lax${secureFlag}`;
        }
        if (userObj) {
          setAdminUser(userObj);
        } else {
          setAdminUser({ name: "Chambers Executive Administrator", email: "admin@cls.com" });
        }
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cls_admin_token");
      localStorage.removeItem("cls_token");
      localStorage.removeItem("cls_user");
      document.cookie = "cls_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "cls_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "cls_member_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "cls_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/sign-in";
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

  if (isAuthorized === null || isAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-full border border-[#C5A059]/40 p-2 flex items-center justify-center bg-[#141414] mb-6 shadow-2xl relative">
          <Scale className="w-8 h-8 text-[#C5A059] animate-pulse" />
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A059] block mb-2">
          Colombo Law Society &bull; Established 1890
        </span>
        <h2 className="text-xl sm:text-2xl font-display text-white uppercase tracking-wider mb-2">
          Verifying Session Authorization
        </h2>
        <p className="text-xs font-mono text-stone-400 max-w-md mb-6">
          Access to the Colombo Law Society Administration Console requires verified credentials. Redirecting to authorization portal...
        </p>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div className="w-1/2 h-full bg-[#C5A059] animate-pulse" />
        </div>
      </div>
    );
  }

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

            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="bg-[#141414] p-3.5 border border-white/5 rounded text-[11px] font-mono space-y-2">
                <div className="text-stone-300 font-semibold uppercase tracking-wider text-[10px]">
                  Chambers Secretariat
                </div>
                <div className="text-stone-400 text-[10px] truncate">
                  {adminUser?.email || "admin@cls.com"}
                </div>
                <div className="text-stone-500 text-[9px] pt-1.5 border-t border-white/5">
                  Superior Courts Enclave, Colombo 12
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 text-[10px] font-mono text-stone-500 text-center">
            Colombo Law Society &bull; Est. 1890
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
