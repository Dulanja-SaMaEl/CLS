import fs from "fs";
import path from "path";
import { supabase } from "./supabase";
import {
  initialMembers,
  initialEvents,
  initialBroadcastLogs,
  executiveCommittee,
  pastPresidents,
  initialGalleryImages,
  Member,
  CLSEvent,
  BroadcastLog,
  GalleryImage,
} from "./mockData";

export interface SocietySettings {
  name: string;
  tagline: string;
  establishedYear: number;
  charterYear: number;
  address: string;
  email: string;
  phone: string;
  membershipFeeOrdinary: number;
  membershipFeeLife: number;
  totalMembersCount: number;
  superiorCourtEnclave: string;
}

export interface DatabaseState {
  members: Member[];
  events: CLSEvent[];
  gallery: GalleryImage[];
  broadcasts: BroadcastLog[];
  committee: typeof executiveCommittee;
  pastPresidents: typeof pastPresidents;
  settings: SocietySettings;
}

const DB_FILE = path.join(process.cwd(), "data", "db.json");

const defaultSettings: SocietySettings = {
  name: "Colombo Law Society",
  tagline: "Premier & Largest Branch Association of the Bar Association of Sri Lanka",
  establishedYear: 1890,
  charterYear: 1975,
  address: "129, Hulftsdorp Street, Colombo 12, Sri Lanka",
  email: "info@colombolawsociety.com",
  phone: "+94 71 192 3531",
  membershipFeeOrdinary: 2000,
  membershipFeeLife: 5000,
  totalMembersCount: 1042,
  superiorCourtEnclave: "Supreme Court & Superior Benches, Hulftsdorp",
};

let memoryDb: DatabaseState | null = null;

function loadDatabase(): DatabaseState {
  if (memoryDb) return memoryDb;

  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      memoryDb = JSON.parse(data);
      if (memoryDb) {
        if (!memoryDb.gallery) memoryDb.gallery = initialGalleryImages;
        if (!memoryDb.settings) memoryDb.settings = defaultSettings;
        if (!memoryDb.committee) memoryDb.committee = executiveCommittee;
        if (!memoryDb.pastPresidents) memoryDb.pastPresidents = pastPresidents;
        return memoryDb;
      }
    }
  } catch (err) {
    console.error("Error reading db.json, falling back to seed data:", err);
  }

  memoryDb = {
    members: [...initialMembers],
    events: [...initialEvents],
    gallery: [...initialGalleryImages],
    broadcasts: [...initialBroadcastLogs],
    committee: [...executiveCommittee],
    pastPresidents: [...pastPresidents],
    settings: defaultSettings,
  };

  saveDatabase(memoryDb);
  return memoryDb;
}

function saveDatabase(state: DatabaseState): void {
  memoryDb = state;
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}

// ============================================================================
// SUPABASE MAPPERS
// ============================================================================
function mapSupabaseEvent(row: any): CLSEvent {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    venue: row.venue,
    location: row.location || "Hulftsdorp, Colombo 12",
    startDateTime: row.start_date_time || row.startDateTime,
    endDateTime: row.end_date_time || row.endDateTime || row.start_date_time || row.startDateTime,
    price: Number(row.price || 0),
    status: row.status || "Upcoming",
    description: row.description || "",
    posterUrl: row.poster_url || row.posterUrl || "/images/events/cls-actual-event.jpg",
    speakers: row.speakers || [],
    attendeeCount: row.attendee_count ?? row.attendeeCount ?? 0,
    isMeeting: Boolean(row.is_meeting ?? row.isMeeting),
    meetingLink: row.meeting_link ?? row.meetingLink ?? "",
    agenda: row.agenda || [],
    color: row.color || "#C5A059",
  };
}

