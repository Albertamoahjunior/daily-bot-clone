import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis,
  ResponsiveContainer ,
  AreaChart, Area,
  CartesianGrid
} from 'recharts';
import { 
  Download, 
  Filter, 
  Calendar ,
  Trophy, 
  CheckCircle2,
  TrendingUp, Clock, Battery
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {TeamMood, MoodResponse} from "../types/Mood"
import { useTeamsContext } from '@/hooks/useTeamsContext';
import { useStandupContext } from '../hooks/useStandupContext';
import { kudosService, pollService, moodService } from '@/services/api';
import { TeamInputDropdown } from '../components/TeamDropdownInput';
import {CustomTooltip} from "../components/CustomTooltip"
import {MoodData} from "../types/Mood"
import { StandupResponse, UserResponse } from '@/types/StandupDashboard';



const kudosCategories = [
  { name: 'Collaboration', value: 400 },
  { name: 'Innovation', value: 300 },
  { name: 'Leadership', value: 200 },
  { name: 'Problem Solving', value: 250 },
  { name: 'Mentorship', value: 180 }
];

interface AnalyticsData {
  teamName: string;          // Name of the team
  standupCompletion: number; // Percentage of standup completion
  avgResponseTime: number;   // Average response time in minutes
  kudosGiven: number;        // Number of kudos given
  pollParticipation: number; // Percentage of poll participation
  avgMood: number;          // Average mood rating (e.g., 1 to 5 scale)
}



// const enhancedTeamData = [
//   { 
//     teamName: 'Engineering',
//     metrics: {
//       standup: {
//         completion: 92,
//         avgTime: '9:15 AM',
//         quality: 4.5,
//         streak: 15,
//         commonBlockers: ['API delays', 'Environment issues']
//       },
//       engagement: {
//         meetingAttendance: 95,
//         documentCollaboration: 88,
//         crossTeamInteraction: 78,
//         responseTime: 12
//       },
//       mood: {
//         current: 4.2,
//         variance: 0.3,
//         workloadIndex: 72,
//         burnoutRisk: 'Low',
//         satisfaction: 85
//       }
//     }
//   }
//   // ... other teams
// ];


const moodTrendsData = [
  { date: 'Jan', Engineering: 4.2, Marketing: 3.8, Sales: 4.0 },
  { date: 'Feb', Engineering: 4.0, Marketing: 3.9, Sales: 4.1 },
  { date: 'Mar', Engineering: 4.3, Marketing: 4.0, Sales: 4.2 }
];

// const kudosDistributionData = [
//   { name: 'Collaboration', value: 400 },
//   { name: 'Innovation', value: 300 },
//   { name: 'Leadership', value: 200 }
// ];

// const radarData = [
//   { metric: 'Standups', Engineering: 90, Marketing: 85, Sales: 88 },
//   { metric: 'Mood', Engineering: 85, Marketing: 80, Sales: 82 },
//   { metric: 'Kudos', Engineering: 95, Marketing: 75, Sales: 85 },
//   { metric: 'Polls', Engineering: 92, Marketing: 88, Sales: 90 }
// ];

// Interface for each data point in the radar chart
interface RadarDataPoint {
  metric: string;
  [teamName: string]: string | number; // Dynamic team names as properties
}

// Type for the full radar dataset
// type RadarDataset = RadarDataPoint[];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
// Expanded color palette with 20 visually distinct colors
const COLOR_PALETTE = [
  '#FF6B6B',  // Coral Red
  '#4ECDC4',  // Turquoise
  '#45B7D1',  // Sky Blue
  '#96CEB4',  // Sage Green
  '#FFEEAD',  // Cream Yellow
  '#D4A5A5',  // Dusty Rose
  '#9B59B6',  // Purple
  '#3498DB',  // Blue
  '#E67E22',  // Orange
  '#27AE60',  // Emerald Green
  '#E84393',  // Pink
  '#74B9FF',  // Light Blue
  '#FFA502',  // Dark Yellow
  '#16A085',  // Green Sea
  '#8E44AD',  // Wisteria
  '#2980B9',  // Belize Hole
  '#F1C40F',  // Sun Flower
  '#D35400',  // Pumpkin
  '#2ECC71',  // Emerald
  '#E74C3C'   // Alizarin
];

interface TimeCount {
  time: string;
  count: number;
}

export const AnalyticsPage: React.FC = () => {
  const {teams, members} = useTeamsContext();
  const { standups, standupQuestions } = useStandupContext();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>();
  const [allConfiguredMoods, setAllConfiguredMoods] = useState<TeamMood[]>([]);
  const [allMoodResponses, setAllMoodResponses] = useState<MoodResponse[]>([]);
  const [radarData, setRadarChartData] = useState<RadarDataPoint[]>();
  const [kudosDistributionData, setKudosDistributionData] = useState<{ name: string; value: number }[]>([]);
  
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [teamsList, setTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [teamMoodSummaryByDate, setTeamMoodSummaryByDate] = useState<MoodData[]>()

  const [standupTimingDistribution, setStandupTimingDistribution] = useState<TimeCount[] | []>([]);

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
  };

  // Populate teamsList
  useEffect(() => {
    setTeamsList(
      teams?.map((team) => ({
        value: team.id,
        label: team.teamName,
      }))
    );

  }, [teams]);

  useEffect(() => {
    const fetchMoodData = async (teamId: string) => {
      const data = await moodService.getMoodAnalyticsForTeam(teamId);
      console.log("Selected Team: ", teamId);
      console.log("Mood Data For Selected Team", data);
      setTeamMoodSummaryByDate(data);
    };
    
    if (selectedTeam) {
      fetchMoodData(selectedTeam);

    } 
  }, [selectedTeam]);

useEffect(() => {
  const fetchMoodData = async () => {
    try {
      const moods = await moodService.getMoods();
      const moodResponses = await moodService.getAllmoodResponses();
      
      setAllConfiguredMoods(moods);
      setAllMoodResponses(moodResponses);
    } catch (err) {
      console.error("Failed to fetch mood data", err);
    }
  };

  fetchMoodData();
}, []); // Empty dependency array ensures it runs only once when the component mounts


  const [teamWithMostStandups, setTeamWithMostStandups] = useState<Team | null | undefined>(null);



   const findTeamWithMostStandupResponses = () => {
    if (!standups || standups.length === 0) return null;

    let maxTeam = null;
    let maxResponses = 0;
  
    for (const team of standups) {
      // Count the number of responses across all standups for this team
      const responseCount = team.standup.reduce((total, entry) => total + entry.response.length, 0);
  
      if (responseCount > maxResponses) {
        maxResponses = responseCount;
        maxTeam = team;
      }
    }
  
    return maxTeam? teams?.find((team) => team.id == maxTeam.teamId) : null;
  };


  const findKudosDistribution = async () => {
    try {
      const allKudos: Kudos[] = await kudosService.getAllKudos();

      // Define categories to track
      const categories = ["teamwork", "innovation", "leadership", "creativity"];
      const categoryCount: Record<string, number> = {
        teamwork: 0,
        innovation: 0,
        leadership: 0,
        creativity: 0,
      };

      // Count occurrences
      allKudos.forEach(({ category }) => {
        const normalizedCategory = category.toLowerCase();
        if (categories.includes(normalizedCategory)) {
          categoryCount[normalizedCategory]++;
        }
      });

      // Convert to array format
      const formattedData = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value,
      }));

      setKudosDistributionData(formattedData);
    } catch (err) {
      console.error("Failed to fetch All Kudos in Analytics page", err);
    }
  };
  

  const generateStandupTimingDistribution = () => {
    const timeCounts: Record<string, number> = {}; // Explicitly define the type
  
    standups?.forEach((team) => {
      team.standup.forEach((question:StandupResponse) => {
        question.response.forEach((response:UserResponse) => {
          const date = new Date(response.date);
          const hours = date.getHours();
          const minutes = Math.floor(date.getMinutes() / 15) * 15; // Round to nearest 15 min
          const timeKey: string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
          timeCounts[timeKey] = (timeCounts[timeKey] || 0) + 1;
        });
      });
    });
  
    // Convert the counts into an array of objects
    return Object.entries(timeCounts).map(([time, count]) => ({ time, count }));
  };

  useEffect(() => {
    const calculateStandupCompletion = (teamId: string ) => {
      const teamMembers =  members?.filter(m => m.teams.includes(teamId));
      
      const teamStandup = standups.find(s => s.teamId === teamId);
      if (!teamStandup) return 0; // No standups, 0% completion
    
      const teamStandupQuestions = standupQuestions.filter(q => q.teamId === teamId);
      if (teamStandupQuestions.length === 0 || teamMembers?.length === 0) return 0; // Avoid division by zero
    
      // Count total responses given
      const totalResponsesGiven = teamStandup.standup.reduce((acc, question) => acc + question.response.length, 0);
    
      // Expected responses (each member should ideally respond to all questions)
      const totalExpectedResponses = teamStandupQuestions.length * (teamMembers?.length || 0);
    
      return totalExpectedResponses === 0 ? 0 : Math.round((totalResponsesGiven / totalExpectedResponses) * 100);
    };


    const calculateAvgResponseTime = (teamId: string): string => {
      // Find the team's standup data
      const teamStandup = standups.find((s) => s.teamId === teamId);
    
      if (!teamStandup || teamStandup.standup.length === 0) {
        return "0"; // No standups or responses, return "0"
      }
    
      let responseTimes: number[] = [];
    
      teamStandup.standup.forEach((question) => {
        let userResponses: { [userId: string]: number[] } = {}; // Explicit index signature
    
        question.response.forEach((res) => {
          const userId = res.userId;
          const timestamp = new Date(res.date).getTime();
    
          if (!userResponses[userId]) {
            userResponses[userId] = [];
          }
          userResponses[userId].push(timestamp);
        });
    
        // Calculate time differences per user
        Object.values(userResponses).forEach((timestamps) => {
          if (timestamps.length > 1) {
            timestamps.sort((a, b) => a - b); // Sort timestamps
            for (let i = 1; i < timestamps.length; i++) {
              responseTimes.push((timestamps[i] - timestamps[i - 1]) / 60000); // Convert ms to minutes
            }
          }
        });
      });
    
      // Compute the average response time
      const avgResponseTime =
        responseTimes.length > 0
          ? responseTimes.reduce((sum, time) => sum + time, 0) /
            responseTimes.length
          : 0;
    
      return avgResponseTime.toFixed(2); // Return rounded value as string
    };


    const calculateKudosGiven = async (teamId: string): Promise<number> => {
      try {
        const allKudos = await kudosService.getTeamKudos(teamId);
    
        if (!allKudos || allKudos.length === 0) {
          return 0; // No kudos found for this team
        }
    
        // Count the total kudos given by all users
        const kudosGivenCount = allKudos.length; 
    
        return kudosGivenCount;
      } catch (err) {
        console.error("Failed to fetch Team Kudos in Analytics page", err);
        return 0;
      }
    };


    const calculateAverageParticipationPercentage = async (teamId: string): Promise<number> => { 
      // Find all team members
      const teamMembers = members?.filter(m => m.teams.includes(teamId)) || [];
      const totalMembers = teamMembers.length;
    
      if (totalMembers === 0) return 0; // Avoid division by zero
    
      try {
        // Fetch all team poll questions and responses
        const allTeamPollQuestions = await pollService.getTeamPollQuestions(teamId);
        const allTeamPollResponses = await pollService.getTeamPollResponses(teamId);
    
        if (!allTeamPollQuestions.length) return 0; // No polls means no participation
    
        // Group responses by pollId
        const responsesByPoll: Record<string, Set<string>> = {};
        allTeamPollResponses.forEach((response:PollResponse)  => {
          if (!responsesByPoll[response.pollId]) {
            responsesByPoll[response.pollId] = new Set();
          }
          responsesByPoll[response.pollId].add(response.userId); // Store unique userIds
        });
    
        // Calculate participation percentage for each poll
        const pollParticipationRates = allTeamPollQuestions.map((poll:Poll) => {
          const uniqueParticipants = responsesByPoll[poll.id]?.size || 0;
          return (uniqueParticipants / totalMembers) * 100;
        });
    
        // Compute the average participation percentage
        const averageParticipation = pollParticipationRates.reduce((sum: number, rate: number) => sum + rate, 0) / allTeamPollQuestions.length;
    
        return Number(averageParticipation.toFixed(2)); // Round to 2 decimal places
      } catch (err) {
        console.error("Failed to calculate participation percentage", err);
        return 0;
      }
    };
    

    const calculateAvgTeamMood = async (teamId: string) => {
      try {

        // Step 1: Filter valid moods
        const validMoodNames = ["excited", "smile", "meh", "angry", "sad"];
        const filteredMoods: TeamMood[] = allConfiguredMoods.filter(mood =>
          validMoodNames.includes(mood.mood.toLowerCase())
        );
    
        // Step 2: Map moods by their names (for quick lookup)
        const moodMap: { [key: string]: number } = {};
        filteredMoods.forEach((mood: TeamMood) => {
          moodMap[mood.mood.toLowerCase()] = mood.moodScore;
        });
    
        // Step 3: Get relevant mood responses for the given team
        const teamMoodResponses = allMoodResponses.filter(
          response => response.teamId === teamId && moodMap[response.moodId.toLowerCase()]
        );
    
        if (teamMoodResponses.length === 0) return 0; // No valid mood responses
    
        // Step 4: Calculate average mood score
        const totalScore = teamMoodResponses.reduce(
          (sum, response) => sum + moodMap[response.moodId.toLowerCase()], 0
        );
    
        return totalScore / teamMoodResponses.length;
      } catch (err) {
        console.error("Failed to calculate avg mood for team", err);
        return 0;
      }
    };


    const fetchData = async () => {
      if (!teams) return;
  
      const updatedData = await Promise.all(
        teams.map(async (team) => ({
          teamName: team.teamName,
          standupCompletion: calculateStandupCompletion(team.id),
          avgResponseTime: Number(calculateAvgResponseTime(team.id)),
          kudosGiven: await calculateKudosGiven(team.id),
          pollParticipation: await calculateAverageParticipationPercentage(team.id),
          avgMood: await calculateAvgTeamMood(team.id)
          // avgMood: 4
        }))
      );

      console.log("Analytics Data", updatedData);
  
      setAnalyticsData(updatedData);
    };

    fetchData();
    const teamwithmoststandups = findTeamWithMostStandupResponses();
    setTeamWithMostStandups(teamwithmoststandups);
    findKudosDistribution();
    const timingDistribution = generateStandupTimingDistribution()
    setStandupTimingDistribution(timingDistribution);

  }, [teams, standups])


  const calculateRadarData = (analyticsData: AnalyticsData[]) => {
    // We'll create metrics based on the data we're already calculating:
    // 1. Standups: standupCompletion (already a percentage)
    // 2. Mood: avgMood (scale of 0-5, convert to percentage)
    // 3. Kudos: normalize kudosGiven to percentage
    // 4. Polls: pollParticipation (already a percentage)
    
    const radarData = [
      {
        metric: 'Standups',
        ...Object.fromEntries(
          analyticsData.map(team => [team.teamName, team.standupCompletion])
        )
      },
      {
        metric: 'Mood',
        ...Object.fromEntries(
          analyticsData.map(team => [team.teamName, (team.avgMood / 5) * 100])
        )
      },
      {
        metric: 'Kudos',
        ...Object.fromEntries(
          analyticsData.map(team => {
            const maxKudos = Math.max(...analyticsData.map(t => t.kudosGiven));
            return [team.teamName, (team.kudosGiven / maxKudos) * 100];
          })
        )
      },
      {
        metric: 'Polls',
        ...Object.fromEntries(
          analyticsData.map(team => [team.teamName, team.pollParticipation])
        )
      }
    ];
  
    return radarData;
  };
  
  // Usage in component:
  useEffect(() => {
    if (analyticsData) {
      const radarData = calculateRadarData(analyticsData);
      console.log("RAdarData: ", radarData);
      setRadarChartData(radarData); // You'll need to add this state
    }
  }, [analyticsData]);

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };



  const DynamicRadarChart: React.FC<{ data: RadarDataPoint[] | undefined }> = ({ data }) => {
    if (!data) {
      return (
        <div>
          <p>No RadarData</p>
        </div>
      );
    }
  
    // Extract unique team names from the first data point
    const teamNames = Object.keys(data[0] || {}).filter(key => key !== 'metric');
  
    // Randomly assign colors to teams
    const teamColors = useMemo(() => {
      const availableColors = [...COLOR_PALETTE];
  
      // Fisher-Yates shuffle algorithm
      for (let i = availableColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableColors[i], availableColors[j]] = [availableColors[j], availableColors[i]];
      }
  
      // Create a map of team names to colors
      return teamNames.reduce((acc, team, index) => ({
        ...acc,
        [team]: availableColors[index % availableColors.length]
      }), {} as Record<string, string>); // Ensure the accumulator is typed
    }, [teamNames.join(',')]);
  
    return (
      <RadarChart
        cx={175}
        cy={125}
        outerRadius={80}
        width={450}
        height={250}
        data={data}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        {teamNames.map((teamName) => (
          <Radar
            key={teamName}
            name={teamName}
            dataKey={teamName}
            stroke={teamColors[teamName]}
            fill={teamColors[teamName]}
            fillOpacity={0.6}
          />
        ))}
        <Legend />
        <Tooltip />
      </RadarChart>
    );
  };

  return (
    <div className="p-6 bg-slate-50 border border-[#5fb0bc] rounded-lg min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Master Team Engagement Analytics
        </h1>
        
        <div className="flex space-x-4">
          {/* Date Range Selector */}
          {/* <Select 
            value={dateRange} 
            onValueChange={setDateRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 30 Days
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select> */}

          {/* Team Filter */}
          {/* <Select 
            value={selectedTeam || ''} 
            onValueChange={(value) => setSelectedTeam(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Teams">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedTeam || 'All Teams'}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Teams</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
            </SelectContent>
          </Select> */}


        </div>
      </div>



      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="standup">Standup Metrics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
  <div className="flex flex-col gap-12">
    {/* Top Performers Card */}
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold">Standup Champion</h3>
          <p className="text-2xl">{teamWithMostStandups?.teamName}</p>
          <p className="text-sm text-green-600 mt-1">Most Standup Responses</p>
        </div>
      </CardContent>
    </Card>

    {/* Detailed Engagement Table */}
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detailed Team Engagement Metrics</CardTitle>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Standup Completion</TableHead>
              <TableHead>Avg Mood Score</TableHead>
              <TableHead>Kudos Given</TableHead>
              <TableHead>Poll Participation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyticsData?.map((data) => (
              <TableRow key={data.teamName}>
                <TableCell>{data.teamName}</TableCell>
                <TableCell>{data.standupCompletion}</TableCell>
                <TableCell>{data.avgMood}</TableCell>
                <TableCell>{data.kudosGiven}</TableCell>
                <TableCell>{data.pollParticipation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    {/* Team Performance Row */}
    <div className="flex flex-row  gap-12 w-full">
      {/* Team Comparison Radar Chart */}
      <Card className="bg-white flex-1">
        <CardHeader>
          <CardTitle>Team Performance Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicRadarChart data={radarData} />
        </CardContent>
      </Card>

      {/* Team Performance Comparison Card */}
      <Card className="bg-white flex-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <XAxis dataKey="teamName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="standupCompletion" fill="#3b82f6" name="Standup Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    {/* Kudos and Response Time Row */}
    <div className="flex flex-row gap-12 w-full">
      {/* Kudos Distribution Card */}
      <Card className="bg-white flex-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
            Kudos Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData}
                dataKey="kudosGiven"
                nameKey="teamName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analyticsData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Response Time Trends Card */}
      <Card className="bg-white flex-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
            Response Time Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <XAxis dataKey="teamName" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgResponseTime" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
</TabsContent>

        {/* Additional tabs would be implemented similarly */}
        <TabsContent value="standup" className="flex flex-col gap-10">
          {/* Standup-specific metrics */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Standup Completion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData}>
                  <XAxis dataKey="teamName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="standupCompletion" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Standup Timing Distribution */}
          <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Standup Timing Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={standupTimingDistribution}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

        </TabsContent>

        <TabsContent value="engagement" className="space-y-12">
          {/* Engagement-specific metrics */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Team Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData}>
                  <XAxis dataKey="teamName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pollParticipation" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Kudos Distribution */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Kudos Distribution</CardTitle>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart width={350} height={250} >
                <Pie
                  data={kudosDistributionData}
                  cx={"50%"}
                  cy={"50%"}
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {kudosDistributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood">
          {/* Mood tracking metrics */}
          <div>
            <TeamInputDropdown
                  inputName="Select a Team To Check Its Mood Recently"
                  options={teamsList}
                  selectedValue={selectedTeam}
                  onOptionChange={handleTeamChange}
            />
            {/* </div> */}

            {selectedTeam?.length ? 
              teamMoodSummaryByDate?.length !== 0?
                <Card className="bg-white shadow-2xl rounded-2xl">
                  <CardHeader>
                    <CardTitle>Team Mood Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={teamMoodSummaryByDate} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="excited" stroke="#34D399" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Excited" stroke="#34D399" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="smile" stroke="#FBBF24" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Smile" stroke="#FBBF24" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="angry" stroke="#F87171" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Angry" stroke="#F87171" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="meh" stroke="#A1A1AA" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Meh" stroke="#A1A1AA" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="sad" stroke="#FBBF24" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Sad" stroke="#FBBF24" strokeWidth={2} dot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card> : 
                <Card className="bg-white shadow-2xl rounded-2xl">
                  <CardHeader>
                    <CardTitle>Team Mood Trends</CardTitle>
                  </CardHeader>
                <CardContent className="w-full">
                  <p className="text-center text-gray-500">No mood data available</p>
                </CardContent>
              </Card>
            :
            <Card className='bg-white'>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">
                        No Team Selected
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-500">
                        Please select a team to view the mood results.
                    </div>
                </CardContent>
            </Card>

            }
          </div>

          {/* Mood Trends */}
          {/* <Card className="bg-white">
            <CardHeader>
              <CardTitle>Team Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart  data={moodTrendsData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Engineering" stroke="#8884d8" />
                <Line type="monotone" dataKey="Marketing" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Sales" stroke="#ffc658" />
              </LineChart>
              </ResponsiveContainer>

            </CardContent>
          </Card> */}

          {/* Mood vs Workload Correlation */}
          {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Battery className="mr-2 h-5 w-5" />
                  Mood vs Workload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enhancedTeamData}>
                    <XAxis dataKey="teamName" />
                    <YAxis yAxisId="left" domain={[0, 5]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="metrics.mood.current" stroke="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="metrics.mood.workloadIndex" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}
        </TabsContent>
      </Tabs>

    </div>
  );
};
