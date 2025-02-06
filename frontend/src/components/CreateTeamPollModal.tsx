import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { TeamInput } from './TeamInput';
import { TeamInputDropdown } from './TeamDropdownInput';
import { useTeamsContext } from '../hooks/useTeamsContext';
import {toast} from 'react-toastify';

export const CreateTeamPollModal = ({ isOpen, onClose }: ICreateTeamProps) => {
  const { teams, members } = useTeamsContext();
  const [allTeamsList, setAllTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamName, setTeamName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<"single" | "multi">("single");
  const [options, setOptions] = useState<string[]>([""]);
  const [optionEmpty, setOptionEmpty] = useState<boolean>(false);
  const [questionEmpty, setQuestionEmpty] = useState<boolean>(false);

  const addOption = () => {
    if (questionText.trim() === "") {
      setQuestionEmpty(true);
    } else if (options.some((option) => option.trim() === "")) {
      setOptionEmpty(true);
    } else {
      setOptionEmpty(false);
      setOptions((prev) => [...prev, ""]);
    }
  };

  // Populate teamsList
  useEffect(() => {
    setAllTeamsList(
      teams.map((team) => ({
        value: team.teamID,
        label: team.teamName,
      }))
    );
  }, [teams]);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleTeamSelect = (value: string) => {
    setSelectedTeam(value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (question.trim() === "") {
      setQuestionEmpty(true);
      return;
    }

    if (format === "multiple_choice" && options.some((option) => option.trim() === "")) {
      setOptionEmpty(true);
      return;
    }

    if(selectedOptions.length <= 0){
      setSelectedOptionsError(true);
      return;
    }

    if(selectedTimes.length <= 0){
      setSelectedTimesError(true);
      return;
    }


    // Prepare and submit data
    const data = {
      format,
      question,
      options: format === "multiple_choice" ? options : undefined,
      required,
    };
    
    onSubmit(data);
  };

  // Function to close the modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[1200px] h-[700px] overflow-scroll relative">
        {/* Close Button */}
        <button
          className="absolute top-7 right-8 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faCircleXmark} size={"xl"} />
        </button>

        <div className="w-full items-center text-center justify-center">
          <h2 className="text-xl font-bold mb-4">Create New Team Poll</h2>
        </div>

        <div className="space-y-8 my-6 mb-8 mx-20">
          <TeamInputDropdown
            inputName="Select a Team"
            className=""
            options={allTeamsList}
            selectedValue={selectedTeam}
            onOptionChange={handleTeamSelect}
          />

          {/* <TeamInput
            labelName={"Enter Team Poll Question"}
            inputType={"text"}
            inputPlaceholder={"Enter Question"}
            inputValue={teamName}
            onInputChange={handleNameChange}
          /> */}

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-black font-medium">Question</label>
            <input
              className="transition-all ease-in-out duration-300 focus:shadow-md border-[1px] border-gray-400 p-4 focus:bg-white"
              type={"text"}
              placeholder="Enter your question here"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            {questionEmpty && (
              <div className="text-red-500">The question input cannot be empty.</div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium">Question type</h3>
            <div className="flex flex-col w-full gap-4">
              <button
                onClick={() => setQuestionType("single")}
                className={`text-left px-4 py-4 rounded-lg border ${
                  questionType == "single" ? "border-black" : "border-gray-400"
                }`}
              >
                Single
              </button>
              <button
                onClick={() => setQuestionType("multi")}
                className={`text-left px-4 py-4 rounded-lg border ${
                  questionType == "multi" ? "border-black" : "border-gray-400"
                }`}
              >
                Multi
              </button>
            </div>
          </div>

          <div>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <label htmlFor={`option-${index}`} className="sr-only">
                  Option {index + 1}
                </label>
                <input
                  id={`option-${index}`}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            {optionEmpty && (
              <div className="text-red-500">You have left an option input empty.</div>
            )}
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-blue-500 hover:underline"
            //   disabled={questionText.trim() === ""}
            >
              + New Option
            </button>
          </div>

          <div className="mt-20 w-full flex justify-center">
            <button onClick={() => handleSubmit} className="text-white bg-green-800 hover:bg-green-700 rounded-lg w-full mx-10 px-6 py-4">
              Create Team Poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
