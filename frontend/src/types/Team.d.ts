interface Standup {
    questionRef: string;       // Reference ID for the question
    questionID: string;
    standupDays: string[];     // Days of the week for standups
    standupTimes: string[];    // Times for the standups
    reminderTimes: string[];    // Reminder times for the standups
    timezone: string;           // Timezone for the standups
}

interface Team {
    teamID: string;
    teamName: string;
    standup: Standup;
}