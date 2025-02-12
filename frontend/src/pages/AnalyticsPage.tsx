import React, { useState, useEffect } from 'react';
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
  AreaChart, Area
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
import { useTeamsContext } from '@/hooks/useTeamsContext';
import { useStandupContext } from '../hooks/useStandupContext';
import { kudosService, pollService, moodService } from '@/services/api';


// Consolidated dummy data
// const teamsData = [
//   { 
//     teamName: 'Engineering',
//     metrics: {
//       standup: {
//         completion: 92,
//         avgTime: '9:15 AM',
//         quality: 4.5,
//         streak: 15,
//         timingDistribution: [
//           { time: '9:00', count: 5 },
//           { time: '9:15', count: 12 },
//           { time: '9:30', count: 8 },
//           { time: '9:45', count: 3 }
//         ]
//       },
//       engagement: {
//         meetingAttendance: 95,
//         documentCollaboration: 88,
//         crossTeamInteraction: 78,
//         responseTime: 12,
//         kudosGiven: 45,
//         kudosReceived: 42,
//         pollParticipation: 88
//       },
//       mood: {
//         current: 4.2,
//         variance: 0.3,
//         workloadIndex: 72,
//         burnoutRisk: 'Low',
//         satisfaction: 85,
//         trends: [
//           { month: 'Jan', value: 4.2 },
//           { month: 'Feb', value: 4.0 },
//           { month: 'Mar', value: 4.3 }
//         ]
//       }
//     }
//   },
//   {
//     teamName: 'Sales',
//     metrics: {
//       standup: {
//         completion: 85,
//         avgTime: '9:30 AM',
//         quality: 4.2,
//         streak: 10,
//         timingDistribution: [
//           { time: '9:00', count: 3 },
//           { time: '9:15', count: 8 },
//           { time: '9:30', count: 15 },
//           { time: '9:45', count: 4 }
//         ]
//       },
//       engagement: {
//         meetingAttendance: 90,
//         documentCollaboration: 82,
//         crossTeamInteraction: 85,
//         responseTime: 22,
//         kudosGiven: 36,
//         kudosReceived: 38,
//         pollParticipation: 75
//       },
//       mood: {
//         current: 3.9,
//         variance: 0.4,
//         workloadIndex: 68,
//         burnoutRisk: 'Medium',
//         satisfaction: 78,
//         trends: [
//           { month: 'Jan', value: 4.0 },
//           { month: 'Feb', value: 4.1 },
//           { month: 'Mar', value: 3.9 }
//         ]
//       }
//     }
//   },
//   {
//     teamName: 'Marketing',
//     metrics: {
//       standup: {
//         completion: 78,
//         avgTime: '9:20 AM',
//         quality: 4.0,
//         streak: 8,
//         timingDistribution: [
//           { time: '9:00', count: 6 },
//           { time: '9:15', count: 10 },
//           { time: '9:30', count: 7 },
//           { time: '9:45', count: 5 }
//         ]
//       },
//       engagement: {
//         meetingAttendance: 88,
//         documentCollaboration: 90,
//         crossTeamInteraction: 92,
//         responseTime: 15,
//         kudosGiven: 40,
//         kudosReceived: 35,
//         pollParticipation: 82
//       },
//       mood: {
//         current: 4.0,
//         variance: 0.2,
//         workloadIndex: 65,
//         burnoutRisk: 'Low',
//         satisfaction: 82,
//         trends: [
//           { month: 'Jan', value: 3.8 },
//           { month: 'Feb', value: 3.9 },
//           { month: 'Mar', value: 4.0 }
//         ]
//       }
//     }
//   }
// ];

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


const dummyTeamData = [
  { 
    teamName: 'Engineering', 
    standupCompletion: 92, 
    avgResponseTime: 15, 
    kudosGiven: 45, 
    pollParticipation: 88,
    avgMood: 4.2
  },
  { 
    teamName: 'Sales', 
    standupCompletion: 85, 
    avgResponseTime: 22, 
    kudosGiven: 36, 
    pollParticipation: 75,
    avgMood: 3.9
  },
  { 
    teamName: 'Marketing', 
    standupCompletion: 78, 
    avgResponseTime: 30, 
    kudosGiven: 28, 
    pollParticipation: 65,
    avgMood: 3.7
  },
  { 
    teamName: 'Customer Support', 
    standupCompletion: 95, 
    avgResponseTime: 12, 
    kudosGiven: 52, 
    pollParticipation: 92,
    avgMood: 4.5
  },
  { 
    teamName: 'Product', 
    standupCompletion: 88, 
    avgResponseTime: 18, 
    kudosGiven: 40, 
    pollParticipation: 82,
    avgMood: 4.0
  }
];

const enhancedTeamData = [
  { 
    teamName: 'Engineering',
    metrics: {
      standup: {
        completion: 92,
        avgTime: '9:15 AM',
        quality: 4.5,
        streak: 15,
        commonBlockers: ['API delays', 'Environment issues']
      },
      engagement: {
        meetingAttendance: 95,
        documentCollaboration: 88,
        crossTeamInteraction: 78,
        responseTime: 12
      },
      mood: {
        current: 4.2,
        variance: 0.3,
        workloadIndex: 72,
        burnoutRisk: 'Low',
        satisfaction: 85
      }
    }
  }
  // ... other teams
];

// Dummy data (would be replaced with actual data fetching)
const standupCompletionData = [
  { team: 'Engineering', completion: 95 },
  { team: 'Marketing', completion: 88 },
  { team: 'Sales', completion: 92 },
  { team: 'Support', completion: 85 },
  { team: 'Product', completion: 90 }
];

