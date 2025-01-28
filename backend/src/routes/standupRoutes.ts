import { Router } from 'express';
import { configureStandup } from '../controllers/standupControllers';

const router = Router();

// Route to configure standup
router.post('/configure', configureStandup);

export default router;