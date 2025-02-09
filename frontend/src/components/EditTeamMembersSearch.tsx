import React, { useEffect, useState } from "react";
import { useTeamsContext } from "../hooks/useTeamsContext";

interface EditTeamMembersSearchProps {
    label?: string | undefined;
    labelClassName?: string;
    team: string;
  }
  
export const EditTeamMembersSearch = ({ label, labelClassName, team }: EditTeamMembersSearchProps) => {
    const { members, setMembers, setMembersToBeAddedToTeam, members_to_be_added_team } = useTeamsContext();
    const [searchValue, setSearchValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [teamMembers, setTeamMembers] = useState<Member[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<Member[] | undefined>(undefined);
  
    useEffect(() => {
      if (members && members.length > 0) {
        setTeamMembers(members.filter(member => member.teams.includes(team)));
      }
    }, [members, team]);
  
    useEffect(() => {
      if (!members) return;
  
      if (!searchValue) {
        const notTeamMembers = members.filter((member: Member) =>
          !teamMembers.some((teamMember) => teamMember.id === member.id) &&
          !members_to_be_added_team.some((addedMember) => addedMember.value === member.id)
        );
        setFilteredUsers(notTeamMembers);
      } else {
        const filtered = members.filter((user: Member) =>
          (user?.memberName.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.id.toLowerCase().includes(searchValue.toLowerCase())) &&
          !members_to_be_added_team.some((member) => member.value === user.id) &&
          !teamMembers.some((teamMember) => teamMember.id === user.id)
        );
        setFilteredUsers(filtered);
      }
    }, [searchValue, teamMembers, members, members_to_be_added_team]);
  
    const handleSelectUser = (user: Member) => {
      console.log("Member selected", user);
      setMembersToBeAddedToTeam((prevAddedMembers) => [
        ...prevAddedMembers,
        { name: user.memberName, value: user.id }
      ]);
      setMembers((prevMembers) => 
        prevMembers?.map((member) => {
            if (member.id === user.id) {
                // Add the specific teamId to the member's teams array
                return {
                    ...member,
                    teams: [...member.teams, team]
                };
            }
            return member;
        })
    );
      setSearchValue("");
    };
  
    return (
      <div className="relative w-full">
        {label && (
          <label className={labelClassName}>
            {label}
          </label>
        )}
        <input
          type="text"
          value={searchValue}
          className="w-full p-2 border rounded"
          placeholder="Search members..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay blur to allow click event to fire
            setTimeout(() => setIsFocused(false), 200);
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
        />
  
        {isFocused && filteredUsers && filteredUsers.length > 0 && (
          <div className="absolute w-full z-10 mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => handleSelectUser(user)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {user.memberName.charAt(0)}
                </div>
                <span>{user.memberName}</span>
              </div>
            ))}
          </div>
        )}
  
        {searchValue && filteredUsers && filteredUsers.length === 0 && (
          <div className="absolute w-full mt-1 p-2 bg-white border rounded">
            No users found.
          </div>
        )}
      </div>
    );
  };
  