import { Request, Response } from "express";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../config/db";

export async function getEventsHandler(req: Request, res: Response) {
  try {
    const { category, month, status } = req.query;
    let events = await getEvents();

    if (category && category !== "All") {
      events = events.filter((e) => e.category.toLowerCase().includes(String(category).toLowerCase()));
    }
    if (status && status !== "All") {
      events = events.filter((e) => e.status.toLowerCase() === String(status).toLowerCase());
    }
    if (month && typeof month === "string") {
      events = events.filter((e) => e.startDateTime.startsWith(month));
    }

    return res.json({ success: true, count: events.length, data: events });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createEventHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body.title || !body.startDateTime) {
      return res.status(400).json({ success: false, error: "Title and startDateTime are required." });
    }

    const newEvent = await createEvent({
      title: body.title,
      category: body.category || "Continuing Legal Education",
      venue: body.venue || "Main Auditorium, Superior Courts Complex",
      location: body.location || "Hulftsdorp, Colombo 12",
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime || body.startDateTime,
      price: Number(body.price) || 0,
      status: body.status || "Upcoming",
      description: body.description || "",
      posterUrl: body.posterUrl || "/images/sri-lanka/hero-old-parliament.jpg",
      speakers: Array.isArray(body.speakers) ? body.speakers : [],
      attendeeCount: Number(body.attendeeCount) || 0,
      isMeeting: Boolean(body.isMeeting),
      meetingLink: body.meetingLink || undefined,
      agenda: Array.isArray(body.agenda) ? body.agenda : [],
      color: body.color || "#C5A059",
    });

    return res.status(201).json({ success: true, data: newEvent });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateEventHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ success: false, error: "Invalid event ID" });

    const updated = await updateEvent(id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Event not found" });

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteEventHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ success: false, error: "Invalid event ID" });

    const deleted = await deleteEvent(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Event not found" });

    return res.json({ success: true, message: "Event removed successfully" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
