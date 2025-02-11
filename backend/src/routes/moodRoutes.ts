import { Router } from 'express';
import { createMoodController,getMoodsController, createMoodResponseController, getMoodResponseController, getMoodAnalyticsController, getMoodAnalyticsPerTeamController, getMoodConfigurationController, getAllMoodResponsesGroupedByTeamController} from '../controllers/moodControllers';
import { getAllMoodResponsesGroupedByTeam } from '../db';

const router = Router();

router.post('/', createMoodController);
router.get('/', getMoodsController);
router.get('/mood-response', getAllMoodResponsesGroupedByTeamController)
router.get('/analytics', getMoodAnalyticsController);
router.get('/:teamId/analytics', getMoodAnalyticsPerTeamController);
router.get('/:teamId/configuration', getMoodConfigurationController)
router.post('/mood-response', createMoodResponseController);
router.get('/mood-response/:userId', getMoodResponseController);

export default router;