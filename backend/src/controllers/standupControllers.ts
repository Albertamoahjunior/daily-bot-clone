import { Request, Response } from 'express';
import { createStandupSetup, createStandupQuestions, createStandupResponses } from '../db';
import { app } from '../config/bot.config';
// import schedule from 'node-schedule';

// const slackClient = app.client;

// // Create modal view function
// const createModalView = (questions: string[], triggerId: string) => ({
//     trigger_id: triggerId,
//     view: {
//         type: 'modal',
//         callback_id: 'standup_submission',
//         title: {
//             type: 'plain_text',
//             text: 'Daily Standup',
//         },
//         submit: {
//             type: 'plain_text',
//             text: 'Submit',
//         },
//         blocks: questions.map((question, index) => ({
//             type: 'input',
//             block_id: `question_${index}`,
//             element: {
//                 type: 'plain_text_input',
//                 action_id: `answer_${index}`,
//                 placeholder: {
//                     type: 'plain_text',
//                     text: 'Your answer here'
//                 }
//             },
//             label: {
//                 type: 'plain_text',
//                 text: question
//             }
//         }))
//     }
// });

// interface ReminderSchedule {
//     days: string[];
//     times: string[];
//     questions: string[];
//     channelId: string;
// }

// function scheduleReminders({
//     days,
//     times,
//     questions,
//     channelId,
// }: ReminderSchedule) {
//     // Validate inputs
//     if (!times.length || !days.length) {
//         console.error('Times and days must be non-empty');
//         return;
//     }

//     const dayMapping = {
//         'sunday': 0,
//         'monday': 1,
//         'tuesday': 2,
//         'wednesday': 3,
//         'thursday': 4,
//         'friday': 5,
//         'saturday': 6
//     };

//     // Convert days to lowercase for comparison
//     const validDays = days.map(day => day.toLowerCase())
//         .filter(day => day in dayMapping);

//     if (validDays.length === 0) {
//         console.error('No valid days provided');
//         return;
//     }

//     // Store job references for potential cleanup
//     const scheduledJobs: schedule.Job[] = [];

//     times.forEach((reminderTime, timeIndex) => {
//         // Parse time in both 12-hour and 24-hour formats
//         const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
//         const match = reminderTime.match(timeRegex);
        
//         if (!match) {
//             console.error(`Invalid time format for ${reminderTime}`);
//             return;
//         }

//         let [_, hours, minutes, period] = match;
//         let parsedHours = parseInt(hours);
//         const parsedMinutes = parseInt(minutes);

//         // Convert to 24-hour format if needed
//         if (period) {
//             if (period.toLowerCase() === 'pm' && parsedHours < 12) parsedHours += 12;
//             if (period.toLowerCase() === 'am' && parsedHours === 12) parsedHours = 0;
//         }

//         validDays.forEach((day, dayIndex) => {
//             // Create a recurring schedule rule
//             const rule = new schedule.RecurrenceRule();
//             rule.dayOfWeek = dayMapping[day as keyof typeof dayMapping];
//             rule.hour = parsedHours;
//             rule.minute = parsedMinutes;
//             rule.tz = 'UTC';

//             const job = schedule.scheduleJob(
//                 `reminder-${timeIndex}-${dayIndex}`,
//                 rule,
//                 async () => {
//                     try {
//                         // Send interactive message with button instead of direct questions
//                         await slackClient.chat.postMessage({
//                             channel: channelId,
//                             blocks: [
//                                 {
//                                     type: 'section',
//                                     text: {
//                                         type: 'mrkdwn',
//                                         text: '🎯 Time for your daily standup!'
//                                     }
//                                 },
//                                 {
//                                     type: 'actions',
//                                     elements: [
//                                         {
//                                             type: 'button',
//                                             text: {
//                                                 type: 'plain_text',
//                                                 text: 'Fill Standup Form'
//                                             },
//                                             action_id: 'open_standup_modal'
//                                         }
//                                     ]
//                                 }
//                             ]
//                         });
//                         console.log(`Interactive reminder sent for job reminder-${timeIndex}-${dayIndex}`);
//                     } catch (error) {
//                         console.error(`Error sending reminder for job reminder-${timeIndex}-${dayIndex}:`, error);
//                     }
//                 }
//             );

//             scheduledJobs.push(job);
//             console.log(`Scheduled recurring reminder for ${day} at ${reminderTime}`);
//         });
//     });

//     return 'reminders success';
// }

// // Add Slack action handlers
// app.action('open_standup_modal', async ({ body, ack, client }) => {
//     try {
//         await ack();
//         // Get questions from your database using teamId
//         const teamId = body.channel?.id;
//         if (!teamId) {
//             console.error('Channel ID is undefined');
//             return;
//         }
//         const questions = await getQuestionsFromDb(teamId); // You'll need to implement this
        
//         await client.views.open(
//             createModalView(questions, body.trigger_id)
//         );
//     } catch (error) {
//         console.error('Error opening modal:', error);
//     }
// });

// app.view('standup_submission', async ({ ack, view, body, client }) => {
//     try {
//         await ack();
        
//         const teamId = "C08BC6L9B2L";
//         const userId = body.user.id;
//         console.log({body: body, client: client})
        
//         // Get questions from database
//         const questions = await getQuestionsFromDb(teamId); // You'll need to implement this
        
//         // Extract answers from the submission
//         const answers = questions.map((_, index) => {
//             const blockId = `question_${index}`;
//             const actionId = `answer_${index}`;
//             return view.state.values[blockId][actionId].value;
//         });

//         // Store answers in your database
//         await createStandupResponses(answers); // You'll need to implement this

//         // Send confirmation message
//         await client.chat.postMessage({
//             channel: userId,
//             text: 'Thanks for submitting your standup! 🎉'
//         });
//     } catch (error) {
//         console.error('Error handling modal submission:', error);
//     }
// });

export async function configureStandup(req: Request, res: Response) {
    const { teamId, standupDays, reminderTimes, questions } = req.body;

    try {
        // Create standup setup
        const standupSetup = await createStandupSetup(teamId, standupDays, reminderTimes);

        // Create standup questions
        const standupQuestions = await createStandupQuestions(teamId, questions);

        //now set the reminders
        // const reminderScheduler = scheduleReminders({
        //     days: standupDays,
        //     times: reminderTimes,
        //     questions,
        //     channelId: teamId,
        // });

        res.status(200).json({
            message: 'Standup setup and questions configured successfully',
            //reminderScheduler,
            standupSetup,
            standupQuestions,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while configuring standup' });
    }
}

