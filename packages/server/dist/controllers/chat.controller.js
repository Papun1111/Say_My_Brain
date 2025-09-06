"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithLink = void 0;
const prisma_1 = require("../lib/prisma");
const gemini_1 = require("../lib/gemini");
// POST /api/chat/:linkId (Private)
const chatWithLink = async (req, res) => {
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
        const link = await prisma_1.prisma.link.findFirst({
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
        const geminiResponse = await (0, gemini_1.getGeminiResponse)(fullPrompt);
        return res.json({ response: geminiResponse });
    }
    catch (error) {
        console.error('Error in chat controller:', error);
        return res.status(500).json({ error: 'Failed to get response from AI' });
    }
};
exports.chatWithLink = chatWithLink;
