import { Pool } from "pg";
import fs from "fs";
import path from "path";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Initialize PostgreSQL Pool if DATABASE_URL is present
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  console.log("🔗 Initialized PostgreSQL Pool for Supabase database.");
} else {
  console.log("⚠️ DATABASE_URL not set; using local persistent JSON database fallback.");
}

// Initialize Supabase JS Client
let supabase: SupabaseClient | null = null;
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://soxycakyzkatpfkpcifm.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNveHljYWt5emthdHBma3BjaWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTI3MzYsImV4cCI6MjEwNzU2ODczNn0.la8TWGQljSixAAFjdti-3GLriIjZ0qjomCRe1HJwX2c";

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log("⚡ Supabase JS Client initialized for:", supabaseUrl);
}

export { pool, supabase };

// ============================================================================
// DATA TYPES
// ============================================================================
export interface CLSEvent {
  id: number;
  title: string;
  category: string;
  venue: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  price: number;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  description: string;
  posterUrl: string;
  speakers?: string[];
  attendeeCount: number;
  isMeeting?: boolean;
  meetingLink?: string;
  agenda?: string[];
  color?: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  date: string;
  venue: string;
  description: string;
  featured: boolean;
  photographer?: string;
  eventId?: number;
}

export interface Member {
  id: number;
  sc_en: string;
  ba_en?: string;
  name: string;
  email: string;
  mobile: string;
  nic?: string;
  gender?: string;
  city?: string;
  practiceArea?: string;
  expertise?: string[];
  membershipTier: "Ordinary" | "Life" | "None";
  status: "Active" | "Inactive" | "Suspended";
  avatarUrl?: string;
  registeredDate?: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  notes?: string;
}

export interface CommitteeOfficer {
  id: number;
  name: string;
  title: string;
  credentials: string;
  court: string;
  image: string;
  bio: string;
  email: string;
  phone: string;
}

export interface BroadcastLog {
  id: number;
  title: string;
  content: string;
  channel: "SMS" | "Email" | "Both";
  targetTier: string;
  recipientsCount: number;
  sentAt: string;
  status: string;
}

