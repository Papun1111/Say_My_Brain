"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiResponse = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in your environment variables.");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const getGeminiResponse = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    }
    catch (error) {
        console.error('Error getting response from Gemini:', error);
        throw new Error('Failed to communicate with the Gemini API');
    }
};
exports.getGeminiResponse = getGeminiResponse;
