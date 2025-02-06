import { Router } from 'express';
import { createTeamController, addMembersToTeamController, getTeamsController, getTeamController, removeTeamController, removeMembersFromTeamController } from '../controllers/teamControllers';

const router = Router();

router.post('/', createTeamController);
router.get('/', getTeamsController);
router.post('/teams/:teamId/members', addMembersToTeamController);
router.get('/teams/:teamId', getTeamController);
router.delete('/teams/:teamId', removeTeamController);
router.delete('/teams/:teamId/members', removeMembersFromTeamController);

export default router;