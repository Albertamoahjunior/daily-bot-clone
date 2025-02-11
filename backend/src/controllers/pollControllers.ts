import { Request, Response } from 'express';
import { createPollQuestions, getTeamPollQuestions, createPollResponses, getTeamPollResponses, getAllPolls } from '../db';
import { createPoll } from '../utils/slack_bot';


// Controller to create poll questions
export const createPollQuestionsController = async (req: Request, res: Response) => {
    const { polls } = req.body;

    try {
        const pollQuestions = await createPollQuestions(polls);
        createPoll(pollQuestions, polls.teamId, polls.question, polls.options, polls.choiceType, polls.anonymous);
        res.status(201).json(`Poll created successfully.`);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create poll questions' });
    }
};

// Controller to get poll questions for a team
export const getTeamPollQuestionsController = async (req: Request, res: Response) => {
    const { teamId } = req.params;

    try {
        const pollQuestions = await getTeamPollQuestions(teamId);
        res.status(200).json(pollQuestions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get poll questions' });
    }
};

// Controller to create poll responses
export const createPollResponsesController = async (req: Request, res: Response) => {
    const { responses } = req.body;

    try {
        const pollResponses = await createPollResponses(responses);
        res.status(201).json(pollResponses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create poll responses' });
    }
};

//controller to get all polls
export const getAllPollsController = async (req: Request, res: Response) => {
    try {
        const polls = await getAllPolls();
        res.status(200).json(polls);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get all polls' });
    }
};

// Controller to get poll responses for a team
export const getTeamPollResponsesController = async (req: Request, res: Response) => {
    const { teamId } = req.params;

    try {
        const pollResponses = await getTeamPollResponses(teamId);
        res.status(200).json(pollResponses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get poll responses' });
    }
};