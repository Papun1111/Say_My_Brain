import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createLink,
  deleteLink,
  getAllLinks,
  getLinkPreview,
  updateLink,
} from '../controllers/link.controller';
import { chatWithLink } from '../controllers/chat.controller';

const router = Router();

// Link CRUD
router.get('/links', getAllLinks);
router.post('/links', body('url').isURL(), createLink);
router.put('/links/:id', param('id').isInt(), updateLink);
router.delete('/links/:id', param('id').isInt(), deleteLink);

// Preview and Chat
router.post('/preview', body('url').isURL(), getLinkPreview);
router.post('/links/:id/chat', param('id').isInt(), body('prompt').isString(), chatWithLink);

export default router;