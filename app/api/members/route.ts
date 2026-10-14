import { NextRequest, NextResponse } from "next/server";
import { getMembers, createMember } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tier = searchParams.get("tier");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let members = await getMembers();

    if (tier && tier !== "All") {
      members = members.filter((m) => m.membershipTier.toLowerCase() === tier.toLowerCase());
    }

    if (status && status !== "All") {
      members = members.filter((m) => m.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      members = members.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.sc_en.toLowerCase().includes(q) ||
          m.ba_en.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.practiceArea.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: members.length, data: members });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.sc_en || !body.email) {
      return NextResponse.json(
        { success: false, error: "Name, Supreme Court Enrolment, and Email are required" },
        { status: 400 }
      );
    }

    const member = await createMember({
      sc_en: body.sc_en,
      ba_en: body.ba_en || `BASL/${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.name,
      email: body.email,
      mobile: body.mobile || "+94 77 000 0000",
      nic: body.nic || "199000000000",
      gender: body.gender || "Other",
      city: body.city || "Colombo",
      practiceArea: body.practiceArea || "General Practice",
      expertise: body.expertise || ["Advocacy"],
      membershipTier: body.membershipTier || "Ordinary",
      status: body.status || "Active",
      registeredDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      membershipStartDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      membershipEndDate: "31 Dec, 2026",
      avatarUrl: body.avatarUrl || "/images/branding/cls-crest-gold.png",
    });

    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
