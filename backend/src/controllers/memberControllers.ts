import { Request, Response } from 'express';
import { app } from '../config/bot.config';
import { PrismaClient } from '@prisma/client';

const slackClient = app.client;
const prisma = new PrismaClient();

interface SlackMember {
  id?: string;
  real_name?: string;
  profile?: {
    email?: string;
  };
  is_bot?: boolean;
  deleted?: boolean;
}

async function syncSlackMembers() {
  try {
    const response = await slackClient.users.list({});
    const slackMembers = response.members as SlackMember[];
    
    if (!slackMembers) {
      return 'Failed to fetch members from Slack';
    }

    const membersToCreate = [];

    for (const slackMember of slackMembers) {
      // Skip bots, deleted users, and users without required info
      if (!slackMember.id || 
          !slackMember.real_name || 
          slackMember.is_bot || 
          slackMember.deleted || 
          !slackMember.profile?.email) {
        continue;
      }

      const existingMember = await prisma.member.findUnique({
        where: { id: slackMember.id },
      });

      if (!existingMember) {
        membersToCreate.push({
          id: slackMember.id,
          memberName: slackMember.real_name,
          email: slackMember.profile.email,
        });
      } else if (
        existingMember.memberName !== slackMember.real_name || 
        existingMember.email !== slackMember.profile.email
      ) {
        // Update existing member if details have changed
        await prisma.member.update({
          where: { id: slackMember.id },
          data: {
            memberName: slackMember.real_name,
            email: slackMember.profile.email,
          },
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
    console.error('Sync error:', error);
    return 'Failed to synchronize Slack members';
  }
}

export async function getMembersController(req: Request, res: Response) {
  try {
    await syncSlackMembers();
    
    const members = await prisma.member.findMany({
      select: {
        id: true,
        memberName: true,
        email: true,
        teams: true,
      },
    });

    res.status(200).json(members);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ error: 'Failed to get members' });
  }
}