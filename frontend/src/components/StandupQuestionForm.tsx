import React, { useState } from "react";
import { useStandupModalContext } from "@/hooks/useStandupModalContext";


type QuestionFormat = "freeText" | "multiple_choice" | "single_choice";

interface QuestionFormProps {
  onSubmit: (questionData: {
    format: QuestionFormat;
    question: string;
    options?: string[];
    required: boolean;
  }) => void;
}

const StandupQuestionForm: React.FC<QuestionFormProps> = ({ onSubmit }) => {
  const [format, setFormat] = useState<QuestionFormat>("freeText");
  const [question, setQuestion] = useState<string>("");

  const [options, setOptions] = useState<string[]>([""]);
  const [required, setRequired] = useState<boolean>(false);

  const [optionEmpty, setOptionEmpty] = useState<boolean>(false);
  const [questionEmpty, setQuestionEmpty] = useState<boolean>(false);
  const {selectedTimes, setSelectedTimesError, selectedOptions, setSelectedOptionsError} = useStandupModalContext();
  const [allQuestions, setAllQuestions] = useState<>();

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (question.trim() === "") {
      setQuestionEmpty(true);
    } else if (options.some((option) => option.trim() === "")) {
      setOptionEmpty(true);
    } else {
      setOptionEmpty(false);
      setOptions((prev) => [...prev, ""]);
    }
  };

  const resetForm = () => {
    setFormat("freeText");
    setQuestion("");
    setOptions([""]);
    setRequired(false);
    setOptionEmpty(false);
    setQuestionEmpty(false);
  };

  const saveQuestion = () => {

  }

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
    resetForm(); // Call reset after successful submission
  };

  return (
    <div className="w-full bg-white">
      <form onSubmit={handleSubmit}>
        {/* Question Format Selector */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Question Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as QuestionFormat)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="freeText">Free Text</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="single_choice">Single Choice</option>
          </select>
        </div>

        {/* Question Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (e.target.value.trim() !== "") setQuestionEmpty(false);
            }}
            placeholder="Enter your question"
            className="w-full transition-all ease-in-out duration-300 focus:shadow-md border-[1px] border-gray-400 p-4 focus:bg-white"
          />
          {questionEmpty && (
            <div className="text-red-500">
              The question input cannot be empty.
            </div>
          )}
        </div>

        {/* Options for Multiple Choice */}
        {format === "multiple_choice" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            {optionEmpty && (
              <div className="text-red-500">
                You have left an option input empty.
              </div>
            )}
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-blue-500 hover:underline"
              disabled={question.trim() === ""}
            >
              + New Option
            </button>
          </div>
        )}

        {/* Options for Single Choice */}
        {format === "single_choice" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Options
            </label>
            <ul>
              <li className="text-gray-600">Yes</li>
              <li className="text-gray-600">No</li>
            </ul>
          </div>
        )}

        {/* Required Checkbox */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="mr-2"
            />
            <span className="text-gray-700">Required</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={saveQuestion}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Save Question
        <button
        type='submit'
        className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition" >
          CONFIGURE STANDUP QUESTION
        <button>
          
        </button>
      </form>
    </div>
  );
};

export default StandupQuestionForm;