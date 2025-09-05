import React, { useState } from 'react';
import { Award, Briefcase, Lightbulb, Cpu, ChevronDown  } from 'lucide-react';

interface IInputDropdown {
  optionText?: string;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const KudosCategoryDropdown: React.FC<IInputDropdown> = ({
  optionText,
  selectedCategory,
  onCategoryChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { value: 'teamwork', label: 'Teamwork', icon: <Award className="w-5 h-5 mr-2 text-purple-500" /> },
    { value: 'innovation', label: 'Innovation', icon: <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" /> },
    { value: 'leadership', label: 'Leadership', icon: <Briefcase className="w-5 h-5 mr-2 text-blue-500" /> },
    { value: 'creativity', label: 'Creativity', icon: <Cpu className="w-5 h-5 mr-2 text-red-500" /> },
  ];

  const handleOptionClick = (value: string) => {
    onCategoryChange(value);
    setIsOpen(false);
  };

  const selectedCategoryLabel =
    categories.find((category) => category.value === selectedCategory)?.label || optionText || 'Select a category';

  return (
    <div className="mb-4 relative">
      {/* Label */}
      <label className="block text-black font-medium mb-2">
        Which team category is being highlighted? (required)
      </label>

      {/* Dropdown Trigger */}
      <div
        className="w-full p-2 border border-gray-400 rounded-lg bg-white cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="flex items-center">{categories.find((category) => category.value == selectedCategory)?.icon} <p>{selectedCategoryLabel}</p></span>
        <ChevronDown  className="text-gray-500" />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {categories.map((category) => (
            <div
              key={category.value}
              className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${
                selectedCategory === category.value ? 'bg-gray-100 font-bold' : ''
              }`}
              onClick={() => handleOptionClick(category.value)}
            >
              {category.icon}
              <span>{category.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
