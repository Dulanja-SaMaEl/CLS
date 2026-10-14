import fs from "fs";
import path from "path";
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
        // Ensure all collections exist
        if (!memoryDb.gallery) memoryDb.gallery = initialGalleryImages;
        if (!memoryDb.settings) memoryDb.settings = defaultSettings;
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
// EVENTS API HELPERS
// ============================================================================
export async function getEvents(): Promise<CLSEvent[]> {
  const db = loadDatabase();
  return db.events;
}

export async function getEventById(id: number): Promise<CLSEvent | null> {
  const db = loadDatabase();
  return db.events.find((e) => e.id === id) || null;
}

export async function createEvent(eventData: Omit<CLSEvent, "id">): Promise<CLSEvent> {
  const db = loadDatabase();
  const newEvent: CLSEvent = {
    ...eventData,
    id: Date.now(),
    attendeeCount: eventData.attendeeCount ?? 0,
    status: eventData.status ?? "Upcoming",
  };
  db.events.unshift(newEvent);
  saveDatabase(db);
  return newEvent;
}

export async function updateEvent(id: number, updates: Partial<CLSEvent>): Promise<CLSEvent | null> {
  const db = loadDatabase();
  const index = db.events.findIndex((e) => e.id === id);
  if (index === -1) return null;

  db.events[index] = { ...db.events[index], ...updates };
  saveDatabase(db);
  return db.events[index];
}

export async function deleteEvent(id: number): Promise<boolean> {
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
  const db = loadDatabase();
  if (category && category !== "All") {
    return db.gallery.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }
  return db.gallery;
}

export async function addGalleryImage(imageData: Omit<GalleryImage, "id">): Promise<GalleryImage> {
  const db = loadDatabase();
  const newImage: GalleryImage = {
    ...imageData,
    id: Date.now(),
    featured: imageData.featured ?? false,
  };
  db.gallery.unshift(newImage);
  saveDatabase(db);
  return newImage;
}

export async function deleteGalleryImage(id: number): Promise<boolean> {
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
  const db = loadDatabase();
  return db.members;
}

export async function getMemberById(id: number): Promise<Member | null> {
  const db = loadDatabase();
  return db.members.find((m) => m.id === id) || null;
}

export async function createMember(memberData: Omit<Member, "id">): Promise<Member> {
  const db = loadDatabase();
  const newMember: Member = {
    ...memberData,
    id: Date.now(),
  };
  db.members.unshift(newMember);
  saveDatabase(db);
  return newMember;
}

export async function updateMember(id: number, updates: Partial<Member>): Promise<Member | null> {
  const db = loadDatabase();
  const index = db.members.findIndex((m) => m.id === id);
  if (index === -1) return null;

  db.members[index] = { ...db.members[index], ...updates };
  saveDatabase(db);
  return db.members[index];
}

export async function deleteMember(id: number): Promise<boolean> {
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
  const db = loadDatabase();
  return db.committee;
}

export async function addCommitteeMember(memberData: Omit<typeof executiveCommittee[0], "id">) {
  const db = loadDatabase();
  const newMember = {
    ...memberData,
    id: Date.now(),
  };
  db.committee.push(newMember);
  saveDatabase(db);
  return newMember;
}

export async function updateCommitteeMember(id: number, updates: Partial<typeof executiveCommittee[0]>) {
  const db = loadDatabase();
  const index = db.committee.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.committee[index] = { ...db.committee[index], ...updates };
  saveDatabase(db);
  return db.committee[index];
}

export async function deleteCommitteeMember(id: number): Promise<boolean> {
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
// BROADCAST API HELPERS
// ============================================================================
export async function getBroadcasts(): Promise<BroadcastLog[]> {
  const db = loadDatabase();
  return db.broadcasts;
}

export async function createBroadcast(data: Omit<BroadcastLog, "id" | "sentAt" | "status">): Promise<BroadcastLog> {
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
  db.broadcasts.unshift(newBroadcast);
  saveDatabase(db);
  return newBroadcast;
}

// ============================================================================
// SETTINGS API HELPERS
// ============================================================================
export async function getSettings(): Promise<SocietySettings> {
  const db = loadDatabase();
  return db.settings;
}

export async function updateSettings(updates: Partial<SocietySettings>): Promise<SocietySettings> {
  const db = loadDatabase();
  db.settings = { ...db.settings, ...updates };
  saveDatabase(db);
  return db.settings;
}
