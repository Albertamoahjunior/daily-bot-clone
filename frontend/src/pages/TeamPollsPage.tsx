import React,{useState, useEffect} from 'react';
import { AnimationWrapper } from '../common/page-animation';
import { TeamInputDropdown } from '../components/TeamDropdownInput';
import { Button } from '@/components/ui/button';
import {  faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import {useTeamsContext} from '../hooks/useTeamsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {TeamPollsMetrics} from '../components/TeamPollsMetrics'



export const TeamPollsPage = () => {
    const [pageState, setPageState] = useState<"insights"|"all-polls">("insights");
      const { teams, members } = useTeamsContext();
    
    const [selectedTeam, setSelectedTeam] = useState('');
    const [membersList, setMembersList] = useState<{ value: string; label: string }[] | undefined>(undefined);
    const [teamsList, setTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);

    const [teamPollsList, setPollsList] = useState()

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

  return (
    <AnimationWrapper key={"mood-page"}>
    <div className="p-6 bg-slate-50 min-h-screen text-gray-800">
          <header className="mb-8">
            <div className="mb-4 flex justify-between">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faSquarePollVertical} className={""} size='2xl'/>
                    <h1 className="text-2xl font-bold text-left text-slate-800">Team Polls</h1>
                 </div>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setPageState("insights")} className={`text-slate-600 hover:underline ${pageState === "insights"? "underline":""}`}>Insights</Button>
                    <Button variant="ghost" onClick={() => setPageState("all-polls")} className={`text-slate-600 hover:underline ${pageState === "all-polls"? "underline":""}`}>All Polls</Button>
                </div>
            </div>

            <div className="flex w-full justify-between">
            <p className="text-left text-lg mt-2">Track and analyze your team's mood trends and engagement</p>
            <button className="flex items-center gap-2 bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors duration-200 "> Create Polls</button>
            </div>
          </header>



          {pageState === "insights" && 
            <main className="flex flex-col gap-6">
                <div className='flex gap-4'>

                    <div className="bg-white p-4 rounded-sm shadow-sm border-black border-1">
                        <TeamInputDropdown
                            inputName="Select a Team To Check Its Mood Recently"
                            options={teamsList}
                            selectedValue={selectedTeam}
                            onOptionChange={handleTeamChange}
                            />

                    </div>
                    <div>
                        <TeamPollsDropdown 
                            inputName="Select a Team Poll To View Its Analytics Recently"
                            options={teamPollsList}
                            selectedValue={selectedTeam}
                            onOptionChange={handleTeamChange}
                        />
                    </div>
                </div>

                <TeamPollsMetrics />

            </main>
          }


          {pageState === "all-polls" && 
            <main className="flex flex-col gap-6">
                <p>All Polls Page</p>

            </main>
          }
    </div>

    </AnimationWrapper>
  )
}

