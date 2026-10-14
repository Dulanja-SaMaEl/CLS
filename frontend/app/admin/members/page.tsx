"use client";

import { useState, useEffect } from "react";
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
  UserPlus,
  Trash2,
  Edit,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";

export default function MemberDirectoryPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selected Member for Tier Upgrade
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedTierToUpgrade, setSelectedTierToUpgrade] = useState<"Ordinary" | "Life">("Ordinary");

  // Enroll New Member Modal
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newScEn, setNewScEn] = useState("");
  const [newBaEn, setNewBaEn] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newNic, setNewNic] = useState("");
  const [newCity, setNewCity] = useState("Colombo");
  const [newPracticeArea, setNewPracticeArea] = useState("Commercial & Corporate Law");
  const [newTier, setNewTier] = useState<"Ordinary" | "Life">("Ordinary");
  const [submittingEnroll, setSubmittingEnroll] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch live members from backend / Supabase
  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMembers(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.sc_en.toLowerCase().includes(q) ||
      (m.ba_en && m.ba_en.toLowerCase().includes(q)) ||
      m.email.toLowerCase().includes(q) ||
      (m.nic && m.nic.toLowerCase().includes(q)) ||
      m.mobile.includes(q);

    const matchesTier = tierFilter === "ALL" || m.membershipTier === tierFilter;
    const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Toggle Active/Inactive Status
  const handleToggleStatus = async (id: number) => {
    const current = members.find((m) => m.id === id);
    if (!current) return;
    const nextStatus = current.status === "Active" ? "Inactive" : "Active";

    // Optimistic UI
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );

    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Advocate ${current.name} status updated to ${nextStatus}`);
      } else {
        loadMembers();
      }
    } catch (err) {
      console.error("Toggle error:", err);
      loadMembers();
    }
  };

  // Tier Upgrade & Renewal
  const handleApplyMembershipUpdate = async () => {
    if (!selectedMember) return;

    if (selectedMember.membershipTier === "Life" && selectedTierToUpgrade === "Ordinary") {
      alert("Error: A permanent Life Member cannot be downgraded to Ordinary membership.");
      return;
    }

    let newEndDate = "2027-12-31";
    if (selectedTierToUpgrade === "Life") {
      newEndDate = "2125-12-31";
    }

    try {
      const res = await fetch(`/api/members/${selectedMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipTier: selectedTierToUpgrade,
          membershipEndDate: newEndDate,
          status: "Active",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === selectedMember.id
              ? {
                  ...m,
                  membershipTier: selectedTierToUpgrade,
                  membershipEndDate: newEndDate,
                  status: "Active",
                }
              : m
          )
        );
        showToast(`Membership for ${selectedMember.name} updated to ${selectedTierToUpgrade}`);
      }
    } catch (err) {
      console.error("Tier update error:", err);
      alert("Failed to update membership tier.");
    } finally {
      setUpgradeModalOpen(false);
      setSelectedMember(null);
    }
  };

  // Delete Member
  const handleDeleteMember = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the active registry?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        showToast(`${name} removed from registry.`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete member.");
    }
  };

  // Enroll New Member Submission
  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newScEn || !newEmail || !newMobile) {
      alert("Please provide advocate name, SC enrolment number, email, and mobile.");
      return;
    }

    setSubmittingEnroll(true);
    try {
      const payload = {
        name: newName,
        sc_en: newScEn,
        ba_en: newBaEn || `BASL/${Math.floor(10000 + Math.random() * 90000)}`,
        email: newEmail,
        mobile: newMobile,
        nic: newNic || "198000000000",
        gender: "Male",
        city: newCity,
        practiceArea: newPracticeArea,
        expertise: ["Appellate Advocacy"],
        membershipTier: newTier,
        status: "Active" as const,
        registeredDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        membershipStartDate: new Date().toISOString().split("T")[0],
        membershipEndDate: newTier === "Life" ? "2125-12-31" : "2027-12-31",
        avatarUrl: "/images/branding/cls-crest-gold.png",
      };

      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setMembers((prev) => [data.data, ...prev]);
        showToast(`Advocate ${newName} enrolled into Supreme Court Bar Directory!`);
        setEnrollModalOpen(false);
        // Reset form
        setNewName("");
        setNewScEn("");
        setNewBaEn("");
        setNewEmail("");
        setNewMobile("");
        setNewNic("");
      } else {
        alert(data.error || "Failed to enroll member");
      }
    } catch (err: any) {
      alert("Network error enrolling member: " + err.message);
    } finally {
      setSubmittingEnroll(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#C5A059] text-noir-900 px-6 py-3 border border-noir-900 font-mono text-xs uppercase tracking-widest font-bold shadow-2xl flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-950" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Title & Top Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hairline-dark pb-6 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-bronze block mb-1">
              [ HULFTSDORP SUPREME COURT BAR DIRECTORY ]
            </span>
            <h1 className="font-display text-3xl md:text-5xl uppercase tracking-wider text-white">
              PRACTITIONER DIRECTORY &amp; TIERS
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadMembers}
              className="p-2.5 rounded bg-noir-800 border border-white/10 hover:border-[#C5A059] text-stone-300 hover:text-white transition cursor-pointer"
              title="Refresh Registry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C5A059]" : ""}`} />
            </button>

            <button
              onClick={() => setEnrollModalOpen(true)}
              className="px-4 py-2.5 bg-[#C5A059] text-black text-xs font-mono uppercase tracking-widest font-bold hover:bg-[#d6b168] transition-all flex items-center space-x-2 shadow cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll New Advocate</span>
            </button>
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
              className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-xs font-mono text-stone-200 focus:outline-none focus:border-bronze uppercase tracking-wider cursor-pointer"
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
              className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-xs font-mono text-stone-200 focus:outline-none focus:border-bronze uppercase tracking-wider cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active Advocates</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table of Members */}
        <div className="bg-noir-900 border border-hairline-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-noir-800/80 text-stone-400 uppercase tracking-widest text-[10px]">
                  <th className="py-3 px-4">Counsel</th>
                  <th className="py-3 px-4">Enrolment</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Practice Domain</th>
                  <th className="py-3 px-4">Tier Status</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-sans font-semibold text-stone-100">
                      {m.name}
                    </td>

                    <td className="py-4 px-4">
                      <span className="block text-stone-300 font-semibold">{m.sc_en}</span>
                      <span className="text-[10px] text-stone-500">{m.ba_en || "BASL/---"}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="block text-stone-300">{m.email}</span>
                      <span className="text-[10px] text-stone-500">{m.mobile}</span>
                    </td>

                    <td className="py-4 px-4 max-w-[200px]">
                      <span className="text-stone-300 block truncate">{m.practiceArea}</span>
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
                        {m.membershipEndDate && (
                          <span className="text-[9px] text-stone-500">Exp: {m.membershipEndDate}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(m.id)}
                        className={`inline-flex items-center space-x-1.5 text-[10px] font-bold tracking-wider uppercase px-2 py-1 border transition-all cursor-pointer ${
                          m.status === "Active"
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10"
                            : "border-stone-700 text-stone-500 bg-stone-900 hover:border-stone-500"
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            m.status === "Active" ? "bg-emerald-400" : "bg-stone-600"
                          }`}
                        />
                        <span>{m.status}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMember(m);
                          setUpgradeModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 border border-bronze/40 text-bronze hover:bg-bronze hover:text-noir-900 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
                        title="Renew or Upgrade Membership Tier"
                      >
                        Tier Manage
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMember(m.id, m.name)}
                        className="p-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[10px] transition cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Enroll New Advocate */}
        {enrollModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-noir-900 border border-hairline-dark max-w-lg w-full p-6 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-hairline-dark pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest block">
                    SUPREME COURT ENROLMENT
                  </span>
                  <h3 className="font-display text-2xl uppercase text-white">
                    Enroll New Advocate
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-stone-300 uppercase mb-1">Advocate Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Mr. Kanchana Senanayake, PC"
                    className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 uppercase mb-1">SC Enrolment No *</label>
                    <input
                      type="text"
                      required
                      value={newScEn}
                      onChange={(e) => setNewScEn(e.target.value)}
                      placeholder="SC/EN/2026/..."
                      className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 uppercase mb-1">BASL Enrolment</label>
                    <input
                      type="text"
                      value={newBaEn}
                      onChange={(e) => setNewBaEn(e.target.value)}
                      placeholder="BASL/18492"
                      className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 uppercase mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="counsel@bar.lk"
                      className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 uppercase mb-1">Mobile Phone *</label>
                    <input
                      type="text"
                      required
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      placeholder="+94 77 000 0000"
                      className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 uppercase mb-1">City / Region</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Colombo"
                      className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 uppercase mb-1">Membership Tier</label>
                    <select
                      value={newTier}
                      onChange={(e) => setNewTier(e.target.value as any)}
                      className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
                    >
                      <option value="Ordinary">Ordinary Member (LKR 2,000/yr)</option>
                      <option value="Life">Life Member (LKR 5,000 lifetime)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 uppercase mb-1">Primary Practice Area</label>
                  <input
                    type="text"
                    value={newPracticeArea}
                    onChange={(e) => setNewPracticeArea(e.target.value)}
                    placeholder="e.g. Commercial & Appellate Litigation"
                    className="w-full px-3 py-2 bg-noir-800 border border-white/10 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEnrollModalOpen(false)}
                    className="px-4 py-2 border border-white/20 text-stone-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingEnroll}
                    className="px-5 py-2 bg-[#C5A059] text-black font-bold uppercase hover:bg-[#d6b168] cursor-pointer disabled:opacity-50"
                  >
                    {submittingEnroll ? "Enrolling..." : "Complete Enrolment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                  type="button"
                  onClick={() => setUpgradeModalOpen(false)}
                  className="text-stone-400 hover:text-white cursor-pointer"
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
                  <span className="text-bronze font-bold">{selectedMember.membershipTier} Member</span>
                </div>
              </div>

              {/* Select Upgrade Tier */}
              <div className="space-y-3 font-mono text-xs">
                <label className="block text-stone-300 uppercase tracking-widest">
                  Target Membership Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedTierToUpgrade("Ordinary")}
                    className={`p-4 border cursor-pointer transition-all ${
                      selectedTierToUpgrade === "Ordinary"
                        ? "border-[#C5A059] bg-[#C5A059]/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="font-bold text-white mb-1">Ordinary Annual</div>
                    <div className="text-stone-400 text-[11px]">Renew through Dec 2027</div>
                    <div className="text-bronze font-bold mt-2">LKR 2,000</div>
                  </div>

                  <div
                    onClick={() => setSelectedTierToUpgrade("Life")}
                    className={`p-4 border cursor-pointer transition-all ${
                      selectedTierToUpgrade === "Life"
                        ? "border-[#C5A059] bg-[#C5A059]/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="font-bold text-white mb-1">Permanent Life</div>
                    <div className="text-stone-400 text-[11px]">Lifetime Hulftsdorp Bar</div>
                    <div className="text-amber-400 font-bold mt-2">LKR 5,000</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-hairline-dark">
                <button
                  type="button"
                  onClick={() => setUpgradeModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-stone-400 hover:text-white uppercase font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyMembershipUpdate}
                  className="px-5 py-2 bg-[#C5A059] text-noir-900 font-bold uppercase font-mono text-xs hover:bg-[#d6b168] transition cursor-pointer"
                >
                  Apply Renewal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