export interface SocietySettings {
  id: number;
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

// ============================================================================
// INITIAL SEED DATA
// ============================================================================
const initialEvents: CLSEvent[] = [
  {
    id: 1,
    title: "Golden Jubilee National Law Conference 2026",
    category: "Annual Symposium",
    venue: "Main Auditorium, Superior Courts Complex",
    location: "Hulftsdorp, Colombo 12",
    startDateTime: "2026-10-24T09:00:00Z",
    endDateTime: "2026-10-24T17:30:00Z",
    price: 3500,
    status: "Upcoming",
    description: "Marking 50 years of the Colombo Law Society charter (1975–2025) as the premier branch association of the BASL. Deliberations on judicial independence, modernizing civil procedures, and cross-border commercial arbitration.",
    posterUrl: "/images/events/cls-actual-event.jpg",
    speakers: ["Chief Justice of Sri Lanka", "President, Colombo Law Society", "Senior President's Counsel"],
    attendeeCount: 420,
    isMeeting: false,
    color: "#C5A059",
  },
  {
    id: 2,
    title: "Hulftsdorp Junior Bar Advocacy & Trial Ethics Colloquium",
    category: "Continuing Legal Education",
    venue: "Colombo Law Society Chambers & Auditorium",
    location: "129 Hulftsdorp Street, Colombo 12",
    startDateTime: "2026-11-12T14:00:00Z",
    endDateTime: "2026-11-12T18:00:00Z",
    price: 1500,
    status: "Upcoming",
    description: "Hands-on cross-examination techniques, appellate briefs drafting, and courtroom decorum for junior practitioners entering Colombo chambers.",
    posterUrl: "/images/sri-lanka/colombo-colonnade.jpg",
    speakers: ["Mr. Dilum Jayanath, Deputy President", "Ms. Wardani Karunaratne, Assistant Secretary"],
    attendeeCount: 180,
    isMeeting: false,
    color: "#3B82F6",
  },
  {
    id: 3,
    title: "Executive Working Council Monthly Deliberations",
    category: "Executive Council",
    venue: "Virtual Chamber & Law Society Boardroom",
    location: "Superior Courts Enclave, Colombo 12",
    startDateTime: "2026-10-28T16:00:00Z",
    endDateTime: "2026-10-28T18:30:00Z",
    price: 0,
    status: "Upcoming",
    description: "Monthly council review on Hulftsdorp courtroom infrastructure, welfare endowments, and BASL national council liaison.",
    posterUrl: "/images/branding/cls-crest-gold.png",
    speakers: ["Mr. Sandun Nagahawatta, President", "Mr. Lahiru Welgama, Secretary"],
    attendeeCount: 24,
    isMeeting: true,
    meetingLink: "https://zoom.us/j/94711923531",
    color: "#10B981",
  },
];

const initialGallery: GalleryImage[] = [
  {
    id: 1,
    title: "50th Golden Jubilee Commemoration & Law Conference",
    category: "National Conference",
    imageUrl: "/images/events/cls-actual-event.jpg",
    date: "12 Oct, 2025",
    venue: "Main Auditorium, Superior Courts Complex, Hulftsdorp",
    description: "Inaugural plenary session addressed by the Supreme Court bench and executive officers of the Colombo Law Society.",
    featured: true,
    photographer: "Official Secretariat Media",
    eventId: 1,
  },
  {
    id: 2,
    title: "Opening of the Legal Year Ceremonial Assembly",
    category: "Ceremonial Sittings",
    imageUrl: "/images/sri-lanka/hero-old-parliament.jpg",
    date: "15 Jan, 2026",
    venue: "Ceremonial Courtroom & Hulftsdorp Forecourt",
    description: "Annual traditional procession of the Colombo Bar welcoming new practitioners and honoring senior advocates of over 50 years standing.",
    featured: true,
    photographer: "Chambers Archive",
  },
  {
    id: 3,
    title: "Annual Law Dinner & Bar Excellence Awards Gala",
    category: "Annual Law Dinner",
    imageUrl: "/images/sri-lanka/colombo-civic-palace.jpg",
    date: "28 Nov, 2025",
    venue: "The Grand Ballroom, Galle Face Hotel, Colombo",
    description: "Gala evening celebrating bar milestones with attendance of judicial officers, legal luminaries, and foreign delegates.",
    featured: true,
    photographer: "Colombo Society Media",
  },
  {
    id: 4,
    title: "Constitution Day Colloquium & Public Law Review",
    category: "CLE Masterclass",
    imageUrl: "/images/sri-lanka/independence-hall.jpg",
    date: "04 Feb, 2026",
    venue: "Independence Memorial Hall, Colombo 07",
    description: "Symposium on constitutional guarantees, fundamental rights adjudication, and judicial independence in South Asia.",
    featured: false,
    photographer: "Constitutional Law Forum",
  },
  {
    id: 5,
    title: "Junior Bar Robing & Professional Induction Seminar",
    category: "CLE Masterclass",
    imageUrl: "/images/sri-lanka/colombo-colonnade.jpg",
    date: "22 Mar, 2026",
    venue: "Law Society Auditorium, Hulftsdorp",
    description: "Intensive advocacy workshop and ethics induction for newly admitted Attorneys-at-Law entering Colombo chambers.",
    featured: false,
    photographer: "Junior Bar Committee",
    eventId: 2,
  },
  {
    id: 6,
    title: "Golden Jubilee Charter Commemoration Ceremony",
    category: "National Conference",
    imageUrl: "/images/branding/cls-50th-anniversary.jpg",
    date: "1975 – 2025 Celebration",
    venue: "Hulftsdorp Judicial Hub, Colombo",
    description: "Celebrating 50 years as the premier branch association of the Bar Association of Sri Lanka.",
    featured: true,
    photographer: "Charter Committee",
  },
];

const initialCommittee: CommitteeOfficer[] = [
  {
    id: 1,
    name: "Mr. Sandun Nagahawatta",
    title: "President",
    credentials: "Attorney-at-Law",
    court: "Supreme Court Bar & Hulftsdorp",
    image: "/images/team/sandun-nagahawatta.jpg",
    bio: "Leading the Colombo Law Society with a vision of judicial modernization, advocate welfare, and constitutional independence of the Bar.",
    email: "president@colombolawsociety.com",
    phone: "+94 77 123 4567",
  },
  {
    id: 2,
    name: "Mr. Lahiru Welgama",
    title: "Secretary",
    credentials: "Attorney-at-Law, LL.B (Hons)",
    court: "Superior Courts Complex",
    image: "/images/team/lahiru-walgama.jpg",
    bio: "Coordinating society administration, registrar liaisons, continuing legal education symposia, and Bar Association relations.",
    email: "secretary@colombolawsociety.com",
    phone: "+94 71 892 3341",
  },
  {
    id: 3,
    name: "Ms. Gamali Amarathunga",
    title: "Treasurer",
    credentials: "Attorney-at-Law",
    court: "Colombo Bar & Commercial Benches",
    image: "/images/team/gamali-amarathunga.jpg",
    bio: "Managing the Society's fiscal governance, advocate benevolent trusts, member relief endowments, and annual subscriptions.",
    email: "treasurer@colombolawsociety.com",
    phone: "+94 77 443 2190",
  },
  {
    id: 4,
    name: "Mr. Dilum Jayanath",
    title: "Deputy President",
    credentials: "Attorney-at-Law",
    court: "Appellate & Commercial Courts",
    image: "/images/team/dilum-jayanath.jpg",
    bio: "Overseeing professional standards, courtroom infrastructure initiatives, and judicial service working committee dialogues.",
    email: "deputy.president@colombolawsociety.com",
    phone: "+94 76 554 8192",
  },
  {
    id: 5,
    name: "Ms. Wardani Karunaratne",
    title: "Assistant Secretary",
    credentials: "Attorney-at-Law",
    court: "Commercial High Court & IP Tribunals",
    image: "/images/team/wardani-karunaratne.jpg",
    bio: "Directing junior bar mentorship programs, publications, member communication bulletins, and legal research archives.",
    email: "asst.secretary@colombolawsociety.com",
    phone: "+94 77 912 3456",
  },
  {
    id: 6,
    name: "Mr. Kunchana Samarakoon",
    title: "Assistant Treasurer",
    credentials: "Attorney-at-Law",
    court: "Trial Advocacy & High Courts",
    image: "/images/team/kunchana-samarakoon.jpg",
    bio: "Administering member dues reconciliation, conference ticket logistics, and library acquisition endowments.",
    email: "asst.treasurer@colombolawsociety.com",
    phone: "+94 70 334 1189",
  },
  {
    id: 7,
    name: "Ms. Vindika Subasinghe",
    title: "Immediate Past President",
    credentials: "Attorney-at-Law, LL.M",
    court: "Supreme Court Bar",
    image: "/images/team/vindika-subasinghe.jpg",
    bio: "Distinguished past president providing senior counsel on constitutional governance, BASL liaison, and Bar welfare.",
    email: "vindika.subasinghe@colombolawsociety.com",
    phone: "+94 71 223 8899",
  },
  {
    id: 8,
    name: "Mr. Naveen Shanaka",
    title: "Past Secretary & Senior Council Member",
    credentials: "Attorney-at-Law",
    court: "Commercial High Court",
    image: "/images/team/naveen-shanaka.jpg",
    bio: "Former Secretary and dedicated senior council member directing arbitration symposia and practitioner support.",
    email: "naveen.shanaka@colombolawsociety.com",
    phone: "+94 71 892 3341",
  },
];

const initialMembers: Member[] = [
  {
    id: 1,
    sc_en: "SC/EN/2014/1820",
    name: "Mr. Sandun Nagahawatta",
    email: "sandun.n@colombolaw.org",
    mobile: "+94 77 123 4567",
    nic: "851240982V",
    gender: "Male",
    city: "Colombo",
    practiceArea: "Constitutional & Fundamental Rights",
    membershipTier: "Life",
    status: "Active",
    registeredDate: "12 Jan, 2014",
    membershipStartDate: "2014-01-12",
  },
  {
    id: 2,
    sc_en: "SC/EN/2016/1942",
    name: "Mr. Lahiru Welgama",
    email: "lahiru.w@colombolaw.org",
    mobile: "+94 71 892 3341",
    nic: "891450231V",
    gender: "Male",
    city: "Colombo",
    practiceArea: "Commercial & Corporate Law",
    membershipTier: "Ordinary",
    status: "Active",
    registeredDate: "18 Aug, 2016",
    membershipStartDate: "2026-01-01",
    membershipEndDate: "2026-12-31",
  },
];

const initialBroadcasts: BroadcastLog[] = [
  {
    id: 101,
    title: "Urgent: Supreme Court Hulftsdorp Sitting Protocol",
    content: "Please note the revised courtroom admission registry and digital pass requirements effective 01 November.",
    channel: "SMS",
    targetTier: "All Members",
    recipientsCount: 1042,
    sentAt: "12 Oct, 2026 09:15 AM",
    status: "Delivered",
  },
  {
    id: 102,
    title: "Invitation: 50th Golden Jubilee Law Conference",
    content: "Registrations are now open for the 2026 Annual Law Conference at the Superior Courts Complex.",
    channel: "Email",
    targetTier: "All Members",
    recipientsCount: 1248,
    sentAt: "05 Oct, 2026 14:30 PM",
    status: "Delivered",
  },
];

const initialSettings: SocietySettings = {
  id: 1,
  name: "Colombo Law Society",
  tagline: "Premier & Largest Branch Association of the Bar Association of Sri Lanka",
  establishedYear: 1890,
  charterYear: 1975,
  address: "129, Hulftsdorp Street, Colombo 12, Sri Lanka",
  email: "info@colombolawsociety.com",
  phone: "+94 71 192 3531",
  membershipFeeOrdinary: 2000.0,
  membershipFeeLife: 5000.0,
  totalMembersCount: 1042,
  superiorCourtEnclave: "Supreme Court & Superior Courts Complex, Hulftsdorp",
};

// ============================================================================
// LOCAL PERSISTENT JSON STORE FALLBACK
// ============================================================================
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface LocalDB {
  events: CLSEvent[];
  gallery: GalleryImage[];
  committee: CommitteeOfficer[];
  members: Member[];
  broadcasts: BroadcastLog[];
  settings: SocietySettings;
}

function loadLocalDB(): LocalDB {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial: LocalDB = {
        events: initialEvents,
        gallery: initialGallery,
        committee: initialCommittee,
        members: initialMembers,
        broadcasts: initialBroadcasts,
        settings: initialSettings,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local db.json:", err);
    return {
      events: initialEvents,
      gallery: initialGallery,
      committee: initialCommittee,
      members: initialMembers,
      broadcasts: initialBroadcasts,
      settings: initialSettings,
    };
  }
}

function saveLocalDB(db: LocalDB) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving local db.json:", err);
  }
}

