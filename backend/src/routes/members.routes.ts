import { Router } from "express";
import {
  getMembersHandler,
  createMemberHandler,
  updateMemberHandler,
  deleteMemberHandler,
} from "../controllers/members.controller";

const router = Router();

router.get("/", getMembersHandler);
router.post("/", createMemberHandler);
router.put("/:id", updateMemberHandler);
router.delete("/:id", deleteMemberHandler);

export default router;
