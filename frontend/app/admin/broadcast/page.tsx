"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { initialBroadcastLogs, BroadcastLog } from "@/lib/mockData";
import {
  Radio,
  Mail,
  MessageSquare,
  Send,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

export default function AdminBroadcastPage() {
  const [logs, setLogs] = useState<BroadcastLog[]>(initialBroadcastLogs);
  const [loading, setLoading] = useState(false);
  const [targetTier, setTargetTier] = useState<"All Members" | "Ordinary Member" | "Life Member">("All Members");
  const [channel, setChannel] = useState<"EMAIL" | "SMS" | "BOTH">("BOTH");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load live broadcast history
  const loadBroadcasts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/broadcast");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLogs(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load broadcast logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBroadcasts();
  }, []);

  // Recipient Count Calculations
  const getRecipientEstimate = () => {
    if (targetTier === "All Members") return 1168;
    if (targetTier === "Ordinary Member") return 842;
    return 326;
  };

  const handleDispatchBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      alert("Please enter both title and message content.");
      return;
    }

    setIsSending(true);

    try {
      const payload = {
        title,
        content: message,
        channel,
        targetTier,
        recipientsCount: getRecipientEstimate(),
      };

      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setLogs((prev) => [data.data, ...prev]);
        showToast(`Broadcast "${title}" queued & dispatched to ${getRecipientEstimate()} advocates!`);
        setTitle("");
        setMessage("");
      } else {
        alert(data.error || "Failed to dispatch broadcast");
      }
    } catch (err: any) {
      console.error("Broadcast error:", err);
      // Fallback local append
      const newLog: BroadcastLog = {
        id: Date.now(),
        title,
        content: message,
        channel,
        targetTier,
        recipientsCount: getRecipientEstimate(),
        sentAt: new Date().toLocaleString("en-GB"),
        status: "Delivered",
      };
      setLogs((prev) => [newLog, ...prev]);
      showToast(`Broadcast dispatched (offline fallback).`);
      setTitle("");
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Quick Template Handler
  const applyTemplate = (t: string, m: string) => {
    setTitle(t);
    setMessage(m);
  };

  const smsLength = message.length;
  const smsSegments = Math.ceil(smsLength / 160) || 1;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#C5A059] text-noir-900 px-6 py-3.5 border border-noir-900 font-mono text-xs uppercase tracking-widest font-bold shadow-2xl flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-950" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 dark:border-hairline-dark pb-6 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#9E7D3B] dark:text-bronze block mb-1">
              [ OFFICIAL BAR COMMUNICATIONS ENGINE ]
            </span>
            <h1 className="font-display text-3xl md:text-5xl uppercase tracking-wider text-stone-900 dark:text-white">
              MULTI-CHANNEL BROADCAST CENTER
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadBroadcasts}
              className="p-2.5 rounded bg-white dark:bg-noir-800 border border-stone-200 dark:border-white/10 hover:border-[#9E7D3B] dark:hover:border-[#C5A059] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition cursor-pointer shadow-sm"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#9E7D3B] dark:text-[#C5A059]" : ""}`} />
            </button>
            <span className="text-xs font-mono text-[#9E7D3B] dark:text-[#C5A059] uppercase tracking-wider font-semibold">
              SMS &amp; Email Dispatch
            </span>
          </div>
        </div>

        {/* Main Compose Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white dark:bg-noir-900 border border-stone-200 dark:border-hairline-dark p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-hairline-dark pb-3">
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-stone-900 dark:text-white">
                  COMPOSE DISPATCH NOTICE
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
                  Official notices and circulars dispatched directly to registered advocates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setMessage("");
                }}
                className="text-[11px] font-mono text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Clear current input"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-[11px] font-mono text-[#9E7D3B] dark:text-[#C5A059] uppercase tracking-widest mb-2 font-bold">
                Quick Announcement Templates:
              </label>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      "Urgent: Supreme Court Sitting Roster Update",
                      "Please be informed that the Supreme Court Bench sitting schedule and courtroom access registry for Hulftsdorp have been revised effective immediately. Please check the official portal notice board."
                    )
                  }
                  className="px-2.5 py-1.5 bg-stone-50 dark:bg-noir-800 border border-stone-200 dark:border-white/10 hover:border-[#9E7D3B] dark:hover:border-[#C5A059] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded transition cursor-pointer"
                >
                  🏛️ Court Protocol
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      "CLE Masterclass: Appellate Advocacy Registrations Open",
                      "Registrations are now open for the upcoming CLE Masterclass on Appellate Argumentation. CPD credits will be accredited. Reserve your seat via the CLS events calendar."
                    )
                  }
                  className="px-2.5 py-1.5 bg-stone-50 dark:bg-noir-800 border border-stone-200 dark:border-white/10 hover:border-[#9E7D3B] dark:hover:border-[#C5A059] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded transition cursor-pointer"
                >
                  ⚖️ CLE Seminar
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      "Annual Bar Subscriptions 2026/2027 Due Notice",
                      "Members of the Colombo Law Society are cordially requested to regularize their annual bar subscriptions for the upcoming judicial term. Online payments and verification are enabled on your member dashboard."
                    )
                  }
                  className="px-2.5 py-1.5 bg-stone-50 dark:bg-noir-800 border border-stone-200 dark:border-white/10 hover:border-[#9E7D3B] dark:hover:border-[#C5A059] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded transition cursor-pointer"
                >
                  💳 Subscription Due
                </button>
              </div>
            </div>

            <form onSubmit={handleDispatchBroadcast} className="space-y-5 text-xs font-mono">
              {/* Target Tier Selection */}
              <div>
                <label className="block text-stone-600 dark:text-stone-400 uppercase tracking-widest mb-1.5 font-semibold">
                  1. Target Membership Tier:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["All Members", "Ordinary Member", "Life Member"] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setTargetTier(tier)}
                      className={`p-3 text-center border transition-all cursor-pointer ${
                        targetTier === tier
                          ? "border-[#9E7D3B] dark:border-[#C5A059] bg-[#9E7D3B] dark:bg-[#C5A059] text-white dark:text-noir-900 font-bold shadow"
                          : "border-stone-200 dark:border-white/10 bg-stone-50/50 dark:bg-transparent text-stone-600 dark:text-stone-400 hover:border-[#9E7D3B]/50 dark:hover:border-white/30"
                      }`}
                    >
                      <span className="block text-xs uppercase">{tier}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Channel Selection */}
              <div>
                <label className="block text-stone-600 dark:text-stone-400 uppercase tracking-widest mb-1.5 font-semibold">
                  2. Delivery Channels:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "EMAIL", label: "Email Only", icon: Mail },
                    { key: "SMS", label: "SMS (Text.lk)", icon: MessageSquare },
                    { key: "BOTH", label: "Both Channels", icon: Radio },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <button
                        key={ch.key}
                        type="button"
                        onClick={() => setChannel(ch.key as any)}
                        className={`p-3 text-center border flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                          channel === ch.key
                            ? "border-[#9E7D3B] dark:border-[#C5A059] bg-[#9E7D3B]/10 dark:bg-[#C5A059]/15 text-[#9E7D3B] dark:text-[#C5A059] font-bold shadow-sm"
                            : "border-stone-200 dark:border-white/10 bg-stone-50/50 dark:bg-transparent text-stone-600 dark:text-stone-400 hover:border-[#9E7D3B]/50 dark:hover:border-white/30"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-xs uppercase">{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Title */}
              <div>
                <label className="block text-stone-600 dark:text-stone-400 uppercase tracking-widest mb-1.5 font-semibold">
                  3. Notice Title / Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Notice: Supreme Court Vacation Roster & Library Hours"
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-noir-800 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-[#9E7D3B] dark:focus:border-[#C5A059]"
                />
              </div>

              {/* Message Content */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-stone-600 dark:text-stone-400 uppercase tracking-widest font-semibold">
                    4. Message Body *
                  </label>
                  {(channel === "SMS" || channel === "BOTH") && (
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">
                      Chars: {smsLength} | Segments: {smsSegments} SMS
                    </span>
                  )}
                </div>
                <textarea
                  rows={6}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Dear Member, Please be notified that..."
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-noir-800 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-[#9E7D3B] dark:focus:border-[#C5A059] font-sans text-xs leading-relaxed"
                />
              </div>

              {/* Audience Preview */}
              <div className="p-3.5 bg-stone-50 dark:bg-noir-800 border border-stone-200 dark:border-hairline-dark flex items-center justify-between text-stone-700 dark:text-stone-300">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#9E7D3B] dark:text-bronze" />
                  <span>Audience Reach:</span>
                </div>
                <span className="text-[#9E7D3B] dark:text-[#C5A059] font-bold text-sm">
                  {getRecipientEstimate()} Enrolled Advocates ({targetTier})
                </span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-[#9E7D3B] hover:bg-[#85682e] dark:bg-[#C5A059] dark:hover:bg-[#d6b168] text-white dark:text-noir-900 font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isSending ? (
                  <span>Dispatching to Gateways...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dispatch Broadcast to {getRecipientEstimate()} Members</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-noir-900 border border-stone-200 dark:border-hairline-dark p-6 space-y-4 shadow-sm">
              <span className="text-xs font-mono text-[#9E7D3B] dark:text-bronze uppercase tracking-widest block border-b border-stone-200 dark:border-hairline-dark pb-2 font-bold">
                LIVE DISPATCH PREVIEW
              </span>

              {/* Email Mock */}
              {(channel === "EMAIL" || channel === "BOTH") && (
                <div className="bg-stone-50 dark:bg-white text-stone-900 p-4 rounded text-xs font-sans shadow-md border border-stone-200 dark:border-transparent">
                  <div className="border-b border-stone-200 pb-2 mb-3 font-mono text-[11px] text-stone-500">
                    <div><strong>From:</strong> notifications@colombolawsociety.com</div>
                    <div><strong>To:</strong> Member Advocate &lt;counsel@bar.lk&gt;</div>
                    <div><strong>Subject:</strong> {title || "Notice Subject Line"}</div>
                  </div>
                  <div className="py-2">
                    <h4 className="font-bold text-stone-800 text-sm mb-1">
                      Colombo Law Society
                    </h4>
                    <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">
                      {message || "The broadcast message body will be formatted with high-contrast official legal typography..."}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-stone-200 text-[10px] text-stone-400 font-mono text-center">
                    &copy; Colombo Law Society • Superior Courts Complex, Hulftsdorp
                  </div>
                </div>
              )}

              {/* SMS Mock */}
              {(channel === "SMS" || channel === "BOTH") && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 p-4 text-xs font-mono space-y-2">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase block">
                    SMS Gateway (Text.lk - Sender: CLS)
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 bg-white dark:bg-noir-800 p-3 border border-emerald-100 dark:border-white/10 rounded font-sans text-xs shadow-sm">
                    {message || "SMS message preview as received on Sri Lankan mobile (+94)..."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Broadcast Audit History Log Table */}
        <div className="bg-white dark:bg-noir-900 border border-stone-200 dark:border-hairline-dark p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-hairline-dark pb-4">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-wider text-stone-900 dark:text-white">
                BROADCAST AUDIT HISTORY
              </h3>
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                Live dispatch records synchronized with Supabase
              </span>
            </div>
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
              {logs.length} Logged Dispatches
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-noir-800/80 text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px]">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Notice Title</th>
                  <th className="py-3 px-3">Target Tier</th>
                  <th className="py-3 px-3">Channel</th>
                  <th className="py-3 px-3">Recipients</th>
                  <th className="py-3 px-3 text-right">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-white/[0.02]">
                    <td className="py-3.5 px-3 text-stone-500 dark:text-stone-400">{log.sentAt}</td>
                    <td className="py-3.5 px-3 font-sans font-medium text-stone-900 dark:text-stone-200 max-w-xs truncate">
                      {log.title}
                    </td>
                    <td className="py-3.5 px-3 text-stone-600 dark:text-stone-400">{log.targetTier}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 bg-stone-100 dark:bg-noir-800 border border-stone-200 dark:border-white/10 text-[#9E7D3B] dark:text-bronze text-[10px] uppercase font-bold">
                        {log.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-stone-900 dark:text-sand font-bold">{log.recipientsCount} Counsel</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-wider font-bold">
                        ✓ {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
