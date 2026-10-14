import { Request, Response } from "express";
import { getSettings, updateSettings } from "../config/db";

export async function getSettingsHandler(req: Request, res: Response) {
  try {
    const settings = await getSettings();
    return res.json({ success: true, data: settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateSettingsHandler(req: Request, res: Response) {
  try {
    const updated = await updateSettings(req.body);
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
