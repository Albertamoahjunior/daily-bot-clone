import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addTeam(name: string, id: string, members: string[]) {
  try {
    const newTeam = await prisma.team.create({
      data: {
        id,
        name
      }
    });

    console.log(`Created team "${name}" with ID: ${newTeam.id}`);
    return newTeam;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        throw new Error(`Team with ID ${id} already exists`);
      }
      throw new Error(`Failed to create team: ${error.message}`);
    }
    throw error;
  }
}

//function to create members and then update team with their ids
async function addStandup(id: string, questions: [{}], answers: [{}], date: Date, teamId: string, responded:[]){
    try {
        const newStandup = await prisma.standup.create({
        data: {
            id,
            questions,
            answers,
            date,
            teamId,
            responded
        }
        });
    
        console.log(`Created standup with ID: ${newStandup.id}`);
        return newStandup;
    } catch (error) {
        if (error instanceof Error) {
        if (error.message.includes('Unique constraint')) {
            throw new Error(`Standup with ID ${id} already exists`);
        }
        throw new Error(`Failed to create standup: ${error.message}`);
        }
        throw error;
    }
}

//function to create members
async function addMember(name: string, id: string, teamId: string, email: string) {
    try {
        const newMember = await prisma.member.create({
            data: {
                id,
                name,
                teamId,
                email
            }
        });
    
        console.log(`Created member "${name}" with ID: ${newMember.id}`);
        return newMember;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                throw new Error(`Member with ID ${id} already exists`);
            }
            throw new Error(`Failed to create member: ${error.message}`);
        }
        throw error;
    }
}





export { addTeam, addStandup};

