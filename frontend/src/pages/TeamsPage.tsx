
import {useState, useEffect} from 'react';
//import {  faCirclePlus } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {TeamCard} from "../components/TeamCard";
import { CreateTeamModal } from '../components/CreateTeamModal';
import { useTeamsContext } from '../hooks/useTeamsContext';
import { useStandupContext } from '../hooks/useStandupContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';
import { TeamStandup } from '@/types/StandupDashboard';
import {useSelector} from 'react-redux';
import { RootState } from '../state/store';


export interface TeamsOverviewCardProps {
    title: string;
    value: number | string | undefined;
    valueClassname? :string;
    icon: React.ComponentType<{ className?: string }>;
  }

export const TeamsPage = () => {
    // const authState = useSelector(())
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {teams, members} = useTeamsContext();
    const {standups} = useStandupContext();
    const totalMembers = members?.length;
    const [activeTeams,setActiveTeams] = useState<number | undefined>();
    const [mostActiveTeams,setMostActiveTeams] = useState<TeamActivity[] | undefined>();
    const is_admin = useSelector((state: RootState) => state.authState.is_admin);
    const userId = useSelector((state: RootState) => state.authState.id);

    const user = members?.find(member => member.id === userId);
   

    useEffect(() => {
      const mostActiveTeams = getMostActiveTeams();
      setMostActiveTeams(mostActiveTeams)
      const activeTeams = teams?.length;
      setActiveTeams(activeTeams);
    }, [standups, teams])
  // Calculate metrics

  interface TeamActivity {
    teamId: string;
    teamName: string;
    activityScore: number;
    metrics: {
      totalResponses: number;
      responsesLastWeek: number;
      activeMembers: number;
      configuredStandups: boolean;
      standupDays: number;
    };
  }
  
  const calculateTeamActivity = (
    teams: Team[] | undefined, 
    standupHistory: TeamStandup[]
  ): TeamActivity[]|undefined => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    return teams?.map(team => {
      // Find standup history for this team
      const teamStandupHistory = standupHistory.find(s => s.teamId === team.id);
      
      // Calculate total responses
      const totalResponses = teamStandupHistory?.standup.reduce(
        (sum, question) => sum + question.response.length,
        0
      ) || 0;
  
      // Calculate responses in the last week
      const responsesLastWeek = teamStandupHistory?.standup.reduce(
        (sum, question) => sum + question.response.filter(
          r => new Date(r.date) >= oneWeekAgo
        ).length,
        0
      ) || 0;
  
      // Count active members (members who responded at least once)
      const activeMembers = teamStandupHistory
        ? new Set(
            teamStandupHistory.standup.flatMap(q => 
              q.response.map(r => r.userId)
            )
          ).size
        : 0;
  
      // Check if team has configured standups
      const hasConfiguredStandups = Boolean(team.standup);
      
      // Get number of standup days configured
      const standupDays = team.standup?.standupDays.length || 0;
  
      // Calculate activity score
      // This formula can be adjusted based on what factors are most important
      const activityScore = (
        (responsesLastWeek * 3) + // Recent activity weighted more heavily
        (totalResponses) +
        (activeMembers * 2) +
        (hasConfiguredStandups ? 5 : 0) +
        (standupDays * 2)
      );
  
      return {
        teamId: team.id,
        teamName: team.teamName,
        activityScore,
        metrics: {
          totalResponses,
          responsesLastWeek,
          activeMembers,
          configuredStandups: hasConfiguredStandups,
          standupDays
        }
      };
    });
  };
  
  const getMostActiveTeams = ( limit: number = 3) => {
    const teamActivity = calculateTeamActivity(teams, standups);
    
    return teamActivity?.sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, limit);
  };
  
//   const recentActivities = teams.filter(team => 
//     team.status === 'active' && new Date(team.createdAt || '').getMonth() === new Date().getMonth()
//   ).length;

    const TeamsOverviewCard: React.FC<TeamsOverviewCardProps> = ({ title, value, icon: Icon, valueClassname }) => (
        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-800">{title}</CardTitle>
            <Icon className="h-5 w-5 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold text-slate-700 ${valueClassname}`}>{value}</div>
          </CardContent>
        </Card>
      );


    return (
        <>
        <div className='w-full p-6'>
            {/* <h2 className="text-3xl text-[#1F2937]">Goodmorning James!</h2>

            <div className="flex justify-between items-center ">
                <p>Manage Your Teams</p>
                <button onClick={() => setIsModalOpen(true)} className="flex text-white bg-black hover:border-2 hover:border-black
                 hover:text-black hover:bg-white rounded-full p-4 transition duration-500 ease-in-out ">
                    <FontAwesomeIcon icon={faCirclePlus} size={"lg"} />
                    <span className="ml-2">Create New Team</span>
                </button>
            </div> */}


      <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.memberName}!</h2>
        <p className="text-white/80">Manage and organize your teams efficiently</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <TeamsOverviewCard
          title="Active Teams"
          value={activeTeams}
          icon={Users}
        />
        <TeamsOverviewCard
          title="Total Members"
          value={totalMembers}
          icon={Users}
        />
        <TeamsOverviewCard
          title="Most Active Team"
          valueClassname="text-2xl"
          value={mostActiveTeams? mostActiveTeams[0].teamName.toUpperCase() : "None"}
          icon={Users}
        />
      </div>

      {/* Teams Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-slate-800">Your Teams</h3>
                    <p className="text-slate-500 text-sm">Manage and organize your team structures</p>
                </div>
                {
                  is_admin?
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="flex items-center gap-2 bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors duration-200"
                >
                    <Plus className="h-5 w-5" />
                    <span>Create New Team</span>
                </button>

                :
                <></>
                }
            </div>
            </div>



            <div className="w-full flex flex-col gap-4">
                {teams?.map((team) => {
                    return <TeamCard teamId={team.id as string} teamName={team.teamName}/>
                })}
            </div>
        </div>
        {isModalOpen && <CreateTeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>}
        </>
    )
}