import { Router } from 'express';
import { createKudosController, getTeamKudosController, getUserKudosCountController, createKudosCategoryController, getTeamKudosCategoriesController } from '../controllers/kudosControllers';

const router = Router();

router.post('/kudos', createKudosController);
router.get('/kudos/team/:teamId', getTeamKudosController);
router.get('/kudos/user/:userId/count', getUserKudosCountController);
router.post('/kudos/category', createKudosCategoryController);
router.get('/kudos/categories/team/:teamId', getTeamKudosCategoriesController);

export default router;