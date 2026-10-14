"use client";

import { useState, useEffect, useMemo } from "react";
import AdminLayout from "@/components/AdminLayout";
import { CLSEvent } from "@/lib/mockData";
import {
  Calendar as CalendarIcon,
  PlusCircle,
  MapPin,
  Clock,
  Trash2,
  Edit3,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  Video,
  Users,
  DollarSign,
  Tag,
  Eye,
  Filter,
  Grid,
  List,
  Sparkles,
} from "lucide-react";

export default function AdminEventsCalendarPage() {
  const [events, setEvents] = useState<CLSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calendar View Mode: Month | Week | Agenda
  const [viewMode, setViewMode] = useState<"month" | "week" | "agenda">("month");

  // Current calendar reference date (defaulting to November 2026 to match conference season)
  const [currentDate, setCurrentDate] = useState(new Date("2026-11-01T00:00:00"));

  // Category Filter
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState<CLSEvent | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Continuing Legal Education");
  const [venue, setVenue] = useState("Main Auditorium, Superior Courts Complex");
  const [location, setLocation] = useState("Hulftsdorp, Colombo 12");
  const [startDateTime, setStartDateTime] = useState("2026-11-20T09:00");
  const [endDateTime, setEndDateTime] = useState("2026-11-20T17:00");
  const [price, setPrice] = useState("2500");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("/images/events/cls-actual-event.jpg");
  const [speakersInput, setSpeakersInput] = useState("Hon. Chief Justice of Sri Lanka, Senior Counsel");
  const [isMeeting, setIsMeeting] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [color, setColor] = useState("#C5A059");
  const [status, setStatus] = useState<CLSEvent["status"]>("Upcoming");
  const [uploading, setUploading] = useState(false);

  // Fetch events from backend API on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const json = await res.json();
      if (json.success && json.data) {
        setEvents(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
      showToast("Error loading events from database.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Preset Colombo Venue List
  const venuePresets = [
    "Main Auditorium, Superior Courts Complex, Hulftsdorp",
    "Law Society Auditorium, Hulftsdorp Street, Colombo 12",
    "Chambers Boardroom, Superior Courts Complex",
    "BMICH Committee Lounge, Bauddhaloka Mw, Colombo 07",
    "The Grand Ballroom, Galle Face Hotel, Colombo",
    "Colombo International Financial Centre Auditorium, Port City",
  ];

  // Preset Colors for Event Types
  const colorPresets = [
    { label: "CLS Gold", hex: "#C5A059" },
    { label: "Emerald (Meeting)", hex: "#10B981" },
    { label: "Amber (CLE)", hex: "#F59E0B" },
    { label: "Indigo (Supreme Court)", hex: "#6366F1" },
    { label: "Rose (Dinner & Gala)", hex: "#F43F5E" },
    { label: "Sky (Public Law)", hex: "#0EA5E9" },
  ];

  // Photo Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setPosterUrl(data.url);
        showToast("Photo uploaded successfully!");
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Open Create Modal (optionally for a specific date)
  const openCreateModal = (defaultDateStr?: string) => {
    setEditingEventId(null);
    setTitle("");
    setCategory("Continuing Legal Education");
    setVenue("Main Auditorium, Superior Courts Complex");
    setLocation("Hulftsdorp, Colombo 12");
    if (defaultDateStr) {
      setStartDateTime(`${defaultDateStr}T09:00`);
      setEndDateTime(`${defaultDateStr}T17:00`);
    } else {
      setStartDateTime("2026-11-20T09:00");
      setEndDateTime("2026-11-20T17:00");
    }
    setPrice("2500");
    setDescription("");
    setPosterUrl("/images/events/cls-actual-event.jpg");
    setSpeakersInput("");
    setIsMeeting(false);
    setMeetingLink("");
    setColor("#C5A059");
    setStatus("Upcoming");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (evt: CLSEvent) => {
    setEditingEventId(evt.id);
    setTitle(evt.title);
    setCategory(evt.category);
    setVenue(evt.venue);
    setLocation(evt.location || "Hulftsdorp, Colombo 12");
    setStartDateTime(evt.startDateTime.slice(0, 16));
    setEndDateTime(evt.endDateTime ? evt.endDateTime.slice(0, 16) : evt.startDateTime.slice(0, 16));
    setPrice(evt.price.toString());
    setDescription(evt.description);
    setPosterUrl(evt.posterUrl);
    setSpeakersInput(evt.speakers ? evt.speakers.join(", ") : "");
    setIsMeeting(Boolean(evt.isMeeting));
    setMeetingLink(evt.meetingLink || "");
    setColor(evt.color || "#C5A059");
    setStatus(evt.status);
    setSelectedEventDetails(null);
    setIsModalOpen(true);
  };

  // Save Event (Create or Update via Backend API)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDateTime) {
      alert("Please provide an event title and start date/time.");
      return;
    }

    const payload = {
      title,
      category,
      venue,
      location,
      startDateTime,
      endDateTime: endDateTime || startDateTime,
      price: parseFloat(price) || 0,
      description,
      posterUrl,
      speakers: speakersInput ? speakersInput.split(",").map((s) => s.trim()).filter(Boolean) : [],
      isMeeting,
      meetingLink,
      color,
      status,
    };

    try {
      if (editingEventId) {
        // PUT update
        const res = await fetch(`/api/events/${editingEventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setEvents((prev) => prev.map((item) => (item.id === editingEventId ? json.data : item)));
          showToast(`Event "${title}" updated successfully.`);
        }
      } else {
        // POST create
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setEvents((prev) => [json.data, ...prev]);
          showToast(`Event "${title}" scheduled on the calendar!`);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save event to database.");
    }
  };

  // Delete Event via Backend API
  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to remove this event from the calendar?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        setSelectedEventDetails(null);
        showToast("Event removed from registry.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete event.");
    }
  };

  // Month Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    if (selectedCategory === "All") return events;
    return events.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [events, selectedCategory]);

  // Calendar Math for Month View
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: Array<{
      dayNum: number;
      dateStr: string;
      isCurrentMonth: boolean;
      events: CLSEvent[];
    }> = [];

    // Preceding month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, day);
      const dateStr = prevDate.toISOString().slice(0, 10);
      days.push({
        dayNum: day,
        dateStr,
        isCurrentMonth: false,
        events: filteredEvents.filter((e) => e.startDateTime.startsWith(dateStr)),
      });
    }

    // Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const d = new Date(year, month, day);
      // Format as YYYY-MM-DD local
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateStr = `${year}-${mStr}-${dStr}`;

      days.push({
        dayNum: day,
        dateStr,
        isCurrentMonth: true,
        events: filteredEvents.filter((e) => e.startDateTime.startsWith(dateStr)),
      });
    }

    // Remaining trailing days to complete full grid (multiple of 7)
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(year, month + 1, day);
      const dateStr = nextDate.toISOString().slice(0, 10);
      days.push({
        dayNum: day,
        dateStr,
        isCurrentMonth: false,
        events: filteredEvents.filter((e) => e.startDateTime.startsWith(dateStr)),
      });
    }

    return days;
  }, [currentDate, filteredEvents]);

  const monthYearLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }).toUpperCase();

  const weekDayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#C5A059] text-black px-6 py-3 border border-black font-mono text-xs uppercase tracking-widest font-bold shadow-2xl flex items-center space-x-2 rounded-sm animate-bounce">
            <CheckCircle className="w-4 h-4 text-black" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header & Console Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
              [ CONTINUING LEGAL EDUCATION & COUNCIL SCHEDULING ]
            </span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white">
              EVENT &amp; MEETING CALENDAR
            </h1>
            <p className="text-xs text-stone-400 font-sans mt-1">
              Google Calendar-style scheduler for Supreme Court Bar symposiums, executive council meetings, and CLE masterclasses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="bg-[#141414] border border-white/10 p-1 rounded-sm flex items-center text-xs font-mono uppercase">
              <button
                onClick={() => setViewMode("month")}
                className={`px-3 py-1.5 rounded-sm transition ${
                  viewMode === "month"
                    ? "bg-[#C5A059] text-black font-bold"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setViewMode("agenda")}
                className={`px-3 py-1.5 rounded-sm transition ${
                  viewMode === "agenda"
                    ? "bg-[#C5A059] text-black font-bold"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Schedule List
              </button>
            </div>

            <button
              onClick={() => openCreateModal()}
              className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-mono text-xs uppercase tracking-widest font-bold transition rounded-sm flex items-center space-x-2 shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule Event / Meeting</span>
            </button>
          </div>
        </div>

        {/* Calendar Controls & Navigation Bar */}
        <div className="bg-[#141414] border border-white/10 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Month / Period Navigation */}
          <div className="flex items-center space-x-3">
            <h2 className="font-display text-2xl tracking-wider text-white min-w-[200px]">
              {monthYearLabel}
            </h2>
            <div className="flex items-center space-x-1">
              <button
                onClick={prevMonth}
                title="Previous Month"
                className="p-2 bg-black border border-white/10 hover:border-[#C5A059] text-stone-300 hover:text-white rounded-sm transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 bg-black border border-white/10 hover:border-[#C5A059] text-xs font-mono uppercase text-stone-300 hover:text-white rounded-sm transition"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                title="Next Month"
                className="p-2 bg-black border border-white/10 hover:border-[#C5A059] text-stone-300 hover:text-white rounded-sm transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {["All", "Annual Symposium", "Continuing Legal Education", "Council Meeting", "Social & Law Dinner"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-sm border uppercase text-[10px] tracking-wider transition ${
                    selectedCategory === cat
                      ? "bg-white text-black border-white font-bold"
                      : "bg-black/60 text-stone-400 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {cat === "Continuing Legal Education" ? "CLE" : cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CALENDAR VIEW: MONTH GRID                                                */}
        {/* ========================================================================= */}
        {viewMode === "month" && (
          <div className="bg-[#141414] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
            {/* Weekday Header Row */}
            <div className="grid grid-cols-7 border-b border-white/10 bg-black/60 text-center text-xs font-mono tracking-widest text-[#C5A059] py-3">
              {weekDayNames.map((d) => (
                <div key={d} className="font-bold">
                  {d}
                </div>
              ))}
            </div>

            {/* 7-column Calendar Days Grid */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-white/10">
              {calendarGrid.map((dayObj, index) => {
                const isToday =
                  new Date().toISOString().slice(0, 10) === dayObj.dateStr;

                return (
                  <div
                    key={index}
                    onClick={() => openCreateModal(dayObj.dateStr)}
                    className={`min-h-[120px] sm:min-h-[140px] p-2 flex flex-col justify-between transition-colors cursor-pointer group relative ${
                      dayObj.isCurrentMonth
                        ? "bg-[#141414] hover:bg-[#1C1C1C]"
                        : "bg-black/40 text-stone-600 hover:bg-black/60"
                    } ${isToday ? "ring-1 ring-[#C5A059] ring-inset" : ""}`}
                  >
                    {/* Top Row: Day Number + Add Pill */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-mono font-bold ${
                          isToday
                            ? "w-6 h-6 rounded-full bg-[#C5A059] text-black flex items-center justify-center font-bold"
                            : dayObj.isCurrentMonth
                            ? "text-stone-300"
                            : "text-stone-600"
                        }`}
                      >
                        {dayObj.dayNum}
                      </span>

                      <span className="opacity-0 group-hover:opacity-100 text-[9px] font-mono text-[#C5A059] transition uppercase">
                        + Add
                      </span>
                    </div>

                    {/* Events list inside this day */}
                    <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-thin">
                      {dayObj.events.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventDetails(evt);
                          }}
                          style={{
                            borderLeftColor: evt.color || "#C5A059",
                          }}
                          className="px-2 py-1 bg-black/80 hover:bg-stone-900 border border-white/10 border-l-4 rounded-sm text-[10px] font-mono text-stone-200 transition-all flex items-center justify-between group/evt truncate shadow"
                          title={`${evt.title} (${evt.venue})`}
                        >
                          <div className="truncate flex-1">
                            <span className="font-bold text-[#C5A059] mr-1">
                              {evt.startDateTime.slice(11, 16)}
                            </span>
                            <span className="truncate">{evt.title}</span>
                          </div>

                          {evt.isMeeting && (
                            <Video className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* AGENDA / SCHEDULE LIST VIEW                                               */}
        {/* ========================================================================= */}
        {viewMode === "agenda" && (
          <div className="bg-[#141414] border border-white/10 rounded-sm divide-y divide-white/10 shadow-xl">
            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center text-stone-500 font-mono text-sm">
                No events scheduled for the selected criteria.
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-6 hover:bg-[#1A1A1A] transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex items-start space-x-4">
                    {/* Event Poster Thumbnail */}
                    <div className="w-20 h-20 rounded-sm bg-black border border-white/10 overflow-hidden shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={evt.posterUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          style={{ backgroundColor: evt.color || "#C5A059" }}
                          className="text-[9px] font-mono uppercase font-bold text-black px-2 py-0.5 rounded-xs"
                        >
                          {evt.category}
                        </span>
                        {evt.isMeeting && (
                          <span className="bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono uppercase px-2 py-0.5 rounded-xs flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Virtual Meeting
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-400 uppercase">
                          Status: {evt.status}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl uppercase tracking-wide text-white">
                        {evt.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-400 pt-1">
                        <span className="flex items-center space-x-1 text-[#C5A059]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {new Date(evt.startDateTime).toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            &bull; {evt.startDateTime.slice(11, 16)} - {evt.endDateTime.slice(11, 16)}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-500" />
                          <span>{evt.venue}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-emerald-400">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{evt.price > 0 ? `LKR ${evt.price.toLocaleString()}` : "Complimentary"}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => setSelectedEventDetails(evt)}
                      className="px-3 py-1.5 bg-black border border-white/20 hover:border-white text-xs font-mono uppercase text-white rounded-sm flex items-center space-x-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => openEditModal(evt)}
                      className="px-3 py-1.5 bg-black border border-white/20 hover:border-[#C5A059] text-xs font-mono uppercase text-[#C5A059] rounded-sm flex items-center space-x-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-2 text-stone-500 hover:text-red-400 transition"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* EVENT DETAIL POPOVER MODAL                                                */}
        {/* ========================================================================= */}
        {selectedEventDetails && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#141414] border border-[#C5A059]/40 w-full max-w-xl rounded-sm overflow-hidden shadow-2xl space-y-6">
              {/* Header Image */}
              <div className="relative aspect-[16/7] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedEventDetails.posterUrl}
                  alt={selectedEventDetails.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedEventDetails(null)}
                  className="absolute top-3 right-3 p-1.5 bg-black/80 rounded-full text-white hover:text-red-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4">
                  <span
                    style={{ backgroundColor: selectedEventDetails.color || "#C5A059" }}
                    className="text-[10px] font-mono font-bold text-black px-2.5 py-0.5 uppercase tracking-wider"
                  >
                    {selectedEventDetails.category}
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <h3 className="font-display text-2xl uppercase tracking-wide text-white leading-snug">
                  {selectedEventDetails.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-3 text-xs font-mono">
                  <div>
                    <span className="text-stone-500 block uppercase text-[10px]">Start Date &amp; Time</span>
                    <span className="text-white font-bold">{selectedEventDetails.startDateTime.replace("T", " • ")}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block uppercase text-[10px]">Fee / Pass</span>
                    <span className="text-emerald-400 font-bold">
                      {selectedEventDetails.price > 0 ? `LKR ${selectedEventDetails.price.toLocaleString()}` : "Complimentary"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-500 block uppercase text-[10px]">Venue</span>
                    <span className="text-stone-200">{selectedEventDetails.venue}</span>
                  </div>
                  {selectedEventDetails.isMeeting && selectedEventDetails.meetingLink && (
                    <div className="col-span-2 bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-sm">
                      <span className="text-emerald-400 block uppercase text-[10px] font-bold">Virtual Chamber Link</span>
                      <a
                        href={selectedEventDetails.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white underline hover:text-emerald-300 break-all text-xs"
                      >
                        {selectedEventDetails.meetingLink}
                      </a>
                    </div>
                  )}
                </div>

                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  {selectedEventDetails.description}
                </p>

                {selectedEventDetails.speakers && selectedEventDetails.speakers.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase block mb-1 font-bold">
                      Panelists &amp; Speakers:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEventDetails.speakers.map((spk, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-black border border-white/10 text-[11px] font-mono text-stone-300">
                          {spk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => handleDeleteEvent(selectedEventDetails.id)}
                    className="text-xs font-mono text-red-400 hover:text-red-300 transition flex items-center gap-1 uppercase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Event</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(selectedEventDetails)}
                      className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-mono text-xs uppercase tracking-wider font-bold transition rounded-sm"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => setSelectedEventDetails(null)}
                      className="px-4 py-2 bg-black border border-white/20 hover:border-white text-xs font-mono uppercase text-white transition rounded-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCHEDULE / EDIT EVENT MODAL                                               */}
        {/* ========================================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#141414] border border-[#C5A059] w-full max-w-2xl rounded-sm p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                    [ CALENDAR SCHEDULING CONSOLE ]
                  </span>
                  <h2 className="font-display text-3xl uppercase tracking-wider text-white">
                    {editingEventId ? "EDIT CALENDAR ENTRY" : "SCHEDULE EVENT OR MEETING"}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4 text-xs font-mono">
                {/* Event Type & Meeting Toggle */}
                <div className="flex items-center justify-between p-3 bg-black border border-white/10 rounded-sm">
                  <div className="flex items-center gap-3">
                    <Video className={`w-4 h-4 ${isMeeting ? "text-emerald-400" : "text-stone-500"}`} />
                    <div>
                      <span className="text-white font-bold block">Council Meeting / Virtual Session</span>
                      <span className="text-[10px] text-stone-400">Toggle on if this is an internal meeting or online session</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isMeeting}
                    onChange={(e) => setIsMeeting(e.target.checked)}
                    className="w-4 h-4 accent-[#C5A059] cursor-pointer"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                    Event / Meeting Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Masterclass on Commercial Appellate Arguments"
                    className="w-full bg-black border border-white/20 p-2.5 rounded text-white focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black border border-white/20 p-2.5 rounded text-white focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="Continuing Legal Education">Continuing Legal Education</option>
                      <option value="Annual Symposium">Annual Symposium</option>
                      <option value="Council Meeting">Council Meeting</option>
                      <option value="Judicial Dialogue">Judicial Dialogue</option>
                      <option value="Social & Law Dinner">Social &amp; Law Dinner</option>
                      <option value="Junior Bar Workshop">Junior Bar Workshop</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as CLSEvent["status"])}
                      className="w-full bg-black border border-white/20 p-2.5 rounded text-white focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Date & Time (Start & End) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                      Start Date &amp; Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                      className="w-full bg-black border border-white/20 p-2.5 rounded text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                      End Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      value={endDateTime}
                      onChange={(e) => setEndDateTime(e.target.value)}
                      className="w-full bg-black border border-white/20 p-2.5 rounded text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Venue & Location */}
                <div>
                  <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                    Venue / Meeting Room
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Main Auditorium, Superior Courts Complex"
                    className="w-full bg-black border border-white/20 p-2.5 rounded text-white focus:border-[#C5A059] focus:outline-none"
                  />
                  {/* Preset Venue Pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {venuePresets.map((v, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setVenue(v)}
                        className="text-[9px] px-2 py-0.5 bg-black border border-white/10 text-stone-400 hover:text-white hover:border-[#C5A059] rounded-xs"
                      >
                        {v.split(",")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meeting Link (if isMeeting is checked) */}
                {isMeeting && (
                  <div>
                    <label className="text-emerald-400 block mb-1 uppercase tracking-wider">
                      Virtual Chamber / Zoom / Google Meet Link
                    </label>
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://zoom.us/j/123456789 or https://meet.google.com/..."
                      className="w-full bg-black border border-emerald-500/40 p-2.5 rounded text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                )}

                {/* Price & Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                      Registration Fee (LKR, 0 = Free)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-black border border-white/20 p-2.5 rounded text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                      Calendar Badge Color
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {colorPresets.map((cp) => (
                        <button
                          key={cp.hex}
                          type="button"
                          onClick={() => setColor(cp.hex)}
                          style={{ backgroundColor: cp.hex }}
                          className={`w-6 h-6 rounded-full border-2 transition ${
                            color === cp.hex ? "border-white scale-110" : "border-transparent opacity-70"
                          }`}
                          title={cp.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Speakers */}
                <div>
                  <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                    Key Speakers / Panelists (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={speakersInput}
                    onChange={(e) => setSpeakersInput(e.target.value)}
                    placeholder="e.g. Hon. Chief Justice, President Sandun Nagahawatta, Mr. K. Kanag-Iswaran PC"
                    className="w-full bg-black border border-white/20 p-2.5 rounded text-white focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Event Photo / Poster Upload */}
                <div>
                  <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                    Event Photo / Poster
                  </label>
                  <div className="border border-dashed border-white/20 hover:border-[#C5A059] p-4 rounded bg-black/60 flex flex-col sm:flex-row items-center gap-4 transition">
                    <div className="w-24 h-24 rounded bg-black border border-white/10 overflow-hidden shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={posterUrl}
                        alt="Event Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2 flex-1 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <label className="cursor-pointer px-3 py-1.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-bold uppercase text-[10px] rounded-sm transition flex items-center gap-1.5 shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-stone-500 text-[10px]">JPG, PNG or WebP</span>
                      </div>
                      <input
                        type="text"
                        value={posterUrl}
                        onChange={(e) => setPosterUrl(e.target.value)}
                        placeholder="Or enter image URL"
                        className="w-full bg-black border border-white/10 p-1.5 rounded text-[11px] text-stone-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-stone-400 block mb-1 uppercase tracking-wider">
                    Event Overview &amp; Agenda Details
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed syllabus, session objectives, or council agenda notes..."
                    className="w-full bg-black border border-white/20 p-2.5 rounded text-white focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-black border border-white/20 hover:border-white text-stone-300 hover:text-white uppercase font-bold text-xs rounded-sm transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black uppercase font-bold text-xs rounded-sm transition shadow-lg"
                  >
                    {editingEventId ? "Save Changes" : "Publish to Calendar"}
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
