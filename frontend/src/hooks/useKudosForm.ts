import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


export const useKudosForm = (teams: Team[], members: Member[]) => {
  const [teamsList, setTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [membersList, setMembersList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('teamwork');
  const [kudosReason, setKudosReason] = useState('');

  // Populate teamsList
  useEffect(() => {
    setTeamsList(
      teams.map((team) => ({
        value: team.teamID,
        label: team.teamName,
      }))
    );
  }, [teams]);

  // Populate membersList based on the selected team
  useEffect(() => {
    if (selectedTeam) {
      const filteredMembers = members
        .filter((member) => member.teamId.includes(selectedTeam))
        .map((member) => ({
          value: member.id,
          label: member.name,
        }));
      setMembersList(filteredMembers);
    } else {
      setMembersList(undefined);
    }
  }, [selectedTeam, members]);

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
  };

  const handleUserSelect = (user: string | null) => {
    if (user && !selectedUsers.includes(user)) {
      setSelectedUsers((prevUsers) => [...prevUsers, user]);
    }
  };

  const handleUserDeselect = (newSelectedUsers: string[]) => {
    setSelectedUsers(newSelectedUsers);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSubmit = () => {
    if (selectedUsers.length > 0 && kudosReason.trim() !== '') {
      toast.success('Kudos sent successfully!');
      // Reset form fields
      setSelectedUsers([]);
      setKudosReason('');
    } else {
      toast.error('Please select at least one recipient and provide a kudos reason.');
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
    
    handleSubmit,
  };
};
