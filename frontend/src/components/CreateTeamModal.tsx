import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { CreateTeamMembersSearch } from './CreateTeamMembersSearch';
import { AddMembersTable } from './AddMembersTable';
import {TeamInput } from './TeamInput';
import {TeamInputDropdown } from './TeamDropdownInput';
import { useTimeZoneSelection } from '../hooks/useTimeZoneSelection';
import { useTeamsContext } from '@/hooks/useTeamsContext';
import ToggleSwitch from './ToggleSwitch';
import {StandupForm} from './StandupForm';
import { teamService } from '@/services/api';


export const CreateTeamModal = ({isOpen, onClose}:ICreateTeamProps) => {
    const [isChecked, setIsChecked] = useState(false);
    const [teamName, setTeamName] = useState("");
    const { selectedTimezone, handleTimezoneChange, timezoneOptions } = useTimeZoneSelection({timezone:''});
    const {teams, setTeams, addMembers} = useTeamsContext();

    const navigate = useNavigate()


    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement> ) => {setTeamName(e.target.value)}
   
    // Function to close the modal when clicking outside
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCreateTeam = async() =>{

        try{
            // Add new team to the teams array
            //new team object
            const new_team = {
                teamName: teamName,
                timezone: selectedTimezone
            } 

            const teamCreated = await teamService.createTeam(new_team);

            
            const updated_new_team = {
                id: teamCreated.id,
                teamName: teamCreated.team,
                timezone: teamCreated.timezone
            } 

            //also add selected members
            const members_added = await addMembers(teamCreated.id);
            console.log(members_added)
            
            setTeams([...teams, updated_new_team]);
            // Close the modal
            onClose();

            // Redirect to the team page
            navigate('/teams')
            console.log('success')
        }
        catch(err){
            console.error("Error creating team: ", err);
            return;
        }
    }
    
    if (!isOpen) return null; // Do not render the modal if it's not open

    return (
        <div onClick={handleBackdropClick} className="fixed  inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[1200px] h-[700px] overflow-scroll relative">
    
                {/* Close Button */}
                <button
                    className="absolute top-7 right-8  text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faCircleXmark} size={"xl"}/>
                </button>
        
                <div className="w-full items-center text-center justify-center">
                    <h2 className="text-xl font-bold mb-4">Create New team</h2>
                </div>

                <div className='space-y-8 my-6 mb-8 mx-20'>
                    <TeamInput 
                        labelName={"Enter Team Name"} 
                        inputType={'text'} 
                        inputPlaceholder={"Enter New Team Name"} 
                        inputValue={teamName} 
                        onInputChange={handleNameChange}
                    />

                    <TeamInputDropdown
                        inputName="Select a Team TimeZone"
                        options={timezoneOptions}
                        selectedValue={selectedTimezone}
                        onOptionChange={handleTimezoneChange}
                    />
                </div>
        
                <div className="flex flex-col gap-2 mt-4 mx-20">
                    <CreateTeamMembersSearch label={'Add Members To Your New Team'} labelClassName='text-black font-medium text-left ' />
                </div>
        
                <div className="w-full mt-10 flex justify-center">
                    <AddMembersTable  />
                </div>

                <div className="mt-16 mx-20">
                    <ToggleSwitch isChecked={isChecked} toggleIsChecked={()=> setIsChecked(!isChecked)}/>
                </div>

                <div className="mt-10 mx-20">
                {isChecked && <StandupForm />}
                </div>

                <div className="mt-20 w-full flex justify-center">
                    <button className='text-white bg-gray-800 hover:bg-black rounded-lg w-full mx-10 px-6 py-4' onClick={handleCreateTeam}>
                        Create Team
                    </button>
                </div>

            </div>
        </div>
    )
}