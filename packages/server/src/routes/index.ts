import { Router } from "express";
import linkRoutes from "./link.routes";
import userRoutes from "./user.routes";
import chatRoutes from "./chat.routes";
import { getSharedLinks } from "../controllers/link.controller";

const router = Router();

router.use("/users", userRoutes);

router.use("/links", linkRoutes);

router.use("/chat", chatRoutes);

router.get("/shared/:shareId", getSharedLinks);

export default router;
