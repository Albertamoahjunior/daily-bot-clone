import React from 'react';
import { Smile, Meh, Frown, Angry, Laugh } from 'lucide-react';
import { MoodData } from '../types/Mood';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';



// interface MoodData {
//   date: string;
//   excited?: number;
//   smile?: number;
//   angry?: number;
//   meh?: number;
//   sad?: number;
// }

export const MoodPercentageDisplay = ({ moodData }: { moodData: MoodData[] | undefined }) => {
  const isEmptyData = () => {
    if (!moodData || moodData.length === 0) return true;
    
    // Check if all mood values across all days are 0
    return moodData.every(day => 
      Object.entries(day)
        .filter(([key]) => key !== 'date')
        .every(([, value]) => !value || value === 0)
    );
  };

  if (isEmptyData()) {
    return (
      <Card className="bg-white shadow-2xl rounded-2xl">
        <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <p className="text-center text-gray-500">No mood data available</p>
        </CardContent>
      </Card>
    );
  }

  const presentMoodTypes = Array.from(
    new Set(
      moodData!.flatMap(day => 
        Object.entries(day)
          .filter(([key, value]) => key !== 'date' && typeof value === 'number' && value > 0)
          .map(([key]) => key)
      )
    )
  ) as Array<'excited' | 'smile' | 'angry' | 'meh' | 'sad'>;

  // Calculate total moods with non-null assertion
  const totalMoods = moodData!.reduce((acc, day) => {
    return acc + Object.entries(day)
      .filter(([key]) => presentMoodTypes.includes(key as any))
      .reduce((sum, [, value]) => sum + (Number(value) || 0), 0);
  }, 0);

  // Calculate percentage for each mood type
  const calculatePercentage = (moodType: 'excited' | 'smile' | 'angry' | 'meh' | 'sad') => {
    const total = moodData!.reduce((acc, day) => acc + Number(day[moodType as keyof MoodData] || 0), 0);
    return totalMoods > 0 ? Math.round((total / totalMoods) * 100) : 0;
  };
  const moodColors = {
    excited: '#34D399',
    smile: '#FBBF24',
    angry: '#F87171',
    meh: '#A1A1AA',
    sad: '#EF4444'
  };

  const moodPercentages = presentMoodTypes.map(mood => ({
    mood,
    percentage: calculatePercentage(mood),
    color: moodColors[mood]
  }));

  const CircularProgress = ({ percentage, color, children }: { percentage: number; color: string; children: React.ReactNode }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24">
        <svg className="w-full h-full">
          <circle
            className="stroke-gray-200"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            className="transition-all duration-300"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              stroke: color,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  };

  const MoodIcon = ({ mood }: { mood: string }) => {
    switch (mood) {
      case 'excited':
        return <Laugh className="h-10 w-10 hover:text-green-500 transition-colors duration-300" aria-label="Excited Mood" />;
      case 'smile':
        return <Smile className="w-10 h-10 hover:text-yellow-400 transition-colors duration-300" aria-label="Happy Mood" />;
      case 'angry':
        return <Angry className="h-10 w-10 hover:text-orange-500 transition-colors duration-300" aria-label="Angry Mood" />;
      case 'meh':
        return <Meh className="w-10 h-10 hover:text-gray-500 transition-colors duration-300" aria-label="Meh Mood" />;
      case 'sad':
        return <Frown className="h-10 w-10 hover:text-red-500 transition-colors duration-300" aria-label="Sad Mood" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-center space-x-8 p-2 px-2">
      {moodPercentages.map(({ mood, percentage, color }) => (
        <div key={mood} className="flex flex-col items-center">
          <CircularProgress percentage={percentage} color={color}>
            <MoodIcon mood={mood.toLowerCase()} />
          </CircularProgress>
          <span className="mt-2 text-xl font-bold">{percentage}%</span>
        </div>
      ))}
    </div>
  );
};

export default MoodPercentageDisplay;
