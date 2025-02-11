interface Kudos {
  id: string;           // Unique identifier for the recognition
  giverId: string;     // ID of the person giving the recognition
  receiverId: string;  // ID of the person receiving the recognition
  teamId: string;      // ID of the team involved
  reason: string;      // Reason for the recognition
  category: string;    // Category of the recognition (e.g., teamwork)
  createdAt: string;   // Timestamp of when the recognition was created
}