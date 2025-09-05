import * as XLSX from 'xlsx';

// Define your interfaces if not already defined
export interface UserResponse {
  answer?: string | null;
  options: string[];
  userId: string;
  date: string;
}

export interface StandupResponse {
  question: string;
  response: UserResponse[];
}

export interface TeamStandup {
  teamId: string;
  teamName: string;
  standup: StandupResponse[] | [];
}

/**
 * Exports the provided standups data to an Excel file named "standups.xlsx"
 *
 * @param {TeamStandup[]} standups - The array of team standup data to export.
 */
export const exportToExcel = (standups: TeamStandup[]): void => {
  // Prepare an array to hold rows for the Excel sheet.
  // Each row represents a user response within a team's standup.
  const data: { TeamID: string; TeamName: string; Question: string; UserID: string; Answer: string; Options: string; Date: string }[] = [];

  // Loop through each team standup
  standups.forEach(team => {
    // Loop through each standup response (each question)
    team.standup.forEach(standupResponse => {
      // Loop through each user's answer to the standup question
      standupResponse.response.forEach(userResponse => {
        data.push({
          TeamID: team.teamId,
          TeamName: team.teamName,
          Question: standupResponse.question,
          UserID: userResponse.userId,
          Answer: userResponse.answer || '', // Fallback to empty string if null/undefined
          Options: userResponse.options.join(', '),
          Date: userResponse.date,
        });
      });
    });
  });

  // Create a worksheet from the JSON data.
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet.
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Standups');

  // Write the workbook to a binary array.
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  // Create a blob from the binary array.
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  });

  // Create a temporary link element to trigger the download.
  const url = window.URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'standups.xlsx');

  // Append the link, trigger click, and then remove it.
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object.
  window.URL.revokeObjectURL(url);
};
