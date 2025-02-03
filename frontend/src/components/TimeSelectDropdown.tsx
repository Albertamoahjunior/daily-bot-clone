import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCheck, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useStandupModalContext } from "@/hooks/useStandupModalContext";


interface TimeSelectDropdownProps {
  label: string;
}

const TimeSelectDropdown: React.FC<TimeSelectDropdownProps> = ({ label }) => {
  const {selectedTimes, setSelectedTimes, selectedTimesError, setSelectedTimesError} = useStandupModalContext();
  // const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Generate an array of time options (e.g., 24-hour format)
  const timeOptions = Array.from({ length: 24 }, (_, hour) =>
    Array.from({ length: 4 }, (_, quarter) =>
      `${String(hour).padStart(2, "0")}:${String(quarter * 15).padStart(2, "0")}`
    )
  ).flat();

  const toggleTimeSelection = (time: string) => {
    if(selectedTimes.length <= 0 && selectedTimesError ){
      setSelectedTimesError(false)
    }

    if (selectedTimes.includes(time)) {
      // Remove time if already selected
      setSelectedTimes((prev) => prev.filter((t) => t !== time));
    } else if (selectedTimes.length < 3) {
      // Add time if less than 3 selected
      setSelectedTimes((prev) => [...prev, time]);
    }
  };

  return (
    <div className="relative inline-block w-full">
      {/* Dropdown Label */}
      <button
        className="w-full flex justify-between items-center px-4 py-2 text-left bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {label}
        {isOpen ? <FontAwesomeIcon icon={faCaretUp}/> : <FontAwesomeIcon icon={faCaretDown} />}
      </button>

      { selectedTimesError && <p className="text-red-500 text-base mt-1">Selecting A Standup Time Is Required</p>}

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {timeOptions.map((time) => (
            <div
              key={time}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedTimes.includes(time) ? "bg-blue-100" : ""
              }`}
              onClick={() => toggleTimeSelection(time)}
            >
              <span className="text-gray-700">{time}</span>
              {selectedTimes.includes(time) && (
                // <Check className="w-4 h-4 text-blue-500" />
                <FontAwesomeIcon icon={faCheck} className="text-blue-500 ml-auto" size={"lg"} /> 
                
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSelectDropdown;
