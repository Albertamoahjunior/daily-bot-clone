import React, { useState } from "react";
import { useTeamsContext } from "../hooks/useTeamsContext";

// interface Member {
//   id: string;
//   memberName: string;
//   teams: string[];
//   status: "Active" | "Pending activation";
// }


interface MembersSearchProps {
  label?: string | undefined;
  labelClassName?: string;
}

export const MembersSearch  = ({label, labelClassName}: MembersSearchProps) => {
  const {members, setMembers} = useTeamsContext();
  const [searchValue, setSearchValue] = useState("");

  console.log("Members",members)
  // Filter the users based on the search value
  const filteredUsers = members?.filter((user: Member) =>
      (user?.memberName.toLowerCase().includes(searchValue.toLowerCase()) || 
       user.id.toLowerCase().includes(searchValue.toLowerCase())) && 
      !members.some((member: Member) => member.id === user.id) // Exclude already selected members
  );

  console.log("Filtered Users: ", filteredUsers);

  // Add selected user to members array
  const handleSelectUser = (user: Member) => {
    setMembers([...members!, user]);
    setSearchValue(""); // Clear the search value after selection
  };

  return (
    <div className="relative w-full">
      {/* Label For Input */}
      {label && 
        <label className={`${labelClassName && labelClassName}`}>
            {label}
        </label>
      }

      {/* Search Input */}
      <input
        className={` ${label &&  "mt-4"} border-[1px] border-gray-400 p-4 focus:bg-white w-full `}
        type="text"
        placeholder="Search and add members by name"
        value={searchValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
      />

      {/* Dropdown List */}
      {searchValue && filteredUsers && filteredUsers.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
          {filteredUsers?.map((user) => (

            <li
              key={user.id}
              className="flex gap-1 items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectUser(user)}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white uppercase mr-3">
                {user.memberName.charAt(0)}
              </div>
              {user.memberName}
            </li>
          ))}
        </ul>
      )}

      {/* No Results Message */}
      {searchValue && filteredUsers && filteredUsers.length === 0 && (
        <p className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full p-2 text-gray-500">
          No users found.
        </p>
      )}
    </div>
  );
};