function mapSupabaseGallery(row: any): GalleryImage {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url || row.imageUrl,
    thumbnailUrl: row.thumbnail_url || row.thumbnailUrl || row.image_url || row.imageUrl,
    date: row.date || "",
    venue: row.venue || "Superior Courts Complex, Hulftsdorp",
    description: row.description || "",
    featured: Boolean(row.featured),
    photographer: row.photographer || "CLS Secretariat Media",
    eventId: row.event_id ?? row.eventId,
  };
}

function mapSupabaseMember(row: any): Member {
  return {
    id: row.id,
    sc_en: row.sc_en || "",
    ba_en: row.ba_en || "BASL/---",
    name: row.name || "",
    email: row.email || "",
    mobile: row.mobile || "",
    nic: row.nic || "",
    gender: row.gender || "Male",
    city: row.city || "Colombo",
    practiceArea: row.practice_area || "General Practice",
    expertise: row.expertise || [],
    membershipTier: row.membership_tier || "Ordinary",
    status: row.status || "Active",
    avatarUrl: row.avatar_url || "/images/branding/cls-crest-gold.png",
    registeredDate: row.registered_date
      ? new Date(row.registered_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "12 Jan, 2024",
    membershipStartDate: row.membership_start_date || "2024-01-01",
    membershipEndDate: row.membership_end_date || "2026-12-31",
  };
}

function mapSupabaseCommittee(row: any) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    credentials: row.credentials || "Attorney-at-Law",
    court: row.court || "Supreme Court Bar & Hulftsdorp",
    image: row.image_url || row.image || "/images/branding/cls-crest-gold.png",
    bio: row.bio || "",
    email: row.email || "",
    phone: row.phone || "",
  };
}

function mapSupabasePastPresident(row: any) {
  return {
    id: row.id,
    year: row.year_period || row.year,
    name: row.name,
    credentials: row.credentials || "Attorney-at-Law",
    tenure: row.tenure || row.year_period || row.year,
    highlight: row.highlight || "",
    image: row.image_url || row.image || null,
  };
}

function mapSupabaseSettings(row: any): SocietySettings {
  return {
    name: row.name || defaultSettings.name,
    tagline: row.tagline || defaultSettings.tagline,
    establishedYear: row.established_year ?? defaultSettings.establishedYear,
    charterYear: row.charter_year ?? defaultSettings.charterYear,
    address: row.address || defaultSettings.address,
    email: row.email || defaultSettings.email,
    phone: row.phone || defaultSettings.phone,
    membershipFeeOrdinary: Number(row.membership_fee_ordinary ?? defaultSettings.membershipFeeOrdinary),
    membershipFeeLife: Number(row.membership_fee_life ?? defaultSettings.membershipFeeLife),
    totalMembersCount: Number(row.total_members_count ?? defaultSettings.totalMembersCount),
    superiorCourtEnclave: row.superior_court_enclave || defaultSettings.superiorCourtEnclave,
  };
}

// ============================================================================
// EVENTS API HELPERS
// ============================================================================
export async function getEvents(): Promise<CLSEvent[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date_time", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapSupabaseEvent);
    }
  } catch (err) {
    console.warn("Supabase fetch events failed, using local DB:", err);
  }
  const db = loadDatabase();
  return db.events;
}

export async function getEventById(id: number): Promise<CLSEvent | null> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return mapSupabaseEvent(data);
    }
  } catch (err) {
    console.warn("Supabase getEventById failed:", err);
  }
  const db = loadDatabase();
  return db.events.find((e) => e.id === id) || null;
}