// ============================================================================
// SUPABASE / POSTGRES MAPPERS
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

function mapSupabaseCommittee(row: any): CommitteeOfficer {
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

function mapSupabaseMember(row: any): Member {
  return {
    id: row.id,
    sc_en: row.sc_en,
    ba_en: row.ba_en || undefined,
    name: row.name,
    email: row.email,
    mobile: row.mobile,
    nic: row.nic || undefined,
    gender: row.gender || undefined,
    city: row.city || undefined,
    practiceArea: row.practice_area || undefined,
    expertise: row.expertise || [],
    membershipTier: row.membership_tier || "Ordinary",
    status: row.status || "Active",
    avatarUrl: row.avatar_url || undefined,
    registeredDate: row.registered_date
      ? new Date(row.registered_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : undefined,
    membershipStartDate: row.membership_start_date || undefined,
    membershipEndDate: row.membership_end_date || undefined,
    notes: row.notes || undefined,
  };
}

function mapSupabaseSettings(row: any): SocietySettings {
  return {
    id: row.id || 1,
    name: row.name || initialSettings.name,
    tagline: row.tagline || initialSettings.tagline,
    establishedYear: row.established_year ?? initialSettings.establishedYear,
    charterYear: row.charter_year ?? initialSettings.charterYear,
    address: row.address || initialSettings.address,
    email: row.email || initialSettings.email,
    phone: row.phone || initialSettings.phone,
    membershipFeeOrdinary: Number(row.membership_fee_ordinary ?? initialSettings.membershipFeeOrdinary),
    membershipFeeLife: Number(row.membership_fee_life ?? initialSettings.membershipFeeLife),
    totalMembersCount: Number(row.total_members_count ?? initialSettings.totalMembersCount),
    superiorCourtEnclave: row.superior_court_enclave || initialSettings.superiorCourtEnclave,
  };
}

// ============================================================================
// DATA ACCESS HELPERS
// ============================================================================
export async function getEvents(): Promise<CLSEvent[]> {
  if (pool) {
    try {
      const res = await pool.query(
        "SELECT id, title, category, venue, location, start_date_time as \"startDateTime\", end_date_time as \"endDateTime\", price, status, description, poster_url as \"posterUrl\", speakers, attendee_count as \"attendeeCount\", is_meeting as \"isMeeting\", meeting_link as \"meetingLink\", agenda, color FROM events ORDER BY start_date_time ASC"
      );
      if (res.rows.length > 0) return res.rows;
    } catch (err) {
      console.warn("PostgreSQL query failed, trying Supabase / local DB:", err);
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date_time", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseEvent);
      }
    } catch (err) {
      console.warn("Supabase getEvents failed:", err);
    }
  }

  return loadLocalDB().events;
}

export async function createEvent(data: Omit<CLSEvent, "id">): Promise<CLSEvent> {
  const newEvent: CLSEvent = {
    ...data,
    id: Date.now(),
    attendeeCount: data.attendeeCount ?? 0,
    status: data.status ?? "Upcoming",
  };

  if (pool) {
    try {
      const res = await pool.query(
        `INSERT INTO events (title, category, venue, location, start_date_time, end_date_time, price, status, description, poster_url, speakers, attendee_count, is_meeting, meeting_link, agenda, color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING id, title, category, venue, location, start_date_time as "startDateTime", end_date_time as "endDateTime", price, status, description, poster_url as "posterUrl", speakers, attendee_count as "attendeeCount", is_meeting as "isMeeting", meeting_link as "meetingLink", agenda, color`,
        [
          newEvent.title,
          newEvent.category,
          newEvent.venue,
          newEvent.location,
          newEvent.startDateTime,
          newEvent.endDateTime,
          newEvent.price,
          newEvent.status,
          newEvent.description,
          newEvent.posterUrl,
          newEvent.speakers || [],
          newEvent.attendeeCount,
          newEvent.isMeeting || false,
          newEvent.meetingLink || null,
          newEvent.agenda || [],
          newEvent.color || "#C5A059",
        ]
      );
      return res.rows[0];
    } catch (err) {
      console.warn("PostgreSQL insert failed, using local DB:", err);
    }
  }

  const db = loadLocalDB();
  db.events.unshift(newEvent);
  saveLocalDB(db);
  return newEvent;
}

export async function updateEvent(id: number, updates: Partial<CLSEvent>): Promise<CLSEvent | null> {
  if (pool) {
    try {
      const current = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
      if (current.rows.length > 0) {
        const u = { ...current.rows[0], ...updates };
        const res = await pool.query(
          `UPDATE events SET title = $1, category = $2, venue = $3, start_date_time = $4, end_date_time = $5, price = $6, status = $7, description = $8, poster_url = $9, is_meeting = $10, meeting_link = $11, updated_at = NOW() WHERE id = $12 RETURNING *`,
          [u.title, u.category, u.venue, u.startDateTime, u.endDateTime, u.price, u.status, u.description, u.posterUrl, u.isMeeting, u.meetingLink, id]
        );
        return res.rows[0];
      }
    } catch (err) {
      console.warn("PostgreSQL update failed, using local DB:", err);
    }
  }

  const db = loadLocalDB();
  const idx = db.events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  db.events[idx] = { ...db.events[idx], ...updates };
  saveLocalDB(db);
  return db.events[idx];
}

export async function deleteEvent(id: number): Promise<boolean> {
  if (pool) {
    try {
      const res = await pool.query("DELETE FROM events WHERE id = $1", [id]);
      return (res.rowCount ?? 0) > 0;
    } catch (err) {
      console.warn("PostgreSQL delete failed, using local DB:", err);
    }
  }

  const db = loadLocalDB();
  const len = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  if (db.events.length !== len) {
    saveLocalDB(db);
    return true;
  }
  return false;
}

// GALLERY
export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  if (pool) {
    try {
      const query = category && category !== "All"
        ? "SELECT id, title, category, image_url as \"imageUrl\", thumbnail_url as \"thumbnailUrl\", date_captured as date, venue, description, featured, photographer, event_id as \"eventId\" FROM event_gallery WHERE LOWER(category) = LOWER($1) ORDER BY id DESC"
        : "SELECT id, title, category, image_url as \"imageUrl\", thumbnail_url as \"thumbnailUrl\", date_captured as date, venue, description, featured, photographer, event_id as \"eventId\" FROM event_gallery ORDER BY id DESC";
      const params = category && category !== "All" ? [category] : [];
      const res = await pool.query(query, params);
      if (res.rows.length > 0) return res.rows;
    } catch (err) {
      console.warn("PostgreSQL gallery query failed, using local DB:", err);
    }
  }

  if (supabase) {
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
      console.warn("Supabase getGalleryImages failed:", err);
    }
  }

  const db = loadLocalDB();
  if (category && category !== "All") {
    return db.gallery.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }
  return db.gallery;
}

