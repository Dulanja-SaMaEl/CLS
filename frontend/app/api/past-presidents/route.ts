import { NextRequest, NextResponse } from "next/server";
import { getPastPresidents } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const presidents = await getPastPresidents();
    return NextResponse.json({ success: true, count: presidents.length, data: presidents });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
