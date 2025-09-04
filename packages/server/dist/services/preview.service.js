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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// --- HELPER FUNCTIONS ---
/**
 * Extracts the Video ID from various YouTube URL formats.
 * @param url The full YouTube URL.
 * @returns The video ID or null if not found.
 */
const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};
/**
 * Determines the platform from a given URL.
 */
const getPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be'))
        return 'YOUTUBE';
    if (url.includes('x.com') || url.includes('twitter.com'))
        return 'X';
    if (url.includes('instagram.com'))
        return 'INSTAGRAM';
    return 'OTHER';
};
// --- API-SPECIFIC FETCHERS ---
/**
 * Fetches preview data for a YouTube video using the official YouTube Data API.
 * This is the most reliable method.
 */
const getYouTubePreview = async (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId)
        throw new Error('Invalid YouTube URL');
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn("YOUTUBE_API_KEY is missing. Falling back to scraping.");
        return getGenericPreview(url, 'YOUTUBE');
    }
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    const { data } = await axios_1.default.get(apiUrl);
    const item = data.items[0];
    if (!item)
        throw new Error('YouTube video not found.');
    const snippet = item.snippet;
    return {
        title: snippet.title,
        description: snippet.description,
        thumbnailUrl: snippet.thumbnails.high.url,
        platform: 'YOUTUBE',
        context: snippet.description || snippet.title,
    };
};
/**
 * Fetches preview data from oEmbed-compatible sites like X and Instagram.
 */
const getOEmbedPreview = async (url, platform) => {
    let oembedUrl;
    if (platform === 'X') {
        oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
    }
    else if (platform === 'INSTAGRAM') {
        const appId = process.env.FB_APP_ID;
        const clientToken = process.env.FB_CLIENT_TOKEN;
        if (!appId || !clientToken)
            throw new Error('Facebook App ID and Client Token are required for Instagram previews.');
        oembedUrl = `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${appId}|${clientToken}`;
    }
    else {
        throw new Error('Unsupported oEmbed platform');
    }
    const { data } = await axios_1.default.get(oembedUrl);
    return {
        title: data.title || data.author_name,
        description: `Post by ${data.author_name}`,
        thumbnailUrl: data.thumbnail_url || '',
        platform,
        context: data.title || `Post by ${data.author_name}`,
    };
};
/**
 * A fallback scraper for generic websites that don't have a dedicated API.
 */
const getGenericPreview = async (url, platform) => {
    const { data } = await axios_1.default.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    const $ = cheerio.load(data);
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'No Title Found';
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
    const thumbnailUrl = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || '';
    const context = $('body').text().replace(/\s\s+/g, ' ').trim().substring(0, 4000);
    return { title, description, thumbnailUrl, platform, context: context || description || title };
};
// --- MAIN EXPORTED FUNCTION ---
/**
 * Main function to fetch preview data. It determines the platform and routes
 * the request to the appropriate handler (API, oEmbed, or generic scraper).
 */
const fetchPreviewData = async (url) => {
    const platform = getPlatform(url);
    try {
        switch (platform) {
            case 'YOUTUBE':
                return await getYouTubePreview(url);
            case 'X':
            case 'INSTAGRAM':
                return await getOEmbedPreview(url, platform);
            case 'OTHER':
            default:
                return await getGenericPreview(url, 'OTHER');
        }
    }
    catch (error) {
        console.error(`Failed to fetch preview for ${url} with method ${platform}. Error:`, error.message);
        // As a final fallback, if the specialized method fails, try the generic scraper.
        console.log("Attempting fallback to generic scraping...");
        try {
            return await getGenericPreview(url, platform);
        }
        catch (fallbackError) {
            console.error(`Generic scraping fallback also failed for ${url}. Error:`, fallbackError.message);
            throw new Error('Could not fetch URL metadata with any available method.');
        }
    }
};
exports.fetchPreviewData = fetchPreviewData;
