import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface MoodMemberInputProps {
  selectedUser: string;
  className? : string;
  members: {value: string, label: string}[] | undefined
  onUserSelect: (user: string | null) => void;
  onUserDeselect: () => void;
}

export const MoodMemberInput: React.FC<MoodMemberInputProps> = ({ members, selectedUser, onUserSelect, onUserDeselect, className }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleUserSelect = (user: string) => {
    // console.log("Inside handle User Select", user);
    onUserSelect(user);
    setIsDropdownOpen(false);
  };

//   const handleClearSelection = (user:string) => {
//     const newSelectedUsers = selectedUsers.filter((selectedUser) => selectedUser !== user)
//     onUserDeselect(newSelectedUsers);
//   };

  return (
    <div className={"relative mb-4 "+ className}  >
       <label className="block text-black font-medium mb-2">Member</label>
      <div
        className="flex items-center px-4 py-2 h-11 bg-white border border-gray-400 rounded-lg cursor-pointer overflow-auto"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedUser && 
        <div className="flex gap-1 mx-2 bg-violet-300 p-2 px-3 rounded-full">
            <span className="text-sm">{members?.find((member) => member.value === selectedUser)?.label}</span>
            {/* <button onClick={() => onUserDeselect}>
                <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button> */}
        </div>}

      </div>
      { isDropdownOpen  && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-400 rounded-lg shadow-md">
        {members && members.length > 0 ? (
            members.map((member) => (
                <div  key={member.value} className={`px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                    selectedUser === member.value ? 'bg-gray-100' : '' }`}
                    onClick={() => {selectedUser === member.value ? onUserDeselect() :handleUserSelect(member.value)}}
                >
                {member.label}
                {selectedUser === member.value && <Check className="w-4 h-4 text-purple-500" />}
                </div>
            ))
        ) : (
        <div className="px-4 py-2 text-gray-500">No members found</div>
        )}
        </div>
      )
    }
    </div>
  );
};
