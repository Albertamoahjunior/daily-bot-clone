import { Router } from 'express';
import { createPollQuestionsController, getTeamPollQuestionsController, createPollResponsesController, getTeamPollResponsesController, getAllPollsController } from '../controllers/pollControllers';

const router = Router();

router.post('/questions', createPollQuestionsController);
router.get('/questions/:teamId', getTeamPollQuestionsController);
router.post('/responses', createPollResponsesController);
router.get('/responses/:teamId', getTeamPollResponsesController);
router.get('/', getAllPollsController);

export default router;