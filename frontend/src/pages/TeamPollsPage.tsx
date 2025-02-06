import React,{useState, useEffect} from 'react';
import { AnimationWrapper } from '../common/page-animation';
import { TeamInputDropdown } from '../components/TeamDropdownInput';
import { Button } from '@/components/ui/button';
import {  faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import {useTeamsContext} from '../hooks/useTeamsContext';
import {usePollsContext} from '../hooks/usePollsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {TeamPollsMetrics} from '../components/TeamPollsMetrics'
import {TeamPollsDropdown } from '../components/TeamPollsDropdown '
import {CreateTeamPollModal } from '../components/CreateTeamPollModal'



export const TeamPollsPage = () => {
    const [pageState, setPageState] = useState<"insights"|"all-polls">("insights");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
      const { teams, members } = useTeamsContext();
      const { allPolls, allPollsResponse } = usePollsContext();
    
    const [selectedTeam, setSelectedTeam] = useState('');
    const [membersList, setMembersList] = useState<{ value: string; label: string }[] | undefined>(undefined);
    const [teamsList, setTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
    
    const [teamPollsList, setTeamPollsList] = useState<Poll[]>();
    const [selectedPoll, setSelectedPoll] = useState('');

    const [selectedTeamPoll, setSelectedTeamPoll] = useState<Poll | undefined>(undefined);
    const [selectedTeamPollResponses, setselectedTeamPollResponses] = useState<PollResponse[] | undefined>(undefined);

    useEffect(() => {
        if(selectedPoll){
            console.log("Selected Poll", selectedPoll);
            const teamPoll = allPolls?.find((poll) => poll.id === selectedPoll);
            setSelectedTeamPoll(teamPoll);

            const teamPollResponses = allPollsResponse?.filter((pollResponse) => pollResponse.pollId === selectedPoll );
            setselectedTeamPollResponses(teamPollResponses);
        }

    }, [selectedPoll])

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

        if(selectedTeam){
            const teamPolls = allPolls?.filter((poll) => poll.teamId === selectedTeam );
            setSelectedPoll("");
            setTeamPollsList(teamPolls);

            const filteredMembers = members?.filter((member:Member) => member.teams.includes(selectedTeam))
            .map((member:Member) => ({
                value: member.id,
                label: member.memberName,
            }));
            setMembersList(filteredMembers);
        }else {
            setMembersList(undefined);
        }

    }, [selectedTeam, members]);

    const handlePollChange = (value: string) => {
        setSelectedPoll(value);
    };

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
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors duration-200 "> Create Polls</button>
            </div>
          </header>



          {pageState === "insights" && 
            <main className="flex flex-col gap-6">
                <div className='w-full flex gap-4 bg-white p-4 rounded-sm shadow-sm border-black border-1'>

                    <div className="w-1/2">
                        <TeamInputDropdown
                            inputName="Select a Team To Check Its Mood Recently"
                            options={teamsList}
                            selectedValue={selectedTeam}
                            onOptionChange={handleTeamChange}
                            />

                    </div>
                    <div className="w-1/2">
                        <TeamPollsDropdown 
                            inputName="Select a Team Poll To View Its Analytics Recently"
                            options={teamPollsList}
                            optionText="Select A Team Poll"
                            selectedValue={selectedPoll}
                            onOptionChange={handlePollChange}
                        />
                    </div>
                </div>

                <TeamPollsMetrics teamMembers={membersList} selectedTeamPoll={selectedTeamPoll} selectedTeamPollResponses={selectedTeamPollResponses} />

            </main>
          }


          {pageState === "all-polls" && 
            <main className="flex flex-col gap-6">
                <p>All Polls Page</p>

            </main>
          }
    </div>
    {isModalOpen && <CreateTeamPollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>}

    </AnimationWrapper>
  )
}

