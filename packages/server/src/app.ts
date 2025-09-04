import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Check
// FIX: Renamed 'req' to '_req' to indicate it's an unused parameter.
app.get('/', (_req: Request, res: Response) => {
  res.send('Second Brain Server is running!');
});

export default app;
