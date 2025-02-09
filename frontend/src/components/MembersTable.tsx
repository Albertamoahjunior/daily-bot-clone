import { useEffect, useState } from "react";
import {DeleteModal} from "./DeleteModal";
import { useMembers } from "../hooks/useMembers";
import { useTeamsContext } from "../hooks/useTeamsContext"; 
//import {Member} from '../hooks/useMembers'

interface MembersTableProps {
    team: string;
  }

export const MembersTable: React.FC<MembersTableProps> = ({team}) => {
    const { members, setMembers } = useTeamsContext();
    const [teamMembers, setTeamMembers] = useState<Member[]>([])
    
    // console.log(team);
    // console.log(members)
    //filter out members that belong to  a particular team
    useEffect(() => {
        // Ensure we only update state if members exist
        if (members && members?.length > 0) {
          const updatedTeamMembers = members?.filter((member) =>
            member.teams.includes(team)
          );
    
          setTeamMembers(updatedTeamMembers);
        }
    }, [ team ]);

    const { isModalOpen, openModal, closeModal, deleteMember } = useMembers({
        members: teamMembers,
        setMembers: setTeamMembers,
        teamID: team
    });


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
                            <button
                            className="text-red-500 ml-4 hover:text-red-700 focus:outline-none"
                            onClick={() => openModal(member.id)}
                            >
                            Delete
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>

        {isModalOpen && 
            <DeleteModal
                isOpen={isModalOpen}
                title="Delete Item"
                description="Are you sure you want to delete this member? This action cannot be undone."
                onClose={closeModal}
                onConfirm={deleteMember}
            /> 
        }
        </>
    )
}