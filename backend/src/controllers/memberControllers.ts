import { Request, Response } from 'express';
import { app } from '../config/bot.config';
import { PrismaClient } from '@prisma/client';

const slackClient = app.client;

//add members to the database
const prisma = new PrismaClient();

//get and add members
async function syncSlackMembers() {
    try {
        const response = await slackClient.users.list({});
        const slackMembers = response.members;

        if (!slackMembers) {
            return 'Failed to fetch members from Slack';
        }

        const membersToCreate = [];

        for (const slackMember of slackMembers) {
            if (!slackMember.id || !slackMember.real_name) continue;

            const existingMember = await prisma.member.findUnique({
                where: { id: slackMember.id },
            });

            if (!existingMember) {
                membersToCreate.push({
                    id: slackMember.id,
                    memberName: slackMember.real_name,
                });
            }
        }

        if (membersToCreate.length > 0) {
            await prisma.member.createMany({
                data: membersToCreate,
            });
        }

        return 'Slack members synchronized successfully';
    } catch (error) {
        return 'Failed to synchronize Slack members' ;
    }
}

//controller to get members from database
export async function getMembersController(req: Request, res: Response) {
    try {
        //first sync members
        await syncSlackMembers();

        //then get members
        const members = await prisma.member.findMany({
            select: {
                id: true,
                memberName: true,
            },
        });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get members' });
    }
}