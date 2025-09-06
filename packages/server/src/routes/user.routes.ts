import { Router } from "express";
import { createAnonymousUser, getMe } from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", createAnonymousUser);

router.get("/me", protect, getMe);

export default router;
