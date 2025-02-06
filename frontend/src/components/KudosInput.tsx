import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface KudosInputProps {
  selectedUsers: string[];
  members: {value: string, label: string}[] | undefined
  onUserSelect: (user: string | null) => void;
  onUserDeselect: (newUsers: string[]) => void;
}

export const KudosInput: React.FC<KudosInputProps> = ({ members, selectedUsers, onUserSelect, onUserDeselect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const users = ['Ginny Weasley', 'Harry Potter', 'Hermione Granger', 'Ron Weasley'];

  const handleUserSelect = (user: string) => {
    onUserSelect(user);
    setIsDropdownOpen(false);
  };

  const handleClearSelection = (user:string) => {
    const newSelectedUsers = selectedUsers.filter((selectedUser) => selectedUser !== user)
    onUserDeselect(newSelectedUsers);
  };

  return (
    <div className="relative mb-4"  >
       <label className="block text-black font-medium mb-2">Kudos To</label>
      <div
        className="flex items-center px-4 py-2 bg-white border border-gray-400 rounded-lg cursor-pointer overflow-auto"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedUsers.length ? selectedUsers.map((selectedUser) => {
          return (<div className="flex gap-1 mx-2 bg-violet-300 p-2 px-3 rounded-full">
            <span>{members?.find((member) => member.value === selectedUser)?.label}</span>
            <button onClick={() => handleClearSelection(selectedUser)}>
              <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>)
        }) : 'Kudos to'}

      </div>
      { isDropdownOpen  && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-400 rounded-lg shadow-md">
        {members && members.length > 0 ? (
        members.map((member) => (
            <div
            key={member.value}
            className={`px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                selectedUsers.includes(member.value) ? 'bg-gray-100' : ''
            }`}
            onClick={() => handleUserSelect(member.value)}
            >
            {member.label}
            {selectedUsers.includes(member.value) && <Check className="w-4 h-4 text-purple-500" />}
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

// export default KudosInput;