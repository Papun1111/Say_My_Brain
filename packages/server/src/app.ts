import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Say My Brain Server is running!');
});

export default app;

