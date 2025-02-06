import { Router } from 'express';
import { createMoodController, createMoodResponseController, getMoodResponseController } from '../controllers/moodControllers';

const router = Router();

router.post('/mood', createMoodController);
router.post('/mood-response', createMoodResponseController);
router.get('/mood-response/:userId', getMoodResponseController);

export default router;