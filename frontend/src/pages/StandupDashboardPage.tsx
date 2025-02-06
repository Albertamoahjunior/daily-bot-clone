import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft,  faUsers, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck, faClock  } from '@fortawesome/free-regular-svg-icons';
import { TeamStandup, StandupQuestion, UserResponse } from '../types/StandupDashboard';
import { useStandupContext } from '../hooks/useStandupContext';
import { useTeamsContext } from '../hooks/useTeamsContext';
import {StandupSearchFilter} from '../components/StandupSearchFilter'
import { TeamStandupCard } from '../components/TeamStandupCard';
import { MetricCard } from '../components/MetricCard';
import { TeamInputDropdown } from '../components/TeamDropdownInput';
import { NoDataCard } from '../components/NoDataCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell  } from 'recharts';
import { AnalyticsCard } from '@/components/AnalyticsCard';

export const StandupDashboardPage = () => {
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const { standups } = useStandupContext();
  const { teams } = useTeamsContext();

  const [filteredStandups, setFilteredStandups] = useState<any[]>([]);
  
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [allTeamsList, setAllTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [selectedTeamm, setSelectedTeam] = useState("");
  // const selectedTeam = standups[selectedTeamIndex];
  const selectedTeamStandup: TeamStandup|undefined = standups.find((standup) => standup.teamId === selectedTeamm );


  const handleTeamSelect = (value: string) => {
    setSelectedTeam(value);
  };

    // Populate teamsList
    useEffect(() => {
      setAllTeamsList(
        teams?.map((team) => ({
          value: team.id,
          label: team.teamName,
        }))
      );
    }, [teams]);

    // Colors for the charts and UI
    const CHART_COLORS = {
        primary: '#3b82f6', // Bright blue
        secondary: '#6366f1', // Indigo
        success: '#22c55e', // Green
        warning: '#f59e0b', // Amber
        background: '#f8fafc', // Slate 50
        text: '#334155', // Slate 700
        lightText: '#64748b', // Slate 500
    };
    
      // Calculate response statistics for pie chart
      const responseStats = useMemo(() => {
        const totalMembers = selectedTeamStandup?.standup[0]?.response.length || 0;
        const responded = selectedTeamStandup?.standup[0]?.response.filter(r => r.answer).length || 0;
        
        return [
          { name: 'Responded', value: responded },
          { name: 'Pending', value: totalMembers - responded },
        ];
      }, [selectedTeamStandup]);




  // Calculate overview metrics
  const overviewMetrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const totalTeams = standups.length;
    const teamsWithTodayStandup = standups.filter(team => 
      team.standup.some(s => s.response.some(r => r.date.startsWith(today)))
    ).length;
    
    const totalResponses = standups.reduce((acc, team) => 
      acc + team.standup.reduce((sum, s) => sum + s.response.length, 0), 0
    );
    
    const avgResponseTime = "9:45 AM"; // This would be calculated from actual timestamps
    
    return {
      completionRate: (teamsWithTodayStandup / totalTeams) * 100,
      pendingStandups: totalTeams - teamsWithTodayStandup,
      totalResponses,
      avgResponseTime
    };
  }, [standups]);

  // Navigate between teams
  const nextTeam = () => {
    setSelectedTeamIndex(prev => 
      prev === standups.length - 1 ? 0 : prev + 1
    );
  };

  const prevTeam = () => {
    setSelectedTeamIndex(prev => 
      prev === 0 ? standups.length - 1 : prev - 1
    );
  };



  // Filter logic
  const handleFilter = (filters: { date?: string; team?: string; member?: string }) => {
    let filtered = standups;

    if(filters.team == "All" || filters.member == "All"){
      setFilteredStandups(standups);
    }

    if (filters.date) {
      filtered = filtered.map((team) => ({
        ...team,
        standup: team.standup.filter((s) =>
          s.response.some((r) => r.date === filters.date)
        ),
      }));
    }

    if (filters.team) {
      filtered = filtered.filter((team) => team.teamName === filters.team);
    }

    if (filters.member) {
      console.log("Filters.memeber: ", filters.member);
      filtered = filtered.map((team) => ({
        ...team,
        standup: team.standup.filter((s) =>
          s.response.some((r) => r.userId === filters.member)
        ),
      }));

      filtered = filtered.map((team) => ({
        ...team,
        standup: team.standup.map((standup) => ({
          ...standup,
          response: standup.response.filter((response) => response.userId === filters.member),
        })).filter((standup) => standup.response.length > 0), // Keep standups with at least one valid response
      }));
      
    }

    console.log("Fitered Results", filtered.filter((team) => team.standup.length > 0));
    // Update the filtered results
    setFilteredStandups(filtered.filter((team) => team.standup.length > 0));

  };

  useEffect(() => {
    if(filteredStandups.length === 0){
        setFilteredStandups(standups);
    }
  }, [])


  const lineChartData = [
    { date: 'Mon', rate: 85 },
    { date: 'Tue', rate: 90 },
    { date: 'Wed', rate: 88 },
    { date: 'Thu', rate: 92 },
    { date: 'Fri', rate: 87 }
  ];



  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6  ">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 text-white mb-8">
          <h1 className="text-3xl font-bold">The Daily Grind</h1>
          <p className="text-slate-100">Team Standup Dashboard</p>
        </div>

    {/* Overview Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Overview Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 py-6 bg-white rounded-lg shadow-sm">
        <MetricCard
            title="Completion Rate"
            value={`${overviewMetrics.completionRate.toFixed(1)}%`}
            icon={faCircleCheck}
            variant="success"
        />
        
        <MetricCard
            title="Pending Standups"
            value={overviewMetrics.pendingStandups}
            icon={faCircleExclamation}
            variant="warning"
        />
        
        <MetricCard
            title="Total Responses"
            value={overviewMetrics.totalResponses}
            icon={faUsers}
            variant="info"
        />
        
        <MetricCard
            title="Avg Response Time"
            value={overviewMetrics.avgResponseTime}
            icon={faClock}
            variant="purple"
        />
        </div>
      </section>

        {/* Team Analytics Section */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center  justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Team Analytics</h2>

            {/* <div className="flex items-center gap-4 bg-slate-100 rounded-lg p-2"> */}
                <TeamInputDropdown
                    className="bg-white mt-4"
                    options={allTeamsList}
                    selectedValue={selectedTeamm}
                    onOptionChange={handleTeamSelect}
                    />
              {/* <button onClick={prevTeam} className="p-2 rounded-full hover:bg-white transition-colors">
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
              <span className="font-medium text-slate-700">{selectedTeam.teamName}</span>
              <button onClick={nextTeam} className="p-2 rounded-full hover:bg-white transition-colors">
                <FontAwesomeIcon icon={faAngleRight} />
              </button> */}
            {/* </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedTeamStandup ? 

            <AnalyticsCard title="Response Rate Trend">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                <XAxis 
                    dataKey="date" 
                    stroke={CHART_COLORS.lightText}
                    tick={{ fill: CHART_COLORS.lightText }}
                />
                <YAxis 
                    stroke={CHART_COLORS.lightText}
                    tick={{ fill: CHART_COLORS.lightText }}
                />
                <Tooltip 
                    contentStyle={{ 
                    backgroundColor: CHART_COLORS.background,
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                />
                <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2.5}
                    dot={{ 
                    fill: CHART_COLORS.primary,
                    strokeWidth: 0
                    }}
                    activeDot={{
                    r: 6,
                    fill: CHART_COLORS.primary,
                    stroke: '#fff',
                    strokeWidth: 2
                    }}
                />
                </LineChart>
            </ResponsiveContainer>
            </AnalyticsCard>
            :
            <NoDataCard title={"No Team Selected"} content={"Please select a team to view the results."}/>
          }


          {selectedTeamStandup ? 
            <AnalyticsCard title="Response Distribution">
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                <Pie
                    data={responseStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    <Cell fill={CHART_COLORS.success} />
                    <Cell fill={CHART_COLORS.warning} />
                </Pie>
                <Tooltip 
                    contentStyle={{ 
                    backgroundColor: CHART_COLORS.background,
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                />
                </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.success }} />
                <span className="text-sm text-slate-600">Responded</span>
                </div>
                <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.warning }} />
                <span className="text-sm text-slate-600">Pending</span>
                </div>
            </div>
            </AnalyticsCard>
              :
              <NoDataCard title={"No Team Selected"} content={"Please select a team to view the results."}/>
            }
        </div>
        </section>


      
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="flex text-center items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Team Standups</h1>
          <button className="bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-lg">
            Export Results
          </button>

        </div>

        {/* Standup Search Filter teams={teams} members={members}  */}
        <StandupSearchFilter onFilter={handleFilter} />
      </div>
      
      {/* Display filtered standups */}
        <div className="mt-6">
            {filteredStandups.length === 0 ? (
            <p>No standups match the filters.</p>
            ) : (
            filteredStandups.map((team: TeamStandup) => (

                <TeamStandupCard 
                    key={team.teamId} 
                    team={team} 
                    expandedTeams= {expandedTeams} 
                    setExpandedTeams = {setExpandedTeams} 
                    expandedQuestions ={ expandedQuestions} 
                    setExpandedQuestions={setExpandedQuestions}
                />

            ))
            )}
        </div>
      
    </div>
  );
};