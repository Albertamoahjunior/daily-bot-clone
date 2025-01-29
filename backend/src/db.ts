import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//create team
async function createTeam(teamId: string, teamName: string, timeZone: string) {
  const team = await prisma.team.create({
    data: {
      id: teamId,
      teamName,
      timezone: timeZone,
    },
  });
  return team;
}

//add members 
async function addMembersToTeam(teamId: string, memberIds: string[]) {
  //update team with members
  
  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: {
      members: memberIds,
    },
  });

  //after update members with the team ids
  for (const memberId of memberIds) {
    await prisma.member.update({
      where: { id: memberId },
      data: { teams: { push: teamId } },
    });
  }
  return updatedTeam;
}

//remove member from team
async function removeMembersFromTeam(teamId: string, memberIds: string[]) {
  //update team to remove members
  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: {
      members: {
        set: (await prisma.team.findUnique({
          where: { id: teamId },
          select: { members: true },
        }))?.members.filter(member => !memberIds.includes(member)) || [],
      },
    },
  });

  //update members to remove the team id
  for (const memberId of memberIds) {
    await prisma.member.update({
      where: { id: memberId },
      data: {
        teams: {
          set: (await prisma.member.findUnique({
            where: { id: memberId },
            select: { teams: true },
          }))?.teams.filter(team => team !== teamId) || [],
        },
      },
    });
  }
  return updatedTeam;
}

//create members in a batch
async function createMembers(members: { id: string; memberName: string }[]) {
  const createdMembers = await prisma.member.createMany({
    data: members,
  });
  return createdMembers;
}



//get members endpoint
async function getMembers() {
  const members = await prisma.member.findMany({
    select: {
      id: true,
    },
  });
  return members;
}

//get a member
async function getMember(memberId: string) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  });
  return member;
}



//get teams 
async function getTeams() {
  const teams = await prisma.team.findMany({
    select: {
      id: true,
      teamName: true,
      members: true,
    },
  });
  return teams;
}

//get a team
async function getTeam(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      teamName: true,
      timezone: true,
      members: true,
    },
  });
  return team;
}

//remove team 
async function removeTeam(teamId: string) {
  await prisma.team.delete({
    where: { id: teamId },
  });
}

//create a standup setup for a team
async function createStandupSetup(
  teamId: string,
  standupDays: string[],
  reminderTimes: string[]
) {
  //check if standup for a team already exists and then delete it
  await prisma.standup.deleteMany({
    where: { teamId },
  });

  const standup = await prisma.standup.create({
    data: {
      teamId,
      standupDays,
      reminderTimes,
    },
  });
  return standup;
}

//add standup questions for a team
async function createStandupQuestions(
  teamId: string,
  questions: {
    questionText: string;
    options: string[];
    questionType: string;
    required: boolean;
  }[]
) {
  const standupQuestions = await prisma.standupQuestion.createMany({
    data: questions.map(question => ({
      teamId,
      ...question,
    })),
  });
  return standupQuestions;
}

//function to add standup response
async function createStandupResponses(
  responses: { questionId: string; userId: string; answer: string | undefined | null; options: string[] }[]
) {
  const standupResponses = await prisma.standupResponse.createMany({
    data: responses,
  });
  return standupResponses;
}

//function to get all standup questions for a team
async function getStandupQuestions(teamId: string) {
  const standupQuestions = await prisma.standupQuestion.findMany({
    where: { teamId },
  });
  return standupQuestions;
}



export {
  createTeam,
  addMembersToTeam,
  getMembers,
  getTeams,
  removeTeam,
  getMember,
  getTeam,
  removeMembersFromTeam,
  createMembers,
  createStandupSetup,
  createStandupQuestions,
  createStandupResponses,
  getStandupQuestions,
}
