import { NextRequest, NextResponse } from "next/server";
import {
  getCommittee,
  updateCommitteeMember,
  addCommitteeMember,
  deleteCommitteeMember,
} from "@/lib/db";

export async function GET() {
  try {
    const committee = await getCommittee();
    return NextResponse.json({ success: true, data: committee });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.title) {
      return NextResponse.json(
        { success: false, error: "Name and title are required" },
        { status: 400 }
      );
    }

    const created = await addCommitteeMember({
      name: body.name,
      title: body.title,
      credentials: body.credentials || "Attorney-at-Law",
      court: body.court || "Hulftsdorp Superior Courts Complex",
      image: body.image || "/images/branding/cls-crest-gold.png",
      bio: body.bio || "",
      email: body.email || "",
      phone: body.phone || "",
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = parseInt(body.id, 10);

    if (!id) {
      return NextResponse.json({ success: false, error: "Member ID is required" }, { status: 400 });
    }

    const updated = await updateCommitteeMember(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Committee member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ success: false, error: "Member ID is required" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    const deleted = await deleteCommitteeMember(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Committee member removed" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
