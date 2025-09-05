import { useState } from "react";
import {teamService} from "../services/api"
import { useTeamsContext } from "./useTeamsContext";



interface UseMembersProps {
  teamID: string;

  members: Member[];

  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;

}

export const useMembers = ({ members, setMembers, teamID }: UseMembersProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<string>("");
  const {toggleReloadTeams} = useTeamsContext();

  const openModal = (id: string) => {
    setItemToBeDeleted(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setItemToBeDeleted("");
  };

  const deleteMember = async () => {
    console.log('Team whose member to be deleted', teamID);
    console.log('Member to be deleted', itemToBeDeleted);
    const confirmDelete = window.confirm("Are you sure you want to delete this team member?");
    if (confirmDelete) {
      const updatedMembers = members?.map(member => ({
        ...member,
        teams: member.teams.filter(teamId => teamId !== teamID)
      }));

      setMembers(updatedMembers);
      try{
        const response = await teamService.removeMembersFromTeam(teamID, {members: [itemToBeDeleted]} )
        if(response){

          toggleReloadTeams();
          console.log("Successfully Deleted Member!")
        }else{
          console.log("Failed To Delete Member")
        }

      }catch(err){
        console.log("Failed To Delete Member")
      }
    }
    // setMembers(members.filter((member) => member.id !== itemToBeDeleted));
    closeModal();
  };

  return { isModalOpen, itemToBeDeleted, openModal, closeModal, deleteMember };
};
