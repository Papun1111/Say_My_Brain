"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithLink = void 0;
const prisma_1 = require("../lib/prisma");
const gemini_1 = require("../lib/gemini");
// POST /api/links/:id/chat
const chatWithLink = async (req, res) => {
    const { id } = req.params;
    const { prompt } = req.body;
    if (!prompt) {
        // FIX: Added return to ensure the function exits here.
        return res.status(400).json({ error: 'Prompt is required' });
    }
    try {
        const link = await prisma_1.prisma.link.findUnique({
            where: { id: parseInt(id) },
        });
        if (!link) {
            // FIX: Added return to ensure the function exits here.
            return res.status(404).json({ error: 'Link not found' });
        }
        const context = link.context || link.description || link.title;
        const fullPrompt = `Based on the following context, please answer the user's question.
    
    Context:
    ---
    URL: ${link.url}
    Title: ${link.title}
    Content: ${context}
    ---
    
    User's Question: "${prompt}"
    
    Answer:`;
        const geminiResponse = await (0, gemini_1.getGeminiResponse)(fullPrompt);
        // FIX: Added return to ensure the function exits here.
        return res.json({ response: geminiResponse });
    }
    catch (error) {
        console.error('Error in chat controller:', error);
        // FIX: Added return to ensure the function exits here.
        return res.status(500).json({ error: 'Failed to get response from AI' });
    }
};
exports.chatWithLink = chatWithLink;
