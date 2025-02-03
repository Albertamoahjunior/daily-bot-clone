import { useTeamsContext } from "../hooks/useTeamsContext";
import React, { useState } from "react";

interface FilterProps {
//   teams: string[];
//   members: string[];
  onFilter: (filters: {
    date?: string;
    team?: string;
    member?: string;
  }) => void;
}

export const StandupSearchFilter: React.FC<FilterProps> = ({ onFilter }) => {
  const [date, setDate] = useState<string>("");
  const [team, setTeam] = useState<string>("All");
  const [member, setMember] = useState<string>("All");
  const { teams, members } = useTeamsContext();

  const handleFilter = () => {
    onFilter({
      date: date || undefined,
      team: team !== "All" ? team : undefined,
      member: member !== "All" ? member : undefined,
    });
  };

  return (
    <div className="w-full justify-between  flex items-center space-x-4">
      {/* Date Filter */}
      <div className="w-1/4 flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Team Filter */}
      <div className="w-1/4 flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Team</label>
        <select
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="All">All</option>
          {teams.map((team, index) => (
            <option key={index} value={team.teamName}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>

      {/* Member Filter */}
      <div className="w-1/4 flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Member</label>
        <select
          value={member}
          onChange={(e) => setMember(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="All">All</option>
          {members.map((member, index) => (
            <option key={index} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Button */}
      <div className="w-1/4 flex flex-col items-end">
        <label className="text-sm w-full text-left font-medium text-gray-700 mb-1">Apply Filter</label>
        <button
          onClick={handleFilter}
          className="bg-blue-500 w-full text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

// export default StandupSearchFilter;
