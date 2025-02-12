import {createContext, useEffect, useState} from "react"
import { StandupQuestion, TeamStandup } from "StandupDashboard";
import {standupService  } from "../services/api"; // Adjust path accordingly



interface IStandupsContextProvider {
    children: React.ReactNode;
}

export const standupContext = createContext<{
    standups: TeamStandup[]
    standupQuestions: StandupQuestion[];
} | undefined>(undefined);


const StandupsContextProvider = ({children}: IStandupsContextProvider) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  
  useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const results = await Promise.allSettled([
                    standupService.getAllStandups(),
                    standupService.getAllStandupQuestions(),
                ]);

                const standupsResult = results[0];
                const standupQuestionsResult = results[1];

                


                if (standupsResult.status === 'fulfilled') {
                    console.log("standupsResult.value", standupsResult.value);
                    setAllStandups(standupsResult.value);
                }
                if (standupQuestionsResult.status === 'fulfilled') {
                    console.log("standupsQuestionResult.value", standupQuestionsResult.value);
                    setStandupQuestions(standupQuestionsResult.value);
                }

                // Check if any promises were rejected
                const anyRejected = results.some(result => result.status === 'rejected');
                
                if (anyRejected) {
                    const errors = results
                        .filter(result => result.status === 'rejected')
                        .map(result => (result as PromiseRejectedResult).reason);
                    
                    throw new Error(`Failed to fetch standup data: ${errors.join(', ')}`);
                } else {
                    setError(null);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch standups data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    //   const questions:StandupQuestion[] = [
    //     {
    //         questionID: "sq1",
    //         teamID: "ddsdsd",
    //         questionText: "What did you accomplish yesterday?",
    //         options: [],
    //         questionType: "freeText",
    //         required: true
    //     },
    //     {
    //         questionID: "sq1",
    //         teamID: "ddsdsd",
    //         questionText: "What are you planning to work on today?",
    //         options: [],
    //         questionType: "freeText",
    //         required: true
    //     },
    //     {
    //         questionID: "sq2",
    //         teamID: "adadd",
    //         questionText: "Are there any blockers?",
    //         options: ["Yes","No"],
    //         questionType: "single_choice",
    //         required: true
    //     },
    //     {
    //         questionID: "sq2",
    //         teamID: "adadd",
    //         questionText: "What are your priorities for this week?",
    //         options: [],
    //         questionType: "freeText",
    //         required: true
    //     },
    //     {
    //         questionID: "sq3",
    //         teamID: "team3",
    //         questionText: "What tests have you completed so far?",
    //         options: [],
    //         questionType: "freeText",
    //         required: false
    //     },
    //     {
    //         questionID: "sq3",
    //         teamID: "team3",
    //         questionText: "What tests have you completed so far?",
    //         options: [],
    //         questionType: "freeText",
    //         required: false
    //     },
    //     {
    //         questionID: "sq4",
    //         teamID: "ad1dd",
    //         questionText: "What tasks have you completed so far?",
    //         options: [],
    //         questionType: "freeText",
    //         required: true
    //     },
    //     {
    //         questionID: "sq4",
    //         teamID: "ad1dd",
    //         questionText: "What is your focus for the next sprint?",
    //         options: [],
    //         questionType: "freeText",
    //         required: true
    //     }
    // ];


    // const allStandups:  TeamStandup[] = [
    //         {
    //           "teamId": "ddsdsd",
    //           "teamName": "sdsd",
    //           "standup": [
    //             {
    //               "question": "What did you accomplish yesterday?",
    //               "response": [
    //                 {
    //                   "answer": "Completed the login page UI",
    //                   "options": [],
    //                   "userId": "11",
    //                   "date": "2025-01-30T09:00:00Z"
    //                 },
    //                 {
    //                   "answer": "Fixed a bug in the navbar component",
    //                   "options": [],
    //                   "userId": "user124",
    //                   "date": "2025-01-30T10:00:00Z"
    //                 }
    //               ]
    //             },
    //             {
    //               "question": "What are you planning to work on today?",
    //               "response": [
    //                 {
    //                   "answer": "Implement the profile settings page",
    //                   "options": [],
    //                   "userId": "23324",
    //                   "date": "2025-01-30T09:05:00Z"
    //                 },
    //                 {
    //                   "answer": "Write tests for the dashboard component",
    //                   "options": [],
    //                   "userId": "4",
    //                   "date": "2025-01-30T10:05:00Z"
    //                 }
    //               ]
    //             }
    //           ]
    //         },
    //         {
    //           "teamId": "adadd",
    //           "teamName": "Backend Engineers",
    //           "standup": [
    //             {
    //               "question": "Are there any blockers?",
    //               "response": [
    //                 {
    //                   "answer": null,
    //                   "options": ["Yes"],
    //                   "userId": "23324",
    //                   "date": "2025-01-30T11:00:00Z"
    //                 },
    //                 {
    //                   "answer": null,
    //                   "options": ["No"],
    //                   "userId": "3",
    //                   "date": "2025-01-30T11:15:00Z"
    //                 }
    //               ]
    //             },
    //             {
    //               "question": "What are your priorities for this week?",
    //               "response": [
    //                 {
    //                   "answer": "Set up API endpoints for user authentication",
    //                   "options": [],
    //                   "userId": "23324",
    //                   "date": "2025-01-29T15:00:00Z"
    //                 },
    //                 {
    //                   "answer": "Optimize the query performance for large datasets",
    //                   "options": [],
    //                   "userId": "11",
    //                   "date": "2025-01-29T15:30:00Z"
    //                 }
    //               ]
    //             }
    //           ]
    //         },
    //         {
    //           "teamId": "team3",
    //           "teamName": "QA Team",
    //           "standup": [
    //             {
    //               "question": "What tests have you completed so far?",
    //               "response": [
    //                 {
    //                   "answer": "Finished testing the login and registration workflows",
    //                   "options": [],
    //                   "userId": "11",
    //                   "date": "2025-01-30T13:00:00Z"
    //                 }
    //               ]
    //             },
    //             {
    //               "question": "What is your focus for the next sprint?",
    //               "response": [
    //                 {
    //                   "answer": "Automate tests for the shopping cart functionality",
    //                   "options": [],
    //                   "userId": "3",
    //                   "date": "2025-01-30T13:15:00Z"
    //                 }
    //               ]
    //             }
    //           ]
    //         },
    //         {
    //           "teamId": "ad1dd",
    //           "teamName": "Dev-watch",
    //           "standup": [
    //             {
    //               "question": "What tasks have you completed so far?",
    //               "response": [
    //                 {
    //                   "answer": "Finished testing the login and registration workflows",
    //                   "options": [],
    //                   "userId": "11",
    //                   "date": "2025-01-30T13:00:00Z"
    //                 }
    //               ]
    //             },
    //             {
    //               "question": "What is your focus for the next sprint?",
    //               "response": [
    //                 {
    //                   "answer": "Automate tests for the shopping cart functionality",
    //                   "options": [],
    //                   "userId": "3",
    //                   "date": "2025-01-30T13:15:00Z"
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
          


    const [standups, setAllStandups] = useState<TeamStandup[] | []>([])
    const [standupQuestions, setStandupQuestions] = useState<StandupQuestion[] | []>([])

    

    return (
        <standupContext.Provider value={{ standups, standupQuestions }}>
            {children}
        </standupContext.Provider>
    )
}

export default StandupsContextProvider;