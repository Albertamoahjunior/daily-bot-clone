export type MoodStatus = 'happy' | 'unhappy' | 'neutral';

export interface Mood {
  date: string;
  happyCount: number;
  unhappyCount: number;
  neutralCount: number;
  totalCount: number;
}

export interface IndividualMood {
  id: string;
  date: string;
  status: MoodStatus;
}

export interface MoodGlobal {
  emojiID: string;
  emoji: "Smile" | "Meh" | "Frown";
  moodLabel: "Happy" | "Neutral" | "Unhappy";
  moodScore: number;
}


// export interface MoodData {
//   date: string;
//   happy: number;
//   neutral: number;
//   unhappy: number;
// }

export interface MoodResponse {
  id: string;
  userId: string;
  teamId: string;
  emojiID: string;
  anonymous: boolean;
  createdAt: string;
}

export interface Emoji {
  emojiId: string;
  emoji: string;
  icon: JSX.Element; // Assuming you're using React
}

export interface ICreateMoodProps{
  isOpen: boolean;
  onClose: () => void;
  // allTeamsList: {value: string; label: string}[] | undefined;
  // handleTeamSelect: (value:string) => void;
  // question: string;

}

 export interface TeamMood {
    id: string;
    mood: string;
    emojiId: string;
    moodScore: number;
    teamId: string;
    description: string;
    createdAt: string; // ISO date string
  }

  interface AllMoods {
    [teamId: string]: TeamMood[]; // Keyed by teamId with an array of Mood objects
  }

  interface MoodData {
    date: string; // date is always a string
    [feeling: "excited"| "smile"| "angry" | "meh" | "sad"]: number ; // Dynamic properties for various feelings
  }