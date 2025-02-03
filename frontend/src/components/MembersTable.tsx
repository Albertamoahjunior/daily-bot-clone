import {DeleteModal} from "./DeleteModal";
import { useMembers } from "../hooks/useMembers";
import { useTeamsContext } from "../hooks/useTeamsContext"; 

// interface IMembersProps{
//     members: Member[];
//     setMembers: (newMembers: Member[]) => void;
// }

export const MembersTable = () => {
    const { members, setAllMembers} = useTeamsContext();
    
    const { isModalOpen, openModal, closeModal, deleteMember } = useMembers({
        members,
        setAllMembers,
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
            {members.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-100 ">
                    <td className="py-3 px-4 flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white uppercase mr-3">
                            {member.name.charAt(0)}
                        </div>
                        {member.name}
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