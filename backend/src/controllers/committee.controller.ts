import { Request, Response } from "express";
import {
  getCommittee,
  addCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
} from "../config/db";

export async function getCommitteeHandler(req: Request, res: Response) {
  try {
    const committee = await getCommittee();
    return res.json({ success: true, count: committee.length, data: committee });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function addCommitteeHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body.name || !body.title) {
      return res.status(400).json({ success: false, error: "Name and title are required" });
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

    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateCommitteeHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.body.id || req.params.id, 10);
    if (!id) return res.status(400).json({ success: false, error: "Member ID is required" });

    const updated = await updateCommitteeMember(id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Council member not found" });

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteCommitteeHandler(req: Request, res: Response) {
  try {
    const id = parseInt(String(req.query.id || req.params.id), 10);
    if (!id) return res.status(400).json({ success: false, error: "Member ID is required" });

    const deleted = await deleteCommitteeMember(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Member not found" });

    return res.json({ success: true, message: "Council officer removed" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
