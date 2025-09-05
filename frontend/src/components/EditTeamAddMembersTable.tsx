import { useEffect, useState } from "react";
import {DeleteModal} from "./DeleteModal";
import { useMembers } from "../hooks/useMembers";
import { useTeamsContext } from "../hooks/useTeamsContext"; 
//import {Member} from '../hooks/useMembers'

interface EditTeamAddMembersTableProps {
    team: string;
  }

export const EditTeamAddMembersTable: React.FC<EditTeamAddMembersTableProps> = ({team}) => {
    const { members, setMembers, members_to_be_added_team, setMembersToBeAddedToTeam } = useTeamsContext();
    const [teamMembers, setTeamMembers] = useState<Member[]>([])
    const [initialTeamMembers, setInitialTeamMembers] = useState<Member[]>([])
    

    //filter out members that belong to  a particular team
    useEffect(() => {
        // Ensure we only update state if members exist
        if (members && members?.length > 0) {
          const updatedTeamMembers = members?.filter((member) =>
            member.teams.includes(team)
          );
    
          setInitialTeamMembers(updatedTeamMembers);
          setTeamMembers(updatedTeamMembers);
        }
    }, [ team ]);

    useEffect(() => {
        if(members_to_be_added_team && members_to_be_added_team.length > 0){
            const newMembers = members_to_be_added_team.flatMap((memberToBeAdded) => members?.filter((member) => member.id === memberToBeAdded.value)).filter((member): member is Member => member !== undefined);

            // Filter out any members that already exist in teamMembers
            const uniqueNewMembers = newMembers.filter(
            (newMember) => !teamMembers.some((teamMember) => teamMember.id === newMember.id)
            );
            setTeamMembers((prevTeamMembers) => [...prevTeamMembers, ...uniqueNewMembers]);
        }

    }, [members_to_be_added_team, members])

    const removeTeamMember = (memberId: string) => {
        if(memberId){
            setTeamMembers((prevTeamMembers) =>prevTeamMembers.filter((teamMember) => teamMember.id !== memberId));
            setMembersToBeAddedToTeam((prevMembersToBeAdded) => prevMembersToBeAdded.filter((toBeAdded) => toBeAdded.value !== memberId))

            setMembers((prevMembers) => 
                prevMembers?.map((member) => {
                    if (member.id === memberId) {
                        // Remove the specific teamId from the member's teams array
                        return {
                            ...member,
                            teams: member.teams.filter((teamId) => teamId !== team) // Assuming teamId is accessible in this scope
                        };
                    }
                    return member;
                })
            );
        }
    }

    const isInitialMember = (memberId: string) => {
        return initialTeamMembers.some(member => member.id === memberId);
      };


    return (
        <>
        <table className="w-full table-auto">
        <thead className="justify-between w-full">
            <tr className="border-b ">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
            </tr>
        </thead>
        <tbody>
            {teamMembers.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-100 ">
                    <td className="py-3 px-4 flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white uppercase mr-3">
                            {member.memberName.charAt(0)}
                        </div>
                        {member.memberName}
                    </td>

                    <td className="py-3 px-4 text-gray-500">{member.status}</td>

                    <td className="py-3 px-4">
                        <div className="relative">
                        {!isInitialMember(member.id) && (
                            <button
                            className="text-red-500 ml-4 hover:text-red-700 focus:outline-none"
                            onClick={() => removeTeamMember(member.id)}
                            // onClick={() => openModal(member.id)}
                            >
                            Remove
                            </button>)
                        }
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>

        </>
    )
}