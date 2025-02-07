import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {kudosService} from '../services/api';
import {useNavigate} from 'react-router-dom'

export const useKudosForm = (teams: Team[]|undefined, members: Member[]|undefined) => {
  const [teamsList, setTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [membersList, setMembersList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUsers, setSelectedUsers] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('teamwork');
  const [kudosReason, setKudosReason] = useState('');
  const navigate = useNavigate();

    const [giverId, setGiverId] = useState<string>('');
    const handleGiverSelect = (user: string | null) => {
      if (user) {
        setGiverId(user);
      }
    };
  
    // Modified to handle single user selection
    const handleGiverDeselect = () => {
      setGiverId('');
    };

  // Populate teamsList
  useEffect(() => {
    setTeamsList(
      teams?.map((team) => ({
        value: team.id,
        label: team.teamName,
      }))
    );
  }, [teams]);

  // Populate membersList based on the selected team
  useEffect(() => {
    console.log("SelectedTeam", selectedTeam);
    console.log("Members in useKudos", members);
    if (selectedTeam) {
      const filteredMembers = members
        ?.filter((member) => member?.teams.includes(selectedTeam))
        .map((member) => ({
          value: member.id,
          label: member.memberName,
        }));
      console.log("Filtered Members", filteredMembers);
      setMembersList(filteredMembers);
    } else {
      setMembersList(undefined);
    }
  }, [selectedTeam, members]);

  useEffect(() => {
    if(!giverId && selectedTeam && members){
      const filteredMembers = members
        .filter((member) => member?.teams.includes(selectedTeam))
        .map((member) => ({
          value: member.id,
          label: member.memberName,
        }));
      setMembersList(filteredMembers);
    } 
    else if (giverId && members) {
      const filteredMembers = members
        .filter((member) => 
          member?.teams.includes(selectedTeam) && 
          member.id !== giverId
        )
        .map((member) => ({
          value: member.id,
          label: member.memberName,
        }));
      setMembersList(filteredMembers);
    }
  }, [giverId, selectedTeam, members]); // Remove membersList from dependencies

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
  };

  const handleUserSelect = (user: string | null) => {
    if (user) {
      setSelectedUsers(user);
    }
  };

  // Modified to handle single user selection
  const handleUserDeselect = () => {
    setSelectedUsers('');
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSubmit = async () => {
    // Check if required fields are filled
    if (selectedUsers && kudosReason.trim() !== '' && giverId) {
      const kudosPayload = {
        teamId: selectedTeam,
        giverId: giverId,
        receiverId: selectedUsers, // Sending single string instead of array
        category: selectedCategory,
        reason: kudosReason,
      };
  
      try {
        // Send the request using Axios
        const response = await kudosService.createKudos(kudosPayload);
        console.log("Response", response)
        // Check if the response indicates success
        if (response ) {
          console.log('Kudos created successfully');
          toast.success('Kudos sent successfully!');
          // Reset form fields
          navigate('/kudos');
          setSelectedTeam('');
          setSelectedUsers('');
          setGiverId('');
          setKudosReason('');
        } else {
          console.error('Error creating kudos. Make sure all fields are filled', response);
          toast.error('Failed to send kudos. Please try again.');
        }
      } catch (error) {
        console.error('Error creating kudos:', error);
        toast.error('Failed to send kudos. Please try again.');
      }
    } else {
      toast.error('Please select a recipient and provide a kudos reason.');
    }
  };
  

  return {
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
    setKudosReason,

    giverId,
    setGiverId,
    handleGiverSelect,
    handleGiverDeselect,
    
    handleSubmit,
  };
};