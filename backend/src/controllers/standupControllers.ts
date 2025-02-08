import { Request, Response } from 'express';
import { createStandupSetup, createStandupQuestions,  getTeamMembers, getTeamStandups, getStandupResponses, getTeams, getStandupQuestions, getAllStandupResponses, getAllStandupQuestions } from '../db';
import { scheduleReminders } from '../utils/slack_bot';


//function for controller to configure standup
export async function configureStandup(req: Request, res: Response) {
    const { teamId, standupDays, reminderTimes, questions } = req.body;

    try {
        // Create standup setup
        const standupSetup = await createStandupSetup(teamId, standupDays, reminderTimes);

        // Create standup questions
        const standupQuestions = await createStandupQuestions(teamId, questions);

        //now set the reminders
        const reminderScheduler = scheduleReminders({
            days: standupDays,
            times: reminderTimes,
            questions,
            channelId: teamId,
        });

        res.status(200).json({
            message: 'Standup setup and questions configured successfully',
            reminderScheduler,
            standupSetup,
            standupQuestions,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while configuring standup' });
    }
}


//function to get all members whose teams have questions for them but have not submitted any standup response
export async function getStandupRespondents(req: Request, res: Response) {
    const { teamId } = req.params;

    try {
        //first get all standups of a team to know if a standup has been set
        const standups = await getTeamStandups(teamId);

        //if there are no standups respond with 204 no standups set for this team
        if (standups.length === 0) {
            res.status(205).json({ message: 'No standups set for this team' });
            return;
        }

        //get  standup responses for a team
        const standupResponses = await getStandupResponses(teamId);


        //get all members in the team
        const members = await getTeamMembers(teamId);

        // console.log(members);
        // console.log(standupResponses);
        
        // For non-respondents (people who haven't responded today)
        const standupNonRespondents = members.filter(member => {
            const memberResponses = standupResponses.filter(response => response.userId === member);
            return !memberResponses.some(response => 
            new Date(response.createdAt).toDateString() === new Date().toDateString()
            );
        });
        
        // For respondents (people who have responded today)
        const standupRespondents = members.filter(member => {
            const memberResponses = standupResponses.filter(response => response.userId === member);
            return memberResponses.some(response =>
            new Date(response.createdAt).toDateString() === new Date().toDateString()
            );
        });     


        res.status(200).json({ standupNonRespondents, standupRespondents });

       
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while retrieving standup eligible members' });
    }
}


//get all standups for all teams
export async function getAllStandups(req: Request, res: Response) {
    try {
        const teams = await getTeams();
        const allStandups = [];

        for (const team of teams) {
            const standups = await getTeamStandups(team.id);
            const standupQuestions = await getStandupQuestions(team.id);
            const standupResponses = await getStandupResponses(team.id);

            const formattedStandups = standupQuestions.map(question => {
                const responses = standupResponses
                    .filter(response => response.questionId === question.id)
                    .map(response => ({
                        answer: response.answer,
                        options: response.options,
                        userId: response.userId,
                        date: response.createdAt,
                    }));

                return {
                    question: question.questionText,
                    response: responses,
                };
            });

            allStandups.push({
                teamId: team.id,
                teamName: team.teamName,
                standup: formattedStandups,
            });
        }

        res.status(200).json(allStandups);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while retrieving all standups' });
    }
}

//controller to get all standup questions
export async function getAllStandupQuestion(req: Request, res: Response) {
    try {
        const standupQuestions = await getAllStandupQuestions();
        res.status(200).json(standupQuestions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while retrieving all standup questions' });
    }
}

