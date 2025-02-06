import { useState } from "react";

interface Member {
  id: string;
  memberName: string;
  status: "Active" | "Pending activation";
  teams : string[];
}

interface UseMembersProps {

  members: Member[];

  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;

}

export const useMembers = ({ members, setMembers }: UseMembersProps) => {
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
        setMembers(members.filter((member) => member.id !== itemToBeDeleted));
    }
    // setMembers(members.filter((member) => member.id !== itemToBeDeleted));
    closeModal();
  };

  return { isModalOpen, itemToBeDeleted, openModal, closeModal, deleteMember };
};
