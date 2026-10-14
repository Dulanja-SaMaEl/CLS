import { Request, Response } from "express";
import { getMembers, createMember, updateMember, deleteMember } from "../config/db";

export async function getMembersHandler(req: Request, res: Response) {
  try {
    const { query, tier, status } = req.query;
    let members = await getMembers();

    if (query && typeof query === "string") {
      const q = query.toLowerCase();
      members = members.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.sc_en.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q)
      );
    }

    if (tier && tier !== "All") {
      members = members.filter((m) => m.membershipTier.toLowerCase() === String(tier).toLowerCase());
    }

    if (status && status !== "All") {
      members = members.filter((m) => m.status.toLowerCase() === String(status).toLowerCase());
    }

    return res.json({ success: true, count: members.length, data: members });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createMemberHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body.name || !body.sc_en || !body.email || !body.mobile) {
      return res.status(400).json({
        success: false,
        error: "Name, Supreme Court enrolment (sc_en), email, and mobile are required",
      });
    }

    const newMember = await createMember({
      name: body.name,
      sc_en: body.sc_en,
      ba_en: body.ba_en || undefined,
      email: body.email,
      mobile: body.mobile,
      nic: body.nic || undefined,
      gender: body.gender || "Male",
      city: body.city || "Colombo",
      practiceArea: body.practiceArea || "Commercial & Corporate Law",
      expertise: Array.isArray(body.expertise) ? body.expertise : [],
      membershipTier: body.membershipTier || "Ordinary",
      status: body.status || "Active",
      avatarUrl: body.avatarUrl || "/images/branding/cls-crest-gold.png",
      registeredDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    });

    return res.status(201).json({ success: true, data: newMember });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateMemberHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await updateMember(id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Member not found" });
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteMemberHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await deleteMember(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Member not found" });
    return res.json({ success: true, message: "Member record deleted" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