export async function addGalleryImage(imageData: Omit<GalleryImage, "id">): Promise<GalleryImage> {
  const newImg: GalleryImage = {
    ...imageData,
    id: Date.now(),
    featured: imageData.featured ?? false,
  };

  if (pool) {
    try {
      const res = await pool.query(
        `INSERT INTO event_gallery (title, category, image_url, thumbnail_url, date_captured, venue, description, featured, photographer, event_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, title, category, image_url as "imageUrl", thumbnail_url as "thumbnailUrl", date_captured as date, venue, description, featured, photographer, event_id as "eventId"`,
        [newImg.title, newImg.category, newImg.imageUrl, newImg.thumbnailUrl || newImg.imageUrl, newImg.date, newImg.venue, newImg.description, newImg.featured, newImg.photographer, newImg.eventId || null]
      );
      return res.rows[0];
    } catch (err) {
      console.warn("PostgreSQL gallery insert failed, using local DB:", err);
    }
  }

  const db = loadLocalDB();
  db.gallery.unshift(newImg);
  saveLocalDB(db);
  return newImg;
}

export async function toggleGalleryFeatured(id: number): Promise<GalleryImage | null> {
  const db = loadLocalDB();
  const idx = db.gallery.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  db.gallery[idx].featured = !db.gallery[idx].featured;
  saveLocalDB(db);
  return db.gallery[idx];
}

