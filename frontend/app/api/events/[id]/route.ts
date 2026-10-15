import { NextRequest, NextResponse } from "next/server";
import { getEventById, updateEvent, deleteEvent } from "@/lib/db";

async function parseId(req: NextRequest, params: any): Promise<number> {
  const resolved = await Promise.resolve(params);
  let id = parseInt(resolved?.id, 10);
  if (isNaN(id)) {
    const parts = req.nextUrl.pathname.split("/").filter(Boolean);
    id = parseInt(parts[parts.length - 1], 10);
  }
  return isNaN(id) ? 0 : id;
}

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const id = await parseId(req, params);
    const event = await getEventById(id);

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const id = await parseId(req, params);
    const body = await req.json();

    const updated = await updateEvent(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  try {
    const id = await parseId(req, params);
    const deleted = await deleteEvent(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
