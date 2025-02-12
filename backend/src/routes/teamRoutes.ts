import { Router } from 'express';
import { createTeamController, addMembersToTeamController, getTeamsController, getTeamController, removeTeamController, removeMembersFromTeamController, updateTeamController, getTeamReportController } from '../controllers/teamControllers';
//import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/', createTeamController);
router.get('/', getTeamsController);
router.put('/teams/:teamId', updateTeamController);
router.post('/teams/:teamId/members', addMembersToTeamController);
router.get('/teams/:teamId', getTeamController);
router.delete('/teams/:teamId', removeTeamController);
router.delete('/teams/:teamId/members', removeMembersFromTeamController);
router.get('/report/:teamId', getTeamReportController)

export default router;