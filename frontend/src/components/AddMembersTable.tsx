import { useTeamsContext } from "../hooks/useTeamsContext"; 

// interface IMembersProps{
//     members: Member[];
//     setMembers: (newMembers: Member[] | ((prevMembers: Member[]) => Member[])) => void;
// }

export const AddMembersTable = () => {
    const { members, setMembers} = useTeamsContext();

    console.log(members)
    return (
        <>
        <table className="w-[86%] table-auto ">
        <thead className="justify-between w-full">
            <tr className="border-b ">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">Actions</th>
            </tr>
        </thead>
        <tbody>
            {members.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-100 justify-center  text-center">
                    <td className="py-3 px-4 flex items-center ">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white uppercase mr-3">
                            {member.memberName.charAt(0)}
                        </div>
                        {member.memberName}
                    </td>

                    {/* Status Column */}
                    <td className="py-3 px-4 text-center">
                        <div className="flex-auto justify-center ">
                            <div className={`mx-auto ${member.status === "Active" ? "text-orange-400": "text-gray-400"}`}>{member.status}</div>
                        </div>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4">
                        <div className="relative">
                            <button
                            className="text-red-500 ml-4 hover:text-red-700 focus:outline-none"
                            onClick={() =>
                                setMembers((prevMembers) =>
                                  prevMembers.filter((m) => m.id !== member.id)
                                )
                              }
                            >
                            Delete
                            </button>
                        </div>
                    </td>

                </tr>
            ))}
        </tbody>
        </table>
        </>
    )
}