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
    createTeam: async (payload: CreateTeamPayload, token: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/team`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get all teams
    getTeams: async (token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get specific team by ID
    getTeam: async (teamId: string, token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team/teams/${teamId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Add members to a team
    addMembersToTeam: async (teamId: string, payload: AddMembersPayload, token: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/team/teams/${teamId}/members`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },
    
    // Remove members from a team
    removeMembersFromTeam: async (teamId: string, payload: AddMembersPayload, token: string) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/team/teams/${teamId}/members`, {
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`
                    }
            });
            console.log("Response.data", response.data);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Delete a team
    removeTeam: async (teamId: string, token: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/team/teams/${teamId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return true;
        } catch (error) {
            return error;
        }
    }
};

//Members API services
export const memberService = {
    // Get all members
    getMembers: async (token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/members`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
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
    createMood: async (payload: CreateMoodPayload[], token: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/mood`, {moods: payload}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getMoods: async (token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Create a mood response
    createMoodResponse: async (payload: MoodResponsePayload, token: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/mood-response`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get mood response by user ID
    getMoodResponse: async (userId: string, token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood-response/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get mood response by user ID
    getMoodAnalyticsForTeam: async (teamId: string, token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood/${teamId}/analytics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
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
    createKudos: async (payload: CreateKudosPayload, token: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/kudos`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamKudos: async (teamId: string, token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/team/${teamId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getUserKudosCount: async (userId: string, token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/user/${userId}/count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    createKudosCategory: async (payload: CreateKudosCategoryPayload, token: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/kudos/category`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamKudosCategories: async (teamId: string, token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/categories/team/${teamId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getKudosAnalytics: async (token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/analytics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
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
    createPollQuestions: async (payload: CreatePollQuestionsPayload, token: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/poll/questions`, { polls: payload }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamPollQuestions: async (teamId: string, token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/poll/questions/${teamId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    createPollResponses: async (payload: CreatePollResponsesPayload, token: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}poll/responses`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamPollResponses: async (teamId: string, token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/poll/responses/${teamId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
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
    configureStandup: async (payload: ConfigureStandupPayload, token: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/standup/configure`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getStandupRespondents: async (teamId: string, token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/respondents/${teamId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getAllStandups: async (token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/all-standups`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getAllStandupQuestions: async (token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/all-questions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    }   
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },
};
