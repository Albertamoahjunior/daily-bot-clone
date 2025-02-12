import { Request, Response } from 'express';
import { createTeam, addMembersToTeam, getTeams, getTeam, removeTeam, removeMembersFromTeam, updateTeam, getTeamReport } from '../db';
import { app } from '../config/bot.config';

const slackClient = app.client;

// Controller to create a new team
export async function createTeamController(req: Request, res: Response) {
    const { teamName, timezone } = req.body;
    try {
        //create a channel in slack with the name teamName and the timezone and return the channelId
        const channel = await slackClient.conversations.create({
            name: teamName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            is_private: false,
        });
        const channelId = channel.channel?.id;

        const team = await createTeam(channelId as string, teamName, timezone);
        res.status(201).json(team);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create team' });
    }
}


// Controller to add members to a team
export async function addMembersToTeamController(req: Request, res: Response) {
    const { teamId } = req.params;
    const { members } = req.body;
    try {
        const updatedTeam = await addMembersToTeam(teamId, members);

        //first invite the members to the channel
        for (const member of members) {
            await slackClient.conversations.invite({
                channel: teamId,
                users: member,
            });
        }

        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add members to team' });
    }
}

// Controller to get all teams
export async function getTeamsController(req: Request, res: Response) {
    try {
        const teams = await getTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get teams' });
    }
}

// Controller to get a specific team by ID
export async function getTeamController(req: Request, res: Response) {
    const { teamId } = req.params;
    try {
        const team = await getTeam(teamId);
        if (team) {
            res.status(200).json(team);
        } else {
            res.status(404).json({ error: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get team' });
    }
}

// Controller to remove a team by ID
export async function removeTeamController(req: Request, res: Response) {
    const { teamId } = req.params;
    try {
        //first archive channel
        await slackClient.conversations.archive({ channel: teamId });

        //then delete team from the database
        await removeTeam(teamId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove team' });
    }
}

//Controller to remove a member from a team
export async function removeMembersFromTeamController(req: Request, res: Response) {
    const { teamId } = req.params;
    const { members } = req.body;
    try {
        //first remove the member from the channel(using a for _ for)
        for (const member of members) {
            await slackClient.conversations.kick({
                channel: teamId,
                user: member,
            });
        }

        const updatedTeam = await removeMembersFromTeam(teamId, members);
        res.status(200).json(updatedTeam);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to remove member from team' });
    }
}

//team controller to update team details in database and on slack
// Controller to update team details
export async function updateTeamController(req: Request, res: Response) {
    const { teamId } = req.params;
    const { teamName, timezone, members } = req.body;
    try {
        // Update the team details in the database
        const updatedTeam = await updateTeam(teamId, teamName, timezone);

         //get all members that belong to a certain channel
         const currentMembers = await slackClient.conversations.members({ channel: teamId });
         const currentMembersIds = currentMembers.members;

        if (currentMembersIds) {
            // If there are members to be removed, remove them
            const membersToRemove = currentMembersIds.filter((member) => !members.includes(member));
            for (const member of membersToRemove) {
                await slackClient.conversations.kick({
                    channel: teamId,
                    user: member,
                });
            }

            // If there are new members, invite them
            for (const member of currentMembersIds) {
                if (!members.includes(member)) {
                    await slackClient.conversations.invite({
                        channel: teamId,
                        users: member,
                    });
                }
            }
        }


        // Update the channel name on Slack
        await slackClient.conversations.rename({
            channel: teamId,
            name: teamName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        });

        res.status(200).json(updatedTeam);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update team' });
    }
}

//controller function to get team report
export async function getTeamReportController(req: Request, res: Response) {
    const { teamId } = req.params;
    try {
        const teamReport = await getTeamReport(teamId);
        res.status(200).json(teamReport);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get team report' });
    }
}