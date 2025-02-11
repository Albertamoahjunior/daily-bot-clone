import { PrismaClient } from '@prisma/client'

interface TokenRecord {
  email: string;
  token: string;
  expiresAt: Date;
}

const prisma = new PrismaClient()

interface Mood {
  id: string;
  mood: string;
  teamId: string;
  description: string;
  moodScore: number;
  createdAt: Date;
}
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
async function createMembers(members: { id: string; memberName: string, email:string, is_admin:boolean }[]) {
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
    include: {
      standup: true,
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

//update a particular team
async function updateTeam(teamId: string, teamName: string, timezone: string) {
  // Update team name and members
  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: {
      teamName,
      timezone
    },
  });

  return updatedTeam;
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
  polls: { teamId: string, question: string; options: string[]; choiceType: string; anonymous: boolean;}
) {
  const pollQuestions = await prisma.pollQuestion.create({
    data: polls
  });
  //return pollId
  return pollQuestions.id;
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
  response: { pollId: string; userId: string; teamId: string; answer: string[]}
) {
  const pollResponses = await prisma.pollResponse.create({
    data: response
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

//function to get all polls 
async function getAllPolls() {
  const polls = await prisma.pollResponse.findMany();
  return polls;
}

//function to get poll by id

//function to get poll responses for a poll
async function getPollResponses(pollId: string) {
  const pollResponses = await prisma.pollResponse.findMany({
    where: { pollId },
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

//function to get all kudos
async function getAllKudos(){
  const kudos = await prisma.kudos.findMany();
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

//create kudos categories for a team
async function createKudosCategory(
  teamId: string,
  category: string,
  description: string
) {
  const kudosCategory = await prisma.kudosCategory.create({
    data: {
      teamId,
      category,
      description,
    },
  });
  return kudosCategory;
}


//get kudos categories for a team
async function getTeamKudosCategories(teamId: string) {
  const kudosCategories = await prisma.kudosCategory.findMany({
    where: { teamId },
  });
  return kudosCategories;
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
      moodId: mood,
      teamId,
      anonymous,
    },
  });
  return moodResponse;
}

//function to get kudos analytics
async function getKudosAnalytics() {
  // Fetch all members
  const members = await prisma.member.findMany();

  // Fetch all kudos to process received kudos per member
  const kudos = await prisma.kudos.findMany();

  // Map members with their received kudos
  const analytics = members.map(member => {
    // Filter kudos received by this member
    const kudosReceived = kudos.filter(k => k.receiverId === member.id);
    const kudosCount = kudosReceived.length;

    // Count kudos per category
    const categoryCount = kudosReceived.reduce(
      (acc, k) => {
        acc[k.category] = (acc[k.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Determine the top category, handle case where no kudos are received
    const topCategory = Object.keys(categoryCount).length
      ? Object.keys(categoryCount).reduce((a, b) =>
          categoryCount[a] > categoryCount[b] ? a : b
        )
      : null;

    return {
      memberId: member.id,
      teams: member.teams, // List of teams the member belongs to
      topCategory,
      kudosCount,
    };
  });

  // Sort by kudos count in descending order
  return analytics
    .sort((a, b) => b.kudosCount - a.kudosCount)
    .map((item, index) => ({
      position: index + 1,
      ...item,
    }));
}


//create moods in a batch
async function createMood(moods: {  mood: string; emojiId: string; moodScore: number; teamId: string; description: string }[]) {
  const createdMoods = await prisma.mood.createMany({
    data: moods,
  });
  return createdMoods;
}

//function to get all moods for a team
async function getTeamMoodConfiguration(teamId: string) {
  const moods = await prisma.mood.findMany({
    where: { teamId },
  });
  return moods;
}

//function to get all moods and then group them by their teamIds
async function getTeamMoods() {
  const moods = await prisma.mood.findMany();
  const groupedMoods = moods.reduce((acc, mood) => {
    acc[mood.teamId] = (acc[mood.teamId] || []).concat(mood);
    return acc;
  }, {} as Record<string, Mood[]>);

  return groupedMoods;
}

//get mood response
async function getMoodResponse(userId: string) {
  const moodResponse = await prisma.moodResponse.findFirst({
    where: { userId },
  });
  return moodResponse;
}

//get all moods, then group them by their createdAt date and then counts for each mood on that date
async function getMoodAnalytics() {
  const moods = await prisma.mood.findMany();
  const moodResponses = await prisma.moodResponse.findMany();

  // Build an object with date keys and mood counts as values
  const analyticsMap = moodResponses.reduce((acc, response) => {
    const date = response.createdAt.toISOString().split('T')[0];
    const mood = moods.find(m => m.description === response.moodId);

    if (!mood) return acc;

    if (!acc[date]) {
      acc[date] = {};
    }

    if (!acc[date][mood.description]) {
      acc[date][mood.description] = 0;
    }

    acc[date][mood.description] += 1;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Convert the object into an array of objects, adding the date as a property.
  const analyticsArray = Object.entries(analyticsMap).map(([date, moodCounts]) => ({
    date,
    ...moodCounts,
  }));

  return analyticsArray;
}


//get mood analytics per team
async function getMoodAnalyticsPerTeam(teamId: string) {
  const moods = await prisma.mood.findMany({where: {teamId: teamId}});
  const moodResponses = await prisma.moodResponse.findMany({where: {teamId: teamId}});

  // Build an object with date keys and mood counts as values
  const analyticsMap = moodResponses.reduce((acc, response) => {
    const date = response.createdAt.toISOString().split('T')[0];
    const mood = moods.find(m => m.description === response.moodId);

    if (!mood) return acc;

    if (!acc[date]) {
      acc[date] = {};
    }

    if (!acc[date][mood.description]) {
      acc[date][mood.description] = 0;
    }

    acc[date][mood.description] += 1;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Convert the object into an array of objects, adding the date as a property.
  const analyticsArray = Object.entries(analyticsMap).map(([date, moodCounts]) => ({
    date,
    ...moodCounts,
  }));

  return analyticsArray;
}

//auth db
const auth = {
  async createToken(data: TokenRecord) {
    //first check if data.token is of a member in the database
    const member = await prisma.member.findUnique({
      where: { email: data.email },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    //if data.token is of a member, create  a token record
    return prisma.token.create({
      data: {
        token: data.token,
        email: data.email,
        expiresAt: data.expiresAt
      },
    });
  },

  async findToken(token: string) {
    return prisma.token.findUnique({
      where: { token }
    });
  },

  async deleteToken(token: string) {
    return prisma.token.delete({
      where: { token }
    });
  },

  async findUser(email: string) {
    return prisma.member.findUnique({
      where: { email },
    });
  }
};




export {
  createTeam,
  updateTeam,
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
  getPollResponses,
  getAllPolls,
  createKudos,
  getTeamKudos,
  getUserKudosCount,
  createMoodResponse,
  createKudosCategory,
  getTeamKudosCategories,
  getAllKudos,
  getKudosAnalytics,
  createMood,
  getMoodResponse,
  getTeamMoods,
  getMoodAnalytics,
  getMoodAnalyticsPerTeam,
  getTeamMoodConfiguration,
  auth
}
