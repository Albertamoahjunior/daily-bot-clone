import { createContext } from "react";

interface Member {
    id: string;
    memberName: string;
    teams: string[];
    status: "Active" | "Pending activation";
}

interface Standup {
    standupDays: string[];
    standupTimes: string[];
    reminderTimes: string[];
}

interface Team {
    id?: string;
    teamName: string;
    timezone: string;
    standup?:  Standup
}

export const teamsContext = createContext<{
    members: Member[];
    teams: Team[];
    setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
    addMembers: (teamId: string) => Promise<string>;
    loading: boolean;
    error: string | null;
} | undefined>(undefined);