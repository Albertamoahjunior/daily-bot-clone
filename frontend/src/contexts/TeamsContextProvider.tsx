import { useState, useEffect } from "react";
import { teamService, memberService } from "../services/api"; // Adjust path accordingly
import {teamsContext} from './teamContext';

interface ITeamsContextProvider {
    children: React.ReactNode;
}

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


const TeamsContextProvider = ({ children }: ITeamsContextProvider) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const members_to_be_added_team = members.map(member => member.id)

    const membersPayload ={
        members: members_to_be_added_team
    }

    const addMembers = async (teamId: string) => {
        try{
            await teamService.addMembersToTeam(teamId, membersPayload);
            return 'Members added successfully';
        }catch(err){
            // Handle error
            console.error('Failed to add members', err);
            return 'Failed to add members';
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const results = await Promise.allSettled([
                    memberService.getMembers(),
                    teamService.getTeams(),
                ]);

                const membersResult = results[0];
                const teamsResult = results[1];

                


                if (membersResult.status === 'fulfilled') {
                    setMembers(membersResult.value);
                }


                if (teamsResult.status === 'fulfilled') {
                    setTeams(teamsResult.value);
                }

                // Check if any promises were rejected
                const anyRejected = results.some(result => result.status === 'rejected');
                
                if (anyRejected) {
                    const errors = results
                        .filter(result => result.status === 'rejected')
                        .map(result => (result as PromiseRejectedResult).reason);
                    
                    throw new Error(`Failed to fetch some data: ${errors.join(', ')}`);
                } else {
                    setError(null);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch some data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <teamsContext.Provider value={{ members, teams, setMembers, setTeams, loading, error, addMembers }}>
            {children}
        </teamsContext.Provider>
    );
};

export default TeamsContextProvider;