import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// This interceptor runs before every API request.
// It automatically attaches the user's authentication token to the header.
api.interceptors.request.use(
  (config) => {
    // Get the token from the browser's local storage.
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- TYPE DEFINITIONS ---
// Updated to include all fields from the backend
export interface Link {
  id: number;
  url: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  platform: 'YOUTUBE' | 'X' | 'INSTAGRAM' | 'OTHER';
  embedHtml: string | null;
  createdAt: string;
}

export interface User {
    id: string;
    shareId: string;
}

// --- NEW AUTH & USER API FUNCTIONS ---

/**
 * Registers a new anonymous user with the backend.
 * @returns A promise that resolves to an object containing the user's token and shareId.
 */
export const registerUser = async (): Promise<{ token: string; shareId: string }> => {
    const response = await api.post('/users/register');
    return response.data;
};

/**
 * Fetches the details for the currently authenticated user.
 * @returns A promise that resolves to the User object.
 */
export const getMe = async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
};

/**
 * Fetches all links for a specific shared brain.
 * @param shareId The unique ID of the brain to fetch.
 * @returns A promise that resolves to an array of Link objects.
 */
export const getSharedLinks = async (shareId: string): Promise<Link[]> => {
    const response = await api.get(`/shared/${shareId}`);
    return response.data;
};


// --- UPDATED LINK & CHAT API FUNCTIONS ---

/**
 * Fetches all links for the currently authenticated user.
 */
export const getAllLinksForUser = async (): Promise<Link[]> => {
  const response = await api.get('/links');
  return response.data;
};

/**
 * Creates a new link for the authenticated user.
 */
export const createLink = async (url: string): Promise<Link> => {
  const response = await api.post('/links', { url });
  return response.data;
};

/**
 * Deletes a link for the authenticated user.
 */
export const deleteLink = async (id: number): Promise<void> => {
  await api.delete(`/links/${id}`);
};

/**
 * Sends a chat prompt about a specific link to the Gemini AI.
 */
export const chatWithLink = async (id: number, prompt: string): Promise<{ response: string }> => {
  const response = await api.post(`/chat/${id}`, { prompt });
  return response.data;
};

