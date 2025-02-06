import {createContext, useState} from "react"
import { MoodData } from "@/types/Mood";
import { MoodGlobal } from "@/types/Mood";
import { MoodResponse } from "@/types/Mood";
import { Emoji } from "@/types/Mood";
import { Smile, Meh, Angry, Laugh,Frown } from 'lucide-react';


interface IPollsContextProvider {
    children: React.ReactNode;
}

interface Poll {
    id: string;               // Unique identifier for the poll
    teamId: string;          // Identifier for the team associated with the poll
    question: string;        // The question being asked in the poll
    choiceType: 'single' | 'multi'; // Type of choice: single or multiple
    options: string[];       // Array of possible answers for the poll
    anonymous: boolean;      // Indicates if voting is anonymous
    createdAt: string;       // Timestamp of when the poll was created (ISO 8601 format)
}


export const teamPollsContext = createContext<{
    allPolls: Poll[] | undefined;
    // setAllMembers: React.Dispatch<React.SetStateAction<Member[]>>;
} | undefined>(undefined);



const PollsContextProvider = ({children}: IPollsContextProvider) => {

        const polls:Poll[] = [
            {
                id: "poll1",
                teamId: "ddsdsd",
                question: "What is your preferred meeting time?",
                choiceType: "multi",
                options: ["10:00 AM", "3:00 PM", "No preference"],
                anonymous: true,
                createdAt: "2025-02-01T10:00:00Z"
            },
            {
                id: "poll2",
                teamId: "adadd",
                question: "Which framework do you prefer for backend development?",
                choiceType: "single",
                options: ["Node.js", "Django", "Ruby on Rails"],
                anonymous: false,
                createdAt: "2025-02-02T11:00:00Z"
            },
            {
                id: "poll3",
                teamId: "team3",
                question: "What tools do you use for testing?",
                choiceType: "multi",
                options: ["Selenium", "Postman", "Jest", "Cypress"],
                anonymous: false,
                createdAt: "2025-02-03T09:30:00Z"
            },
            {
                id: "poll4",
                teamId: "ad1dd",
                question: "Which feature should we prioritize next?",
                choiceType: "single",
                options: ["Performance improvements", "UI enhancements", "Bug fixes"],
                anonymous: false,
                createdAt: "2025-02-04T14:00:00Z"
            }
        ];
        

        const [allPolls, setAllPolls] = useState<Poll[] | undefined>(polls);
        



    return (
        <teamPollsContext.Provider value={{ allPolls }}>
            {children}
        </teamPollsContext.Provider>
    )
}

export default PollsContextProvider;