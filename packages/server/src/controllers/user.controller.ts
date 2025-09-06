import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

// Extend the global Express Request interface to include the 'user' property.
// This prevents TypeScript errors when accessing req.user.
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// Helper function to generate a JSON Web Token for a given user ID
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '365d', // Anonymous user tokens are long-lived
  });
};

/**
 * @route   POST /api/users/register
 * @desc    Create a new anonymous user and return a JWT for them.
 * @access  Public
 */
export const createAnonymousUser = async (_req: Request, res: Response) => {
  try {
    // Create a new user with a default (and unique) cuid and shareId
    const user = await prisma.user.create({ data: {} });

    // Generate a token for the new user
    const token = generateToken(user.id);

    // Return the token and user identifiers to the client, which will be stored locally
    return res.status(201).json({ token, userId: user.id, shareId: user.shareId });
  } catch (error) {
    console.error('Error creating anonymous user:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
};


export const getMe = async (req: Request, res: Response) => {
  // The 'protect' middleware should have already added the user object to the request.
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  try {
    // Find the user in the database using the ID from the token payload
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      // Only select the fields that are safe and necessary to send to the client
      select: { id: true, shareId: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's data
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

