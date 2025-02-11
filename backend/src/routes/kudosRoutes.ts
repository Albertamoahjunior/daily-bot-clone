import { Router } from 'express';
import { createKudosController, getTeamKudosController, getUserKudosCountController, createKudosCategoryController, getTeamKudosCategoriesController, getKudosAnalyticsController , getAllKudosController} from '../controllers/kudosControllers';

const router = Router();

router.post('/', createKudosController);
router.get('/all', getAllKudosController);
router.get('/team/:teamId', getTeamKudosController);
router.get('/user/:userId/count', getUserKudosCountController);
router.post('/category', createKudosCategoryController);
router.get('/categories/team/:teamId', getTeamKudosCategoriesController);
router.get('/analytics', getKudosAnalyticsController);

export default router;