import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const responseData = [
  { option: 'Option A', votes: 50, percentage: 33 },
  { option: 'Option B', votes: 70, percentage: 47 },
  { option: 'Option C', votes: 30, percentage: 20 },
];

export const TeamPollsMetrics = () => {
  const snackPreferences = [
    { item: 'Fresh fruit and nuts', percentage: 16, responses: 5 },
    { item: 'Sugarless oatmeal cookies with dried fruit', percentage: 8, responses: 2 },
    { item: 'Freshly squeezed juices', percentage: 72, responses: 18 },
    { item: 'Fresh Veggies and yogurt dips', percentage: 4, responses: 2 },
  ];

  const reportStreaks = [
    { name: 'Kate Martinez', streak: 1248, avatar: '/api/placeholder/30/30' },
    { name: 'Brandon Clark', streak: 748, avatar: '/api/placeholder/30/30' },
    { name: 'Dwayne Washington', streak: 139, avatar: '/api/placeholder/30/30' },
    { name: 'Helen Flanagan', streak: 98, avatar: '/api/placeholder/30/30' },
    { name: 'Susan Green', streak: 75, avatar: '/api/placeholder/30/30' },
  ];

  return (
    <div className="flex gap-6 mt-6">
      <div className='flex flex-col w-[75%] space-y-10'>
        {/* Snack Preferences */}
        <Card className='bg-white'>
            <CardHeader>
            <CardTitle className="text-lg font-medium">
                What kind of healthy snacks would you prefer at the office?
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {snackPreferences.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                    <div className="text-sm">{item.item}</div>
                    <div className="h-2 mt-1 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                        className="h-full bg-teal-400" 
                        style={{ width: `${item.percentage}%` }}
                        />
                    </div>
                    </div>
                    <div className="ml-4 text-sm text-gray-500 whitespace-nowrap">
                    {item.percentage}% {item.responses} responses
                    </div>
                </div>
                ))}
                <div className="text-sm text-gray-500 mt-4">27 total responses</div>
            </div>
            </CardContent>
        </Card>

        {/* Response Breakdown */}
        <Card className="bg-white">
            <CardHeader>
            <CardTitle className="text-lg font-medium">Response Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseData}>
                    <XAxis dataKey="option" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#5EEAD4" />
                </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
                {responseData.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                    <span>{item.option}:</span>
                    <span>{item.votes} votes ({item.percentage}%)</span>
                </div>
                ))}
            </div>
            </CardContent>
        </Card>
      </div>

      <div className="flex flex-col w-[25%] space-y-10">
        {/* Participation Card */}
        <Card>
            <CardHeader>
            <CardTitle className="text-lg font-medium">Participation</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                    />
                    <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#5EEAD4"
                    strokeWidth="3"
                    strokeDasharray="73, 100"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold">
                    73%
                </div>
                </div>
            </div>
            <div className="text-center mt-4">
                <div>Reported: 14 people out of 19</div>
                <div className="text-sm text-green-500">+5% since Monday, Nov 4th</div>
            </div>
            </CardContent>
        </Card>

        {/* Report Streak */}
        <Card className="col-span-2">
            <CardHeader>
            <CardTitle className="text-lg font-medium">Report streak 🚀</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {reportStreaks.map((person, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <img 
                        src={person.avatar} 
                        alt={person.name} 
                        className="w-8 h-8 rounded-full"
                    />
                    <span>{person.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <span>{person.streak}</span>
                    <span className="text-orange-500">🔥</span>
                    </div>
                </div>
                ))}
            </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
};

// export default TeamPollsMetrics;