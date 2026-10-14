import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const month = searchParams.get("month"); // YYYY-MM
    const status = searchParams.get("status");

    let events = await getEvents();

    if (category && category !== "All") {
      events = events.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== "All") {
      events = events.filter((e) => e.status.toLowerCase() === status.toLowerCase());
    }

    if (month) {
      events = events.filter((e) => e.startDateTime.startsWith(month));
    }

    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.startDateTime) {
      return NextResponse.json(
        { success: false, error: "Title and start date/time are required" },
        { status: 400 }
      );
    }

    const event = await createEvent({
      title: body.title,
      category: body.category || "General Event",
      venue: body.venue || "Superior Courts Complex, Hulftsdorp",
      location: body.location || "Hulftsdorp, Colombo 12",
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime || body.startDateTime,
      price: typeof body.price === "number" ? body.price : parseFloat(body.price || 0),
      status: body.status || "Upcoming",
      description: body.description || "",
      posterUrl: body.posterUrl || "/images/sri-lanka/hero-old-parliament.jpg",
      speakers: body.speakers || [],
      attendeeCount: body.attendeeCount || 0,
      isMeeting: Boolean(body.isMeeting),
      meetingLink: body.meetingLink || "",
      agenda: body.agenda || [],
      color: body.color || "#C5A059",
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
