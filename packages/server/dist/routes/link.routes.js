"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const link_controller_1 = require("../controllers/link.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router
    .route("/")
    .get(auth_middleware_1.protect, // Protect the route
link_controller_1.getAllLinksForUser)
    .post(auth_middleware_1.protect, // Protect the route
[(0, express_validator_1.body)("url", "A valid URL is required").isURL()], // Validate the input
link_controller_1.createLink);
router
    .route("/:id")
    .put(auth_middleware_1.protect, [(0, express_validator_1.param)("id", "A valid link ID is required").isInt()], link_controller_1.updateLink)
    .delete(auth_middleware_1.protect, [(0, express_validator_1.param)("id", "A valid link ID is required").isInt()], // Validate the parameter
link_controller_1.deleteLink);
exports.default = router;
