import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import {MoodData} from '../types/Mood'

export const MoodPercentageDisplay = ({ moodData }: { moodData: MoodData[] | undefined }) => {

  if (!moodData || moodData.length === 0) {
    return (
      <div className="bg-white shadow-2xl rounded-2xl">
        <div className="w-full">
          <p className="text-center text-gray-500">No mood data available</p>
        </div>
      </div>
    );
  }


  const totalMoods = moodData.reduce((acc, day) => acc + day.happy + day.neutral + day.unhappy, 0);

  const calculatePercentage = (moodType: 'happy' | 'neutral' | 'unhappy') => {
    const total = moodData.reduce((acc, day) => acc + day[moodType], 0);
    return Math.round((total / totalMoods) * 100);
  };

  const moodPercentages = [
    { mood: 'happy', percentage: calculatePercentage('happy'), color: '#3B82F6' },
    { mood: 'neutral', percentage: calculatePercentage('neutral'), color: '#6B7280' },
    { mood: 'unhappy', percentage: calculatePercentage('unhappy'), color: '#EF4444' },
  ];

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
      case 'happy':
        return <Smile className="w-10 h-10 text-yellow-400" aria-label="Happy Mood" />;
      case 'neutral':
        return <Meh className="w-10 h-10 text-gray-500" aria-label="Neutral Mood" />;
      case 'unhappy':
        return <Frown className="w-10 h-10 text-red-500" aria-label="Unhappy Mood" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-center space-x-8 p-2 px-2">
      {moodPercentages.map(({ mood, percentage, color }) => (
        <div key={mood} className="flex flex-col items-center">
          <CircularProgress percentage={percentage} color={color}>
            <MoodIcon mood={mood} />
          </CircularProgress>
          <span className="mt-2 text-xl font-bold">{percentage}%</span>
        </div>
      ))}
    </div>
  );
};
