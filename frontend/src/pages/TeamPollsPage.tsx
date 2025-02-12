import {useState, useEffect} from 'react';
import { AnimationWrapper } from '../common/page-animation';
import { TeamInputDropdown } from '../components/TeamDropdownInput';
import { Button } from '@/components/ui/button';
import {  faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import { CheckCircle2, Settings2 } from 'lucide-react';
import {useTeamsContext} from '../hooks/useTeamsContext';
import {usePollsContext} from '../hooks/usePollsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {TeamPollsMetrics} from '../components/TeamPollsMetrics'
import {TeamPollsDropdown } from '../components/TeamPollsDropdown '
import {CreateTeamPollModal } from '../components/CreateTeamPollModal'
import {pollService} from "../services/api"
import {useSelector} from 'react-redux';
import { RootState } from '../state/store';
// import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
//import { usePolls } from '@/services/query_hooks/usePolls';




export const TeamPollsPage = () => {
    const [pageState, setPageState] = useState<"insights"|"all-polls">("insights");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { teams, members } = useTeamsContext();
    const { allPolls, allPollsResponse, everyPollsResponse, setTeamId } = usePollsContext();
    const is_admin = useSelector((state: RootState) => state.authState.is_admin);

    //const { data: allPolls} = usePolls();

    
    const [selectedTeam, setSelectedTeam] = useState('');
    const [membersList, setMembersList] = useState<{ value: string; label: string }[] | undefined>(undefined);
    const [teamsList, setTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
    
    // const [teamPollsList, setTeamPollsList] = useState<Poll[]>();
    const [selectedPoll, setSelectedPoll] = useState('');

    const [selectedTeamPoll, setSelectedTeamPoll] = useState<Poll | undefined>(undefined);
    const [selectedTeamPollResponses, setselectedTeamPollResponses] = useState<PollResponse[] | undefined>(undefined);

    const [pollQuestions, setPollQuestions] = useState<Poll[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPollQuestions = async () => {
            try {
                setIsLoading(true);
                
                // Get unique teamIds from the response data
                const pollResponses: PollResponse[]|undefined = everyPollsResponse;
                const uniqueTeamIds = [...new Set(pollResponses?.map(response => response.teamId))];
                
                // Fetch poll questions for each unique teamId
                const allPollQuestions: Poll[] = [];
                
                for (const teamId of uniqueTeamIds) {
                    try {
                        const data = await pollService.getTeamPollQuestions(teamId);
                        
                        if (data && data.length) {
                            // Add new questions that aren't already in the array
                            data.forEach((question: Poll) => {
                                const exists = allPollQuestions.some(q => q.id === question.id);
                                if (!exists) {
                                    allPollQuestions.push(question);
                                }
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching poll questions for team ${teamId}:`, error);
                    }
                }

                setPollQuestions(allPollQuestions);
            } catch (error) {
                console.error('Error fetching poll questions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPollQuestions();
    }, [everyPollsResponse]); 



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



    // Populate pollsList based on the selected team
    useEffect(() => {

        if(selectedTeam){
            setTeamId(selectedTeam);
            // const teamPolls = allPolls?.filter((poll) => poll.teamId === selectedTeam );
            setSelectedPoll("");
            // setTeamPollsList(teamPolls);

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
        setTeamId(value);
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
                    <Button variant="ghost" onClick={() => setPageState("all-polls")} className={`text-slate-600 hover:underline ${pageState === "all-polls"? "underline":""}`}>All Polls Responses</Button>
                </div>
            </div>

            <div className="flex w-full justify-between">
            <p className="text-left text-lg mt-2">Track and analyze your team's mood trends and engagement</p>
            { is_admin && <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors duration-200 "> Create Polls</button>}
            </div>
          </header>



          {pageState === "insights" && 
            <main className="flex flex-col gap-6">
                <div className='w-full flex gap-4 bg-white p-4 rounded-sm shadow-sm border-black border-1'>

                    <div className="w-1/2">
                        <TeamInputDropdown
                            inputName="Select a Team To View Its Poll Recently"
                            options={teamsList}
                            selectedValue={selectedTeam}
                            onOptionChange={handleTeamChange}
                        />

                    </div>
                    <div className="w-1/2">
                        <TeamPollsDropdown 
                            inputName="Select a Team Poll To View Its Analytics Recently"
                            options={allPolls}
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
                {everyPollsResponse?.map(pollResponse => (
                    <div className="w-full p-4 border border-slate-900 rounded-lg ">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-5 w-5 text-slate-600" />
                        <h2 className="text-lg font-medium text-slate-900">{pollQuestions?.find((poll) => poll.id === pollResponse.pollId)?.choiceType} Choice</h2>
                        </div>
                        <p className="text-sm text-slate-600 ml-7">
                        {pollQuestions?.find((poll) => poll.id === pollResponse.pollId)?.question}
                        </p>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-slate-600 ml-7 mt-1">
                            By: {members?.find((member) => member.id === pollResponse.userId)?.memberName.toUpperCase()}
                            </p>
                            <p className="text-sm text-slate-600 ml-7 mt-1">
                            In: {teams?.find((team) => team.id === pollResponse.teamId)?.teamName.toUpperCase()}
                            </p>


                        </div>
                    </div>

                    <div className="space-y-2">
                        {pollQuestions?.find((poll) => poll.id === pollResponse.pollId)?.options.map((option) => (
                        <div
                            key={option}
                            className={`${pollResponse.answer.includes(option) ? "border border-slate-900 bg-white":"border border-slate-200 "} flex items-center space-x-3 p-4 rounded-lg  `}
                        >
                            <div className="flex items-center space-x-3">
                            <Settings2 className="h-5 w-5 text-slate-600" />
                            <span className="text-sm font-medium text-slate-900">
                                {option}
                            </span>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                ))}

            </main>
          }
    </div>
    {isModalOpen && <CreateTeamPollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>}

    </AnimationWrapper>
  )
}

