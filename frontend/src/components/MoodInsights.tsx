import { BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { XAxis, PolarAngleAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MoodData {
  date: string;
  excited?: number;
  smile?: number;
  angry?: number;
  meh?: number;
  sad?: number;
}

interface IMoodInsights {
  moodData: MoodData[] | undefined;
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

  const calculateTotalMoods = () => {
    return moodData.reduce((total, day) => {
      return total + (day.excited || 0) + (day.smile || 0) + (day.angry || 0) + (day.meh || 0) + (day.sad || 0);
    }, 0);
  };

  const totalMoods = calculateTotalMoods();
  const participation = Math.round((totalMoods / (moodData.length * 19)) * 100);

  const calculateMoodScore = () => {
    const moodWeights = {
      excited: 1,
      smile: 1,
      meh: 0.5,
      angry: 0,
      sad: 0
    };

    const totalWeightedScore = moodData.reduce((total, day) => {
      return total + 
        ((day.excited || 0) * moodWeights.excited) +
        ((day.smile || 0) * moodWeights.smile) +
        ((day.meh || 0) * moodWeights.meh) +
        ((day.angry || 0) * moodWeights.angry) +
        ((day.sad || 0) * moodWeights.sad);
    }, 0);

    return totalMoods ? (totalWeightedScore / totalMoods) : 0;
  };

  const avgMoodScore = calculateMoodScore().toFixed(1);

  const participationData = [{ name: "Participation", value: participation, fill: "#34D399" }];

  const responseData = moodData.map((day) => ({
    date: day.date,
    responses: (day.excited || 0) + (day.smile || 0) + (day.angry || 0) + (day.meh || 0) + (day.sad || 0),
  }));

  const moodScoreData = [
    { name: "Excited", value: moodData.reduce((acc, day) => acc + (day.excited || 0), 0), fill: "#34D399" },
    { name: "Smile", value: moodData.reduce((acc, day) => acc + (day.smile || 0), 0), fill: "#4ADE80" },
    { name: "Meh", value: moodData.reduce((acc, day) => acc + (day.meh || 0), 0), fill: "#FBBF24" },
    { name: "Angry", value: moodData.reduce((acc, day) => acc + (day.angry || 0), 0), fill: "#F87171" },
    { name: "Sad", value: moodData.reduce((acc, day) => acc + (day.sad || 0), 0), fill: "#6B7280" },
  ];

  if (!selectedTeam.length) {
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
    );
  }

  return (
    <Card className="bg-white shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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