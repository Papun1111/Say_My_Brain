import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { fetchPreviewData } from '../services/preview.service';

// GET /api/links
// FIX: Renamed 'req' to '_req' as it is unused.
export const getAllLinks = async (_req: Request, res: Response) => {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(links);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch links' });
  }
};

// POST /api/links
export const createLink = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // FIX: Added return to ensure function exits.
    return res.status(400).json({ errors: errors.array() });
  }

  const { url } = req.body;

  try {
    const previewData = await fetchPreviewData(url);
    const newLink = await prisma.link.create({
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
  } catch (error) {
    console.error(error);
    // FIX: Added return to ensure function exits.
    return res.status(500).json({ error: 'Failed to create link' });
  }
};

// PUT /api/links/:id
export const updateLink = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedLink = await prisma.link.update({
      where: { id: parseInt(id) },
      data: { title, description },
    });
    return res.json(updatedLink);
  } catch (error) {
    return res.status(404).json({ error: 'Link not found' });
  }
};

// DELETE /api/links/:id
export const deleteLink = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.link.delete({
      where: { id: parseInt(id) },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ error: 'Link not found' });
  }
};

// POST /api/preview
export const getLinkPreview = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // FIX: Added return to ensure function exits.
    return res.status(400).json({ errors: errors.array() });
  }

  const { url } = req.body;
  try {
    const previewData = await fetchPreviewData(url);
    // FIX: Added return to ensure function exits.
    return res.json(previewData);
  } catch (error) {
    // FIX: Added return to ensure function exits.
    return res.status(500).json({ error: 'Failed to fetch preview' });
  }
};