export async function deleteGalleryImage(id: number): Promise<boolean> {
  if (pool) {
    try {
      const res = await pool.query("DELETE FROM event_gallery WHERE id = $1", [id]);
      return (res.rowCount ?? 0) > 0;
    } catch (err) {
      console.warn("PostgreSQL gallery delete failed, using local DB:", err);
    }
  }

  const db = loadLocalDB();
  const len = db.gallery.length;
  db.gallery = db.gallery.filter((g) => g.id !== id);
  if (db.gallery.length !== len) {
    saveLocalDB(db);
    return true;
  }
  return false;
}

// MEMBERS
export async function getMembers(): Promise<Member[]> {
  if (pool) {
    try {
      const res = await pool.query("SELECT * FROM members ORDER BY id ASC");
      if (res.rows.length > 0) return res.rows.map(mapSupabaseMember);
    } catch (err) {
      console.warn("PostgreSQL members query failed, using Supabase / local DB:", err);
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from("members").select("*").order("id", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseMember);
      }
    } catch (err) {
      console.warn("Supabase getMembers failed:", err);
    }
  }

  return loadLocalDB().members;
}

export async function createMember(data: Omit<Member, "id">): Promise<Member> {
  const db = loadLocalDB();
  const newMember: Member = { ...data, id: Date.now() };
  db.members.unshift(newMember);
  saveLocalDB(db);
  return newMember;
}

