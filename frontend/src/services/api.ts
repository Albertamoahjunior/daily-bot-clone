import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1'; // adjust this to match your backend URL

interface CreateTeamPayload {
    teamName: string;
    timezone: string;
}

interface AddMembersPayload {
    members: string[] | [];
}

// Team API services
export const teamService = {
    // Create a new team
    createTeam: async (payload: CreateTeamPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/team`, payload);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get all teams
    getTeams: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team`);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get specific team by ID
    getTeam: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team/teams/${teamId}`);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Add members to a team
    addMembersToTeam: async (teamId: string, payload: AddMembersPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/team/teams/${teamId}/members`, payload);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Remove members from a team
    removeMembersFromTeam: async (teamId: string, payload: AddMembersPayload) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/team/teams/${teamId}/members`, {
                data: payload
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Delete a team
    removeTeam: async (teamId: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/team/teams/${teamId}`);
            return true;
        } catch (error) {
            return error;
        }
    }
};

//Members API services
export const memberService = {
    // Get all members
    getMembers: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/members`);
            return response.data;
        } catch (error) {
            return error;
        }
    }
};


// Mood API services
interface CreateMoodPayload {
    mood: string;
    teamId: string;
    description: string;
    emojiId: string;
    moodScore: number;
}

interface MoodResponsePayload {
    userId: string;
    mood: string;
    teamId: string;
    anonymous: boolean;
}

export const moodService = {
    // Create a new mood
    createMood: async (payload: CreateMoodPayload[]) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/mood`, {moods: payload});
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Create a mood response
    createMoodResponse: async (payload: MoodResponsePayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/mood-response`, payload);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get mood response by user ID
    getMoodResponse: async (userId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood-response/${userId}`);
            return response.data;
        } catch (error) {
            return error;
        }
    }
};

// Kudos API services
interface CreateKudosPayload {
    giverId: string;
    receiverId: string|string[];
    teamId: string;
    reason: string;
    category: string;
}

interface CreateKudosCategoryPayload {
    teamId: string;
    category: string;
    description: string;
}

export const kudosService = {
    createKudos: async (payload: CreateKudosPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/kudos`, payload);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamKudos: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/team/${teamId}`);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getUserKudosCount: async (userId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/user/${userId}/count`);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    createKudosCategory: async (payload: CreateKudosCategoryPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/kudos/category`, payload);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamKudosCategories: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/categories/team/${teamId}`);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getKudosAnalytics: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/analytics`);
            return response.data;
        } catch (error) {
            return error;
        }
    }
};


// Poll API services
interface CreatePollQuestionsPayload {
    teamId: string;
    question: string;
    options: string[];
    choiceType: string;
    anonymous: boolean;
}

interface CreatePollResponsesPayload {
    responses: {
        userId: string;
        teamId: string;
        pollId: string;
        response: string;
    }[];
}

export const pollService = {
    createPollQuestions: async (payload: CreatePollQuestionsPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/poll/questions`, { polls: payload });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamPollQuestions: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/poll/questions/${teamId}`);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    createPollResponses: async (payload: CreatePollResponsesPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}poll/responses`, payload);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamPollResponses: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/poll/responses/${teamId}`);
            return response.data;
        } catch (error) {
            return error;
        }
    }
};

//Standup API services
interface standupQuestion {
    questionText: string;
    options: [];
    questionType: "freeText" | "multiple_choice" | "single_choice",
    required: boolean;
}

interface ConfigureStandupPayload {
    teamId: string;
    standupDays: string[];
    reminderTimes: string[];
    questions: standupQuestion[];
}

export const standupService = {
    configureStandup: async (payload: ConfigureStandupPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/standup/configure`, payload);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getStandupRespondents: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/respondents/${teamId}`);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getAllStandups: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/all-standups`);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getAllStandupQuestions: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/all-questions`);
            return response.data;
        } catch (error) {
            return error;
        }
    },
};