const moodTrendsData = [
  { date: 'Jan', Engineering: 4.2, Marketing: 3.8, Sales: 4.0 },
  { date: 'Feb', Engineering: 4.0, Marketing: 3.9, Sales: 4.1 },
  { date: 'Mar', Engineering: 4.3, Marketing: 4.0, Sales: 4.2 }
];

const kudosDistributionData = [
  { name: 'Collaboration', value: 400 },
  { name: 'Innovation', value: 300 },
  { name: 'Leadership', value: 200 }
];

const pollParticipationData = [
  { team: 'Engineering', participation: 92 },
  { team: 'Marketing', participation: 85 },
  { team: 'Sales', participation: 88 },
  { team: 'Support', participation: 80 },
  { team: 'Product', participation: 90 }
];

const radarData = [
  { metric: 'Standups', Engineering: 90, Marketing: 85, Sales: 88 },
  { metric: 'Mood', Engineering: 85, Marketing: 80, Sales: 82 },
  { metric: 'Kudos', Engineering: 95, Marketing: 75, Sales: 85 },
  { metric: 'Polls', Engineering: 92, Marketing: 88, Sales: 90 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AnalyticsPage: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const {teams, members} = useTeamsContext();
   const { standups, standupQuestions } = useStandupContext();
   const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>();
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
    

    // const calculateAvgTeamMood = async (teamId: string) => {

    //   try{
    //     const allConfiguredMoods = await moodService.getMoods();
    //     const allMoodResponses = await moodService.getAllmoodResponses();



    //   }catch(err){
    //     console.error("Failed to calculate avg mood for team", err);
    //     return 0;
    //   }
    // }


    const fetchData = async () => {
      if (!teams) return;
  
      const updatedData = await Promise.all(
        teams.map(async (team) => ({
          teamName: team.teamName,
          standupCompletion: calculateStandupCompletion(team.id),
          avgResponseTime: Number(calculateAvgResponseTime(team.id)),
          kudosGiven: await calculateKudosGiven(team.id),
          pollParticipation: await calculateAverageParticipationPercentage(team.id),
          // avgMood: await calculateAvgTeamMood(team.id)
          avgMood: 4
        }))
      );

      console.log("Analytics Data", updatedData);
  
      setAnalyticsData(updatedData);
    };

    fetchData();
    const teamwithmoststandups = findTeamWithMostStandupResponses();
    setTeamWithMostStandups(teamwithmoststandups);

  }, [teams, standups])

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Top Performers Card */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold">Standup Champion</h3>
                  <p className="text-2xl"> {teamWithMostStandups?.teamName} </p>
                  <p className="text-sm text-green-600 mt-1">Most Standup Responses</p>
                </div>
                {/* Add more top performer categories */}
              </CardContent>
            </Card>

            {/* Detailed Engagement Table */}
            <Card className="bg-white col-span-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detailed Team Engagement Metrics</CardTitle>
                {/* Export Button */}
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
                    {analyticsData?.map((data) => {
                      return (
                        <TableRow>
                          <TableCell>{data.teamName}</TableCell>
                          <TableCell>{data.standupCompletion}</TableCell>
                          <TableCell>{data.avgMood}</TableCell>
                          <TableCell>{data.kudosGiven}</TableCell>
                          <TableCell>{data.pollParticipation}</TableCell>
                        </TableRow>
                      )
                    }) }
                    
                    {/* <TableRow>
                      <TableCell>Marketing</TableCell>
                      <TableCell>88%</TableCell>
                      <TableCell>3.9</TableCell>
                      <TableCell>35</TableCell>
                      <TableCell>85%</TableCell>
                    </TableRow> */}
                    {/* More rows... */}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Team Comparison Radar Chart */}
            <Card className="bg-white ">

              <CardHeader>
                <CardTitle>Team Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <RadarChart 
                  cx={175} 
                  cy={125} 
                  outerRadius={80} 
                  width={450} 
                  height={250} 
                  data={radarData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <Radar 
                    name="Engineering" 
                    dataKey="Engineering" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                  <Radar 
                    name="Marketing" 
                    dataKey="Marketing" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6} 
                  />
                  <Radar 
                    name="Sales" 
                    dataKey="Sales" 
                    stroke="#ffc658" 
                    fill="#ffc658" 
                    fillOpacity={0.6} 
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </CardContent>
            </Card>

            {/* Team Performance Comparison Card */}
            <Card className="bg-white">
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

            {/* Kudos Distribution Card */}
            <Card className="bg-white">
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
            <Card className="bg-white">
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
        </TabsContent>

        {/* Additional tabs would be implemented similarly */}
        <TabsContent value="standup">
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
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Standup Timing Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { time: '9:00', count: 5 },
                    { time: '9:15', count: 12 },
                    { time: '9:30', count: 8 },
                    { time: '9:45', count: 3 }
                  ]}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          {/* Standup Completion */}
          {/* <Card className="bg-white">
            <CardHeader>
              <CardTitle>Standup Completion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart width={350} height={250} data={standupCompletionData}>
                <XAxis dataKey="team" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completion" fill="#8884d8" />
              </BarChart>
            </CardContent>
          </Card> */}
        </TabsContent>

        <TabsContent value="engagement">
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
                  cx={175}
                  cy={125}
                  labelLine={false}
                  outerRadius={80}
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
          {/* <Card className="bg-white">
            <CardHeader>
              <CardTitle>Team Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dummyTeamData}>
                  <XAxis dataKey="teamName" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgMood" stroke="#f43f5e" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}

          {/* Mood Trends */}
          <Card className="bg-white">
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
          </Card>

          {/* Mood vs Workload Correlation */}
          <Card>
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
            </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
};