export async function updateMember(id: number, updates: Partial<Member>): Promise<Member | null> {
  const db = loadLocalDB();
  const idx = db.members.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  db.members[idx] = { ...db.members[idx], ...updates };
  saveLocalDB(db);
  return db.members[idx];
}

export async function deleteMember(id: number): Promise<boolean> {
  const db = loadLocalDB();
  const len = db.members.length;
  db.members = db.members.filter((m) => m.id !== id);
  if (db.members.length !== len) {
    saveLocalDB(db);
    return true;
  }
  return false;
}

// COMMITTEE
export async function getCommittee(): Promise<CommitteeOfficer[]> {
  if (pool) {
    try {
      const res = await pool.query(
        "SELECT id, name, title, credentials, court, image_url as image, bio, email, phone FROM committee_members WHERE is_active = true ORDER BY order_index ASC"
      );
      if (res.rows.length > 0) return res.rows;
    } catch (err) {
      console.warn("PostgreSQL committee query failed, using Supabase / local DB:", err);
    }
  }

  if (supabase) {
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
      console.warn("Supabase getCommittee failed:", err);
    }
  }

  return loadLocalDB().committee;
}

export async function addCommitteeMember(data: Omit<CommitteeOfficer, "id">): Promise<CommitteeOfficer> {
  const db = loadLocalDB();
  const newOfficer: CommitteeOfficer = { ...data, id: Date.now() };
  db.committee.push(newOfficer);
  saveLocalDB(db);
  return newOfficer;
}

