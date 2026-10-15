"use client";

import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { executiveCommittee } from "@/lib/mockData";
import { compressImageFile, readFileAsDataUrl } from "@/lib/image-upload";
import {
  Award,
  Edit,
  Trash2,
  Plus,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Mail,
  Phone,
  Scale,
  X,
  UserCheck
} from "lucide-react";

type CommitteeMember = typeof executiveCommittee[0];

export default function AdminCommitteePage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [credentials, setCredentials] = useState("Attorney-at-Law");
  const [court, setCourt] = useState("Hulftsdorp Superior Courts Complex");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load committee from API
  const loadCommittee = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/committee");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setMembers(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load committee:", err);
      setMembers(executiveCommittee);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommittee();
  }, []);

  // Handle direct photo upload via /api/upload with client optimization and zero-failure fallback
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setFeedback(null);

    try {
      // Compress client-side for rapid upload and to avoid serverless payload limits
      const optimizedBlob = await compressImageFile(file);

      const formData = new FormData();
      formData.append("file", optimizedBlob, file.name);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          setImage(data.url);
          setFeedback({ type: "success", text: "Portrait uploaded successfully!" });
          return;
        }
      } catch (uploadErr) {
        console.warn("Upload API error, falling back to direct Data URL:", uploadErr);
      }

      // Seamless fallback to high-fidelity data URL if API had an issue
      const directDataUrl = await readFileAsDataUrl(optimizedBlob);
      setImage(directDataUrl);
      setFeedback({ type: "success", text: "Portrait processed and ready!" });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Network error uploading portrait" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Open modal for new member
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName("");
    setTitle("");
    setCredentials("Attorney-at-Law");
    setCourt("Hulftsdorp Superior Courts Complex");
    setImage("/images/branding/cls-crest-gold.png");
    setBio("");
    setEmail("");
    setPhone("");
    setFeedback(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing member
  const handleOpenEdit = (m: CommitteeMember) => {
    setIsEditing(true);
    setCurrentId(m.id);
    setName(m.name);
    setTitle(m.title);
    setCredentials(m.credentials);
    setCourt(m.court);
    setImage(m.image);
    setBio(m.bio);
    setEmail(m.email);
    setPhone(m.phone);
    setFeedback(null);
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title) {
      setFeedback({ type: "error", text: "Officer name and designated title are required." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      if (isEditing && currentId) {
        // Update
        const res = await fetch("/api/committee", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: currentId,
            name,
            title,
            credentials,
            court,
            image,
            bio,
            email,
            phone,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setFeedback({ type: "success", text: "Council member updated successfully!" });
          setIsModalOpen(false);
          loadCommittee();
        } else {
          setFeedback({ type: "error", text: data.error || "Failed to update member" });
        }
      } else {
        // Create
        const res = await fetch("/api/committee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            title,
            credentials,
            court,
            image: image || "/images/branding/cls-crest-gold.png",
            bio,
            email,
            phone,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setFeedback({ type: "success", text: "New Council Officer appointed successfully!" });
          setIsModalOpen(false);
          loadCommittee();
        } else {
          setFeedback({ type: "error", text: data.error || "Failed to add member" });
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save council member" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: number, memberName: string) => {
    if (!confirm(`Are you sure you want to remove "${memberName}" from the Executive Council?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/committee?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete committee member:", err);
    }
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.court.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout activeTab="committee">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 p-6 rounded-lg shadow-sm transition-colors">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#9E7D3B] dark:text-[#C5A059] uppercase tracking-wider mb-1 font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Hulftsdorp Bar Governance Roster</span>
            </div>
            <h1 className="text-2xl font-display uppercase tracking-wide text-stone-900 dark:text-white">
              Executive Committee &amp; Council Editor
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
              Manage the 2026/2027 Executive Officers, Presidents, Secretaries, and Working Committee portfolios. All changes reflect live on the public /team portal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadCommittee}
              className="p-2.5 rounded bg-stone-100 hover:bg-stone-200 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 hover:border-[#9E7D3B] dark:hover:border-[#C5A059] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded bg-[#9E7D3B] hover:bg-[#85682e] dark:bg-[#C5A059] dark:hover:bg-[#d6b168] text-white dark:text-black text-xs font-mono uppercase tracking-widest font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Council Officer</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 p-4 rounded-lg shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by officer name, title, or chambers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 pl-9 pr-4 py-2 rounded text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
            />
          </div>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
            Total Officers: <strong className="text-stone-900 dark:text-white">{members.length}</strong>
          </span>
        </div>

        {/* Officers Grid */}
        {loading ? (
          <div className="py-20 text-center text-stone-500 font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#9E7D3B] dark:text-[#C5A059]" />
            Loading Council Roster...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 rounded-lg p-12 text-center shadow-sm">
            <UserCheck className="w-12 h-12 text-stone-400 dark:text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-display uppercase tracking-wider text-stone-900 dark:text-white">No Officers Found</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              No committee members match your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((officer) => (
              <div
                key={officer.id}
                className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 rounded-lg overflow-hidden flex flex-col group hover:border-[#9E7D3B]/60 dark:hover:border-[#C5A059]/60 transition-all duration-200 shadow-sm"
              >
                {/* Photo Frame */}
                <div className="relative aspect-[4/5] bg-stone-100 dark:bg-black overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={officer.image}
                    alt={officer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/branding/cls-crest-gold.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Title Badge */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-2 py-0.5 bg-[#9E7D3B] dark:bg-[#C5A059] text-white dark:text-black text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm inline-block shadow">
                      {officer.title}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base tracking-wide uppercase text-stone-900 dark:text-white leading-snug">
                      {officer.name}
                    </h3>
                    <p className="text-[10px] font-mono text-[#9E7D3B] dark:text-[#C5A059] mt-0.5 uppercase tracking-wider font-semibold">
                      {officer.credentials}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 font-sans mt-2 line-clamp-2 leading-relaxed">
                      {officer.bio}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-white/5 space-y-1 text-[10px] font-mono text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Scale className="w-3 h-3 text-[#9E7D3B] dark:text-[#C5A059] shrink-0" />
                      <span className="truncate">{officer.court}</span>
                    </div>
                    {officer.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-stone-400 dark:text-stone-500 shrink-0" />
                        <span className="truncate">{officer.email}</span>
                      </div>
                    )}
                    {officer.phone && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3 h-3 text-stone-400 dark:text-stone-500 shrink-0" />
                        <span className="truncate">{officer.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEdit(officer)}
                      className="px-3 py-1.5 rounded bg-stone-100 hover:bg-[#9E7D3B] hover:text-white dark:bg-[#1A1A1A] dark:hover:bg-[#C5A059] dark:hover:text-black text-stone-800 dark:text-stone-200 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition shadow-xs"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit Officer</span>
                    </button>

                    <button
                      onClick={() => handleDelete(officer.id, officer.name)}
                      className="p-1.5 rounded text-stone-400 hover:text-rose-600 dark:text-stone-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Remove from council"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit / Add Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/20 rounded-lg max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl uppercase tracking-wide text-stone-900 dark:text-white">
                    {isEditing ? "Edit Council Officer" : "Add Council Officer"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                    Update executive portfolio, portrait, credentials, and bio.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 text-stone-400 hover:text-stone-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded text-xs font-mono mb-4 flex items-center gap-2 ${
                    feedback.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{feedback.text}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                {/* Photo Dropzone */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 font-medium">
                    Officer Portrait Photo
                  </label>
                  <div className="border border-dashed border-stone-300 dark:border-white/20 rounded p-4 text-center bg-stone-50 dark:bg-[#1A1A1A]/50">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {image ? (
                      <div className="flex items-center gap-4 justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt="Preview"
                          className="w-16 h-20 object-cover rounded border border-stone-300 dark:border-white/20"
                        />
                        <div className="text-left">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-mono text-[#9E7D3B] dark:text-[#C5A059] font-semibold hover:underline block"
                          >
                            Upload Different Portrait
                          </button>
                          <span className="text-[10px] text-stone-500 font-mono">
                            Auto-optimizes for committee card
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-mono text-[#9E7D3B] dark:text-[#C5A059] hover:underline flex items-center justify-center gap-2 mx-auto font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Official Photo</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Or enter image URL path (e.g. /images/team/sandun-nagahawatta.jpg)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="mt-2 w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-1.5 rounded text-xs text-stone-900 dark:text-white font-mono focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Name & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 font-medium">
                      Full Name <span className="text-[#9E7D3B] dark:text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. Sandun Nagahawatta"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-2 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none placeholder-stone-400 dark:placeholder-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 font-medium">
                      Office / Portfolio <span className="text-[#9E7D3B] dark:text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. President, Secretary, Treasurer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-2 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none placeholder-stone-400 dark:placeholder-stone-500"
                    />
                  </div>
                </div>

                {/* Credentials & Court */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 font-medium">
                      Professional Credentials
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Attorney-at-Law, LL.B (Hons)"
                      value={credentials}
                      onChange={(e) => setCredentials(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-2 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none placeholder-stone-400 dark:placeholder-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 font-medium">
                      Chambers / Bench Enclave
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Supreme Court Bar & Hulftsdorp"
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-2 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none placeholder-stone-400 dark:placeholder-stone-500"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 font-medium">
                      Official Society Email
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. president@colombolawsociety.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-2 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none placeholder-stone-400 dark:placeholder-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 font-medium">
                      Direct Chamber Phone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +94 77 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-2 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none font-mono placeholder-stone-400 dark:placeholder-stone-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 font-medium">
                    Biographical &amp; Executive Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief career highlights, committee mandate, or bar achievements..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-2 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none placeholder-stone-400 dark:placeholder-stone-500"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-stone-200 dark:border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-white/20 text-xs font-mono uppercase text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 rounded transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !name || !title}
                    className="px-5 py-2 bg-[#9E7D3B] hover:bg-[#85682e] dark:bg-[#C5A059] dark:hover:bg-[#d6b168] disabled:opacity-50 text-white dark:text-black text-xs font-mono uppercase font-bold rounded flex items-center gap-2 shadow-sm transition"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isEditing ? "Save Changes" : "Appoint Officer"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
