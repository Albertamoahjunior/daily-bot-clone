import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCheck, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useStandupModalContext } from "@/hooks/useStandupModalContext";

interface IMultiSelectDropdown{
    label: string;
    options: string[];
}

const MultiSelectDropdown = ({ label, options }:IMultiSelectDropdown) => {
  const {selectedOptions, setSelectedOptions, selectedOptionsError, setSelectedOptionsError} = useStandupModalContext();
  // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);


  const toggleOption = (option: string) => {
    if(selectedOptions.length <= 0 && selectedOptionsError ){
      setSelectedOptionsError(false)
    }

    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className={"relative inline-block w-full"}>
      {/* Dropdown Label */}
      <button
        className="w-full flex justify-between items-center px-4 py-2 text-left bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {label}
        {isOpen ? <FontAwesomeIcon icon={faCaretUp}/> : <FontAwesomeIcon icon={faCaretDown} />}
      </button>

      { selectedOptionsError && <p className="text-red-500 text-base mt-1">Selecting A Standup Day Is Required</p>}


      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              <span className="text-gray-700">{option}</span>
              {selectedOptions.includes(option) && (
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

export default MultiSelectDropdown;