export async function updateCommitteeMember(id: number, updates: Partial<CommitteeOfficer>): Promise<CommitteeOfficer | null> {
  const db = loadLocalDB();
  const idx = db.committee.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  db.committee[idx] = { ...db.committee[idx], ...updates };
  saveLocalDB(db);
  return db.committee[idx];
}

export async function deleteCommitteeMember(id: number): Promise<boolean> {
  const db = loadLocalDB();
  const len = db.committee.length;
  db.committee = db.committee.filter((c) => c.id !== id);
  if (db.committee.length !== len) {
    saveLocalDB(db);
    return true;
  }
  return false;
}

// BROADCASTS
export async function getBroadcasts(): Promise<BroadcastLog[]> {
  return loadLocalDB().broadcasts;
}

export async function createBroadcast(data: Omit<BroadcastLog, "id" | "sentAt" | "status">): Promise<BroadcastLog> {
  const db = loadLocalDB();
  const newB: BroadcastLog = {
    ...data,
    id: Date.now(),
    sentAt: new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "Delivered",
  };
  db.broadcasts.unshift(newB);
  saveLocalDB(db);
  return newB;
}

// SETTINGS
export async function getSettings(): Promise<SocietySettings> {
  if (pool) {
    try {
      const res = await pool.query("SELECT * FROM society_settings LIMIT 1");
      if (res.rows.length > 0) return mapSupabaseSettings(res.rows[0]);
    } catch (err) {
      console.warn("PostgreSQL settings query failed, using Supabase / local DB:", err);
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from("society_settings").select("*").limit(1).single();
      if (!error && data) {
        return mapSupabaseSettings(data);
      }
    } catch (err) {
      console.warn("Supabase getSettings failed:", err);
    }
  }

  return loadLocalDB().settings;
}

export async function updateSettings(updates: Partial<SocietySettings>): Promise<SocietySettings> {
  const db = loadLocalDB();
  db.settings = { ...db.settings, ...updates };
  saveLocalDB(db);
  return db.settings;
}
