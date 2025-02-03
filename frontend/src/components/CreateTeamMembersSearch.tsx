import React, { useState } from "react";
import { useTeamsContext } from "../hooks/useTeamsContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCheck } from '@fortawesome/free-solid-svg-icons';

interface CreateTeamMembersSearchProps {
  label?: string | undefined;
  labelClassName?: string;
}

export const CreateTeamMembersSearch = ({ label, labelClassName }: CreateTeamMembersSearchProps) => {
  const { users, members, setAllMembers } = useTeamsContext();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Filtered users based on search input
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.id.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Add or remove user from members list
  const toggleUserSelection = (user: Member) => {
    setAllMembers((prevMembers) => {
      const isAlreadySelected = prevMembers.some((member) => member.id === user.id);
      if (isAlreadySelected) {
        return prevMembers.filter((member) => member.id !== user.id);
      }
      return [...prevMembers, user];
    });
  };

  return (
    <div className="relative w-full ">
      {/* Label For Input */}
     <label className={labelClassName}>{label}</label>

      {/* Search Input */}
      <input
        className={`mt-4 border-[1px] border-gray-400 p-4 focus:bg-white w-full`}
        type="text"
        placeholder="Search and add members by name"
        value={searchValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
      />

      {/* Scrollable User List */}
      {isFocused && (
      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
        {filteredUsers.map((user) => {
          const isSelected = members.some((member) => member.id === user.id);
          return (
            <li
              key={user.id}
              className="flex gap-2 items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleUserSelection(user)}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white uppercase">
                {user.name.charAt(0)}
              </div>
              <span>{user.name}</span>
              {isSelected && <FontAwesomeIcon icon={faCheck} className="text-green-500 ml-auto" size={"lg"} /> }
            </li>
          );
        })}
      </ul>
      )}

    </div>
  );
};
