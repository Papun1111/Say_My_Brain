import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { getGeminiResponse } from '../lib/gemini';

// FIX: Extend the global Express Request interface to include the 'user' property.
// This tells TypeScript that req.user is a valid property added by our middleware.
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// POST /api/chat/:linkId (Private)
export const chatWithLink = async (req: Request, res: Response) => {
  // 1. Check if user is authenticated (from the 'protect' middleware)
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  const { linkId } = req.params;
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // 2. Find the link AND ensure it belongs to the authenticated user
    const link = await prisma.link.findFirst({
      where: {
        id: parseInt(linkId),
        userId: req.user.id, // This is the crucial security check
      },
    });

    // 3. If no link is found for this user, deny access
    if (!link) {
      return res.status(404).json({ error: 'Link not found or you do not have permission to access it.' });
    }

    // 4. If everything is valid, proceed with the Gemini API call
    const context = link.context || link.description || link.title;
    const fullPrompt = `Based on the following context about a saved link, please answer the user's question concisely.
    
    Context:
    ---
    URL: ${link.url}
    Title: ${link.title}
    Content Summary: ${context}
    ---
    
    User's Question: "${prompt}"
    
    Answer:`;

    const geminiResponse = await getGeminiResponse(fullPrompt);

    return res.json({ response: geminiResponse });
  } catch (error) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({ error: 'Failed to get response from AI' });
  }
};

