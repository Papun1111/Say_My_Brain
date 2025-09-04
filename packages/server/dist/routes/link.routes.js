"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const link_controller_1 = require("../controllers/link.controller");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
// Link CRUD
router.get('/links', link_controller_1.getAllLinks);
router.post('/links', (0, express_validator_1.body)('url').isURL(), link_controller_1.createLink);
router.put('/links/:id', (0, express_validator_1.param)('id').isInt(), link_controller_1.updateLink);
router.delete('/links/:id', (0, express_validator_1.param)('id').isInt(), link_controller_1.deleteLink);
// Preview and Chat
router.post('/preview', (0, express_validator_1.body)('url').isURL(), link_controller_1.getLinkPreview);
router.post('/links/:id/chat', (0, express_validator_1.param)('id').isInt(), (0, express_validator_1.body)('prompt').isString(), chat_controller_1.chatWithLink);
exports.default = router;
