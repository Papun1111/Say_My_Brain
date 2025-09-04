import axios from 'axios';
import * as cheerio from 'cheerio';
import { Platform } from '@prisma/client';

interface PreviewData {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  platform: Platform;
  context: string; // The text content for Gemini
}

const getPlatform = (url: string): Platform => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YOUTUBE';
  if (url.includes('x.com') || url.includes('twitter.com')) return 'X';
  if (url.includes('instagram.com')) return 'INSTAGRAM';
  return 'OTHER';
};

export const fetchPreviewData = async (url: string): Promise<PreviewData> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(data);

    // Extract Open Graph (og) tags, which are standard for previews
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      'No Title Found';

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    const thumbnailUrl =
      $('meta[property="og:image"]').attr('content') ||
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
  } catch (error) {
    console.error(`Failed to fetch preview for ${url}:`, error);
    throw new Error('Could not fetch URL metadata.');
  }
};