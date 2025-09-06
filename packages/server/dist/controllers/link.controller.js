"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedLinks = exports.deleteLink = exports.updateLink = exports.createLink = exports.getAllLinksForUser = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = require("../lib/prisma");
const preview_service_1 = require("../services/preview.service");
// GET /api/links (Private) - Renamed for clarity
const getAllLinksForUser = async (req, res) => {
    // 1. Check for authenticated user (from 'protect' middleware)
    if (!req.user)
        return res.status(401).json({ error: 'Not authorized' });
    try {
        // 2. Fetch only the links that belong to the current user
        const links = await prisma_1.prisma.link.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        return res.json(links);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch links' });
    }
};
exports.getAllLinksForUser = getAllLinksForUser;
// POST /api/links (Private)
const createLink = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Not authorized' });
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { url } = req.body;
    try {
        // 3. Prevent user from saving the same link twice
        const existingLink = await prisma_1.prisma.link.findUnique({
            where: { userId_url: { userId: req.user.id, url } },
        });
        if (existingLink) {
            return res.status(409).json({ error: 'You have already saved this link.' });
        }
        const previewData = await (0, preview_service_1.fetchPreviewData)(url);
        const newLink = await prisma_1.prisma.link.create({
            data: {
                url,
                title: previewData.title,
                description: previewData.description,
                thumbnailUrl: previewData.thumbnailUrl,
                platform: previewData.platform,
                context: previewData.context,
                // FIX: Use a type assertion to inform TypeScript about the optional 'embedHtml' property.
                embedHtml: previewData.embedHtml,
                // 4. Associate the new link with the authenticated user
                userId: req.user.id,
            },
        });
        return res.status(201).json(newLink);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create link' });
    }
};
exports.createLink = createLink;
// PUT /api/links/:id (Private)
const updateLink = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Not authorized' });
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        // 5. Verify that the link belongs to the user before updating
        const link = await prisma_1.prisma.link.findFirst({
            where: { id: parseInt(id), userId: req.user.id }
        });
        if (!link) {
            return res.status(404).json({ error: 'Link not found or you do not have permission to edit it.' });
        }
        const updatedLink = await prisma_1.prisma.link.update({
            where: { id: parseInt(id) },
            data: { title, description },
        });
        return res.json(updatedLink);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to update link' });
    }
};
exports.updateLink = updateLink;
// DELETE /api/links/:id (Private)
const deleteLink = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Not authorized' });
    const { id } = req.params;
    try {
        // 6. Verify that the link belongs to the user before deleting
        const link = await prisma_1.prisma.link.findFirst({
            where: { id: parseInt(id), userId: req.user.id }
        });
        if (!link) {
            return res.status(404).json({ error: 'Link not found or you do not have permission to delete it.' });
        }
        await prisma_1.prisma.link.delete({
            where: { id: parseInt(id) },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to delete link' });
    }
};
exports.deleteLink = deleteLink;
// --- NEW SHARING FEATURE ---
// GET /api/shared/:shareId (Public)
const getSharedLinks = async (req, res) => {
    const { shareId } = req.params;
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { shareId },
            include: {
                links: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'Shared brain not found' });
        }
        return res.json(user.links);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch shared links' });
    }
};
exports.getSharedLinks = getSharedLinks;
