import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1'; 
const BASE_URL = 'http://localhost:3000';

interface CreateTeamPayload {
    teamName: string;
    timezone: string;
}

interface AddMembersPayload {
    members: string[] | [];
}
const token = 'token'
//auth
const options = {
    headers: {
        'Authorization': `Bearer ${token}`
        }   
}

//Auth services
export const authService = {
    // Login a user
    login: async (email: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { email });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    //verify user
    verifyUser: async (token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/verify?token=${token}`);
            return response.data;
            //save the data in the context
        } catch (error) {
            return error;
        }
    },

    // Logout a user
    logout: async () => {
        try {
            await axios.post(`${BASE_URL}/auth/logout`, {}, options);
            return true;
        } catch (error) {
            return error;
        }
    },

    // Get user information
    getUser: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/user`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    // Get user information
}


// Team API services
export const teamService = {
    // Create a new team
    createTeam: async (payload: CreateTeamPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/team`, payload, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get all teams
    getTeams: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get specific team by ID
    getTeam: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team/teams/${teamId}`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Add members to a team
    addMembersToTeam: async (teamId: string, payload: AddMembersPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/team/teams/${teamId}/members`, payload, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },
    
    // Remove members from a team
    removeMembersFromTeam: async (teamId: string, payload: AddMembersPayload) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/team/teams/${teamId}/members`, {
                data: payload,
                headers:options.headers
            });
            console.log("Response.data", response.data);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Delete a team
    removeTeam: async (teamId: string ) => {
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
            const response = await axios.get(`${API_BASE_URL}/members`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    }
};


// Mood API services
interface CreateMoodPayload {
    mood: string;
    moodScore: number;
    emojiId: "001"| "002"| "003"| "004"|"005";
    teamId: string;
    description: string;
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
            const response = await axios.post(`${API_BASE_URL}/mood`, {moods: payload}, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getMoods: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Create a mood response
    createMoodResponse: async (payload: MoodResponsePayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/mood-response`, payload, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get mood response by user ID
    getMoodResponse: async (userId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood-response/${userId}`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get mood response by user ID
    getMoodAnalyticsForTeam: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood/${teamId}/analytics`, options);
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
            const response = await axios.post(`${API_BASE_URL}/kudos`, payload, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamKudos: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/team/${teamId}`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getUserKudosCount: async (userId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/user/${userId}/count`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    createKudosCategory: async (payload: CreateKudosCategoryPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/kudos/category`, payload, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamKudosCategories: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/categories/team/${teamId}`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getKudosAnalytics: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/analytics`, options);
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
            const response = await axios.post(`${API_BASE_URL}/poll/questions`, { polls: payload }, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamPollQuestions: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/poll/questions/${teamId}`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    createPollResponses: async (payload: CreatePollResponsesPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}poll/responses`, payload, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamPollResponses: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/poll/responses/${teamId}`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    }
};

//Standup API services
 export interface standupQuestion {
    questionText: string;
    options: string[];
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
            const response = await axios.post(`${API_BASE_URL}/standup/configure`, payload, options)
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getStandupRespondents: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/respondents/${teamId}`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getAllStandups: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/all-standups`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getAllStandupQuestions: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/all-questions`, options);
            return response.data;
        } catch (error) {
            return error;
        }
    },
};
