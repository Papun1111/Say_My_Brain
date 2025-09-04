import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api',
});

// Types based on Prisma schema
export interface Link {
  id: number;
  url: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  platform: 'YOUTUBE' | 'X' | 'INSTAGRAM' | 'OTHER';
  createdAt: string;
}

export interface PreviewData {
  title: string;
  description?: string;
  thumbnailUrl?: string;
}

// API Functions

/**
 * Fetches all links from the server.
 * @returns A promise that resolves to an array of Link objects.
 */
export const getAllLinks = async (): Promise<Link[]> => {
  const response = await api.get('/links');
  return response.data;
};

/**
 * Creates a new link by sending a URL to the server.
 * @param url - The URL of the link to save.
 * @returns A promise that resolves to the newly created Link object.
 */
export const createLink = async (url: string): Promise<Link> => {
  const response = await api.post('/links', { url });
  return response.data;
};

/**
 * Deletes a link by its ID.
 * @param id - The ID of the link to delete.
 */
export const deleteLink = async (id: number): Promise<void> => {
  await api.delete(`/links/${id}`);
};

/**
 * Fetches a preview for a given URL.
 * @param url - The URL to get a preview for.
 * @returns A promise that resolves to the preview data.
 */
export const getPreview = async (url: string): Promise<PreviewData> => {
  const response = await api.post('/preview', { url });
  return response.data;
};

/**
 * Sends a chat prompt related to a specific link and gets an AI response.
 * @param id - The ID of the link to chat about.
 * @param prompt - The user's question or prompt.
 * @returns A promise that resolves to an object containing the AI's response.
 */
export const chatWithLink = async (id: number, prompt: string): Promise<{ response: string }> => {
  const response = await api.post(`/links/${id}/chat`, { prompt });
  return response.data;
};

