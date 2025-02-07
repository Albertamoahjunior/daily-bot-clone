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
import { exportToExcel } from '@/services/dataExport';

export const StandupDashboardPage = () => {
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const { standups } = useStandupContext();
  const { teams } = useTeamsContext();

  const [filteredStandups, setFilteredStandups] = useState<TeamStandup[]>([]);
  
  const [allTeamsList, setAllTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [selectedTeamm, setSelectedTeam] = useState("");
  const [responseStats, setResponseStats] = useState<{name:string; value: number}[]>();
  const [lineChartData, setLineChartData] = useState<{date:string; rate: number}[]>();
  // const selectedTeam = standups[selectedTeamIndex];
  const selectedTeamStandup: TeamStandup|undefined = standups.find((standup) => standup.teamId === selectedTeamm );


  const handleTeamSelect = (value: string) => {
    setSelectedTeam(value);
  };

  useEffect(() => {
    const stats = calculateResponseStats();
    console.log("Response Stats", stats);
    setResponseStats(stats);
    const chartData = calculateResponseTrend();
    console.log("Line Chart Stats", chartData);
    setLineChartData(chartData);

  }, [selectedTeamStandup])

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
    
    const calculateResponseStats = () => {
      if (!selectedTeamStandup?.standup || selectedTeamStandup.standup.length === 0) {
        return [
          { name: 'Responded', value: 0 },
          { name: 'Pending', value: 0 }
        ];
      }
    
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
    
      // Get unique users who responded today
      const uniqueRespondedUsers = new Set();
      selectedTeamStandup.standup.forEach(question => {
        question.response.forEach(response => {
          // Check if response is from today
          if (response.date.split('T')[0] === today) {
            // Consider a user responded if they either:
            // 1. Provided an answer
            // 2. Selected options
            if (response.answer || (response.options && response.options.length > 0)) {
              uniqueRespondedUsers.add(response.userId);
            }
          }
        });
      });
    
      // Count total unique users across all questions for today
      const totalUniqueUsers = new Set();
      selectedTeamStandup.standup.forEach(question => {
        question.response.forEach(response => {
          if (response.date.split('T')[0] === today) {
            totalUniqueUsers.add(response.userId);
          }
        });
      });
    
      const responded = uniqueRespondedUsers.size;
      const total = totalUniqueUsers.size;
    
      return [
        { name: 'Responded', value: responded },
        { name: 'Pending', value: total - responded }
      ];
    };


    interface TrendDataPoint {
      date: string;
      rate: number;
    }
    
    const calculateResponseTrend = (daysToShow: number = 5): TrendDataPoint[] => {
      if (!selectedTeamStandup || !selectedTeamStandup.standup.length) {
        return [];
      }
    
      // Create a map to store response rates by date
      const responseRatesByDate = new Map<string, {
        uniqueResponders: Set<string>;
        totalUniqueUsers: Set<string>;
      }>();
    
      // Get all responses across all questions
      const allResponses = selectedTeamStandup.standup.flatMap(question => question.response);
    
      // Group responses by date
      allResponses.forEach(response => {
        const dateStr = response.date.split('T')[0];
        
        if (!responseRatesByDate.has(dateStr)) {
          responseRatesByDate.set(dateStr, {
            uniqueResponders: new Set(),
            totalUniqueUsers: new Set()
          });
        }
    
        const dateStats = responseRatesByDate.get(dateStr)!;
        dateStats.uniqueResponders.add(response.userId);
        dateStats.totalUniqueUsers.add(response.userId);
      });
    
      // Get the last n days, including today
      const today = new Date();
      const dates = Array.from({ length: daysToShow }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
    
      // Calculate response rate for each date
      const trendData: TrendDataPoint[] = dates.map(date => {
        const stats = responseRatesByDate.get(date);
        
        if (!stats) {
          return {
            date,
            rate: 0
          };
        }
    
        const respondersCount = stats.uniqueResponders.size;
        const totalUsersCount = stats.totalUniqueUsers.size;
    
        return {
          date,
          rate: totalUsersCount > 0 
            ? Math.round((respondersCount / totalUsersCount) * 100)
            : 0
        };
      });
    
      return trendData;
    };




  // Calculate overview metrics
  const overviewMetrics = useMemo(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    const totalTeams = standups.length;
    
    // Count teams with standups today
    const teamsWithTodayStandup = standups.filter(team => {
      if (!team.standup.length) return false;
      
      // Get unique user responses for today by checking any standup question
      const hasResponseToday = team.standup.some(s => 
        s.response.some(r => r.date.split('T')[0] === today)
      );
      
      return hasResponseToday;
    }).length;
  
    // Count total unique responses by userId and date
    const totalResponses = standups.reduce((acc, team) => {
      // Get all responses from the team
      const responses = team.standup.flatMap(s => s.response);
      
      // Create unique keys combining userId and date (without time)
      const uniqueKeys = new Set(
        responses.map(r => `${r.userId}_${r.date.split('T')[0]}`)
      );
      
      // Add number of unique responses to accumulator
      return acc + uniqueKeys.size;
    }, 0);
  
      // Calculate average response time
    const responseTimestamps = standups.flatMap(team =>
      team.standup.flatMap(question =>
        question.response.map(r => new Date(r.date))
      )
    ).filter(date => date.toISOString().split('T')[0] === today);
    
    let avgResponseTime = "N/A";
    if (responseTimestamps.length > 0) {
      const totalMinutes = responseTimestamps.reduce((acc, date) => {
        const minutes = date.getHours() * 60 + date.getMinutes();
        return acc + minutes;
      }, 0);
      
      const avgMinutes = Math.round(totalMinutes / responseTimestamps.length);
      const hours = Math.floor(avgMinutes / 60);
      const minutes = avgMinutes % 60;
      
      avgResponseTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    }
  
    return {
      completionRate: (teamsWithTodayStandup / totalTeams) * 100,
      pendingStandups: totalTeams - teamsWithTodayStandup,
      totalResponses,
      avgResponseTime
    };
  }, [standups]);




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
          s.response.some((r) => r.date === filters.date?.split('T')[0])
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
        // console.log("Filtered Standups", standups)
        setFilteredStandups(standups);
    }
  }, [standups])


  // const lineChartData = [
  //   { date: 'Mon', rate: 85 },
  //   { date: 'Tue', rate: 90 },
  //   { date: 'Wed', rate: 88 },
  //   { date: 'Thu', rate: 92 },
  //   { date: 'Fri', rate: 87 }
  // ];



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
            title="Completion Rate Today"
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
            title="Avg Response Time Today"
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

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedTeamStandup ? 
              
            <AnalyticsCard title="Response Rate Trend">
              {lineChartData && lineChartData.length <= 0?
                <p className="text-red-400 text-center items-center">No Data To Show</p>:

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
              }
            </AnalyticsCard>
            :
            <NoDataCard title={"No Team Selected"} content={"Please select a team to view the results."}/>
          }


          {selectedTeamStandup ? 
            <AnalyticsCard title="Response Distribution">
                {responseStats?.every(stat => stat.value === 0)?
                  <p className="text-red-400 text-center items-center">No Data To Show</p>:
                  <>
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
                  </>
                }

            </AnalyticsCard>
              :
              <NoDataCard title={"No Team Selected"} content={"Please select a team to view the results."}/>
            }
        </div>
        </section>


      
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="flex text-center items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Team Standups</h1>
          <button className="bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-lg" onClick={() => exportToExcel(standups)}>
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