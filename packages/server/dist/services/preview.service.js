"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPreviewData = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const getPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be'))
        return 'YOUTUBE';
    if (url.includes('x.com') || url.includes('twitter.com'))
        return 'X';
    if (url.includes('instagram.com'))
        return 'INSTAGRAM';
    return 'OTHER';
};
const fetchPreviewData = async (url) => {
    try {
        const { data } = await axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        // Extract Open Graph (og) tags, which are standard for previews
        const title = $('meta[property="og:title"]').attr('content') ||
            $('title').text() ||
            'No Title Found';
        const description = $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            '';
        const thumbnailUrl = $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            '';
        // Extract main content as context for the AI
        // This is a simplified approach; more advanced extraction could be used
        const context = $('body').text().replace(/\s\s+/g, ' ').trim().substring(0, 4000);
        return {
            title,
            description,
            thumbnailUrl,
            platform: getPlatform(url),
            context: context || description || title
        };
    }
    catch (error) {
        console.error(`Failed to fetch preview for ${url}:`, error);
        throw new Error('Could not fetch URL metadata.');
    }
};
exports.fetchPreviewData = fetchPreviewData;
