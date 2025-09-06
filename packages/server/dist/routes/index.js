"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const link_routes_1 = __importDefault(require("./link.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const chat_routes_1 = __importDefault(require("./chat.routes"));
const link_controller_1 = require("../controllers/link.controller");
const router = (0, express_1.Router)();
router.use("/users", user_routes_1.default);
router.use("/links", link_routes_1.default);
router.use("/chat", chat_routes_1.default);
router.get("/shared/:shareId", link_controller_1.getSharedLinks);
exports.default = router;
