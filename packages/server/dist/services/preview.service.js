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
/**
 * Fetches preview data for an X (Twitter) URL using the oEmbed API.
 */
const fetchXPreview = async (url) => {
    try {
        const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
        const { data } = await axios_1.default.get(oembedUrl);
        // The main content is in the 'html' property, which we can parse.
        const $ = cheerio.load(data.html);
        const textContent = $('p').text();
        return {
            title: `${data.author_name} on X`,
            description: textContent,
            thumbnailUrl: '', // X oEmbed does not provide a direct thumbnail URL.
            platform: 'X',
            context: textContent,
        };
    }
    catch (error) {
        console.error(`Failed to fetch X oEmbed for ${url}:`, error);
        // Fallback to generic scraping if oEmbed fails
        return fetchGenericPreview(url, 'X');
    }
};
/**
 * Fetches preview data for an Instagram URL.
 * NOTE: This requires a Facebook Developer App ID and Client Token.
 */
const fetchInstagramPreview = async (url) => {
    const { FB_APP_ID, FB_CLIENT_TOKEN } = process.env;
    if (!FB_APP_ID || !FB_CLIENT_TOKEN) {
        console.warn("Facebook App ID or Client Token not configured. Instagram previews will fail.");
        return {
            title: "Instagram Post (Configuration Required)",
            description: "Please configure Facebook Developer credentials in the backend .env file to enable Instagram previews.",
            platform: 'INSTAGRAM',
            context: url,
        };
    }
    try {
        const accessToken = `${FB_APP_ID}|${FB_CLIENT_TOKEN}`;
        const oembedUrl = `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${accessToken}`;
        const { data } = await axios_1.default.get(oembedUrl);
        return {
            title: data.title || `Post by ${data.author_name}`,
            description: data.title,
            thumbnailUrl: data.thumbnail_url,
            platform: 'INSTAGRAM',
            context: data.title,
        };
    }
    catch (error) {
        console.error(`Failed to fetch Instagram oEmbed for ${url}:`, error);
        throw new Error('Could not fetch Instagram metadata.');
    }
};
/**
 * Fetches preview data using a generic HTML scraping method.
 * This is used for YouTube and as a fallback for other platforms.
 */
const fetchGenericPreview = async (url, platform) => {
    try {
        const { data } = await axios_1.default.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'No Title Found';
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
        const thumbnailUrl = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || '';
        const context = $('body').text().replace(/\s\s+/g, ' ').trim().substring(0, 4000);
        return { title, description, thumbnailUrl, platform, context: context || description || title };
    }
    catch (error) {
        console.error(`Failed to fetch generic preview for ${url}:`, error);
        throw new Error('Could not fetch URL metadata.');
    }
};
// Main function that routes to the correct fetcher
const fetchPreviewData = async (url) => {
    const platform = getPlatform(url);
    switch (platform) {
        case 'X':
            return fetchXPreview(url);
        case 'INSTAGRAM':
            return fetchInstagramPreview(url);
        case 'YOUTUBE':
        case 'OTHER':
        default:
            return fetchGenericPreview(url, platform);
    }
};
exports.fetchPreviewData = fetchPreviewData;
