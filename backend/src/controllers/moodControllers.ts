import { Request, Response } from 'express';
import { createMoodResponse, getMoodResponse, createMood, getTeamMoods, getMoodAnalytics } from '../db';

const emojis = [
    {
        id: 'emoji-001',
        name: ':smile:',
        unicode: '��'
    },
    {
        id: 'emoji-002',
        name: ':smile:',
        unicode: '��'
    },
    {
        id: 'emoji-003',
        name: ':smile:',
        unicode: '��'
    },
    {
        id: 'emoji-004',
        name: ':smile:',
        unicode: '��'
    },
    {
        id: 'emoji-005',
        name: ':smile:',
        unicode: '��'
    },
]

//controller to create moods
export async function createMoodController(req: Request, res: Response) {
    const { moods } = req.body;

    try {
        const moodResponse = await createMood(moods);
        res.status(201).json(moodResponse);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create mood' });
    }
}

export async function getMoodsController(req: Request, res: Response){
    try {
        const moods = await getTeamMoods();
        res.status(200).json(moods);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get moods' });
    }
}

//controller to create mood reponse
export async function createMoodResponseController(req: Request, res: Response) {
    const { userId, mood, teamId, anonymous } = req.body;

    try {
        const moodResponse = await createMoodResponse(userId, mood, teamId, anonymous);
        res.status(201).json(moodResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create mood response' });
    }
}

// Controller to get a mood response
export async function getMoodResponseController(req: Request, res: Response) {
    const { userId } = req.params;

    try {
        const moodResponse = await getMoodResponse(userId);
        if (moodResponse) {
            res.status(200).json(moodResponse);
        } else {
            res.status(404).json({ error: 'Mood response not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get mood response' });
    }
}

//controller to get mood analytics
export async function getMoodAnalyticsController(req: Request, res: Response) {
    try {
        const analytics = await getMoodAnalytics();
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get mood analytics' });
    }
}