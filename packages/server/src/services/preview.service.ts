import axios from 'axios';
import * as cheerio from 'cheerio';
import { Platform } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// --- TYPE DEFINITIONS ---
interface PreviewData {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  platform: Platform;
  context: string;
  embedHtml?: string;
}

// --- HELPER & SANITIZING FUNCTIONS ---

/**
 * **REFINED:** This function is updated to be as robust as possible,
 * prioritizing the reliable regex method to handle all YouTube URL formats.
 * @param url The full YouTube URL.
 * @returns The video ID or null if not found.
 */
const getYouTubeVideoId = (url: string): string | null => {
  // This regex is a reliable method to capture the video ID from various URL formats.
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }

  // As a fallback, try parsing with the URL object for any other edge cases.
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.substring(1);
    }
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }
  } catch (error) {
    console.error("Could not parse YouTube URL:", error);
  }
  
  return null; // Return null if no ID could be extracted
};


const sanitizeInstagramUrl = (url: string): string => {
  const match = url.match(/(https:\/\/(?:www\.)?instagram\.com\/(p|reel|tv|stories)\/[a-zA-Z0-9\-_]+)/);
  return match?.[0] || url;
};

const sanitizeXUrl = (url: string): string => {
  const match = url.match(/(https:\/\/(?:www\.)?(?:twitter|x)\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+)/);
  return match?.[0] || url;
};

const getPlatform = (url: string): Platform => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YOUTUBE';
  if (url.includes('x.com') || url.includes('twitter.com')) return 'X';
  if (url.includes('instagram.com')) return 'INSTAGRAM';
  return 'OTHER';
};


// --- API-SPECIFIC FETCHERS ---

const getYouTubePreview = async (url:string): Promise<PreviewData> => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn("YOUTUBE_API_KEY is missing. Falling back to scraping.");
        return getGenericPreview(url, 'YOUTUBE');
    }
    
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    const { data } = await axios.get(apiUrl);
    const item = data.items[0];
    if (!item) throw new Error('YouTube video not found.');

    const snippet = item.snippet;
    return {
        title: snippet.title,
        description: snippet.description,
        thumbnailUrl: snippet.thumbnails.high.url,
        platform: 'YOUTUBE',
        context: snippet.description || snippet.title,
    };
}

const getOEmbedPreview = async (url: string, platform: Platform): Promise<PreviewData> => {
    let finalUrl = url;
    if (platform === 'INSTAGRAM') {
        finalUrl = sanitizeInstagramUrl(url);
    } else if (platform === 'X') {
        finalUrl = sanitizeXUrl(url);
    }

    let oembedUrl: string;
    if (platform === 'X') {
        oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(finalUrl)}`;
    } else if (platform === 'INSTAGRAM') {
        const { FB_APP_ID, FB_CLIENT_TOKEN } = process.env;
        if (!FB_APP_ID || !FB_CLIENT_TOKEN) throw new Error('Facebook credentials are required for Instagram previews.');
        oembedUrl = `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(finalUrl)}&access_token=${FB_APP_ID}|${FB_CLIENT_TOKEN}`;
    } else {
        throw new Error('Unsupported oEmbed platform');
    }

    const { data } = await axios.get(oembedUrl);

    if (platform === 'X') {
        return {
            title: `Post by ${data.author_name}`,
            description: data.html.replace(/<[^>]*>?/gm, '').trim(),
            platform,
            context: data.html.replace(/<[^>]*>?/gm, '').trim(),
            embedHtml: data.html,
            thumbnailUrl: '',
        };
    }

    return {
        title: `Post by ${data.author_name}`,
        description: data.title || '',
        thumbnailUrl: data.thumbnail_url || '',
        platform,
        context: data.title || `Post by ${data.author_name}`,
    };
};

const getGenericPreview = async (url: string, platform: Platform): Promise<PreviewData> => {
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
  const $ = cheerio.load(data);
  const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'No Title Found';
  const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
  const thumbnailUrl = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || '';
  const context = $('body').text().replace(/\s\s+/g, ' ').trim().substring(0, 4000);
  return { title, description, thumbnailUrl, platform, context: context || description || title };
};


// --- MAIN EXPORTED FUNCTION ---

export const fetchPreviewData = async (url: string): Promise<PreviewData> => {
  const platform = getPlatform(url);
  try {
    switch (platform) {
      case 'YOUTUBE': return await getYouTubePreview(url);
      case 'X':
      case 'INSTAGRAM': return await getOEmbedPreview(url, platform);
      default: return await getGenericPreview(url, 'OTHER');
    }
  } catch (error) {
    console.error(`Failed to fetch preview for ${url} with method ${platform}. Error:`, (error as any).message);
    return getGenericPreview(url, platform);
  }
};

