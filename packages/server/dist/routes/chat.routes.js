"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
router.post('/:linkId', auth_middleware_1.protect, [
    (0, express_validator_1.param)('linkId', 'Link ID must be a valid integer').isInt(),
    (0, express_validator_1.body)('prompt', 'Prompt is required and must be a string').isString().notEmpty(),
], chat_controller_1.chatWithLink);
exports.default = router;
