import { Router } from 'express';
import { getMembersController } from '../controllers/memberControllers';

const router = Router();

router.get('/', getMembersController);

export default router;