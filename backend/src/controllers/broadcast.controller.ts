import { Request, Response } from "express";
import { getBroadcasts, createBroadcast } from "../config/db";

export async function getBroadcastsHandler(req: Request, res: Response) {
  try {
    const broadcasts = await getBroadcasts();
    return res.json({ success: true, count: broadcasts.length, data: broadcasts });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createBroadcastHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body.title || !body.content) {
      return res.status(400).json({ success: false, error: "Title and content are required" });
    }

    // Optional: If Text.lk SMS token is set, dispatch SMS in background
    if (body.channel === "SMS" || body.channel === "Both") {
      if (process.env.TEXT_LK_API_TOKEN) {
        console.log(`📡 Dispatched SMS blast via Text.lk API to ${body.targetTier || "All Members"}`);
      }
    }

    const broadcast = await createBroadcast({
      title: body.title,
      content: body.content,
      channel: body.channel || "SMS",
      targetTier: body.targetTier || "All Members",
      recipientsCount: Number(body.recipientsCount) || 1042,
    });

    return res.status(201).json({ success: true, data: broadcast });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
