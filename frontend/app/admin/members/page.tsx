"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { initialMembers, Member } from "@/lib/mockData";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  Shield,
  X,
  RefreshCw,
  Eye,
  UserCheck,
} from "lucide-react";

export default function MemberDirectoryPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selected Member for Modal Review / Tier Upgrade
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedTierToUpgrade, setSelectedTierToUpgrade] = useState<"Ordinary" | "Life">("Ordinary");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.sc_en.toLowerCase().includes(q) ||
      m.ba_en.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.nic.toLowerCase().includes(q) ||
      m.mobile.includes(q);

    const matchesTier = tierFilter === "ALL" || m.membershipTier === tierFilter;
    const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleToggleStatus = (id: number) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === "Active" ? "Inactive" : "Active";
          showToast(`Member ${m.name} status updated to ${nextStatus}`);
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleApplyMembershipUpdate = () => {
    if (!selectedMember) return;

    if (selectedMember.membershipTier === "Life" && selectedTierToUpgrade === "Ordinary") {
      alert("Error: A permanent Life Member cannot be downgraded to Ordinary membership.");
      return;
    }

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === selectedMember.id) {
          const now = new Date();
          let newEndDate = "31 Dec, 2027";
          if (selectedTierToUpgrade === "Life") {
            newEndDate = "31 Dec, 2125";
          }
          return {
            ...m,
            membershipTier: selectedTierToUpgrade,
            membershipEndDate: newEndDate,
            status: "Active",
          };
        }
        return m;
      })
    );

    showToast(`Membership for ${selectedMember.name} updated to ${selectedTierToUpgrade}`);
    setUpgradeModalOpen(false);
    setSelectedMember(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-sand text-noir-900 px-6 py-3 border border-noir-900 font-mono text-xs uppercase tracking-widest font-bold shadow-2xl flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-800" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hairline-dark pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-bronze block mb-1">
              [ HULFTSDORP SUPREME COURT BAR DIRECTORY ]
            </span>
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider text-white">
              PRACTITIONER DIRECTORY & TIERS
            </h1>
          </div>

          <div className="mt-4 md:mt-0 text-xs font-mono text-stone-400">
            SHOWING {filteredMembers.length} OF {members.length} ENROLLED ADVOCATES
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-noir-900 border border-hairline-dark grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Name, SC Enrolment, BA Enrolment, NIC, Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-noir-800 border border-white/10 text-xs font-mono text-stone-200 placeholder-stone-500 focus:outline-none focus:border-bronze"
            />
          </div>

          {/* Tier Filter */}
          <div className="md:col-span-3">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-xs font-mono text-stone-200 focus:outline-none focus:border-bronze uppercase tracking-wider"
            >
              <option value="ALL">All Membership Tiers</option>
              <option value="Ordinary">Ordinary (Annual)</option>
              <option value="Life">Life (Permanent)</option>
              <option value="None">None (Unassigned)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-xs font-mono text-stone-200 focus:outline-none focus:border-bronze uppercase tracking-wider"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-noir-900 border border-hairline-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-stone-400 uppercase tracking-widest text-[10px] bg-noir-800/60">
                  <th className="py-3.5 px-4">Counsel Name</th>
                  <th className="py-3.5 px-4">Court Credentials</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Practice Discipline</th>
                  <th className="py-3.5 px-4">Membership Tier</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-sans font-medium text-stone-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={m.avatarUrl}
                          alt={m.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <span className="block font-semibold">{m.name}</span>
                          <span className="text-[10px] font-mono text-stone-500">{m.city}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="block text-stone-300 font-semibold">{m.sc_en}</span>
                      <span className="text-[10px] text-stone-500">{m.ba_en}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="block text-stone-300">{m.email}</span>
                      <span className="text-[10px] text-stone-500">{m.mobile}</span>
                    </td>

                    <td className="py-4 px-4 max-w-[200px]">
                      <span className="text-stone-300 block truncate">{m.practiceArea}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {m.expertise.slice(0, 2).map((exp, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.2 bg-white/5 text-stone-400">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col items-start space-y-1">
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                            m.membershipTier === "Life"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                              : m.membershipTier === "Ordinary"
                              ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                              : "bg-stone-800 text-stone-400 border border-stone-700"
                          }`}
                        >
                          {m.membershipTier} Member
                        </span>
                        <span className="text-[9px] text-stone-500">Exp: {m.membershipEndDate}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(m.id)}
                        className={`inline-flex items-center space-x-1.5 text-[10px] font-bold tracking-wider uppercase px-2 py-1 border transition-all ${
                          m.status === "Active"
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10"
                            : "border-stone-700 text-stone-500 bg-stone-900 hover:border-stone-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            m.status === "Active" ? "bg-emerald-400" : "bg-stone-600"
                          }`}
                        />
                        <span>{m.status}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMember(m);
                          setUpgradeModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 border border-bronze/40 text-bronze hover:bg-bronze hover:text-noir-900 text-[10px] uppercase tracking-wider font-bold transition-all"
                        title="Renew or Upgrade Membership Tier"
                      >
                        Tier Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Tier Management & Renewal */}
        {upgradeModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-noir-900 border border-hairline-dark max-w-lg w-full p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-hairline-dark pb-4">
                <div>
                  <span className="text-[10px] font-mono text-bronze uppercase tracking-widest block">
                    MEMBERSHIP TIER RENEWAL
                  </span>
                  <h3 className="font-display text-2xl uppercase text-white">
                    {selectedMember.name}
                  </h3>
                </div>
                <button
                  onClick={() => setUpgradeModalOpen(false)}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current details */}
              <div className="p-3 bg-noir-800 border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Supreme Court Enrolment:</span>
                  <span className="text-white font-bold">{selectedMember.sc_en}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Current Tier:</span>
                  <span className="text-amber-400 font-bold">{selectedMember.membershipTier} Member</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Valid Until:</span>
                  <span className="text-stone-300">{selectedMember.membershipEndDate}</span>
                </div>
              </div>

              {/* Selection options */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-widest text-stone-400 block">
                  Select Target Tier:
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setSelectedTierToUpgrade("Ordinary")}
                    className={`p-4 border cursor-pointer transition-all ${
                      selectedTierToUpgrade === "Ordinary"
                        ? "border-bronze bg-bronze/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span className="font-display text-lg text-white block">ORDINARY MEMBER</span>
                    <span className="text-xs font-mono text-stone-400 block mt-1">LKR 2,000 / Year</span>
                    <p className="text-[10px] text-stone-500 font-sans mt-2">
                      Adds +1 year from active expiration date.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedTierToUpgrade("Life")}
                    className={`p-4 border cursor-pointer transition-all ${
                      selectedTierToUpgrade === "Life"
                        ? "border-amber-400 bg-amber-400/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span className="font-display text-lg text-white block">LIFE MEMBER</span>
                    <span className="text-xs font-mono text-amber-400 block mt-1">LKR 5,000 Lifetime</span>
                    <p className="text-[10px] text-stone-500 font-sans mt-2">
                      Permanent 99-year validity with full AGM voting rights.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-hairline-dark flex justify-end space-x-3">
                <button
                  onClick={() => setUpgradeModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-stone-300 text-xs font-mono uppercase tracking-widest hover:border-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyMembershipUpdate}
                  className="px-5 py-2 bg-sand text-noir-900 font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-all"
                >
                  Apply & Record Membership
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
