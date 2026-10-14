"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  sriLankaCities, 
  practiceAreasCatalog, 
  specializationAreas 
} from "@/lib/mockData";
import { 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  User, 
  Building2, 
  Lock, 
  Award,
  Sparkles,
  AlertCircle
} from "lucide-react";

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "Mr.",
    fullName: "",
    callingName: "",
    sc_en: "",
    ba_en: "",
    nic: "",
    dob: "",
    gender: "Male",
    email: "",
    mobile: "",
    officePhone: "",
    chamberAddress: "",
    city: "Colombo 12 (Hulftsdorp / Superior Courts)",
    primaryPractice: "Commercial & Corporate Law",
    expertise: ["Appellate Court Advocacy", "Commercial High Court Trials"],
    membershipTier: "Ordinary" as "Ordinary" | "Life",
    password: "",
    confirmPassword: "",
    acceptedOath: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const toggleSpecialization = (spec: string) => {
    if (formData.expertise.includes(spec)) {
      setFormData({
        ...formData,
        expertise: formData.expertise.filter((e) => e !== spec),
      });
    } else {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, spec],
      });
    }
  };

  const handleFillSample = () => {
    setFormData({
      title: "Ms.",
      fullName: "Anuki Nilupuli Jayawardena",
      callingName: "Anuki Jayawardena",
      sc_en: "SC/EN/2024/5129",
      ba_en: "BASL/18920",
      nic: "199854201940",
      dob: "1998-04-12",
      gender: "Female",
      email: "anuki.jayawardena@chambers.lk",
      mobile: "+94 77 482 9102",
      officePhone: "+94 11 289 4410",
      chamberAddress: "Law Chambers, 4th Floor, Hulftsdorp Commercial Arcade",
      city: "Colombo 12 (Hulftsdorp / Superior Courts)",
      primaryPractice: "Intellectual Property & IT Law",
      expertise: [
        "Fintech, Digital Assets & AI Law",
        "Patent & Trademark Enforcement",
        "Commercial High Court Trials"
      ],
      membershipTier: "Ordinary",
      password: "Password@123",
      confirmPassword: "Password@123",
      acceptedOath: true,
    });
    setFormErrors({});
  };

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = "Full name as enrolled is required";
      if (!formData.sc_en.trim()) errors.sc_en = "Supreme Court Enrolment Number is required";
      if (!formData.ba_en.trim()) errors.ba_en = "BASL Registration Number is required";
      if (!formData.nic.trim()) errors.nic = "National Identity Card (NIC) is required";
      if (!formData.dob) errors.dob = "Date of Birth is required";
    }

    if (step === 2) {
      if (!formData.chamberAddress.trim()) errors.chamberAddress = "Chamber / Office address is required";
      if (!formData.city) errors.city = "City / District is required";
      if (formData.expertise.length === 0) errors.expertise = "Select at least 1 area of expertise";
    }

    if (step === 3) {
      if (!formData.email.trim() || !formData.email.includes("@")) errors.email = "Valid professional email is required";
      if (!formData.mobile.trim()) errors.mobile = "Active mobile number is required";
      if (!formData.password || formData.password.length < 6) errors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
      if (!formData.acceptedOath) errors.acceptedOath = "You must subscribe to the Colombo Law Society Constitution";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E7E0D3] selection:bg-[#C5A059] selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 border-b border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#C5A059]/30 rounded-full text-[10px] tracking-widest uppercase text-[#C5A059] mb-4">
                <Scale className="w-3 h-3" />
                Hulftsdorp Bar Admission &bull; Est. 1890
              </div>
              <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
                ENROLMENT AS AN <br />
                <span className="font-serif italic font-normal text-[#C5A059] lowercase text-5xl sm:text-7xl">
                  advocate of the society
                </span>
              </h1>
              <p className="mt-4 text-sm text-[#A0A0A0] leading-relaxed">
                Join Sri Lanka&apos;s most venerable legal fraternity. Open to all Attorneys-at-Law admitted to the Supreme Court bar practicing within the Superior Courts and Colombo courts jurisdiction.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleFillSample}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#E7E0D3] transition rounded"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                Auto-Fill Sample Data
              </button>
            </div>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: 1, title: "01. Bar Credentials", subtitle: "SC & BASL Enrolment Details", icon: User },
              { step: 2, title: "02. Chambers & Practice", subtitle: "Jurisdiction & Specialities", icon: Building2 },
              { step: 3, title: "03. Tier & Declaration", subtitle: "Subscription & Constitution Oath", icon: ShieldCheck },
            ].map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.step;
              const isPast = currentStep > s.step;

              return (
                <div
                  key={s.step}
                  className={`p-4 border transition-all ${
                    isActive
                      ? "bg-[#181818] border-[#C5A059] shadow-lg shadow-[#C5A059]/10"
                      : isPast
                      ? "bg-[#141414] border-white/20"
                      : "bg-[#0E0E0E] border-white/5 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isPast
                          ? "bg-[#C5A059] text-black"
                          : isActive
                          ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]"
                          : "bg-white/5 text-[#A0A0A0]"
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-display uppercase text-sm tracking-wide text-white">
                        {s.title}
                      </div>
                      <div className="text-[11px] text-[#A0A0A0]">{s.subtitle}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Body */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        {isSubmitted ? (
          <div className="bg-[#141414] border border-[#C5A059] p-8 sm:p-12 text-center rounded shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 bg-[#C5A059]/20 border border-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C5A059]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-2">
              Registration Dossier Logged
            </div>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              WELCOME TO THE <span className="font-serif italic font-normal text-[#C5A059]">Colombo Law Society</span>
            </h2>
            <p className="text-sm text-[#A0A0A0] max-w-xl mx-auto leading-relaxed mb-8">
              Your application for enrolment has been verified against the Supreme Court register. A confirmation SMS and official welcome dossier have been dispatched to{" "}
              <strong className="text-white">{formData.email}</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 text-left bg-[#1C1C1C] p-4 border border-white/10 rounded">
              <div>
                <div className="text-[10px] uppercase text-[#A0A0A0]">Member ID</div>
                <div className="font-mono text-sm font-bold text-[#C5A059]">CLS-ORD-2026-9140</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-[#A0A0A0]">Assigned Tier</div>
                <div className="text-sm font-bold text-white">{formData.membershipTier} Member</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-[#A0A0A0]">SC Enrolment</div>
                <div className="font-mono text-xs text-white">{formData.sc_en}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/member"
                className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-xs uppercase tracking-widest transition rounded shadow"
              >
                Open Member Portal & Bar Card
              </Link>
              <Link
                href="/sign-in"
                className="px-6 py-3.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/20 text-white font-semibold text-xs uppercase tracking-widest transition rounded"
              >
                Sign In to Account
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/10 p-8 sm:p-12 rounded shadow-2xl">
            {/* STEP 1: Personal & Court Credentials */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                    Step 1 &bull; Personal & Supreme Court Credentials
                  </h2>
                  <p className="text-xs text-[#A0A0A0] mt-1">
                    Please provide your enrolment details exactly as inscribed on the Supreme Court Roll.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Salutation
                    </label>
                    <select
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-[#1C1C1C] border border-white/20 text-white px-3 py-2.5 rounded text-sm focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Hon.">Hon.</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Full Legal Name (as per Supreme Court Roll) *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Mudiyanselage Anuki Nilupuli Jayawardena"
                      className={`w-full bg-[#1C1C1C] border px-4 py-2.5 rounded text-sm text-white placeholder-white/30 focus:outline-none ${
                        formErrors.fullName ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                      }`}
                    />
                    {formErrors.fullName && (
                      <span className="text-[11px] text-red-400 mt-1 block">{formErrors.fullName}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Supreme Court Enrolment No. (SC/EN) *
                    </label>
                    <input
                      type="text"
                      value={formData.sc_en}
                      onChange={(e) => setFormData({ ...formData, sc_en: e.target.value })}
                      placeholder="e.g. SC/EN/2018/2210"
                      className={`w-full bg-[#1C1C1C] border px-4 py-2.5 rounded text-sm text-white font-mono placeholder-white/30 focus:outline-none ${
                        formErrors.sc_en ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                      }`}
                    />
                    {formErrors.sc_en && (
                      <span className="text-[11px] text-red-400 mt-1 block">{formErrors.sc_en}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      BASL Enrolment Registration No. *
                    </label>
                    <input
                      type="text"
                      value={formData.ba_en}
                      onChange={(e) => setFormData({ ...formData, ba_en: e.target.value })}
                      placeholder="e.g. BASL/11204"
                      className={`w-full bg-[#1C1C1C] border px-4 py-2.5 rounded text-sm text-white font-mono placeholder-white/30 focus:outline-none ${
                        formErrors.ba_en ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                      }`}
                    />
                    {formErrors.ba_en && (
                      <span className="text-[11px] text-red-400 mt-1 block">{formErrors.ba_en}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      NIC / Passport Number *
                    </label>
                    <input
                      type="text"
                      value={formData.nic}
                      onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                      placeholder="199854201940"
                      className={`w-full bg-[#1C1C1C] border px-4 py-2.5 rounded text-sm text-white placeholder-white/30 focus:outline-none ${
                        formErrors.nic ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                      }`}
                    />
                    {formErrors.nic && (
                      <span className="text-[11px] text-red-400 mt-1 block">{formErrors.nic}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className={`w-full bg-[#1C1C1C] border px-4 py-2 rounded text-sm text-white focus:outline-none ${
                        formErrors.dob ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                      }`}
                    />
                    {formErrors.dob && (
                      <span className="text-[11px] text-red-400 mt-1 block">{formErrors.dob}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-[#1C1C1C] border border-white/20 text-white px-3 py-2.5 rounded text-sm focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-xs uppercase tracking-wider transition rounded"
                  >
                    Proceed to Practice &bull; Step 2
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Practice & Chambers */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                    Step 2 &bull; Chamber Address & Judicial Practice
                  </h2>
                  <p className="text-xs text-[#A0A0A0] mt-1">
                    Define your primary discipline and judicial location to facilitate bar directory listings and court liaisons.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      City / Judicial Jurisdiction *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#1C1C1C] border border-white/20 text-white px-4 py-2.5 rounded text-sm focus:border-[#C5A059] focus:outline-none"
                    >
                      {sriLankaCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Primary Practice Discipline *
                    </label>
                    <select
                      value={formData.primaryPractice}
                      onChange={(e) => setFormData({ ...formData, primaryPractice: e.target.value })}
                      className="w-full bg-[#1C1C1C] border border-white/20 text-white px-4 py-2.5 rounded text-sm focus:border-[#C5A059] focus:outline-none"
                    >
                      {practiceAreasCatalog.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                    Chambers / Office Address *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.chamberAddress}
                    onChange={(e) => setFormData({ ...formData, chamberAddress: e.target.value })}
                    placeholder="e.g. No. 42/B, Hulftsdorp Street, Colombo 12"
                    className={`w-full bg-[#1C1C1C] border px-4 py-2.5 rounded text-sm text-white placeholder-white/30 focus:outline-none ${
                      formErrors.chamberAddress ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                    }`}
                  />
                  {formErrors.chamberAddress && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.chamberAddress}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                      Specific Areas of Expertise &bull; Select Applicable
                    </label>
                    <span className="text-[11px] text-[#C5A059]">
                      {formData.expertise.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {specializationAreas.map((spec) => {
                      const isSelected = formData.expertise.includes(spec);
                      return (
                        <button
                          type="button"
                          key={spec}
                          onClick={() => toggleSpecialization(spec)}
                          className={`text-left px-3.5 py-2.5 rounded border text-xs transition flex items-center justify-between ${
                            isSelected
                              ? "bg-[#C5A059]/15 border-[#C5A059] text-white"
                              : "bg-[#1C1C1C] border-white/10 text-[#A0A0A0] hover:border-white/30"
                          }`}
                        >
                          <span>{spec}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected
                                ? "bg-[#C5A059] text-black border-[#C5A059] font-bold"
                                : "border-white/20"
                            }`}
                          >
                            {isSelected && "✓"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {formErrors.expertise && (
                    <span className="text-[11px] text-red-400 mt-2 block">{formErrors.expertise}</span>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition rounded"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-xs uppercase tracking-wider transition rounded"
                  >
                    Proceed to Tier &amp; Security &bull; Step 3
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Tier Selection, Credentials & Oath */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                    Step 3 &bull; Membership Tier &amp; Digital Credentials
                  </h2>
                  <p className="text-xs text-[#A0A0A0] mt-1">
                    Select your membership tier, set your secure access password, and ratify your declaration.
                  </p>
                </div>

                {/* Membership Tier Cards */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-3 font-medium">
                    Select Your Society Membership Classification *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => setFormData({ ...formData, membershipTier: "Ordinary" })}
                      className={`cursor-pointer p-5 border rounded transition-all relative ${
                        formData.membershipTier === "Ordinary"
                          ? "bg-[#181818] border-[#C5A059] shadow-lg shadow-[#C5A059]/10"
                          : "bg-[#1C1C1C] border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display uppercase text-lg text-white">Ordinary Membership</span>
                        <span className="text-sm font-bold text-[#C5A059]">LKR 2,000 / yr</span>
                      </div>
                      <p className="text-xs text-[#A0A0A0] leading-relaxed mb-4">
                        Renewable on a 1-year basis expiring annually on 31 December. Full access to library, robes, and symposium discounts.
                      </p>
                      <ul className="text-[11px] text-white/70 space-y-1.5">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Superior Courts Robing Room Access
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Annual Bar Directory Inclusion
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> 12 Months Digital Bar Card Validity
                        </li>
                      </ul>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, membershipTier: "Life" })}
                      className={`cursor-pointer p-5 border rounded transition-all relative ${
                        formData.membershipTier === "Life"
                          ? "bg-[#181818] border-[#C5A059] shadow-lg shadow-[#C5A059]/10"
                          : "bg-[#1C1C1C] border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display uppercase text-lg text-white">Permanent Life Member</span>
                        <span className="text-sm font-bold text-[#C5A059]">LKR 5,000 one-time</span>
                      </div>
                      <p className="text-xs text-[#A0A0A0] leading-relaxed mb-4">
                        Requires minimum 5 years standing at the Bar. Lifetime exemption from annual renewal subscriptions.
                      </p>
                      <ul className="text-[11px] text-white/70 space-y-1.5">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Permanent 99-Year Digital Pass
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> AGM Voting &amp; Committee Candidacy Rights
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Exclusive Hulftsdorp Heritage Room Privileges
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="advocate@chambers.lk"
                      className={`w-full bg-[#1C1C1C] border px-4 py-2.5 rounded text-sm text-white placeholder-white/30 focus:outline-none ${
                        formErrors.email ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                      }`}
                    />
                    {formErrors.email && (
                      <span className="text-[11px] text-red-400 mt-1 block">{formErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Mobile Number (for SMS Alerts) *
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="+94 77 123 4567"
                      className={`w-full bg-[#1C1C1C] border px-4 py-2.5 rounded text-sm text-white font-mono placeholder-white/30 focus:outline-none ${
                        formErrors.mobile ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                      }`}
                    />
                    {formErrors.mobile && (
                      <span className="text-[11px] text-red-400 mt-1 block">{formErrors.mobile}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Account Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••••••"
                      className={`w-full bg-[#1C1C1C] border px-4 py-2.5 rounded text-sm text-white focus:outline-none ${
                        formErrors.password ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                      }`}
                    />
                    {formErrors.password && (
                      <span className="text-[11px] text-red-400 mt-1 block">{formErrors.password}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••••••"
                      className={`w-full bg-[#1C1C1C] border px-4 py-2.5 rounded text-sm text-white focus:outline-none ${
                        formErrors.confirmPassword ? "border-red-500" : "border-white/20 focus:border-[#C5A059]"
                      }`}
                    />
                    {formErrors.confirmPassword && (
                      <span className="text-[11px] text-red-400 mt-1 block">{formErrors.confirmPassword}</span>
                    )}
                  </div>
                </div>

                {/* Declaration & Oath */}
                <div className="bg-[#1C1C1C] border border-white/10 p-4 rounded space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      id="oath-check"
                      type="checkbox"
                      checked={formData.acceptedOath}
                      onChange={(e) => setFormData({ ...formData, acceptedOath: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#C5A059] focus:ring-[#C5A059]"
                    />
                    <label htmlFor="oath-check" className="text-xs text-[#A0A0A0] leading-relaxed cursor-pointer">
                      <strong className="text-white">Declaration of Standing:</strong> I hereby declare that I am an Attorney-at-Law of the Supreme Court of Sri Lanka in good standing, free from suspension or disciplinary disbarment. I undertake to abide by the Constitution and Rules of the Colombo Law Society (Est. 1890) and uphold the dignity of the Bar.
                    </label>
                  </div>
                  {formErrors.acceptedOath && (
                    <span className="text-[11px] text-red-400 block">{formErrors.acceptedOath}</span>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition rounded"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold text-xs uppercase tracking-widest transition rounded shadow-lg shadow-[#C5A059]/20"
                  >
                    Ratify Enrolment &amp; Submit
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </section>

      <Footer />
    </div>
  );
}
