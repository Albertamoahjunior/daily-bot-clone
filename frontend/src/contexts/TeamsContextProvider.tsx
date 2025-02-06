import { useState, useEffect } from "react";
import { teamService, memberService } from "../services/api"; // Adjust path accordingly
import {teamsContext} from './teamContext';

interface ITeamsContextProvider {
    children: React.ReactNode;
}


const TeamsContextProvider = ({ children }: ITeamsContextProvider) => {
    const [members, setMembers] = useState<Member[] | undefined>(undefined);
    const [teams, setTeams] = useState<Team[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [teamMembers, setTeamMembers] = useState<Member[] | undefined>(undefined);
    const [members_to_be_added_team, setMembersToBeAddedToTeam] = useState<string[]|[]>([]);

    // const members_to_be_added_team = teamMembers?.map(member => member.id)

    // const membersPayload ={
    //     members: members_to_be_added_team ? members_to_be_added_team : [] 
    // }

    useEffect(() => {
        const members_to_be_added_team = teamMembers?.map(member => member.id);
        if(members_to_be_added_team && members_to_be_added_team.length){
            setMembersToBeAddedToTeam(members_to_be_added_team);
        }
        else{
            setMembersToBeAddedToTeam( []);
        }


    },[teamMembers])

    const addMembers = async (teamId: string) => {
        try{
            await teamService.addMembersToTeam(teamId,{ members: members_to_be_added_team});
            setMembersToBeAddedToTeam([]);
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
                    console.log("membersResult.value", membersResult.value);
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
                setError('Failed to fetch team and members data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <teamsContext.Provider value={{ members, teams, setMembers, setTeams, loading, error, addMembers, teamMembers, setTeamMembers }}>
            {children}
        </teamsContext.Provider>
    );
};

export default TeamsContextProvider;