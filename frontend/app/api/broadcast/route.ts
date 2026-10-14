import { NextRequest, NextResponse } from "next/server";
import { getBroadcasts, createBroadcast } from "@/lib/db";

export async function GET() {
  try {
    const broadcasts = await getBroadcasts();
    return NextResponse.json({ success: true, count: broadcasts.length, data: broadcasts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: "Title and announcement content are required" },
        { status: 400 }
      );
    }

    const broadcast = await createBroadcast({
      title: body.title,
      content: body.content,
      channel: body.channel || "BOTH",
      targetTier: body.targetTier || "All Members",
      recipientsCount: body.recipientsCount || 1042,
    });

    return NextResponse.json({ success: true, data: broadcast }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
