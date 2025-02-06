

interface Member{
    id: string;
    name: string;
    teamId: string[];
    status?: "Active" | "Pending activation";
}