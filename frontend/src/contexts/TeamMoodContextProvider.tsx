import {createContext, useState} from "react"
import { MoodData } from "@/types/Mood";
import { MoodGlobal } from "@/types/Mood";
import { MoodResponse } from "@/types/Mood";
import { Emoji } from "@/types/Mood";
import { Smile, Meh, Angry, Laugh,Frown } from 'lucide-react';


interface ITeamMoodContextProvider {
    children: React.ReactNode;
}

export const teamMoodContext = createContext<{
    teamMood: MoodData[] | undefined;
    allMoods: MoodGlobal[] | undefined;
    allEmojis: Emoji[] | undefined;
    allMoodResponses: MoodResponse[] | undefined;
    // setAllMembers: React.Dispatch<React.SetStateAction<Member[]>>;
} | undefined>(undefined);


const TeamMoodContextProvider = ({children}: ITeamMoodContextProvider) => {

    const [moodData, setMoodData] = useState<MoodData[]>([
        { date: 'Mon', happy: 12, neutral: 3, unhappy: 1 },
        { date: 'Tue', happy: 10, neutral: 5, unhappy: 2 },
        { date: 'Wed', happy: 8, neutral: 6, unhappy: 4 },
        { date: 'Thu', happy: 14, neutral: 2, unhappy: 0 },
        { date: 'Fri', happy: 11, neutral: 3, unhappy: 1 },
    ]);

    const moods:MoodGlobal[]  = [
        {
            emojiID: "emoji-001",
            emoji: "Smile",
            moodLabel: "Happy",
            moodScore: 5,
        },
        {
            emojiID: "emoji-002",
            emoji: "Meh",
            moodLabel: "Neutral",
            moodScore: 3,
        },
        {
            emojiID: "emoji-003",
            emoji: "Frown",
            moodLabel: "Unhappy",
            moodScore: 2,
        },
        ];

    const emojis:Emoji[] = [
        {emojiId: "emoji-001",emoji: "Excited", icon: <Laugh className="h-10 w-10 hover:text-green-500 transition-colors duration-300" />},
        {emojiId: "emoji-002",emoji: "Smile", icon: <Smile className="w-10 h-10 text-yellow-400" aria-label="Happy Mood" />},
        {emojiId: "emoji-003",emoji: "Meh", icon: <Meh className="w-10 h-10 text-gray-500" aria-label="Neutral Mood" />},
        {emojiId: "emoji-004",emoji: "Angry", icon: <Angry className="h-10 w-10 hover:text-orange-500 transition-colors duration-300" />},
        {emojiId: "emoji-005",emoji: "Sad", icon: <Frown className="h-10 w-10 hover:text-red-500 transition-colors duration-300" />}
    ]
    

    // Sample mood responses
    const moodResponses: MoodResponse[] = [
        {
        id: "res-001",
        userId: "11",
        teamId: "ddsdsd",
        emojiID: "emoji-001",
        anonymous: false,
        createdAt: "2025-02-04T10:00:00Z",
        },
        {
        id: "res-003",
        userId: "3",
        teamId: "team3",
        emojiID: "emoji-003",
        anonymous: false,
        createdAt: "2025-02-04T09:00:00Z",
        },
        {
        id: "res-004",
        userId: "4",
        teamId: "ddsdsd",
        emojiID: "emoji-001",
        anonymous: true,
        createdAt: "2025-02-04T08:45:00Z",
        },
        {
        id: "res-005",
        userId: "11",
        teamId: "ad1dd",
        emojiID: "emoji-002",
        anonymous: false,
        createdAt: "2025-02-04T14:00:00Z",
        },
        {
        id: "res-006",
        userId: "3",
        teamId: "adadd",
        emojiID: "emoji-001",
        anonymous: true,
        createdAt: "2025-02-04T11:00:00Z",
        },
        {
        id: "res-007",
        userId: "23324",
        teamId: "ddsdsd",
        emojiID: "emoji-003",
        anonymous: false,
        createdAt: "2025-02-04T10:45:00Z",
        },
        {
        id: "res-008",
        userId: "4",
        teamId: "team3",
        emojiID: "emoji-002",
        anonymous: true,
        createdAt: "2025-02-04T09:30:00Z",
        },
    ];

    const [teamMood, setTeamMood] = useState<MoodData[] | undefined>(moodData);
    const [allMoods, setAllMood] = useState<MoodGlobal[] | undefined>(moods);
    const [allEmojis, setAllEmojis] = useState<Emoji[] | undefined>(emojis);
    const [allMoodResponses, setAllMoodRsponses] = useState<MoodResponse[] | undefined>(moodResponses);



    return (
        <teamMoodContext.Provider value={{ teamMood, allMoods, allMoodResponses, allEmojis }}>
            {children}
        </teamMoodContext.Provider>
    )
}

export default TeamMoodContextProvider;