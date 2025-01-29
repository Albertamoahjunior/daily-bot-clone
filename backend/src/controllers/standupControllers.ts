import { Request, Response } from 'express';
import { createStandupSetup, createStandupQuestions, createStandupResponses, getStandupQuestions } from '../db';
import { app } from '../config/bot.config';
import schedule from 'node-schedule';
import { SlackActionMiddlewareArgs } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { View, ModalView } from '@slack/web-api';

const slackClient = app.client;

interface StandupQuestion {
    id:            String;
    teamId:        String;   
    questionText:  String;  
    options:       String[]; 
    questionType:  String;   
    required:      Boolean;  
  }

// Function to create the modal view with proper typing
function createModalView(questions: StandupQuestion[], triggerId: string, teamId: string): ModalView {
    return {
      type: "modal",
      callback_id: "standup_submission",
      private_metadata: JSON.stringify({ teamId: teamId }),
      title: {
        type: "plain_text",
        text: "Daily Standup"
      },
      submit: {
        type: "plain_text",
        text: "Submit"
      },
      blocks: questions.map((question, index) => {
        // Check if the question has options
        if (question.options && question.questionType === 'multiple_choice' && question.options.length > 0) {
          return {
            type: "input",
            block_id: `question_${index}`,
            element: {
              type: "multi_static_select",
              action_id: `answer_${index}`,
              placeholder: {
                type: "plain_text",
                text: "Select an option"
              },
              options: question.options.map(option => ({
                text: {
                  type: "plain_text",
                  text: option
                },
                value: option
              }))
            },
            label: {
              type: "plain_text",
              text: question.questionText
            }
          };
        } else if (question.options && question.questionType === 'single_choice' && question.options.length > 0) {
            return {
              type: "input",
              block_id: `question_${index}`,
              element: {
                type: "static_select",
                action_id: `answer_${index}`,
                placeholder: {
                  type: "plain_text",
                  text: "Select an option"
                },
                options: question.options.map(option => ({
                  text: {
                    type: "plain_text",
                    text: option
                  },
                  value: option
                }))
              },
              label: {
                type: "plain_text",
                text: question.questionText
              }
            };
          } 
        else {
          return {
            type: "input",
            block_id: `question_${index}`,
            element: {
              type: "plain_text_input",
              action_id: `answer_${index}`,
              placeholder: {
                type: "plain_text",
                text: "Enter your response"
              }
            },
            label: {
              type: "plain_text",
              text: question.questionText
            }
          };
        }
      })
    };
  }
  

interface ReminderSchedule {
    days: string[];
    times: string[];
    questions: string[];
    channelId: string;
}

function scheduleReminders({
    days,
    times,
    questions,
    channelId,
}: ReminderSchedule) {
    // Validate inputs
    if (!times.length || !days.length) {
        console.error('Times and days must be non-empty');
        return;
    }

    const dayMapping = {
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6
    };

    // Convert days to lowercase for comparison
    const validDays = days.map(day => day.toLowerCase())
        .filter(day => day in dayMapping);

    if (validDays.length === 0) {
        console.error('No valid days provided');
        return;
    }

    // Store job references for potential cleanup
    const scheduledJobs: schedule.Job[] = [];

    times.forEach((reminderTime, timeIndex) => {
        // Parse time in both 12-hour and 24-hour formats
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
        const match = reminderTime.match(timeRegex);
        
        if (!match) {
            console.error(`Invalid time format for ${reminderTime}`);
            return;
        }

        let [_, hours, minutes, period] = match;
        let parsedHours = parseInt(hours);
        const parsedMinutes = parseInt(minutes);

        // Convert to 24-hour format if needed
        if (period) {
            if (period.toLowerCase() === 'pm' && parsedHours < 12) parsedHours += 12;
            if (period.toLowerCase() === 'am' && parsedHours === 12) parsedHours = 0;
        }

        validDays.forEach(async (day, dayIndex) => {
            // Create a recurring schedule rule
            const rule = new schedule.RecurrenceRule();
            rule.dayOfWeek = dayMapping[day as keyof typeof dayMapping];
            rule.hour = parsedHours;
            rule.minute = parsedMinutes;
            rule.tz = 'UTC';
            
            //get all members from the channel with a .then() method
            const members = await slackClient.conversations.members({ channel: channelId });
            const memberIds = members.members;

            const job = schedule.scheduleJob(
                `reminder-${timeIndex}-${dayIndex}`,
                rule,
                async () => {
                    try {
                        // Send interactive message with button instead of direct questions
                        if(memberIds){
                            for(const memberId of memberIds) {
                                await slackClient.chat.postMessage({
                                    channel: memberId,
                                    blocks: [
                                        {
                                            type: 'section',
                                            text: {
                                                type: 'mrkdwn',
                                                text: '🎯 Time for your daily standup!'
                                            }
                                        },
                                        {
                                            type: 'actions',
                                            elements: [
                                                {
                                                    type: 'button',
                                                    text: {
                                                        type: 'plain_text',
                                                        text: 'Fill Standup Form'
                                                    },
                                                    action_id: 'open_standup_modal',
                                                    value: JSON.stringify({ teamId: channelId })
                                                }
                                            ]
                                        }
                                    ]
                                });
                            }
                        }
                        
                        console.log(`Interactive reminder sent for job reminder-${timeIndex}-${dayIndex}`);
                    } catch (error) {
                        console.error(`Error sending reminder for job reminder-${timeIndex}-${dayIndex}:`, error);
                    }
                }
            );

            scheduledJobs.push(job);
            console.log(`Scheduled recurring reminder for ${day} at ${reminderTime}`);
        });
    });

    return 'reminders success';
}