export async function createEvent(eventData: Omit<CLSEvent, "id">): Promise<CLSEvent> {
  const newEvent: CLSEvent = {
    ...eventData,
    id: Date.now(),
    attendeeCount: eventData.attendeeCount ?? 0,
    status: eventData.status ?? "Upcoming",
  };

  try {
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title: newEvent.title,
          category: newEvent.category,
          venue: newEvent.venue,
          location: newEvent.location,
          start_date_time: newEvent.startDateTime,
          end_date_time: newEvent.endDateTime,
          price: newEvent.price,
          status: newEvent.status,
          description: newEvent.description,
          poster_url: newEvent.posterUrl,
          speakers: newEvent.speakers || [],
          attendee_count: newEvent.attendeeCount,
          is_meeting: newEvent.isMeeting || false,
          meeting_link: newEvent.meetingLink || "",
          agenda: newEvent.agenda || [],
          color: newEvent.color || "#C5A059",
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return mapSupabaseEvent(data);
    }
  } catch (err) {
    console.warn("Supabase insert event failed:", err);
  }

  const db = loadDatabase();
  db.events.unshift(newEvent);
  saveDatabase(db);
  return newEvent;
}

export async function updateEvent(id: number, updates: Partial<CLSEvent>): Promise<CLSEvent | null> {
  try {
    const updatePayload: Record<string, any> = {};
    if (updates.title !== undefined) updatePayload.title = updates.title;
    if (updates.category !== undefined) updatePayload.category = updates.category;
    if (updates.venue !== undefined) updatePayload.venue = updates.venue;
    if (updates.location !== undefined) updatePayload.location = updates.location;
    if (updates.startDateTime !== undefined) updatePayload.start_date_time = updates.startDateTime;
    if (updates.endDateTime !== undefined) updatePayload.end_date_time = updates.endDateTime;
    if (updates.price !== undefined) updatePayload.price = updates.price;
    if (updates.status !== undefined) updatePayload.status = updates.status;
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.posterUrl !== undefined) updatePayload.poster_url = updates.posterUrl;
    if (updates.speakers !== undefined) updatePayload.speakers = updates.speakers;
    if (updates.attendeeCount !== undefined) updatePayload.attendee_count = updates.attendeeCount;
    if (updates.isMeeting !== undefined) updatePayload.is_meeting = updates.isMeeting;
    if (updates.meetingLink !== undefined) updatePayload.meeting_link = updates.meetingLink;
    if (updates.agenda !== undefined) updatePayload.agenda = updates.agenda;
    if (updates.color !== undefined) updatePayload.color = updates.color;

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from("events")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return mapSupabaseEvent(data);
      }
    }
  } catch (err) {
    console.warn("Supabase update event failed:", err);
  }

  const db = loadDatabase();
  const index = db.events.findIndex((e) => e.id === id);
  if (index === -1) return null;

  db.events[index] = { ...db.events[index], ...updates };
  saveDatabase(db);
  return db.events[index];
}

export async function deleteEvent(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) {
      const db = loadDatabase();
      db.events = db.events.filter((e) => e.id !== id);
      saveDatabase(db);
      return true;
    }
  } catch (err) {
    console.warn("Supabase delete event failed:", err);
  }

  const db = loadDatabase();
  const initialLen = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  if (db.events.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ============================================================================
// GALLERY SHOWCASE API HELPERS
// ============================================================================
export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  try {
    let query = supabase.from("event_gallery").select("*").order("id", { ascending: false });
    if (category && category !== "All") {
      query = query.ilike("category", category);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map(mapSupabaseGallery);
    }
  } catch (err) {
    console.warn("Supabase fetch gallery failed:", err);
  }

  const db = loadDatabase();
  if (category && category !== "All") {
    return db.gallery.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }
  return db.gallery;
}

