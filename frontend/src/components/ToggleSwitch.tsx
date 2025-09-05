import React, { useState } from 'react';

interface IToggle{
    label?:string
    isChecked: boolean;
    toggleIsChecked: () => void;
}

const ToggleSwitch = ({label, isChecked, toggleIsChecked}:IToggle) => {

  return (
    <div className="flex items-center space-x-3 w-full justify-between">
      <label htmlFor="toggle" className="text-gray-700">
        {label ? label : "Want To Create Standup Questions? you can always configure them later"}
      </label>
      <div>
        <div className="relative">
          <input
            type="checkbox"
            id="toggle"
            className="sr-only"
            checked={isChecked}
            onChange={() => toggleIsChecked()}
          />
          <label
            htmlFor="toggle"
            className={`block w-10 h-6 rounded-full p-1 cursor-pointer ${
              isChecked ? 'bg-blue-500' : 'bg-gray-300'
            } transition-colors duration-300`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 
                 ${isChecked ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;