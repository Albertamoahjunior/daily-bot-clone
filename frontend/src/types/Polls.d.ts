interface Poll {
    id: string;               // Unique identifier for the poll
    teamId: string;          // Identifier for the team associated with the poll
    question: string;        // The question being asked in the poll
    choiceType: 'single' | 'multi'; // Type of choice: single or multiple
    options: string[];       // Array of possible answers for the poll
    anonymous: boolean;      // Indicates if voting is anonymous
    createdAt: string;       // Timestamp of when the poll was created (ISO 8601 format)
}
interface PollResponse {
    id: string;
    pollId: string;
    userId: string;
    teamId: string;
    answer: string[];
    createdAt: string; // ISO 8601 format
}