export async function addGalleryImage(imageData: Omit<GalleryImage, "id">): Promise<GalleryImage> {
  const newImage: GalleryImage = {
    ...imageData,
    id: Date.now(),
    featured: imageData.featured ?? false,
  };

  try {
    const { data, error } = await supabase
      .from("event_gallery")
      .insert([
        {
          title: newImage.title,
          category: newImage.category,
          image_url: newImage.imageUrl,
          thumbnail_url: newImage.thumbnailUrl || newImage.imageUrl,
          date:
            newImage.date ||
            new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          venue: newImage.venue || "Superior Courts Complex, Hulftsdorp",
          description: newImage.description || "",
          featured: newImage.featured,
          photographer: newImage.photographer || "CLS Secretariat Media",
          event_id: newImage.eventId || null,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return mapSupabaseGallery(data);
    }
  } catch (err) {
    console.warn("Supabase insert gallery failed:", err);
  }

  const db = loadDatabase();
  db.gallery.unshift(newImage);
  saveDatabase(db);
  return newImage;
}

export async function deleteGalleryImage(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("event_gallery").delete().eq("id", id);
    if (!error) {
      const db = loadDatabase();
      db.gallery = db.gallery.filter((g) => g.id !== id);
      saveDatabase(db);
      return true;
    }
  } catch (err) {
    console.warn("Supabase delete gallery image failed:", err);
  }

  const db = loadDatabase();
  const initialLen = db.gallery.length;
  db.gallery = db.gallery.filter((g) => g.id !== id);
  if (db.gallery.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

export async function toggleGalleryFeatured(id: number): Promise<GalleryImage | null> {
  try {
    const { data: current } = await supabase.from("event_gallery").select("featured").eq("id", id).single();
    if (current) {
      const { data, error } = await supabase
        .from("event_gallery")
        .update({ featured: !current.featured })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        return mapSupabaseGallery(data);
      }
    }
  } catch (err) {
    console.warn("Supabase toggle gallery featured failed:", err);
  }

  const db = loadDatabase();
  const img = db.gallery.find((g) => g.id === id);
  if (!img) return null;
  img.featured = !img.featured;
  saveDatabase(db);
  return img;
}

// ============================================================================
// MEMBERS API HELPERS
// ============================================================================
export async function getMembers(): Promise<Member[]> {
  try {
    const { data, error } = await supabase.from("members").select("*").order("id", { ascending: true });
    if (!error && data && data.length > 0) {
      return data.map(mapSupabaseMember);
    }
  } catch (err) {
    console.warn("Supabase fetch members failed:", err);
  }
  const db = loadDatabase();
  return db.members;
}

export async function getMemberById(id: number): Promise<Member | null> {
  try {
    const { data, error } = await supabase.from("members").select("*").eq("id", id).single();
    if (!error && data) {
      return mapSupabaseMember(data);
    }
  } catch (err) {
    console.warn("Supabase getMemberById failed:", err);
  }
  const db = loadDatabase();
  return db.members.find((m) => m.id === id) || null;
}

export async function createMember(memberData: Omit<Member, "id">): Promise<Member> {
  const newMember: Member = {
    ...memberData,
    id: Date.now(),
  };

  try {
    const { data, error } = await supabase
      .from("members")
      .insert([
        {
          sc_en: newMember.sc_en,
          ba_en: newMember.ba_en || null,
          name: newMember.name,
          email: newMember.email,
          mobile: newMember.mobile,
          nic: newMember.nic || null,
          gender: newMember.gender || "Male",
          city: newMember.city || "Colombo",
          practice_area: newMember.practiceArea || "Commercial & Corporate Law",
          expertise: newMember.expertise || [],
          membership_tier: newMember.membershipTier || "Ordinary",
          status: newMember.status || "Active",
          avatar_url: newMember.avatarUrl || "/images/branding/cls-crest-gold.png",
          notes: (newMember as any).notes || null,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return mapSupabaseMember(data);
    }
  } catch (err) {
    console.warn("Supabase insert member failed:", err);
  }

  const db = loadDatabase();
  db.members.unshift(newMember);
  saveDatabase(db);
  return newMember;
}

export async function updateMember(id: number, updates: Partial<Member>): Promise<Member | null> {
  try {
    const updatePayload: Record<string, any> = {};
    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.email !== undefined) updatePayload.email = updates.email;
    if (updates.mobile !== undefined) updatePayload.mobile = updates.mobile;
    if (updates.practiceArea !== undefined) updatePayload.practice_area = updates.practiceArea;
    if (updates.membershipTier !== undefined) updatePayload.membership_tier = updates.membershipTier;
    if (updates.status !== undefined) updatePayload.status = updates.status;
    if (updates.city !== undefined) updatePayload.city = updates.city;

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from("members")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return mapSupabaseMember(data);
      }
    }
  } catch (err) {
    console.warn("Supabase update member failed:", err);
  }

  const db = loadDatabase();
  const index = db.members.findIndex((m) => m.id === id);
  if (index === -1) return null;

  db.members[index] = { ...db.members[index], ...updates };
  saveDatabase(db);
  return db.members[index];
}

export async function deleteMember(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (!error) {
      const db = loadDatabase();
      db.members = db.members.filter((m) => m.id !== id);
      saveDatabase(db);
      return true;
    }
  } catch (err) {
    console.warn("Supabase delete member failed:", err);
  }

  const db = loadDatabase();
  const initialLen = db.members.length;
  db.members = db.members.filter((m) => m.id !== id);
  if (db.members.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ============================================================================
// COMMITTEE & TEAM API HELPERS
// ============================================================================
export async function getCommittee() {
  try {
    const { data, error } = await supabase
      .from("committee_members")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapSupabaseCommittee);
    }
  } catch (err) {
    console.warn("Supabase fetch committee failed:", err);
  }

  const db = loadDatabase();
  return db.committee;
}

