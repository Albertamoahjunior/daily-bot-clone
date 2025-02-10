import {createContext, useEffect, useState} from "react"
import { pollService } from "@/services/api";

interface IPollsContextProvider {
    children: React.ReactNode;
}




export const teamPollsContext = createContext<{
    allPolls: Poll[] | undefined;
    allPollsResponse: PollResponse[] | undefined;
    teamId: string;
    setTeamId: React.Dispatch<React.SetStateAction<string>>;
} | undefined>(undefined);



const PollsContextProvider = ({children}: IPollsContextProvider) => {


        // const polls:Poll[] = [
        //     {
        //         id: "poll1",
        //         teamId: "ddsdsd",
        //         question: "What is your preferred meeting time?",
        //         choiceType: "multi",
        //         options: ["10:00 AM", "3:00 PM", "No preference"],
        //         anonymous: true,
        //         createdAt: "2025-02-01T10:00:00Z"
        //     },
        //     {
        //         id: "poll2",
        //         teamId: "adadd",
        //         question: "Which framework do you prefer for backend development?",
        //         choiceType: "single",
        //         options: ["Node.js", "Django", "Ruby on Rails"],
        //         anonymous: false,
        //         createdAt: "2025-02-02T11:00:00Z"
        //     },
        //     {
        //         id: "poll3",
        //         teamId: "team3",
        //         question: "What tools do you use for testing?",
        //         choiceType: "multi",
        //         options: ["Selenium", "Postman", "Jest", "Cypress"],
        //         anonymous: false,
        //         createdAt: "2025-02-03T09:30:00Z"
        //     },
        //     {
        //         id: "poll4",
        //         teamId: "ad1dd",
        //         question: "Which feature should we prioritize next?",
        //         choiceType: "single",
        //         options: ["Performance improvements", "UI enhancements", "Bug fixes"],
        //         anonymous: false,
        //         createdAt: "2025-02-04T14:00:00Z"
        //     }
        // ];

        // const allResponses = [
        //     {
        //         id: "response1",
        //         pollId: "poll1", // Corresponds to the first poll
        //         userId: "11",    // Sylwia
        //         teamId: "ddsdsd",
        //         answer: ["10:00 AM", "No preference"],
        //         createdAt: "2025-02-03T08:31:24.699Z"
        //     },
        //     {
        //         id: "response2",
        //         pollId: "poll2", // Corresponds to the second poll
        //         userId: "3",     // John Doe
        //         teamId: "adadd",
        //         answer: ["Node.js"],
        //         createdAt: "2025-02-03T09:15:00.000Z"
        //     },
        //     {
        //         id: "response3",
        //         pollId: "poll3", // Corresponds to the third poll
        //         userId: "4",     // Jane Smith
        //         teamId: "team3",
        //         answer: ["Selenium", "Postman"],
        //         createdAt: "2025-02-03T10:00:00.000Z"
        //     },
        //     {
        //         id: "response4",
        //         pollId: "poll4", // Corresponds to the fourth poll
        //         userId: "23324", // Sylvia L.
        //         teamId: "ad1dd",
        //         answer: ["UI enhancements"],
        //         createdAt: "2025-02-03T11:30:00.000Z"
        //     }
        // ];
        

        
        
        const [allPolls, setAllPolls] = useState<Poll[] | undefined>(undefined);
        const [allPollsResponse, setAllPollsResponses] = useState<PollResponse[] | undefined>(undefined)
        const [teamId, setTeamId] = useState<string>(""); 

        useEffect( () => {
            const fetchPollQuestions = async () => {
                if (teamId) {
                    console.log("Selected Team ID", teamId);
                    try {
                        const result = await pollService.getTeamPollQuestions(teamId);
                        if (result && result.length) {
                            setAllPolls(result);
                        }
                    } catch (err) {
                        console.log("Error Fetching Poll For Team", teamId);
                    }
                }
            };
            const fetchPollResponses = async () => {
                if (teamId) {
                    console.log("Selected Team ID", teamId);
                    try {
                        const result = await pollService.getTeamPollResponses(teamId);
                        if (result && result.length) {
                            setAllPollsResponses(result);
                        }
                    } catch (err) {
                        console.log("Error Fetching Poll For Team", teamId);
                    }
                }
            };
        
            fetchPollQuestions();
            fetchPollResponses();

        }, [teamId])



    return (
        <teamPollsContext.Provider value={{ allPolls, allPollsResponse, teamId, setTeamId }}>
            {children}
        </teamPollsContext.Provider>
    )
}

export default PollsContextProvider;