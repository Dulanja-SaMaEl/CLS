import { Router } from "express";
import {
  getEventsHandler,
  createEventHandler,
  updateEventHandler,
  deleteEventHandler,
} from "../controllers/events.controller";

const router = Router();

router.get("/", getEventsHandler);
router.post("/", createEventHandler);
router.get("/:id", updateEventHandler);
router.put("/:id", updateEventHandler);
router.delete("/:id", deleteEventHandler);

export default router;
