import { Router } from "express";
import {
  getBroadcastsHandler,
  createBroadcastHandler,
} from "../controllers/broadcast.controller";

const router = Router();

router.get("/", getBroadcastsHandler);
router.post("/", createBroadcastHandler);

export default router;
