import { Router } from "express";
import { body, param } from "express-validator";
import {
  createLink,
  deleteLink,
  getAllLinksForUser,
  updateLink,
} from "../controllers/link.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router
  .route("/")
  .get(
    protect, // Protect the route
    getAllLinksForUser
  )
  .post(
    protect, // Protect the route
    [body("url", "A valid URL is required").isURL()], // Validate the input
    createLink
  );

router
  .route("/:id")
  .put(
    protect,
    [param("id", "A valid link ID is required").isInt()],
    updateLink
  )
  .delete(
    protect,
    [param("id", "A valid link ID is required").isInt()], // Validate the parameter
    deleteLink
  );

export default router;
