

interface Member{
    id: string;
    memberName: string;
    teams: string[];
    status?: "Active" | "Pending activation" | undefined;
}