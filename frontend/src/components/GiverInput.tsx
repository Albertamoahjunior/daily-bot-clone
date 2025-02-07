import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface GivenInputProps {
  selectedUsers: string;
  members: Member[] | undefined;
  onUserSelect: (user: string | null) => void;
  onUserDeselect: () => void;
}

export const GiverInput: React.FC<GivenInputProps> = ({
  members,
  selectedUsers,
  onUserSelect,
  onUserDeselect
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleUserSelect = (user: string) => {
    onUserSelect(user);
    setIsDropdownOpen(false);
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening when clearing
    onUserDeselect();
  };

  return (
    <div className="relative mb-4">
      <label className="block text-black font-medium mb-2">Who Is Giving The Kudos</label>
      <div
        className="flex items-center px-4 py-2 bg-white border border-gray-400 rounded-lg cursor-pointer overflow-auto"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedUsers ? (
          <div className="flex gap-1 mx-2 bg-violet-300 p-2 px-3 rounded-full">
            <span>
              {members?.find((member) => member.id === selectedUsers)?.memberName}
            </span>
            <button onClick={handleClearSelection}>
              <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        ) : (
          'Giver'
        )}
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-400 rounded-lg shadow-md">
          {members && members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className={`px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                  selectedUsers === member.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleUserSelect(member.id)}
              >
                {member.memberName}
                {selectedUsers === member.id && (
                  <Check className="w-4 h-4 text-purple-500" />
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No members found</div>
          )}
        </div>
      )}
    </div>
  );
};