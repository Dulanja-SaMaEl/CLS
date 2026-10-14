import { Router } from "express";
import {
  getCommitteeHandler,
  addCommitteeHandler,
  updateCommitteeHandler,
  deleteCommitteeHandler,
} from "../controllers/committee.controller";

const router = Router();

router.get("/", getCommitteeHandler);
router.post("/", addCommitteeHandler);
router.put("/", updateCommitteeHandler);
router.put("/:id", updateCommitteeHandler);
router.delete("/", deleteCommitteeHandler);
router.delete("/:id", deleteCommitteeHandler);

export default router;
