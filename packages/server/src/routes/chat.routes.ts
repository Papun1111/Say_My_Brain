import { Router } from 'express';
import { body, param } from 'express-validator';
import { protect } from '../middleware/auth.middleware';
import { chatWithLink } from '../controllers/chat.controller';

const router = Router();

router.post(
  '/:linkId',
  protect, 
  [
 
    param('linkId', 'Link ID must be a valid integer').isInt(),
    body('prompt', 'Prompt is required and must be a string').isString().notEmpty(),
  ],
  chatWithLink 
);

export default router;

