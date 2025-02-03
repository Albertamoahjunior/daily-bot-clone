import { useState } from "react";


interface UseMembersProps {
  members: Member[];
  setAllMembers: (newMembers: Member[]) => void;
}

export const useMembers = ({ members, setAllMembers }: UseMembersProps) => {
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
        setAllMembers(members.filter((member) => member.id !== itemToBeDeleted));
    }
    // setMembers(members.filter((member) => member.id !== itemToBeDeleted));
    closeModal();
  };

  return { isModalOpen, itemToBeDeleted, openModal, closeModal, deleteMember };
};
