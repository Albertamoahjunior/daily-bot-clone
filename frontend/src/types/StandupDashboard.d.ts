export interface UserResponse {
  answer?: string | null;
  options: string[];
  userId: string;
  date: string;
}

export interface StandupResponse {
  question: string;
  response: UserResponse[];
}

export interface TeamStandup {
  teamId: string;
  teamName: string;
  standup: StandupResponse[];
}


// Interface for Standup Question
interface StandupQuestion {
  questionID: string;        // Unique identifier for the question
  teamID: string;            // Reference to the team ID
  questionText: string;      // Text of the question
  options: string[];         // Possible options for the question
  questionType: string;      // Type of the question (e.g., text, multiple-choice)
  required: boolean;         // Whether the question is required
}