interface Standup {
    id: string;
    teamId: string;
    standupDays: string[];     // Days of the week for standups
    standupTimes: string[];    // Times for the standups
    reminderTimes: string[];    // Reminder times for the standups
}

interface Team {
    id: string;
    status? : any
    teamName: string;
    timezone: string;           // Timezone for the standups
    standup: Standup | null;
}