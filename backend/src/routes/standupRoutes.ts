import { Router } from 'express';
import { configureStandup, getStandupRespondents, getAllStandups, getAllStandupQuestion} from '../controllers/standupControllers';

const router = Router();

// Route to configure standup
router.post('/configure', configureStandup);
router.get('/respondents/:teamId', getStandupRespondents)
router.get('/all-standups', getAllStandups)
router.get('/all-questions', getAllStandupQuestion);

export default router;