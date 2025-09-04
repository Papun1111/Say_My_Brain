"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkPreview = exports.deleteLink = exports.updateLink = exports.createLink = exports.getAllLinks = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = require("../lib/prisma");
const preview_service_1 = require("../services/preview.service");
// GET /api/links
// FIX: Renamed 'req' to '_req' as it is unused.
const getAllLinks = async (_req, res) => {
    try {
        const links = await prisma_1.prisma.link.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return res.json(links);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch links' });
    }
};
exports.getAllLinks = getAllLinks;
// POST /api/links
const createLink = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // FIX: Added return to ensure function exits.
        return res.status(400).json({ errors: errors.array() });
    }
    const { url } = req.body;
    try {
        const previewData = await (0, preview_service_1.fetchPreviewData)(url);
        const newLink = await prisma_1.prisma.link.create({
            data: {
                url,
                title: previewData.title,
                description: previewData.description,
                thumbnailUrl: previewData.thumbnailUrl,
                platform: previewData.platform,
                context: previewData.context,
            },
        });
        // FIX: Added return to ensure function exits.
        return res.status(201).json(newLink);
    }
    catch (error) {
        console.error(error);
        // FIX: Added return to ensure function exits.
        return res.status(500).json({ error: 'Failed to create link' });
    }
};
exports.createLink = createLink;
// PUT /api/links/:id
const updateLink = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const updatedLink = await prisma_1.prisma.link.update({
            where: { id: parseInt(id) },
            data: { title, description },
        });
        return res.json(updatedLink);
    }
    catch (error) {
        return res.status(404).json({ error: 'Link not found' });
    }
};
exports.updateLink = updateLink;
// DELETE /api/links/:id
const deleteLink = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.prisma.link.delete({
            where: { id: parseInt(id) },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(404).json({ error: 'Link not found' });
    }
};
exports.deleteLink = deleteLink;
// POST /api/preview
const getLinkPreview = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // FIX: Added return to ensure function exits.
        return res.status(400).json({ errors: errors.array() });
    }
    const { url } = req.body;
    try {
        const previewData = await (0, preview_service_1.fetchPreviewData)(url);
        // FIX: Added return to ensure function exits.
        return res.json(previewData);
    }
    catch (error) {
        // FIX: Added return to ensure function exits.
        return res.status(500).json({ error: 'Failed to fetch preview' });
    }
};
exports.getLinkPreview = getLinkPreview;