// Add Slack action handlers
// Updated action handler with proper typing
app.action('open_standup_modal', async ({ ack, body, client }: SlackActionMiddlewareArgs<any> & { client: WebClient }) => {
    try {
      await ack();

      console.log(body)

      const payload = JSON.parse(body.actions[0].value);
      
      const teamId = payload.teamId;
      if (!teamId) {
        console.error('Channel ID is undefined');
        return;
      }
  
      const triggerId = (body as any).trigger_id || (body as any).container?.trigger_id;
      if (!triggerId) {
        console.error('Trigger ID is undefined');
        return;
      }
  
      const questions = await getStandupQuestions(teamId);
      //const questionStrings = questions.map(question => question.questionText);
      
      const modalView = createModalView(questions, triggerId, teamId);
      await client.views.open({
        trigger_id: triggerId,
        view: modalView
      });
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  });

  app.view('standup_submission', async ({ ack, view, body, client }) => {
    try {
      await ack();
      const metadata = JSON.parse(body.view.private_metadata);
      const teamId = metadata.teamId;
      const userId = body.user.id;
      
      // Get questions from database
      const questions = await getStandupQuestions(teamId);
      
      // Extract answers from the submission
      const answers = questions.map((question, index) => {
        const questionId = `question_${index}`;
        const answerBlock = view.state.values[questionId][`answer_${index}`];
        
        // Initialize the response object
        const response: { questionId: string, userId: string, answer: string, options: string[] } = {
          questionId: question.id,
          userId,
          answer: '',
          options: []
        };
        
        // Handle different types of inputs
        if (answerBlock.type === 'plain_text_input') {
          // For free text questions
          response.answer = answerBlock.value ?? '';
        } else if (answerBlock.type === 'static_select') {
          // For single select questions
          response.options = answerBlock.selected_option ? [answerBlock.selected_option.value] : [];
        } else if (answerBlock.type === 'multi_static_select') {
          // For multi-select questions
          response.options = answerBlock.selected_options ? answerBlock.selected_options.map(option => option.value) : [];
        }
        
        return response;
      });
  
      // Store answers in your database
      await createStandupResponses(answers);
  
      // Send confirmation message to the user
      await client.chat.postMessage({
        channel: userId,
        text: 'Thanks for submitting your standup! 🎉'
      });
  
      // Send notification to the channel
      await client.chat.postMessage({
        channel: teamId,
        text: `<@${userId}> just submitted a standup 📝`
      });
  
    } catch (error) {
      console.error('Error handling modal submission:', error);
    }
  });

export async function configureStandup(req: Request, res: Response) {
    const { teamId, standupDays, reminderTimes, questions } = req.body;

    try {
        // Create standup setup
        const standupSetup = await createStandupSetup(teamId, standupDays, reminderTimes);

        // Create standup questions
        const standupQuestions = await createStandupQuestions(teamId, questions);

        //now set the reminders
        const reminderScheduler = scheduleReminders({
            days: standupDays,
            times: reminderTimes,
            questions,
            channelId: teamId,
        });

        res.status(200).json({
            message: 'Standup setup and questions configured successfully',
            reminderScheduler,
            standupSetup,
            standupQuestions,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while configuring standup' });
    }
}