export async function addCommitteeMember(memberData: Omit<typeof executiveCommittee[0], "id">) {
  const newMember = {
    ...memberData,
    id: Date.now(),
  };

  try {
    const { data, error } = await supabase
      .from("committee_members")
      .insert([
        {
          name: newMember.name,
          title: newMember.title,
          credentials: newMember.credentials,
          court: newMember.court,
          image_url: newMember.image,
          bio: newMember.bio,
          email: newMember.email,
          phone: newMember.phone,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return mapSupabaseCommittee(data);
    }
  } catch (err) {
    console.warn("Supabase add committee member failed:", err);
  }

  const db = loadDatabase();
  db.committee.push(newMember);
  saveDatabase(db);
  return newMember;
}

export async function updateCommitteeMember(id: number, updates: Partial<typeof executiveCommittee[0]>) {
  try {
    const updatePayload: Record<string, any> = {};
    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.title !== undefined) updatePayload.title = updates.title;
    if (updates.credentials !== undefined) updatePayload.credentials = updates.credentials;
    if (updates.court !== undefined) updatePayload.court = updates.court;
    if (updates.image !== undefined) updatePayload.image_url = updates.image;
    if (updates.bio !== undefined) updatePayload.bio = updates.bio;
    if (updates.email !== undefined) updatePayload.email = updates.email;
    if (updates.phone !== undefined) updatePayload.phone = updates.phone;

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from("committee_members")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return mapSupabaseCommittee(data);
      }
    }
  } catch (err) {
    console.warn("Supabase update committee member failed:", err);
  }

  const db = loadDatabase();
  const index = db.committee.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.committee[index] = { ...db.committee[index], ...updates };
  saveDatabase(db);
  return db.committee[index];
}

export async function deleteCommitteeMember(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("committee_members").delete().eq("id", id);
    if (!error) {
      const db = loadDatabase();
      db.committee = db.committee.filter((c) => c.id !== id);
      saveDatabase(db);
      return true;
    }
  } catch (err) {
    console.warn("Supabase delete committee member failed:", err);
  }

  const db = loadDatabase();
  const initialLen = db.committee.length;
  db.committee = db.committee.filter((c) => c.id !== id);
  if (db.committee.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ============================================================================
// PAST PRESIDENTS API HELPERS
// ============================================================================
export async function getPastPresidents() {
  try {
    const { data, error } = await supabase
      .from("past_presidents")
      .select("*")
      .order("id", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapSupabasePastPresident);
    }
  } catch (err) {
    console.warn("Supabase fetch past presidents failed:", err);
  }

  const db = loadDatabase();
  return db.pastPresidents;
}

