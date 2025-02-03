import {createContext, useState} from "react"


interface ITeamsContextProvider {
    children: React.ReactNode;
}

export const teamsContext = createContext<{
    users: Member[];
    members: Member[];
    teams: Team[]
    // setAllUsers: React.Dispatch<React.SetStateAction<Member[]>>;
    setAllMembers: React.Dispatch<React.SetStateAction<Member[]>>;
} | undefined>(undefined);


const TeamsContextProvider = ({children}: ITeamsContextProvider) => {
    const allUsers:Member[] = [
        { id: "11", name: "Sylwia", status: "Active" },
        { id: "23324", name: "Sylvia L.", status: "Pending activation" },
        { id: "3", name: "John Doe", status: "Active" },
        { id: "4", name: "Jane Smith", status: "Pending activation" },
    ]
    const allMembers:Member[] = [
        { id: "11", name: "Sylwia",  status: "Active" },
        { id: "23324", name: "Sylvia L.",  status: "Pending activation" },
        { id: "3", name: "John Doe", status: "Active" },
        { id: "4", name: "Jane Smith", status: "Pending activation" },
    ]
    const allTeams:Team[] = [
        {
            teamID: "ddsdsd",
            teamName: "sdsd",
            standup: {
                questionRef: "q1",
                questionID: "sq1",
                standupDays: ["Monday", "Wednesday", "Friday"],
                standupTimes: ["10:00 AM", "3:00 PM"],
                reminderTimes: ["9:45 AM", "2:45 PM"],
                timezone: "UTC"
            }
        },
        {
            teamID: "adadd",
            teamName: "Backend Engineers",
            standup: {
                questionRef: "q2",
                questionID: "sq2",
                standupDays: ["Tuesday", "Thursday"],
                standupTimes: ["11:00 AM"],
                reminderTimes: ["10:45 AM"],
                timezone: "UTC"
            }
        },
        {
            teamID: "team3",
            teamName: "QA Team",
            standup: {
                questionRef: "q3",
                questionID: "sq3",
                standupDays: ["Monday", "Thursday"],
                standupTimes: ["9:00 AM"],
                reminderTimes: ["8:45 AM"],
                timezone: "UTC"
            }
        },
        {
            teamID: "ad1dd",
            teamName: "Dev-watch",
            standup: {
                questionRef: "q4",
                questionID: "sq4",
                standupDays: ["Wednesday", "Friday"],
                standupTimes: ["2:00 PM"],
                reminderTimes: ["1:45 PM"],
                timezone: "UTC"
            }
        }
    ];
          

    const [users, setAllUsers] = useState<Member[]>(allUsers)
    const [teams, setTeams] = useState<Team[]>(allTeams)

    const [members, setAllMembers] = useState<Member[]>(allMembers)


    return (
        <teamsContext.Provider value={{ users, members, teams,  setAllMembers}}>
            {children}
        </teamsContext.Provider>
    )
}

export default TeamsContextProvider;