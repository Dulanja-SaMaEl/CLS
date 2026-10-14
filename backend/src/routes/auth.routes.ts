import { Router } from "express";
import { signInHandler, signUpHandler, meHandler } from "../controllers/auth.controller";

const router = Router();

router.post("/sign-in", signInHandler);
router.post("/sign-up", signUpHandler);
router.get("/me", meHandler);

export default router;
