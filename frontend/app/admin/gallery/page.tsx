"use client";

import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { GalleryImage, initialGalleryImages, CLSEvent } from "@/lib/mockData";
import { compressImageFile, readFileAsDataUrl } from "@/lib/image-upload";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Eye,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Camera,
  X,
  ExternalLink,
  RefreshCw,
  Tag
} from "lucide-react";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [events, setEvents] = useState<CLSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Upload Modal / Form State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("National Conference");
  const [customCategory, setCustomCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  );
  const [venue, setVenue] = useState("Superior Courts Complex, Hulftsdorp");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [photographer, setPhotographer] = useState("CLS Secretariat Media Desk");
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Inspection modal
  const [inspectImage, setInspectImage] = useState<GalleryImage | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch gallery & events
  const loadData = async () => {
    setLoading(true);
    try {
      // Load gallery
      const gRes = await fetch("/api/gallery");
      if (gRes.ok) {
        const gData = await gRes.json();
        if (gData.success && gData.data) {
          setImages(gData.data);
        }
      }

      // Load events for dropdown binding
      const eRes = await fetch("/api/events");
      if (eRes.ok) {
        const eData = await eRes.json();
        if (eData.success && eData.data) {
          setEvents(eData.data);
        }
      }
    } catch (err) {
      console.error("Error loading gallery data:", err);
      // Fallback
      setImages(initialGalleryImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle direct file upload via /api/upload with client optimization and zero-failure fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
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
          setImageUrl(data.url);
          setFeedback({ type: "success", text: "Photo uploaded to server successfully!" });
          return;
        }
      } catch (uploadErr) {
        console.warn("Upload API error, falling back to direct Data URL:", uploadErr);
      }

      // Seamless fallback to high-fidelity data URL if API had an issue
      const directDataUrl = await readFileAsDataUrl(optimizedBlob);
      setImageUrl(directDataUrl);
      setFeedback({ type: "success", text: "Photo processed and ready!" });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Network error uploading file" });
    } finally {
      setUploadingFile(false);
    }
  };

  // Submit new photo to gallery API
  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      setFeedback({ type: "error", text: "Please enter a title and upload or provide an image URL." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      title,
      category: category === "Other" ? customCategory : category,
      imageUrl,
      thumbnailUrl: imageUrl,
      date,
      venue,
      description,
      featured,
      photographer,
      eventId: selectedEventId ? parseInt(selectedEventId, 10) : undefined,
    };

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", text: "Event photograph published to public showcase!" });
        // Reset form
        setTitle("");
        setImageUrl("");
        setDescription("");
        setFeatured(false);
        setIsUploadOpen(false);
        loadData();
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to add image" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to submit image" });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, featured: !img.featured } : img))
        );
      }
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  };

  // Delete Image
  const handleDeleteImage = async (id: number, imgTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${imgTitle}" from the public showcase?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  // Categories for filter
  const categories = [
    "All",
    "National Conference",
    "Annual Law Dinner",
    "CLE Masterclass",
    "Ceremonial Sittings",
  ];

  const filteredImages = images.filter((img) => {
    const matchesCategory =
      selectedCategory === "All" || img.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.description ? img.description.toLowerCase().includes(searchQuery.toLowerCase()) : false);
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout activeTab="gallery">
      <div className="space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 p-6 rounded-lg shadow-sm transition-colors">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#9E7D3B] dark:text-[#C5A059] uppercase tracking-wider mb-1 font-semibold">
              <Camera className="w-3.5 h-3.5" />
              <span>Event Photo Archive &bull; Hulftsdorp</span>
            </div>
            <h1 className="text-2xl font-display uppercase tracking-wide text-stone-900 dark:text-white">
              Event Image Showcase Manager
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
              Upload, catalog, and curate high-resolution photographs from CLS symposiums, law dinners, and judicial ceremonials for public display on the official showcase portal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded bg-stone-100 hover:bg-stone-200 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 hover:border-[#9E7D3B] dark:hover:border-[#C5A059] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition"
              title="Refresh Showcase"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href="/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded bg-stone-100 hover:bg-stone-200 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 hover:border-stone-400 dark:hover:border-white/30 text-stone-800 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5 font-medium"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => {
                setIsUploadOpen(true);
                setFeedback(null);
              }}
              className="px-5 py-2.5 rounded bg-[#9E7D3B] hover:bg-[#85682e] dark:bg-[#C5A059] dark:hover:bg-[#d6b168] text-white dark:text-black text-xs font-mono uppercase tracking-widest font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Photo</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 p-4 rounded-lg shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Total Showcase Photos
            </span>
            <span className="text-2xl font-display text-stone-900 dark:text-white mt-1 block">
              {images.length}
            </span>
            <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
              In Hulftsdorp digital archive
            </span>
          </div>

          <div className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 p-4 rounded-lg shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9E7D3B] dark:text-[#C5A059] block font-semibold">
              Featured Highlights
            </span>
            <span className="text-2xl font-display text-[#9E7D3B] dark:text-amber-400 mt-1 block flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#9E7D3B] dark:text-[#C5A059]" />
              {images.filter((i) => i.featured).length}
            </span>
            <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
              Pinned on homepage &amp; gallery hero
            </span>
          </div>

          <div className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 p-4 rounded-lg shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Calendar Events Linked
            </span>
            <span className="text-2xl font-display text-stone-900 dark:text-white mt-1 block">
              {images.filter((i) => i.eventId).length}
            </span>
            <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
              Connected to scheduler roster
            </span>
          </div>

          <div className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 p-4 rounded-lg shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Archive Domains
            </span>
            <span className="text-2xl font-display text-stone-900 dark:text-white mt-1 block">
              {new Set(images.map((i) => i.category)).size || 4}
            </span>
            <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
              Active society categories
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 p-4 rounded-lg shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by photo title, venue, or caption..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 pl-9 pr-4 py-2 rounded text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#9E7D3B] dark:bg-[#C5A059] text-white dark:text-black font-bold shadow-sm"
                    : "bg-stone-100 hover:bg-stone-200 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="py-20 text-center text-stone-500 font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#9E7D3B] dark:text-[#C5A059]" />
            Loading Hulftsdorp Event Showcase...
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 rounded-lg p-12 text-center shadow-sm">
            <ImageIcon className="w-12 h-12 text-stone-400 dark:text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-display uppercase tracking-wider text-stone-900 dark:text-white">No Photographs Found</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              There are no event photos matching your search query or selected category filter.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-4 px-4 py-2 bg-[#9E7D3B] dark:bg-[#C5A059] text-white dark:text-black text-xs font-mono uppercase font-bold rounded shadow-sm"
            >
              Upload First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/10 rounded-lg overflow-hidden flex flex-col group hover:border-[#9E7D3B]/50 dark:hover:border-[#C5A059]/50 transition-all duration-200 shadow-sm"
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] bg-stone-100 dark:bg-black overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/branding/cls-crest-gold.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-[9px] font-mono tracking-wider uppercase text-[#C5A059] border border-[#C5A059]/40 rounded-sm">
                      {image.category}
                    </span>
                  </div>

                  {/* Featured Toggle Button on Card */}
                  <button
                    onClick={() => handleToggleFeatured(image.id)}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition ${
                      image.featured
                        ? "bg-amber-400 text-black shadow-md"
                        : "bg-black/60 text-stone-400 hover:text-white hover:bg-black/90"
                    }`}
                    title={image.featured ? "Featured (Click to unfeature)" : "Not featured (Click to feature)"}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  {/* Linked Event Pill */}
                  {image.eventId && (
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 bg-blue-950/80 backdrop-blur-sm text-[9px] font-mono tracking-wider text-blue-300 border border-blue-500/30 rounded-sm">
                        Event #{image.eventId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-sm tracking-wide uppercase text-stone-900 dark:text-white line-clamp-1 leading-snug">
                      {image.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed font-sans">
                      {image.description || "Archived legal assembly photograph."}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-200 dark:border-white/5 space-y-1 text-[10px] font-mono text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3 h-3 text-[#9E7D3B] dark:text-[#C5A059] shrink-0" />
                      <span className="truncate">{image.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-[#9E7D3B] dark:text-[#C5A059] shrink-0" />
                      <span className="truncate">{image.venue}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInspectImage(image)}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 dark:bg-[#1A1A1A] dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(image.id)}
                      className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition ${
                        image.featured
                          ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                          : "bg-stone-100 hover:bg-stone-200 dark:bg-[#1A1A1A] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                      }`}
                    >
                      {image.featured ? "★ Featured" : "☆ Feature"}
                    </button>

                    <button
                      onClick={() => handleDeleteImage(image.id, image.title)}
                      className="p-1 rounded text-stone-400 hover:text-rose-600 dark:text-stone-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Delete from showcase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/20 rounded-lg max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded bg-[#9E7D3B]/10 dark:bg-[#C5A059]/10 text-[#9E7D3B] dark:text-[#C5A059] border border-[#9E7D3B]/30 dark:border-[#C5A059]/30">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl uppercase tracking-wide text-stone-900 dark:text-white">
                      Upload to Event Showcase
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                      Add a new photograph with metadata to the public Hulftsdorp gallery.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 text-stone-400 hover:text-stone-900 dark:hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`p-3.5 rounded text-xs font-mono mb-6 flex items-center gap-2 ${
                    feedback.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveImage} className="space-y-5">
                {/* File Dropzone & Direct Upload */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 font-medium">
                    Event Photograph File <span className="text-[#9E7D3B] dark:text-[#C5A059]">*</span>
                  </label>

                  <div className="border-2 border-dashed border-stone-300 dark:border-white/20 hover:border-[#9E7D3B]/60 dark:hover:border-[#C5A059]/60 rounded-lg p-5 text-center transition bg-stone-50 dark:bg-[#1A1A1A]/50">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {imageUrl ? (
                      <div className="space-y-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt="Upload preview"
                          className="max-h-48 mx-auto rounded border border-stone-300 dark:border-white/20 object-contain bg-black"
                        />
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-mono text-[#9E7D3B] dark:text-[#C5A059] font-semibold hover:underline"
                          >
                            Replace Image
                          </button>
                          <span className="text-stone-300 dark:text-white/20">|</span>
                          <button
                            type="button"
                            onClick={() => setImageUrl("")}
                            className="text-xs font-mono text-rose-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer py-4 flex flex-col items-center justify-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#141414] border border-stone-300 dark:border-white/10 flex items-center justify-center text-[#9E7D3B] dark:text-[#C5A059] mb-3">
                          {uploadingFile ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                        </div>
                        <span className="text-xs font-mono font-semibold text-stone-900 dark:text-white block">
                          {uploadingFile ? "Uploading to Server..." : "Click to select or drag photo here"}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono mt-1 block">
                          JPEG, PNG, WEBP up to 10MB (Saves directly to public/uploads)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Manual URL fallback */}
                  <div className="mt-2.5">
                    <input
                      type="text"
                      placeholder="Or enter existing image path (e.g., /images/sri-lanka/hero-old-parliament.jpg)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-1.5 rounded text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 font-mono focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 font-medium">
                    Photograph Title / Caption <span className="text-[#9E7D3B] dark:text-[#C5A059]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50th Golden Jubilee Law Conference Plenary Session"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3.5 py-2.5 rounded text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Category & Associated Calendar Event */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 font-medium">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3.5 py-2.5 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="National Conference">National Conference</option>
                      <option value="Annual Law Dinner">Annual Law Dinner</option>
                      <option value="CLE Masterclass">CLE Masterclass</option>
                      <option value="Ceremonial Sittings">Ceremonial Sittings</option>
                      <option value="Executive Council">Executive Council</option>
                      <option value="Bar Welfare">Bar Welfare</option>
                      <option value="Other">Other (Custom Category)</option>
                    </select>

                    {category === "Other" && (
                      <input
                        type="text"
                        placeholder="Enter custom category name..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="mt-2 w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3 py-1.5 rounded text-xs text-stone-900 dark:text-white"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 font-medium">
                      Link with Scheduled Event
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3.5 py-2.5 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="">None (Independent Showcase Image)</option>
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          #{ev.id} - {ev.title} ({ev.startDateTime ? ev.startDateTime.slice(0, 10) : "Event"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Venue */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 font-medium">
                      Date Captured
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15 Oct, 2026"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3.5 py-2.5 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 font-medium">
                      Venue / Chamber Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Superior Courts Complex, Hulftsdorp"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3.5 py-2.5 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Photographer Attribution */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 font-medium">
                    Photographer / Media Attribution
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CLS Secretariat Media Desk / Hulftsdorp Press"
                    value={photographer}
                    onChange={(e) => setPhotographer(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3.5 py-2.5 rounded text-xs text-stone-900 dark:text-white focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 font-medium">
                    Description &amp; Historical Context
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about the session, key dignitaries, speeches, or resolution passed..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/10 px-3.5 py-2.5 rounded text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:border-[#9E7D3B] dark:focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-[#1A1A1A] rounded border border-stone-200 dark:border-white/10">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#9E7D3B] dark:accent-[#C5A059] rounded"
                  />
                  <label htmlFor="featuredToggle" className="text-xs text-stone-900 dark:text-white font-mono cursor-pointer">
                    <span className="font-bold text-[#9E7D3B] dark:text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#9E7D3B] dark:text-[#C5A059]" />
                      Feature in Public Showcase Highlights
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                      Featured images will be prioritized at the top of the public gallery and shown on key portals.
                    </span>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-stone-200 dark:border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="px-5 py-2.5 rounded bg-stone-100 hover:bg-stone-200 dark:bg-transparent border border-stone-300 dark:border-white/20 text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !imageUrl || !title}
                    className="px-6 py-2.5 rounded bg-[#9E7D3B] hover:bg-[#85682e] dark:bg-[#C5A059] dark:hover:bg-[#d6b168] disabled:opacity-50 text-white dark:text-black text-xs font-mono uppercase tracking-widest font-bold transition flex items-center gap-2 shadow-md shadow-[#9E7D3B]/20 dark:shadow-none"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Publish to Showcase</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Inspect Modal */}
        {inspectImage && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-white/20 rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row">
              {/* Image Preview */}
              <div className="md:w-1/2 bg-stone-100 dark:bg-black flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={inspectImage.imageUrl}
                  alt={inspectImage.title}
                  className="max-h-96 w-auto max-w-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#9E7D3B]/10 dark:bg-[#C5A059]/20 text-[#9E7D3B] dark:text-[#C5A059] text-[9px] font-mono uppercase tracking-wider rounded font-medium">
                      {inspectImage.category}
                    </span>
                    <button
                      onClick={() => setInspectImage(null)}
                      className="text-stone-400 hover:text-stone-900 dark:hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-display text-lg uppercase tracking-wide text-stone-900 dark:text-white mt-3 leading-snug">
                    {inspectImage.title}
                  </h3>

                  <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                    {inspectImage.description}
                  </p>

                  <div className="mt-4 space-y-2 text-[11px] font-mono text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-white/10 pt-4">
                    <div>
                      <span className="text-stone-400 dark:text-stone-500 uppercase block text-[9px]">Date</span>
                      <span className="text-stone-900 dark:text-white font-medium">{inspectImage.date}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 dark:text-stone-500 uppercase block text-[9px]">Venue</span>
                      <span className="text-stone-900 dark:text-white font-medium">{inspectImage.venue}</span>
                    </div>
                    {inspectImage.photographer && (
                      <div>
                        <span className="text-stone-400 dark:text-stone-500 uppercase block text-[9px]">Attribution</span>
                        <span className="text-stone-900 dark:text-white font-medium">{inspectImage.photographer}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 dark:border-white/10 flex items-center justify-between">
                  <a
                    href={inspectImage.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#9E7D3B] dark:text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Full High-Res</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      handleToggleFeatured(inspectImage.id);
                      setInspectImage({ ...inspectImage, featured: !inspectImage.featured });
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider font-semibold ${
                      inspectImage.featured
                        ? "bg-[#9E7D3B] dark:bg-amber-400 text-white dark:text-black"
                        : "bg-stone-100 hover:bg-stone-200 dark:bg-[#1A1A1A] border border-stone-300 dark:border-white/20 text-stone-800 dark:text-white"
                    }`}
                  >
                    {inspectImage.featured ? "★ Featured" : "☆ Mark Featured"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
