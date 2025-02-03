interface IInputDropdown {
    inputName: string;
    options: { value: string; label: string }[]; // Array of dropdown options
    selectedValue: string; // The current selected value
    onOptionChange: (value: string) => void; // Callback for when an option is selected
}
  
  export const TeamInputDropdown = ({
    inputName,
    options,
    selectedValue,
    onOptionChange,
  }: IInputDropdown) => {
    return (
      <div className="mb-4">
        {/* Label */}
        <label className="block text-black font-medium mb-2">{inputName}</label>
        
        {/* Dropdown */}
        <select
          value={selectedValue}
          onChange={(e) => onOptionChange(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-lg focus:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all ease-in-out duration-300"
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  