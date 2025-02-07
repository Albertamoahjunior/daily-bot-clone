import { Router } from 'express';
import { createMoodController,getMoodsController, createMoodResponseController, getMoodResponseController, getMoodAnalyticsController, getMoodAnalyticsPerTeamController, getMoodConfigurationController} from '../controllers/moodControllers';

const router = Router();

router.post('/', createMoodController);
router.get('/', getMoodsController);
router.get('/analytics', getMoodAnalyticsController);
router.get('/:teamId/analytics', getMoodAnalyticsPerTeamController);
router.get('/:teamId/configuration', getMoodConfigurationController)
router.post('/mood-response', createMoodResponseController);
router.get('/mood-response/:userId', getMoodResponseController);

export default router;