import React, { useState } from 'react';
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
  PolarAngleAxis 
} from 'recharts';
import { 
  Download, 
  Filter, 
  Calendar 
} from 'lucide-react';
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
  const [dateRange, setDateRange] = useState('last-30-days');

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Master Team Engagement Analytics
        </h1>
        
        <div className="flex space-x-4">
          {/* Date Range Selector */}
          <Select 
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
          </Select>

          {/* Team Filter */}
          <Select 
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
              <SelectItem value="">All Teams</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Standup Completion */}
        <Card>
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
        </Card>

        {/* Mood Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Team Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={350} height={250} data={moodTrendsData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Engineering" stroke="#8884d8" />
              <Line type="monotone" dataKey="Marketing" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Sales" stroke="#ffc658" />
            </LineChart>
          </CardContent>
        </Card>

        {/* Kudos Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Kudos Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={350} height={250}>
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
          </CardContent>
        </Card>

        {/* Poll Participation */}
        <Card>
          <CardHeader>
            <CardTitle>Poll Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={350} height={250} data={pollParticipationData}>
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="participation" fill="#82ca9d" />
            </BarChart>
          </CardContent>
        </Card>

        {/* Team Comparison Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart 
              cx={175} 
              cy={125} 
              outerRadius={80} 
              width={350} 
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

        {/* Detailed Engagement Table */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Detailed Team Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Standup Completion</TableHead>
                  <TableHead>Avg Mood Score</TableHead>
                  <TableHead>Kudos Received</TableHead>
                  <TableHead>Poll Participation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Engineering</TableCell>
                  <TableCell>95%</TableCell>
                  <TableCell>4.2</TableCell>
                  <TableCell>42</TableCell>
                  <TableCell>92%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Marketing</TableCell>
                  <TableCell>88%</TableCell>
                  <TableCell>3.9</TableCell>
                  <TableCell>35</TableCell>
                  <TableCell>85%</TableCell>
                </TableRow>
                {/* More rows... */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// export default MasterAnalyticsDashboard;