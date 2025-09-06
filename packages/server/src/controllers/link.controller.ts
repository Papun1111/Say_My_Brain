import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { fetchPreviewData } from '../services/preview.service';

// FIX: Extend the global Express Request interface to include the 'user' property.
// This tells TypeScript that req.user is a valid property added by our middleware.
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// GET /api/links (Private) - Renamed for clarity
export const getAllLinksForUser = async (req: Request, res: Response) => {
  // 1. Check for authenticated user (from 'protect' middleware)
  if (!req.user) return res.status(401).json({ error: 'Not authorized' });

  try {
    // 2. Fetch only the links that belong to the current user
    const links = await prisma.link.findMany({
      where: { userId: req.user.id }, 
      orderBy: { createdAt: 'desc' },
    });
    return res.json(links);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch links' });
  }
};

// POST /api/links (Private)
export const createLink = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authorized' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { url } = req.body;

  try {
    // 3. Prevent user from saving the same link twice
    const existingLink = await prisma.link.findUnique({
      where: { userId_url: { userId: req.user.id, url } },
    });
    if (existingLink) {
      return res.status(409).json({ error: 'You have already saved this link.' });
    }

    const previewData = await fetchPreviewData(url);
    const newLink = await prisma.link.create({
      data: {
        url,
        title: previewData.title,
        description: previewData.description,
        thumbnailUrl: previewData.thumbnailUrl,
        platform: previewData.platform,
        context: previewData.context,
        // FIX: Use a type assertion to inform TypeScript about the optional 'embedHtml' property.
        embedHtml: (previewData as any).embedHtml,
        // 4. Associate the new link with the authenticated user
        userId: req.user.id, 
      },
    });
    return res.status(201).json(newLink);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create link' });
  }
};

// PUT /api/links/:id (Private)
export const updateLink = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Not authorized' });
    
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        // 5. Verify that the link belongs to the user before updating
        const link = await prisma.link.findFirst({
            where: { id: parseInt(id), userId: req.user.id }
        });

        if (!link) {
            return res.status(404).json({ error: 'Link not found or you do not have permission to edit it.' });
        }

        const updatedLink = await prisma.link.update({
            where: { id: parseInt(id) },
            data: { title, description },
        });
        return res.json(updatedLink);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update link' });
    }
};

// DELETE /api/links/:id (Private)
export const deleteLink = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Not authorized' });
    
    const { id } = req.params;
    try {
        // 6. Verify that the link belongs to the user before deleting
        const link = await prisma.link.findFirst({
            where: { id: parseInt(id), userId: req.user.id }
        });

        if (!link) {
            return res.status(404).json({ error: 'Link not found or you do not have permission to delete it.' });
        }

        await prisma.link.delete({
            where: { id: parseInt(id) },
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete link' });
    }
};

// --- NEW SHARING FEATURE ---

// GET /api/shared/:shareId (Public)
export const getSharedLinks = async (req: Request, res: Response) => {
  const { shareId } = req.params;
  try {
    const user = await prisma.user.findUnique({
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
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch shared links' });
  }
};

