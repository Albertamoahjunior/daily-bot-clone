
import {MoodData}  from '../types/Mood';
import { BarChart, Bar, RadialBarChart, RadialBar,} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { XAxis, PolarAngleAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


interface IMoodInsights{
    moodData: MoodData[] | undefined ;
    selectedTeam: string;
}

export const MoodInsights = ({ moodData, selectedTeam }: IMoodInsights) => {
  if (!moodData || moodData.length === 0) {
    return (
      <Card className="bg-white shadow-2xl rounded-2xl">
        <CardContent className="w-full">
          <p className="text-center text-gray-500">No mood data available</p>
        </CardContent>
      </Card>
    );
  }

  const totalMoods = moodData.reduce((acc, day) => acc + day.happy + day.neutral + day.unhappy, 0);
  const participation = Math.round((totalMoods / (moodData.length * 19)) * 100);

  const calculateMoodScore = () => {
    const happyScore = moodData.reduce((acc, day) => acc + day.happy, 0) * 1;
    const neutralScore = moodData.reduce((acc, day) => acc + day.neutral, 0) * 0.5;
    const unhappyScore = moodData.reduce((acc, day) => acc + day.unhappy, 0) * 0;
    return totalMoods ? (happyScore + neutralScore + unhappyScore) / totalMoods : 0;
  };

  const avgMoodScore = calculateMoodScore().toFixed(1);

  const participationData = [{ name: "Participation", value: participation, fill: "#34D399" }];

  const responseData = moodData.map((day) => ({
    date: day.date,
    responses: day.happy + day.neutral + day.unhappy,
  }));

  const moodScoreData = [
    { name: "Happy", value: moodData.reduce((acc, day) => acc + day.happy, 0), fill: "#34D399" },
    { name: "Neutral", value: moodData.reduce((acc, day) => acc + day.neutral, 0), fill: "#FBBF24" },
    { name: "Unhappy", value: moodData.reduce((acc, day) => acc + day.unhappy, 0), fill: "#F87171" },
  ];

  if(!selectedTeam.length){
    return (
            <Card className='bg-white'>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">
                        No Poll Selected
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-500">
                        Please select a team poll to view the results.
                    </div>
                </CardContent>
            </Card>
    )
  }

  return (
    <Card className="bg-white shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Responses Bar Chart */}
            <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Responses</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={responseData}>
                <Bar dataKey="responses" fill="#3B82F6" />
                <XAxis dataKey="date" />
                <Tooltip />
                </BarChart>
            </ResponsiveContainer>
            </div>
        

        {/* Participation Radial Chart */}
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">Participation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              startAngle={90}
              endAngle={-270}
              innerRadius="70%"
              outerRadius="100%"
              data={participationData}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-4xl font-bold">{participation}%</p>
        </div>

        {/* Mood Score Pie Chart */}
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">Avg Mood Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={moodScoreData} dataKey="value" innerRadius={50} outerRadius={80} label>
                {moodScoreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-4xl font-bold">{avgMoodScore}/5</p>
        </div>
      </CardContent>
    </Card>
  );
};