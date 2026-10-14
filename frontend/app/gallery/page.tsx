"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GalleryImage, initialGalleryImages } from "@/lib/mockData";
import {
  Camera,
  Calendar,
  MapPin,
  Search,
  Filter,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Award,
  ArrowRight,
  Share2,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(initialGalleryImages);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Fetch live photos from backend API
  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.length > 0) {
            setImages(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load gallery images from API:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const categories = [
    "All",
    "National Conference",
    "Annual Law Dinner",
    "CLE Masterclass",
    "Ceremonial Sittings"
  ];

  const filteredImages = images.filter((img) => {
    const matchesCategory =
      selectedCategory === "All" ||
      img.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesFeatured = !featuredOnly || img.featured;
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.description ? img.description.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (img.photographer ? img.photographer.toLowerCase().includes(searchQuery.toLowerCase()) : false);

    return matchesCategory && matchesFeatured && matchesSearch;
  });

  const activeImage = activeImageIndex !== null ? filteredImages[activeImageIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null && activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    } else {
      setActiveImageIndex(filteredImages.length - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null && activeImageIndex < filteredImages.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    } else {
      setActiveImageIndex(0);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") setActiveImageIndex(null);
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, filteredImages.length]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E7E0D3] selection:bg-[#C5A059] selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 border-b border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#C5A059]/30 rounded-full text-[10px] tracking-widest uppercase text-[#C5A059] mb-4 font-mono">
            <Camera className="w-3 h-3" />
            Hulftsdorp Judicial Archives &bull; Historical &amp; Event Showcase
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white leading-none">
            COLOMBO LAW SOCIETY <br />
            <span className="font-serif italic font-normal text-[#C5A059] lowercase text-5xl sm:text-7xl md:text-8xl">
              event showcase &amp; gallery
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-stone-400 max-w-2xl leading-relaxed font-sans">
            A visual retrospective of the Colombo Law Society. From landmark Golden Jubilee convocations and ceremonial court welcomes to continuing legal education masterclasses and the annual Hulftsdorp Bar dinners.
          </p>

          {/* Quick Stats Banner */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-mono text-stone-400 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white font-semibold">{images.length}</span> Total Archived Photos
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-white font-semibold">{images.filter(i => i.featured).length}</span> Curated Highlights
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>BASL Hulftsdorp Bar Historical Records</span>
            </div>
            <Link
              href="/admin/gallery"
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-[#C5A059] hover:underline font-mono"
            >
              <span>Secretariat Media Desk Upload</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Search & Filter Controls */}
          <div className="mt-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by event title, hall, or photographer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-white/20 pl-10 pr-4 py-2.5 rounded text-xs text-white placeholder-stone-500 focus:border-[#C5A059] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills & Featured Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition font-mono ${
                    selectedCategory === cat
                      ? "bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/20"
                      : "bg-[#141414] border border-white/10 text-stone-400 hover:text-white hover:border-white/30"
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition font-mono flex items-center gap-1.5 ${
                  featuredOnly
                    ? "bg-amber-400 text-black shadow-md"
                    : "bg-[#141414] border border-white/10 text-stone-400 hover:text-white hover:border-white/30"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Featured
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {filteredImages.length === 0 ? (
          <div className="text-center py-24 bg-[#141414] rounded-lg border border-white/10">
            <Camera className="w-12 h-12 text-stone-500 mx-auto mb-4" />
            <h3 className="text-lg font-display uppercase tracking-wider text-white">No Event Photographs Found</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              No images match your current search &apos;{searchQuery}&apos; or filter category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setFeaturedOnly(false);
              }}
              className="mt-6 px-4 py-2 bg-[#C5A059] text-black text-xs font-mono uppercase tracking-widest font-bold rounded hover:bg-[#d6b168]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, idx) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                onClick={() => setActiveImageIndex(idx)}
                className="group relative bg-[#141414] border border-white/10 rounded overflow-hidden cursor-pointer hover:border-[#C5A059]/60 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl"
              >
                {/* Image Container with 16:10 Aspect */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/branding/cls-crest-gold.png";
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase text-[#C5A059] border border-[#C5A059]/40 rounded-sm">
                      {image.category}
                    </span>
                  </div>

                  {/* Featured Star */}
                  {image.featured && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-0.5 bg-[#C5A059] text-black text-[9px] font-mono font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Hover Inspect Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-[#C5A059] flex items-center justify-center text-[#C5A059] transform scale-75 group-hover:scale-100 transition-transform">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg tracking-wide uppercase text-white group-hover:text-[#C5A059] transition-colors leading-snug">
                      {image.title}
                    </h3>
                    <p className="mt-2 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {image.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1.5 text-[11px] font-mono text-stone-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-stone-300">
                        <Calendar className="w-3 h-3 text-[#C5A059]" />
                        {image.date}
                      </span>
                      {image.photographer && (
                        <span className="text-[10px] text-stone-500 uppercase">
                          {image.photographer}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-400 truncate">
                      <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
                      <span className="truncate">{image.venue}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 bg-[#141414] py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A059] block mb-2">
            Hulftsdorp Bar Archives &bull; Historical Record Division
          </span>
          <h2 className="font-display text-3xl sm:text-4xl uppercase text-white tracking-tight">
            Have Photographs of CLS Convocations or Court Ceremonials?
          </h2>
          <p className="mt-3 text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            The Bar Secretariat welcomes high-resolution submissions from Senior Advocates, Junior Bar members, and court correspondents to preserve our collective legal heritage.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admin/gallery"
              className="px-6 py-3 bg-[#C5A059] text-black text-xs font-mono uppercase tracking-widest font-bold hover:bg-[#d4b065] transition shadow-lg rounded"
            >
              Upload to Showcase →
            </Link>
            <Link
              href="/events"
              className="px-6 py-3 border border-white/20 text-white hover:border-[#C5A059] text-xs font-mono uppercase tracking-widest transition rounded"
            >
              View Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-black text-white transition-colors hidden sm:flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-black text-white transition-colors hidden sm:flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-[#141414] border border-white/20 rounded-lg overflow-hidden flex flex-col lg:flex-row shadow-2xl"
            >
              {/* Large Image Frame */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-[500px] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/branding/cls-crest-gold.png";
                  }}
                />
              </div>

              {/* Sidebar Details */}
              <div className="w-full lg:w-96 p-6 sm:p-8 flex flex-col justify-between bg-[#141414] border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto max-h-[40vh] lg:max-h-[75vh]">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-mono uppercase tracking-widest rounded-sm">
                      {activeImage.category}
                    </span>
                    {activeImage.featured && (
                      <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-2xl uppercase tracking-wide text-white leading-tight">
                    {activeImage.title}
                  </h2>

                  <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                    {activeImage.description}
                  </p>

                  <div className="mt-6 space-y-3 pt-6 border-t border-white/10 text-xs font-mono text-stone-300">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase">Date of Event</span>
                        <span>{activeImage.date}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase">Venue &amp; Location</span>
                        <span>{activeImage.venue}</span>
                      </div>
                    </div>

                    {activeImage.photographer && (
                      <div className="flex items-start gap-2.5">
                        <Camera className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase">Photographer / Media</span>
                          <span>{activeImage.photographer}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <a
                    href={activeImage.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C5A059] hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Original
                  </a>
                  <span className="text-[10px] font-mono text-stone-500">
                    {activeImageIndex !== null ? activeImageIndex + 1 : 1} of {filteredImages.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
