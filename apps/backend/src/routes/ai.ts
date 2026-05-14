import { Router } from 'express';
import { handleChat } from '../controllers/aiController';

const router = Router();

router.post('/chat', handleChat);

export default router;
