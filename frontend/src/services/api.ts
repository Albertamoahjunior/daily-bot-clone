import axios from 'axios';
import { LOGIN, LOGOUT} from '../state/authState/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {useSelector} from 'react-redux';
import { RootState } from '@/state/store';


const API_BASE_URL = 'http://localhost:3000/api/v1'; 
const BASE_URL = 'http://localhost:3000';

interface CreateTeamPayload {
    teamName: string;
    timezone: string;
}

interface AddMembersPayload {
    members: string[] | [];
}
const getAuthHeaders = () => {
    const token = useSelector((state: RootState) => state.authState.token);
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};


export const useAuthService = () => {


    const navigate = useNavigate();
    const dispatch = useDispatch();


    return {
        // Login a user
        login: async (email: string) => {
            try {
                console.log("Inside login")
                const response = await axios.post(`${BASE_URL}/auth/login`, { email });
                return response.data;
            } catch (error) {
                return error;
            }
        },

        // Verify user
        verifyUser: async (token: string) => {
            try {
                const response = await axios.get(`${BASE_URL}/auth/verify?token=${token}`);
                if (response.status === 200) {
                    dispatch(LOGIN(response.data));
                    toast.success("Successfully Signed In!!✨🎉");
                    navigate("/");
                }
                return response.data;
            } catch (error) {
                return error;
            }
        },

        // Logout a user
        logout: async () => {
            try {
                await axios.post(`${BASE_URL}/auth/logout`, {}, getAuthHeaders());
                dispatch(LOGOUT()); // Ensure the user is logged out in Redux state
                toast.info("Logged out successfully.");
                navigate("/login");
                return true;
            } catch (error) {
                return error;
            }
        },

        // Get user information
        getUser: async () => {
            try {
                const response = await axios.get(`${BASE_URL}/auth/user`, getAuthHeaders());
                return response.data;
            } catch (error) {
                return error;
            }
        },
    };
};


// Team API services
export const teamService = {
    // Create a new team
    createTeam: async (payload: CreateTeamPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/team`, payload, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get all teams
    getTeams: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get specific team by ID
    getTeam: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team/teams/${teamId}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Add members to a team
    addMembersToTeam: async (teamId: string, payload: AddMembersPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/team/teams/${teamId}/members`, payload, getAuthHeaders());
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
                headers:getAuthHeaders().headers
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
            const response = await axios.get(`${API_BASE_URL}/members`, getAuthHeaders());
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
            const response = await axios.post(`${API_BASE_URL}/mood`, {moods: payload}, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getMoods: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Create a mood response
    createMoodResponse: async (payload: MoodResponsePayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/mood-response`, payload, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get mood response by user ID
    getMoodResponse: async (userId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood-response/${userId}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // Get mood response by user ID
    getMoodAnalyticsForTeam: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mood/${teamId}/analytics`, getAuthHeaders());
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
            const response = await axios.post(`${API_BASE_URL}/kudos`, payload, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamKudos: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/team/${teamId}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getUserKudosCount: async (userId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/user/${userId}/count`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    createKudosCategory: async (payload: CreateKudosCategoryPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/kudos/category`, payload, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamKudosCategories: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/categories/team/${teamId}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getKudosAnalytics: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/kudos/analytics`, getAuthHeaders());
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
            const response = await axios.post(`${API_BASE_URL}/poll/questions`, { polls: payload }, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamPollQuestions: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/poll/questions/${teamId}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    createPollResponses: async (payload: CreatePollResponsesPayload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}poll/responses`, payload, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getTeamPollResponses: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/poll/responses/${teamId}`, getAuthHeaders());
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
            const response = await axios.post(`${API_BASE_URL}/standup/configure`, payload, getAuthHeaders())
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getStandupRespondents: async (teamId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/respondents/${teamId}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getAllStandups: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/all-standups`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getAllStandupQuestions: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/standup/all-questions`, getAuthHeaders());
            return response.data;
        } catch (error) {
            return error;
        }
    },
};
