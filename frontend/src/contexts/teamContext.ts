import { createContext } from "react";

// interface Member {
//     id: string;
//     memberName: string;
//     teams: string[];
//     status: "Active" | "Pending activation";
// }

// interface Standup {
//     standupDays: string[];
//     standupTimes: string[];
//     reminderTimes: string[];
// }

// interface Team {
//     id?: string;
//     teamName: string;
//     timezone: string;
//     standup?:  Standup
// }

export const teamsContext = createContext<{
    members: Member[] | undefined;
    teamMembers: Member[] | undefined;
    teams: Team[] | undefined;
    members_to_be_added_team: {name:string, value:string}[] | [],
    setMembersToBeAddedToTeam: React.Dispatch<React.SetStateAction<{name:string, value:string}[] | []>>;
    setMembers: React.Dispatch<React.SetStateAction<Member[] | undefined>>;
    setTeamMembers: React.Dispatch<React.SetStateAction<Member[] | undefined>>;
    setTeams: React.Dispatch<React.SetStateAction<Team[] | undefined>>;
    toggleReloadTeams: () => void;
    addMembers: (teamId: string) => Promise<string>;
    loading: boolean;
    error: string | null;
} | undefined>(undefined);