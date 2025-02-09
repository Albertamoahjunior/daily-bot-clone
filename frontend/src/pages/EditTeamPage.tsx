import {  faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { TeamInput } from '../components/TeamInput';
import { TeamInputDropdown } from '../components/TeamDropdownInput';
import {AddMemberModal} from '../components/AddMemberModal'
import { MembersTable } from '../components/MembersTable';
import {useTimeZoneSelection} from '../hooks/useTimeZoneSelection'
import { useState } from 'react';
import { useStandupContext } from "../hooks/useStandupContext"
import { useTeamsContext } from '../hooks/useTeamsContext';
import { Card, CardContent } from '@/components/ui/card';
import {  Settings, AlertCircle } from 'lucide-react';
import { StandupQuestionCard } from '@/components/StandupQuestionCard';
import { StandupQuestion } from '@/types/StandupDashboard';
import { ConfigureStandupModal } from '@/components/ConfigureStandupModal';


export const EditTeamPage = () => {
    const {teamId, team} = useParams();
    const {teams, members} = useTeamsContext();
    const teamObj = teams?.find(t => t.id === teamId);
    const hasStandup = teamObj?.standup !== null;
    const [teamName, setTeamName] = useState((teamObj as Team).teamName);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isStandupModalOpen, setStandupModalOpen] = useState(false);
    const { selectedTimezone, handleTimezoneChange, timezoneOptions } = useTimeZoneSelection({ timezone: (teamObj as Team).timezone });
    const {  standupQuestions } = useStandupContext();
    // Find the current team's standups
    const teamStandupQuestions: StandupQuestion[] = standupQuestions.filter(s => s.teamID === teamId);

    // console.log(members)

    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement> ) => {setTeamName(e.target.value)}


    const handleModalClose = () => {
        setModalOpen(false)
    }

    const handleStandupModalClose = () => {
        setStandupModalOpen(false)
    }

  
    
    const handleDeleteQuestion = (questionIndex: number) => {
      // Implement delete functionality
      console.log('Delete question at index:', questionIndex);
    };


    return (
    <>
        <div className="w-full h-[100%]">
            <div className="w-full pb-2 border-b-2 border-gray-500 flex items-center justify-between">
                <div className="">
                    <h1>This is the <strong>{teamName}</strong> team page</h1>
                    <p className="text-xs">Created At : yugua</p>
                </div>
                <button onClick={() => {setModalOpen(true)}} className='flex items-center gap-2 hover:text-white hover:bg-black rounded-full p-4 transition duration-500 ease-in-out'>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Add New Member</span>
                </button>
            </div>

            <div className="space-y-6">
                <TeamInput 
                labelName={"Team Name"} 
                inputType={'text'} inputPlaceholder={"Enter New Team Name"} inputValue={teamName} onInputChange={handleNameChange}
                />

                {/*Team Input Dropdown */}
                <TeamInputDropdown
                inputName="Select a Team TimeZone"
                options={timezoneOptions}
                selectedValue={selectedTimezone}
                onOptionChange={handleTimezoneChange}
                />
            </div>

            <div>
                <div className="w-full pb-2 border-b-2 border-gray-300 mb-6">
                    <h2 className="text-black font-medium">Team Members</h2>
                </div>

                <div className="bg-white shadow-md rounded-lg">
                    <MembersTable team={teamId as string}/>

                </div>

            </div>

            <div className="mt-8 w-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                    <h2 className="text-xl font-semibold text-slate-800">Standup Questions</h2>
                    <p className="text-sm text-slate-500">Configure your team's daily standup questions</p>
                    </div>
                    {teamStandupQuestions.length <= 0 && <button onClick={() => setStandupModalOpen(true)} className="flex items-center gap-2 bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors duration-200">
                        <Settings className="h-4 w-4" />
                        <span>Configure Questions</span>
                    </button>}
                </div>

                { teamStandupQuestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamStandupQuestions.map((question, idx) => (
                        <StandupQuestionCard
                        key={idx}
                        question={question}
                        onDelete={() => handleDeleteQuestion(idx)}
                        />
                    ))}
                    </div>
                ) : (
                    <Card className="bg-slate-50">
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertCircle className="h-8 w-8 text-slate-400 mb-2" />
                        <h3 className="font-medium text-slate-700">No Standup Questions</h3>
                        <p className="text-sm text-slate-500 mt-1">
                        Start by adding some questions for your team's daily standup.
                        </p>
                    </CardContent>
                    </Card>
                )}
            </div>
            

        </div>

        {isModalOpen && <AddMemberModal  isOpen={isModalOpen} teamId={teamId || ""} onClose={() => handleModalClose()} />}
        {isStandupModalOpen && <ConfigureStandupModal teamId={teamId || ""} isOpen={isStandupModalOpen} onClose={() => handleStandupModalClose()} />}

    </>
    )
}