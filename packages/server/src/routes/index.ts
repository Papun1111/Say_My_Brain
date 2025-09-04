import { Router } from 'express';
import linkRoutes from './link.routes';

const router = Router();

router.use('/', linkRoutes);

export default router;