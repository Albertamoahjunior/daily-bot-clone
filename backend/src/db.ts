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
      members: {push: memberIds},
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
      memberName: true,
      teams: true,
    },
  });
  return members;
}

//get all members who belong to a particluar team
async function getTeamMembers(teamId: string) {
  const teamMembers = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      members: true,
    },
  });
  return teamMembers?.members || [];
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
  responses: { questionId: string; userId: string; answer: string | undefined | null; teamId:string; options: string[] }[]
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

//get all standup questions irrespective of teams
async function getAllStandupQuestions() {
  const standupQuestions = await prisma.standupQuestion.findMany();
  return standupQuestions;
}

//function to get all standup responses
async function getStandupResponses(teamId: string) {
  const standupResponses = await prisma.standupResponse.findMany({
    where: { teamId },
  });
  return standupResponses;
}

//get all standupResponses irrespective of teams
async function getAllStandupResponses() {
  const standupResponses = await prisma.standupResponse.findMany();
  return standupResponses;
}

//function to get all standup responses for a user

//function to get all standups for a team
async function getTeamStandups(teamId: string) {
  const standups = await prisma.standup.findMany({
    where: { teamId },
  });
  return standups;
}

//function to configure or set polls for a team
async function createPollQuestions(
  polls: { teamId: string, question: string; options: string[] }[]
) {
  const pollQuestions = await prisma.pollQuestion.createMany({
    data: polls
  });
  return pollQuestions;
}

//function to get all poll questions for a team
async function getTeamPollQuestions(teamId: string) {
  const pollQuestions = await prisma.pollQuestion.findMany({
    where: { teamId },
  });
  return pollQuestions;
}

//function to create poll responses
async function createPollResponses(
  responses: { pollId: string; userId: string; answer: string, teamId: string }[]
) {
  const pollResponses = await prisma.pollResponse.createMany({
    data: responses
  });
  return pollResponses;
}

//function to get all poll responses for a team
async function getTeamPollResponses(teamId: string) {
  const pollResponses = await prisma.pollResponse.findMany({
    where: { teamId },
  });
  return pollResponses;
}

//function to create kudos
async function createKudos(
  giverId: string,
  receiverId: string,
  teamId: string,
  reason: string,
  category: string
) {
  const kudos = await prisma.kudos.create({
    data: {
      giverId,
      receiverId,
      teamId,
      reason,
      category,
    },
  });
  return kudos;
}

//function to get all kudos for a team
async function getTeamKudos(teamId: string) {
  const kudos = await prisma.kudos.findMany({
    where: { teamId },
  });
  return kudos;
}

//count all kudos given by a user
async function getUserKudosCount(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const kudosCount = await prisma.kudos.count({
    where: {
      giverId: userId,
      createdAt: {
        gte: today,
      },
    },
  });
  return kudosCount;
}

//create a mood response
async function createMoodResponse(
  userId: string,
  mood: string,
  teamId: string,
  anonymous: boolean
) {
  const moodResponse = await prisma.moodResponse.create({
    data: {
      userId,
      mood,
      teamId,
      anonymous,
    },
  });
  return moodResponse;
}





export {
  createTeam,
  addMembersToTeam,
  getMembers,
  getTeamMembers,
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
  getTeamStandups,
  getStandupResponses,
  getAllStandupQuestions,
  getAllStandupResponses,
  createPollQuestions,
  getTeamPollQuestions,
  createPollResponses,
  getTeamPollResponses,
  createKudos,
  getTeamKudos,
  getUserKudosCount,
  createMoodResponse,
}
