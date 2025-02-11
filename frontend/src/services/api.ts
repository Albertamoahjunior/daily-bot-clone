import apiClient from './apiClient';

const API_BASE_URL = 'http://localhost:3000/api/v1';
const BASE_URL = 'http://localhost:3000';

// Types
interface CreateTeamPayload {
    teamName: string;
    timezone: string;
}

interface AddMembersPayload {
    members: string[] | [];
}

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

export interface standupQuestion {
    questionText: string;
    options: string[];
    questionType: "freeText" | "multiple_choice" | "single_choice";
    required: boolean;
}

interface ConfigureStandupPayload {
    teamId: string;
    standupDays: string[];
    reminderTimes: string[];
    questions: standupQuestion[];
}

// Auth Service
export const authService = () => {
    return {
        login: async (email: string) => {
            const response = await apiClient.post(`${BASE_URL}/auth/login`, { email });
            return response.data;
            
        },

        verifyUser: async (token: string) => {
            const response = await apiClient.get(`${BASE_URL}/auth/verify`, {
                params: { token }
            });
            return response.data;
      
        },

        logout: async () => {
            const logged_out = await apiClient.get(`${BASE_URL}/auth/logout`);
            return logged_out;
        },

        getUser: async () => {
            const response = await apiClient.get(`${BASE_URL}/auth/user`);
            return response.data;
        },
    };
};

// Team Service
export const teamService = {
    createTeam: async (payload: CreateTeamPayload) => {
        const response = await apiClient.post(`${API_BASE_URL}/team`, payload);
        return response.data;
    },

    getTeams: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/team`);
        return response.data;
    },

    getTeam: async (teamId: string) => {
        const response = await apiClient.get(`${API_BASE_URL}/team/teams/${teamId}`);
        return response.data;
    },

    addMembersToTeam: async (teamId: string, payload: AddMembersPayload) => {
        const response = await apiClient.post(
            `${API_BASE_URL}/team/teams/${teamId}/members`, 
            payload
        );
        return response.data;
    },
    
    removeMembersFromTeam: async (teamId: string, payload: AddMembersPayload) => {
        const response = await apiClient.delete(
            `${API_BASE_URL}/team/teams/${teamId}/members`,
            { data: payload }
        );
        return response.data;
    },

    removeTeam: async (teamId: string) => {
        await apiClient.delete(`${API_BASE_URL}/team/teams/${teamId}`);
        return true;
    }
};

// Member Service
export const memberService = {
    getMembers: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/members`);
        return response.data;
    }
};

// Mood Service
export const moodService = {
    createMood: async (payload: CreateMoodPayload[]) => {
        const response = await apiClient.post(`${API_BASE_URL}/mood`, { moods: payload });
        return response.data;
    },

    getMoods: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/mood`);
        return response.data;
    },

    createMoodResponse: async (payload: MoodResponsePayload) => {
        const response = await apiClient.post(`${API_BASE_URL}/mood-response`, payload);
        return response.data;
    },

    getMoodResponse: async (userId: string) => {
        const response = await apiClient.get(`${API_BASE_URL}/mood-response/${userId}`);
        return response.data;
    },

    getMoodAnalyticsForTeam: async (teamId: string) => {
        const response = await apiClient.get(`${API_BASE_URL}/mood/${teamId}/analytics`);
        return response.data;
    }
};

// Kudos Service
export const kudosService = {
    createKudos: async (payload: CreateKudosPayload) => {
        const response = await apiClient.post(`${API_BASE_URL}/kudos`, payload);
        return response.data;
    },

    getAllKudos: async() =>{
        const response = await apiClient.get(`${API_BASE_URL}/kudos/all`);
        return response.data;
    },

    getTeamKudos: async (teamId: string) => {
        const response = await apiClient.get(`${API_BASE_URL}/kudos/team/${teamId}`);
        return response.data;
    },

    getUserKudosCount: async (userId: string) => {
        const response = await apiClient.get(`${API_BASE_URL}/kudos/user/${userId}/count`);
        return response.data;
    },

    createKudosCategory: async (payload: CreateKudosCategoryPayload) => {
        const response = await apiClient.post(`${API_BASE_URL}/kudos/category`, payload);
        return response.data;
    },

    getTeamKudosCategories: async (teamId: string) => {
        const response = await apiClient.get(`${API_BASE_URL}/kudos/categories/team/${teamId}`);
        return response.data;
    },

    getKudosAnalytics: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/kudos/analytics`);
        return response.data;
    }
};

// Poll Service
export const pollService = {
    createPollQuestions: async (payload: CreatePollQuestionsPayload) => {
        const response = await apiClient.post(`${API_BASE_URL}/poll/questions`, { polls: payload });
        return response.data;
    },

    getTeamPollQuestions: async (teamId: string) => {
        const response = await apiClient.get(`${API_BASE_URL}/poll/questions/${teamId}`);
        return response.data;
    },

    createPollResponses: async (payload: CreatePollResponsesPayload) => {
        const response = await apiClient.post(`${API_BASE_URL}/poll/responses`, payload);
        return response.data;
    },

    getTeamPollResponses: async (teamId: string) => {
        const response = await apiClient.get(`${API_BASE_URL}/poll/responses/${teamId}`);
        return response.data;
    }
};

// Standup Service
export const standupService = {
    configureStandup: async (payload: ConfigureStandupPayload) => {
        const response = await apiClient.post(`${API_BASE_URL}/standup/configure`, payload);
        return response.data;
    },

    getStandupRespondents: async (teamId: string) => {
        const response = await apiClient.get(`${API_BASE_URL}/standup/respondents/${teamId}`);
        return response.data;
    },

    getAllStandups: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/standup/all-standups`);
        return response.data;
    },

    getAllStandupQuestions: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/standup/all-questions`);
        return response.data;
    }
};