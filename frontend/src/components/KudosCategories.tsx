import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award,Briefcase, Lightbulb,  Brush, Cpu } from 'lucide-react';

const categories = [
  {
    value: 'teamwork',
    label: 'Teamwork',
    icon: <Award size={32} />,
    description: 'Recognizing individuals who excel at collaborating, supporting, and contributing to the team.',
    color: 'bg-blue-400 text-white',
  },
  {
    value: 'innovation',
    label: 'Innovation',
    icon: <Lightbulb size={32} />,
    description: 'Celebrating those who bring fresh ideas, solutions, and approaches to drive progress.',
    color: 'bg-green-400 text-white',
  },
  {
    value: 'leadership',
    label: 'Leadership',
    icon: <Briefcase size={32} />,
    description: 'Honoring team members who inspire others, guide the way, and set an example for the organization.',
    color: 'bg-yellow-400 text-white',
  },
  {
    value: 'creativity',
    label: 'Creativity',
    icon: <Brush size={32} />,
    description: 'Recognizing individuals who bring unique perspectives, artistic flair, and imaginative thinking to their work.',
    color: 'bg-pink-400 text-white',
  },
];

export const KudosCategories: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
    {categories.map((category) => (
      <Card
        key={category.value}
        className={`bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ${category.color}`}
      >
        <CardHeader className="flex items-center space-x-4">
          {category.icon}
          <CardTitle className="text-white">{category.label}</CardTitle>
        </CardHeader>
        <CardContent className="text-white text-center">
          <p>{category.description}</p>
        </CardContent>
      </Card>
    ))}
  </div>
  );
};

// export default KudosCategories;