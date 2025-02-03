import { Request, Response } from 'express';
import { createKudos, getTeamKudos, getUserKudosCount, createKudosCategory, getTeamKudosCategories, getKudosAnalytics } from '../db';

// Controller to create kudos
export async function createKudosController(req: Request, res: Response) {
    const { giverId, receiverId, teamId, reason, category } = req.body;
    try {
        const kudos = await createKudos(giverId, receiverId, teamId, reason, category);
        res.status(201).json(kudos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create kudos' });
    }
}

// Controller to get all kudos for a team
export async function getTeamKudosController(req: Request, res: Response) {
    const { teamId } = req.params;
    try {
        const kudos = await getTeamKudos(teamId);
        res.status(200).json(kudos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get team kudos' });
    }
}

// Controller to count all kudos given by a user
export async function getUserKudosCountController(req: Request, res: Response) {
    const { userId } = req.params;
    try {
        const count = await getUserKudosCount(userId);
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user kudos count' });
    }
}

// Controller to create kudos category for a team
export async function createKudosCategoryController(req: Request, res: Response) {
    const { teamId, category, description } = req.body;
    try {
        const kudosCategory = await createKudosCategory(teamId, category, description);
        res.status(201).json(kudosCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create kudos category' });
    }
}

// Controller to get kudos categories for a team
export async function getTeamKudosCategoriesController(req: Request, res: Response) {
    const { teamId } = req.params;
    try {
        const categories = await getTeamKudosCategories(teamId);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get team kudos categories' });
    }
}

//controller for kudos analytics
export async function getKudosAnalyticsController(req: Request, res: Response) {
    try {
        const analytics = await getKudosAnalytics();
        res.status(200).json(analytics);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get kudos analytics' });
    }
}
