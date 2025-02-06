import { useState } from "react";

export interface Member {
  id: string;
  memberName: string;
  status?: "Active" | "Pending activation" | undefined;
  teams : string[];
}

interface UseMembersProps {
  teamID: string;

  members: Member[];

  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;

}

export const useMembers = ({ members, setMembers, teamID }: UseMembersProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<string>("");

  const openModal = (id: string) => {
    setItemToBeDeleted(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setItemToBeDeleted("");
  };

  const deleteMember = () => {
    console.log('Member deleted');
    const confirmDelete = window.confirm("Are you sure you want to delete this team member?");
    if (confirmDelete) {
      const updatedMembers = members.map(member => ({
        ...member,
        teams: member.teams.filter(teamId => teamId !== teamID)
      }));

        setMembers(updatedMembers);
    }
    // setMembers(members.filter((member) => member.id !== itemToBeDeleted));
    closeModal();
  };

  return { isModalOpen, itemToBeDeleted, openModal, closeModal, deleteMember };
};
