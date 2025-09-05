import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TeamInputDropdown } from './TeamDropdownInput';
import { MoodMemberInput } from './MoodMemberInput';
import { useState } from 'react';
import { MoodResponse, Emoji } from '../types/Mood';

interface IMemberMoodHistoryProps {
    moodHistTeamsList: { value: string; label: string }[] | undefined;
    moodHistMembersList: { value: string; label: string }[] | undefined;
    selectedMoodHistTeam: string;
    handleMoodHistTeamChange: (value: string) => void;
    moodHistSelectedUser: string;
    moodHistDate: string;
    handleDateSelect: (date: string | null) => void;
    handleMoodHistUserSelect: (user: string | null) => void;
    handleMoodHistUserDeselect: () => void;
    filteredMoodResponses: MoodResponse[] | undefined;
    onFilter: () => void;
    allEmojis: Emoji[] | undefined;
}

export const MemberMoodHistory = ({
    moodHistTeamsList, 
    selectedMoodHistTeam, 
    handleMoodHistTeamChange,
    moodHistMembersList,
    moodHistSelectedUser,
    handleMoodHistUserSelect,
    moodHistDate,
    handleDateSelect,
    onFilter,
    filteredMoodResponses,
    handleMoodHistUserDeselect,
    allEmojis,
}: IMemberMoodHistoryProps) => {



    return (
        <>
        <Card className="bg-white shadow-2xl rounded-2xl">
            <CardHeader>
                <CardTitle>Find Member Mood History</CardTitle>
                <div className="w-full grid grid-cols-4 gap-4 items-center mt-8">
                    <TeamInputDropdown
                        inputName="Select a Team"
                        className=""
                        options={moodHistTeamsList}
                        selectedValue={selectedMoodHistTeam}
                        onOptionChange={handleMoodHistTeamChange}
                    />
                    <MoodMemberInput
                        members={moodHistMembersList}
                        className="mb-4"
                        selectedUser={moodHistSelectedUser}
                        onUserSelect={handleMoodHistUserSelect}
                        onUserDeselect={handleMoodHistUserDeselect}
                    />
                    {/* Date Filter */}
                    <div className="flex flex-col mb-4">
                        <label className="text-base font-medium text-black mb-2 block">Date</label>
                        <input
                            type="date"
                            value={moodHistDate}
                            onChange={(e) => handleDateSelect(e.target.value)}
                            className="h-11 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    {/* Filter Button */}
                    <div className="flex flex-col items-end mb-4">
                        <label className="text-base w-full text-left font-medium text-gray-700 mb-2">Apply Filter</label>
                        <button
                            onClick={onFilter}
                            className="h-11 bg-blue-500 w-full text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Filter
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className=''>
                {/* Display filtered mood responses */}
                <div className="mt-6">
                    {!filteredMoodResponses || filteredMoodResponses.length <= 0 ? (
                        <p>No Mood Responses match the filters.</p>
                    ) : (
                        filteredMoodResponses.map((moodResponse: MoodResponse) => (
                            <Card key={moodResponse.id} className="w-full mx-auto shadow-md mb-4">
                                <CardHeader className="flex flex-row items-center space-x-4">
                                     {/* Ensure this function is defined */}
                                    <h2 className="text-lg font-semibold">
                                        Team: {moodHistTeamsList?.find((team) => team.value === moodResponse.teamId)?.label}
                                    </h2>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">How are you feeling today?</p>
                                    <div className="space-y-2">
                                        <div className='flex w-full justify-between'>
                                            <p>{moodHistMembersList?.find((member) => member.value === moodResponse.userId)?.label}</p>
                                            <p className="text-black">{allEmojis?.find((emoji) => emoji.emoji.toLowerCase() === moodResponse.moodId.toLowerCase())?.icon}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                {new Date(moodResponse.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>


        </>

    );
};
