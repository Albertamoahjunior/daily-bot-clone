import { TDocumentDefinitions, Content, ContentStack, ContentColumns } from 'pdfmake/interfaces';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
//import { pdfMake as pdfMakeType } from "pdfmake/build/vfs_fonts";


// Explicitly set the virtual file system
(pdfMake as typeof pdfMake & { vfs: typeof pdfFonts.vfs }).vfs = pdfFonts.vfs;


interface Question {
  id: string;
  teamId: string;
  questionText: string;
  options: string[];
  questionType: string;
  required: boolean;
}

interface ParticipationCount {
  memberName: string;
  count: number;
}

interface MoodTrend {
  id: string;
  userId: string;
  teamId: string;
  moodId: string;
  anonymous: boolean;
  createdAt: string;
}

export interface TeamData {
  teamName: string;
  standupConfig: {
    days: string[];
    reminderTimes: string[];
    questions: Question[];
  };
  members: string[];
  participation: {
    mood: ParticipationCount[];
    polls: ParticipationCount[];
    standups: ParticipationCount[];
  };
  moodTrends: MoodTrend[];
}

export const generateTeamPDF = (data: TeamData): TDocumentDefinitions => {
  // Color scheme
  const colors = {
    primary: '#2563eb',
    secondary: '#4f46e5',
    accent: '#7c3aed',
    success: '#16a34a',
    warning: '#ca8a04',
    background: '#f8fafc',
    text: '#1e293b'
  };

  // Helper function to create section headers
  const createHeader = (text: string): Content => ({
    text,
    fontSize: 18,
    bold: true,
    color: colors.primary,
    margin: [0, 20, 0, 10]
  });

  // Generate team overview section
  const teamOverview: ContentStack = {
    stack: [
      {
        text: data.teamName,
        fontSize: 24,
        bold: true,
        color: colors.primary,
        margin: [0, 0, 0, 20]
      } as Content,
      {
        columns: [
          {
            width: '50%',
            stack: [
              { 
                text: 'Team Members:',
                bold: true,
                margin: [0, 0, 0, 5]
              } as Content,
              ...data.members.map(member => ({
                text: `• ${member}`,
                margin: [10, 0, 0, 2]
              } as Content))
            ]
          },
          {
            width: '50%',
            stack: [
              {
                text: 'Standup Days:',
                bold: true,
                margin: [0, 0, 0, 5]
              } as Content,
              ...data.standupConfig.days.map(day => ({
                text: `• ${day}`,
                margin: [10, 0, 0, 2]
              } as Content))
            ]
          }
        ]
      } as ContentColumns
    ]
  };

  // Generate questions section
  const questionsSection: ContentStack = {
    stack: [
      createHeader('Standup Questions'),
      ...data.standupConfig.questions.map((question, index) => ({
        stack: [
          {
            text: `${index + 1}. ${question.questionText}`,
            bold: true,
            margin: [0, 10, 0, 5]
          } as Content,
          {
            text: `Type: ${question.questionType}`,
            color: colors.secondary,
            margin: [10, 0, 0, 5]
          } as Content,
          question.options.length > 0 ? {
            stack: [
              {
                text: 'Options:',
                margin: [10, 0, 0, 5]
              } as Content,
              ...question.options.map(opt => ({
                text: `• ${opt}`,
                margin: [20, 0, 0, 2]
              } as Content))
            ]
          } as ContentStack : null
        ]
      } as ContentStack))
    ]
  };

  // Generate participation statistics
  const participationStats: ContentStack = {
    stack: [
      createHeader('Participation Statistics'),
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*'],
          body: [
            [
              { text: 'Member', bold: true },
              { text: 'Standups', bold: true },
              { text: 'Polls', bold: true },
              { text: 'Mood Updates', bold: true }
            ],
            ...data.members.map(member => [
              member,
              data.participation.standups.find(s => s.memberName === member)?.count || 0,
              data.participation.polls.find(p => p.memberName === member)?.count || 0,
              data.participation.mood.find(m => m.memberName === member)?.count || 0
            ])
          ]
        }
      }
    ]
  };

  // Generate mood trends section
  const moodTrends: ContentStack = {
    stack: [
      createHeader('Mood Trends'),
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],
          body: [
            [
              { text: 'Date', bold: true },
              { text: 'Mood', bold: true },
              { text: 'Anonymous', bold: true }
            ],
            ...data.moodTrends.map(trend => [
              new Date(trend.createdAt).toLocaleDateString(),
              trend.moodId,
              trend.anonymous ? 'Yes' : 'No'
            ])
          ]
        }
      }
    ]
  };

  // Combine all sections into final document definition
  return {
    content: [
      teamOverview,
      questionsSection,
      participationStats,
      moodTrends
    ],
    defaultStyle: {
      fontSize: 12,
      color: colors.text
    },
    pageMargins: [40, 60, 40, 60],
    background: {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 595.28, // A4 width in points
          h: 841.89, // A4 height in points
          color: colors.background
        }
      ]
    }
  };
};


// Export both the type and the generator function
export const generate_report = (team_data: TeamData) => {
  const docDefinition = generateTeamPDF(team_data);
  return pdfMake.createPdf(docDefinition);
};

//export type { TeamData };
export default generateTeamPDF;

