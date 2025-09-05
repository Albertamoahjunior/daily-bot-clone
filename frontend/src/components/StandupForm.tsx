import MultiSelectDropdown from './MultiSelectDropdown'
import TimeSelectDropdown from './TimeSelectDropdown'
import StandupQuestionForm from './StandupQuestionForm'
import {useStandupModalContext} from "../hooks/useStandupModalContext"
import {useEffect} from 'react'

interface IStandupForm{
    teamId: string | undefined
}
export const StandupForm = ({teamId}: IStandupForm ) => {
    const { setTeamId } = useStandupModalContext()

    useEffect(() => {
        if(teamId){
            setTeamId(teamId)
        }
    }, [])

    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ];

    return (
        <div className="w-full">
            <div className="space-y-10">
                <MultiSelectDropdown label="Select Standup Days" options={daysOfWeek} />
                <TimeSelectDropdown label="Select Your Team's Reminder Times" />
                <p className='text-gray-500 text-sm'>Standup Days and Reminder Times will apply to all Questions Configured</p>
                <StandupQuestionForm onSubmit={()=> {}}/>
            </div>
        </div>
    )
}