"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function AdminBroadcastPage() {
  const [logs, setLogs] = useState<BroadcastLog[]>(initialBroadcastLogs);
  const [targetTier, setTargetTier] = useState<"All Members" | "Ordinary Member" | "Life Member">("All Members");
  const [channel, setChannel] = useState<"EMAIL" | "SMS" | "BOTH">("BOTH");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recipient Count Calculations
  const getRecipientEstimate = () => {
    if (targetTier === "All Members") return 1168;
    if (targetTier === "Ordinary Member") return 842;
    return 326;
  };

  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      alert("Please enter both title and message content.");
      return;
    }

    setIsSending(true);

    // Simulate async gateway dispatch
    setTimeout(() => {
      const newLog: BroadcastLog = {
        id: Date.now(),
        title,
        content: message,
        channel,
        targetTier,
        recipientsCount: getRecipientEstimate(),
        sentAt: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Delivered",
      };

      setLogs([newLog, ...logs]);
      setIsSending(false);
      showToast(`Broadcast "${title}" queued & dispatched to ${getRecipientEstimate()} advocates!`);
      setTitle("");
      setMessage("");
    }, 1200);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const smsLength = message.length;
  const smsSegments = Math.ceil(smsLength / 160) || 1;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-sand text-noir-900 px-6 py-3.5 border border-noir-900 font-mono text-xs uppercase tracking-widest font-bold shadow-2xl flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-800" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hairline-dark pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-bronze block mb-1">
              [ OFFICIAL BAR COMMUNICATIONS ENGINE ]
            </span>
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider text-white">
              MULTI-CHANNEL BROADCAST CENTER
            </h1>
          </div>
          <span className="text-xs font-mono text-stone-400 mt-2 md:mt-0">
            INTEGRATED WITH GMAIL SMTP & TEXT.LK GATEWAY
          </span>
        </div>

        {/* Main Compose Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-noir-900 border border-hairline-dark p-6 space-y-6">
            <div className="border-b border-hairline-dark pb-3">
              <h3 className="font-display text-2xl uppercase tracking-wide text-white">
                COMPOSE DISPATCH NOTICE
              </h3>
              <p className="text-xs text-stone-400 font-sans mt-0.5">
                Targeted notices are dispatched asynchronously to prevent gateway timeouts.
              </p>
            </div>

            <form onSubmit={handleDispatchBroadcast} className="space-y-5 text-xs font-mono">
              {/* Target Tier Selection */}
              <div>
                <label className="block text-stone-400 uppercase tracking-widest mb-1.5">
                  1. Target Membership Tier:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["All Members", "Ordinary Member", "Life Member"] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setTargetTier(tier)}
                      className={`p-3 text-center border transition-all ${
                        targetTier === tier
                          ? "border-sand bg-sand text-noir-900 font-bold"
                          : "border-white/10 text-stone-400 hover:border-white/30"
                      }`}
                    >
                      <span className="block text-xs uppercase">{tier}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Channel Selection */}
              <div>
                <label className="block text-stone-400 uppercase tracking-widest mb-1.5">
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
                        className={`p-3 text-center border flex items-center justify-center space-x-2 transition-all ${
                          channel === ch.key
                            ? "border-bronze bg-bronze/10 text-bronze font-bold"
                            : "border-white/10 text-stone-400 hover:border-white/30"
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
                <label className="block text-stone-400 uppercase tracking-widest mb-1.5">
                  3. Notice Title / Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Notice: Supreme Court Vacation Roster & Library Hours"
                  className="w-full px-4 py-2.5 bg-noir-800 border border-white/10 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-bronze"
                />
              </div>

              {/* Message Content */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-stone-400 uppercase tracking-widest">
                    4. Message Body *
                  </label>
                  {(channel === "SMS" || channel === "BOTH") && (
                    <span className="text-[10px] text-stone-400">
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
                  className="w-full px-4 py-2.5 bg-noir-800 border border-white/10 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-bronze font-sans text-xs leading-relaxed"
                />
              </div>

              {/* Audience Preview */}
              <div className="p-3.5 bg-noir-800 border border-hairline-dark flex items-center justify-between text-stone-300">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-bronze" />
                  <span>Audience Reach:</span>
                </div>
                <span className="text-sand font-bold text-sm">
                  {getRecipientEstimate()} Enrolled Advocates ({targetTier})
                </span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-sand text-noir-900 font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
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
            {/* Live Preview Card */}
            <div className="bg-noir-900 border border-hairline-dark p-6 space-y-4">
              <span className="text-xs font-mono text-bronze uppercase tracking-widest block border-b border-hairline-dark pb-2">
                LIVE DISPATCH PREVIEW
              </span>

              {/* Email Mock */}
              {(channel === "EMAIL" || channel === "BOTH") && (
                <div className="bg-white text-stone-900 p-4 rounded text-xs font-sans shadow-lg">
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
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 text-xs font-mono space-y-2">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                    SMS Gateway (Text.lk - Sender: CLS)
                  </span>
                  <p className="text-stone-200 bg-noir-800 p-3 border border-white/10 rounded font-sans text-xs">
                    {message || "SMS message preview as received on Sri Lankan mobile (+94)..."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Broadcast Audit History Log Table */}
        <div className="bg-noir-900 border border-hairline-dark p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-hairline-dark pb-4">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                BROADCAST AUDIT HISTORY
              </h3>
              <span className="text-xs font-mono text-stone-400">
                Single log entry generated per batch (Duplicate row bug resolved)
              </span>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {logs.length} Logged Dispatches
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-stone-400 uppercase tracking-widest text-[10px]">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Notice Title</th>
                  <th className="pb-3">Target Tier</th>
                  <th className="pb-3">Channel</th>
                  <th className="pb-3">Recipients</th>
                  <th className="pb-3 text-right">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 text-stone-400">{log.sentAt}</td>
                    <td className="py-3.5 font-sans font-medium text-stone-200 max-w-xs truncate">
                      {log.title}
                    </td>
                    <td className="py-3.5 text-stone-400">{log.targetTier}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-noir-800 border border-white/10 text-bronze text-[10px] uppercase font-bold">
                        {log.channel}
                      </span>
                    </td>
                    <td className="py-3.5 text-sand font-bold">{log.recipientsCount} Counsel</td>
                    <td className="py-3.5 text-right">
                      <span className="text-emerald-400 text-[10px] uppercase tracking-wider font-bold">
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