// ============================================================================
// BROADCAST API HELPERS
// ============================================================================
export async function getBroadcasts(): Promise<BroadcastLog[]> {
  try {
    const { data, error } = await supabase
      .from("broadcast_logs")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        id: b.id,
        title: b.title,
        content: b.content,
        channel: b.channel === "BOTH" ? "Email & SMS" : b.channel,
        targetTier: b.target_tier || "All Members",
        recipientsCount: b.recipients_count || 1042,
        sentAt: b.sent_at
          ? new Date(b.sent_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date().toLocaleDateString("en-GB"),
        status: b.status || "Delivered",
      }));
    }
  } catch (err) {
    console.warn("Supabase fetch broadcasts failed:", err);
  }

  const db = loadDatabase();
  return db.broadcasts;
}

export async function createBroadcast(
  data: Omit<BroadcastLog, "id" | "sentAt" | "status">
): Promise<BroadcastLog> {
  const db = loadDatabase();
  const newBroadcast: BroadcastLog = {
    ...data,
    id: Date.now(),
    sentAt: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "Delivered",
  };

  try {
    await supabase.from("broadcast_logs").insert([
      {
        title: newBroadcast.title,
        content: newBroadcast.content,
        channel: newBroadcast.channel.toUpperCase().includes("SMS") && newBroadcast.channel.toUpperCase().includes("EMAIL") ? "BOTH" : newBroadcast.channel.toUpperCase().includes("SMS") ? "SMS" : "EMAIL",
        target_tier: newBroadcast.targetTier,
        recipients_count: newBroadcast.recipientsCount,
        status: "Delivered",
      },
    ]);
  } catch (err) {
    console.warn("Supabase create broadcast log failed:", err);
  }

  db.broadcasts.unshift(newBroadcast);
  saveDatabase(db);
  return newBroadcast;
}

// ============================================================================
// SETTINGS API HELPERS
// ============================================================================
export async function getSettings(): Promise<SocietySettings> {
  try {
    const { data, error } = await supabase.from("society_settings").select("*").limit(1).single();
    if (!error && data) {
      return mapSupabaseSettings(data);
    }
  } catch (err) {
    console.warn("Supabase fetch settings failed:", err);
  }

  const db = loadDatabase();
  return db.settings;
}

export async function updateSettings(updates: Partial<SocietySettings>): Promise<SocietySettings> {
  try {
    const updatePayload: Record<string, any> = {};
    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.tagline !== undefined) updatePayload.tagline = updates.tagline;
    if (updates.establishedYear !== undefined) updatePayload.established_year = updates.establishedYear;
    if (updates.charterYear !== undefined) updatePayload.charter_year = updates.charterYear;
    if (updates.address !== undefined) updatePayload.address = updates.address;
    if (updates.email !== undefined) updatePayload.email = updates.email;
    if (updates.phone !== undefined) updatePayload.phone = updates.phone;
    if (updates.membershipFeeOrdinary !== undefined) updatePayload.membership_fee_ordinary = updates.membershipFeeOrdinary;
    if (updates.membershipFeeLife !== undefined) updatePayload.membership_fee_life = updates.membershipFeeLife;
    if (updates.totalMembersCount !== undefined) updatePayload.total_members_count = updates.totalMembersCount;
    if (updates.superiorCourtEnclave !== undefined) updatePayload.superior_court_enclave = updates.superiorCourtEnclave;

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from("society_settings")
        .update(updatePayload)
        .eq("id", 1)
        .select()
        .single();

      if (!error && data) {
        return mapSupabaseSettings(data);
      }
    }
  } catch (err) {
    console.warn("Supabase update settings failed:", err);
  }

  const db = loadDatabase();
  db.settings = { ...db.settings, ...updates };
  saveDatabase(db);
  return db.settings;
}
