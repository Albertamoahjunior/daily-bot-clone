import { Router } from 'express';
import { createPollQuestionsController, getTeamPollQuestionsController, createPollResponsesController, getTeamPollResponsesController } from '../controllers/pollControllers';

const router = Router();

router.post('/questions', createPollQuestionsController);
router.get('/questions/:teamId', getTeamPollQuestionsController);
router.post('/responses', createPollResponsesController);
router.get('/responses/:teamId', getTeamPollResponsesController);

export default router;