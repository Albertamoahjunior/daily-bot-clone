import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { useTeamsContext } from '../hooks/useTeamsContext';
import { TeamInputDropdown } from './TeamDropdownInput';
import { useKudosForm } from '../hooks/useKudosForm';
import { KudosInput } from './KudosInput';
import { KudosTextArea } from './KudosTextArea';
import { KudosCategoryDropdown } from './KudosCategoryDropdown';
import { GiverInput } from './GiverInput';

interface GiveKudosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | ""
}

export const GiveKudosModal: React.FC<GiveKudosModalProps> = ({ isOpen, onClose, userId }) => {
  useEffect(() => {
    setGiverId(userId);
  }, [userId])

  const { teams, members } = useTeamsContext();
  const {
    teamsList,
    membersList,
    selectedTeam,
    handleTeamChange,
    selectedUsers,
    handleUserSelect,
    handleUserDeselect,
    selectedCategory,
    handleCategoryChange,
    kudosReason,

    giverId,
    setGiverId,

    setKudosReason,
    handleSubmit,
  } = useKudosForm(teams, members);


  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[1200px] h-[700px] overflow-scroll relative">
        {/* Close Button */}
        <button className="absolute top-7 right-8 text-gray-500 hover:text-black" onClick={onClose}>
          <FontAwesomeIcon icon={faCircleXmark} size={'xl'} />
        </button>

        <div className="w-full items-center text-center justify-center">
          <h2 className="text-xl font-bold mb-4">Give Kudos</h2>
        </div>

        <div className="flex flex-col gap-6 my-6 mb-8 mx-20">
          {/* <GiverInput
            members={members}
            selectedUsers={giverId}
            onUserSelect={handleGiverSelect}
            onUserDeselect={handleGiverDeselect}
          /> */}
          <div className="flex items-center px-4 py-2 bg-white border border-gray-400 rounded-lg cursor-pointer overflow-auto">
            <p className="text-gray-700">{members?.find((member) => member.id === giverId)?.memberName || "No Giver"}</p>
          </div>

          <TeamInputDropdown
            inputName="Select a Team "
            options={teamsList}
            selectedValue={selectedTeam}
            onOptionChange={handleTeamChange}
          />

          <KudosInput
            members={membersList}
            selectedUsers={selectedUsers}
            onUserSelect={handleUserSelect}
            onUserDeselect={handleUserDeselect}
          />


          <KudosCategoryDropdown
            optionText="Select A Kudos Category"
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <KudosTextArea kudosReason={kudosReason} setKudosReason={setKudosReason} />
        </div>

        <div className="mt-14 w-full flex justify-center">
          <button
            className="text-white bg-blue-400 hover:bg-blue-600 rounded-full w-full mx-20 px-6 py-4"
            onClick={handleSubmit}
          >
            Give Kudos
          </button>
        </div>
      </div>
    </div>
  );
};
