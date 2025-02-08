import { createStandupResponses, getStandupQuestions, getTeamMembers, getTeamStandups, getStandupResponses, getUserKudosCount, createKudos, getTeamKudosCategories, createPollResponses, getPollResponses, createMoodResponse, getTeamMoodConfiguration} from '../db';
import { app } from '../config/bot.config';
import schedule from 'node-schedule';
import { WebClient } from '@slack/web-api';
import { View, ModalView } from '@slack/web-api';
import { 
    SlackActionMiddlewareArgs,
    BlockAction,
    ButtonAction,
  } from '@slack/bolt';

const slackClient = app.client;
  
  type ButtonElement = {
    type: 'button';
    text: {
      type: 'plain_text';
      text: string;
    };
    value: string;
    action_id: string;
  };

interface StandupQuestion {
    id:            String;
    teamId:        String;   
    questionText:  String;  
    options:       String[]; 
    questionType:  String;   
    required:      Boolean;  
  }

//function to get non respondents
async function getStandupNonRespondents(teamId: string) {

    try {
        //first get all standups of a team to know if a standup has been set
        const standups = await getTeamStandups(teamId);

        //if there are no standups respond with 204 no standups set for this team
        if (standups.length === 0) {
            return { message: 'No standups set for this team' };
        }

        //get  standup responses for a team
        const standupResponses = await getStandupResponses(teamId);

        //get all members in the team
        const members = await getTeamMembers(teamId);

        //filter members who do not have a record in the standup responses with createdAt date to be today
        const standupNonRespondents = members.filter(member => {
          const memberResponses = standupResponses.filter(response => response.userId === member);
          return memberResponses.length === 0 || !memberResponses.some(response => 
            new Date(response.createdAt).toDateString() === new Date().toDateString()
          );
        });


        return { standupNonRespondents };

       
    } catch (error) {
        console.log(error);
        return { message: 'An error occurred while retrieving standup eligible members' };
    }
}

// Function to create the modal view with proper typing
function createModalView(questions: StandupQuestion[], triggerId: string, teamId: string, messageTs: string | undefined | null): ModalView {
    return {
      type: "modal",
      callback_id: "standup_submission",
      private_metadata: JSON.stringify({ teamId: teamId, messageTs: messageTs}),
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

export function scheduleReminders({
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
            
            //get all non respondents
            const standupNonRespondents = await getStandupNonRespondents(channelId);
            const  memberIds = standupNonRespondents.standupNonRespondents;
            console.log(memberIds)

            console.log(standupNonRespondents)

            const job = schedule.scheduleJob(
                `reminder-${timeIndex}-${dayIndex}`,
                rule,
                async () => {
                    try {
                         //Send it to the channel
                         let channel_reminder: any;
                         if(memberIds && memberIds.length){
                            channel_reminder = await slackClient.chat.postMessage({
                                channel: channelId,
                                text: '🎯 Hey team! Here is your daily standup reminder. Please check your dms. I have sent your daily standup to fill',
                                reply_broadcast: false
                            });
                         }else{
                            channel_reminder = await slackClient.chat.postMessage({
                                channel: channelId,
                                text: '��� Great all of you have filled your standups',
                                reply_broadcast: false
                            });
                         }
                        

                        // then send reminders to each members DM
                        if(memberIds && memberIds.length > 0) {
                            for(const memberId of memberIds) {
                                await slackClient.chat.postMessage({
                                    channel: memberId,
                                    blocks: [
                                        {
                                            type: 'section',
                                            text: {
                                                type: 'mrkdwn',
                                                text: `🎯 Time for your daily standup for <#${channelId}> !`
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
                                                    value: JSON.stringify({ teamId: channelId, messageTs: channel_reminder.ts })
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

      const payload = JSON.parse(body.actions[0].value);

      const messageTs = payload.messageTs 
      
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
      
      const modalView = createModalView(questions, triggerId, teamId, messageTs);
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
      const messageTs = metadata.messageTs;
      
      // Get questions from database
      const questions = await getStandupQuestions(teamId);
      
      // Extract answers from the submission
      const answers = questions.map((question, index) => {
        const questionId = `question_${index}`;
        const answerBlock = view.state.values[questionId][`answer_${index}`];
        
        // Initialize the response object
        const response: { questionId: string, userId: string, answer: string, teamId:string, options: string[] } = {
          questionId: question.id,
          userId,
          answer: '',
          teamId :teamId,
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
  
      // Send notification to the channel with the answers as block
      await client.chat.postMessage({
        channel: teamId,
        text: 'Here are your submitted standup answers:',
        reply_broadcast: false,
        thread_ts: messageTs,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<@${userId}> Standup Answers:`,
            },
          },
          ...answers.map(answer => ({
            type: 'section',
            text:
                {
                type: 'mrkdwn',
                text: `${answer.answer}${answer.options.length > 0 ? `\n *Choice(s):* ${answer.options.join(', ')}` : ''}`
              },
          })),
        ],
      });

      //after let users choose from a list of moods(buttons) for the day
      // Helper function to map emojiIds to actual emojis
      const getEmojiForId = (emojiId: string): string => {
        const emojiMap: Record<string, string> = {
          '001': '🤩',
          '002': '🥺',
          '003': '😁',
          '004': '🙂',
          '005': '😴',
        };
        
        return emojiMap[emojiId] || '❓'; // Return a fallback emoji if ID not found
      };

      const teamMoodConfigs = await getTeamMoodConfiguration(teamId);

      

      await client.chat.postMessage({
        channel: userId,
        text: 'Select your mood for the day:',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: 'Select your mood for the day:',
            },
          },
          {
            type: 'actions',
            elements: teamMoodConfigs.map(config => ({
              type: 'button',
              text: {
                type: 'plain_text',
                text: `${getEmojiForId(config.emojiId)} ${config.description}`,
              },
              value: config.description,
              action_id: `update_mood_${config.description.toLowerCase()}`,
            })),
          },
        ],
      });

      //app action for mood
      app.action(/^update_mood_.+/, async ({ ack, body, client }) => {
        try {
          await ack();

          const selected_mood = (body as any).actions[0].value;

          const userId = body.user.id;
          const mood = selected_mood;
          await createMoodResponse(userId, mood, teamId, false);
          await client.chat.postMessage({
            channel: userId,
            text: `Your mood has been updated to ${mood}!`,
          });
        } catch (error) {
          console.log(error)
          console.error('Error updating mood:', error);
        }
      });

  
    } catch (error) {
      console.error('Error handling modal submission:', error);
    }
  });


  //function to listen and send kudos to a user
  export function listenKudos(): void {
    app.event(
      'app_mention', 
      async ({ event, client }) => {
        try {
          const channel = event.channel;
          const user = event.user;
          const text = event.text;

         
          
          const kudosRegex = /kudos to <@(\w+)> for (.+)$/i;
          const matches = text.match(kudosRegex);
          
          if (!matches) {
            await client.chat.postMessage({
              channel: channel,
              text: 'Please use the correct format: @bot kudos to @user for reason',
            });
            return;
          }
  
          const receiverId = matches[1];
          const reason = matches[2].trim();

          
  
          const userKudosCount = await getUserKudosCount(user as string);
          if (userKudosCount >= 3) {
            await client.chat.postMessage({
              channel: channel,
              text: 'You have reached your daily limit for giving kudos.',
            });
            return;
          }
  
          const teamKudosCategories = await getTeamKudosCategories(channel)
          
          //then get only the categories and put them into an array
          let kudos_categories = teamKudosCategories.map(category => category.category);
          kudos_categories = ['teamwork', 'innovation', 'leadership', 'creativity'];


          const categories = kudos_categories
          const buttonElements: ButtonElement[] = categories.map((category) => ({
            type: 'button',
            text: { 
              type: 'plain_text',
              text: category 
            },
            value: `${category}|${receiverId}|${reason}|${channel}`,
            action_id: `select_category_${category.toLowerCase()}`
          }));
  
          await client.chat.postMessage({
            channel: channel,
            text: `You mentioned kudos for <@${receiverId}> for "${reason}". Please select a category to continue:`,
            blocks: [
              {
                type: 'actions',
                block_id: 'category_selection',
                elements: buttonElements
              }
            ],
          });
        } catch (error) {
          console.log('Error handling app_mention event:', error);
        }
      }
    );
  
    app.action<BlockAction>(
      /^select_category_.+/,
      async ({ body, action, ack, client }) => {
        await ack();
        try {
            

          const buttonAction = action as ButtonAction;
          if (!buttonAction.value) {
            throw new Error('Button value is undefined');
          }
  
          const [category, receiverId, reason, channel] = buttonAction.value.split('|');
  
          if (!category || !receiverId || !reason || !channel) {
            throw new Error('Invalid button value format');
          }
  
          await createKudos(body.user.id, receiverId, channel, reason, category);
  
          await client.chat.postMessage({
            channel: receiverId,
            text: `<@${body.user.id}> gave you kudos for "${reason}" (${category})`,
          });
  
          await client.chat.postMessage({
            channel: channel,
            text: `Kudos successfully sent to <@${receiverId}> for "${reason}" (${category})`,
          });
        } catch (error) {
          console.log('Error handling category selection:', error);
        }
      }
    );
  }


//create polls in the slack channel indicated using the questions given and answers options been the options(an array) field in the poll created
export const createPoll = async (
  id: string,
  channel: string,
  question: string,
  options: string[],
  type: "single" | "multi",
  anonimity: boolean
) => {
  const elements = {
    type: type === "single" ? "radio_buttons" : "checkboxes",
    action_id: "poll_vote",
    options: options.map((option) => ({
      text: {
        type: "plain_text",
        text: option,
      },
      value: option,
    })),
  };

  await app.client.chat.postMessage({
    channel,
    text: anonimity? "Anonymous Poll" : "Public Poll",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Please make your choice(s) known*`,
        },
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${question}*`,
        },
      },
      {
        type: "actions",
        block_id: `poll_${id}`, 
        elements: [elements as any],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Submit",
            },
            value: id, 
            action_id: "submit_poll",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Results",
            },
            value: JSON.stringify({id: id, anonimity: anonimity}), 
            action_id: "view_poll",
          },
        ],
      },
    ],
  });
};

app.action("submit_poll", async ({ body, ack, client }) => {
  await ack();
  
  const pollId = (body as any).actions[0].value;
  const blockId = `poll_${pollId}`;

  console.log((body as any).state.values[blockId]?.poll_vote);
  
  // Get selected options from state
  const selectedOptions = (body as any).state.values[blockId]?.poll_vote?.selected_options ||  [];
  let singleSelect = []

  if(selectedOptions.length < 1){
    if((body as any).state.values[blockId]?.poll_vote?.selected_option){
      singleSelect.push((body as any).state.values[blockId]?.poll_vote?.selected_option.value)
    }
  }


  if(!selectedOptions.length && !singleSelect.length ){
    await client.chat.postMessage({
      channel: body.channel?.id || '',
      text: `<@${body.user.id}> please choose an option`
    });

    return;
  }
  
  if (!body.channel?.id) {
    console.error('Channel ID is undefined');
    return;
  }

  const pollResponse = {
    pollId,
    userId: body.user.id,
    teamId: body.channel.id,
    answer: selectedOptions.length > 1? selectedOptions.map((option: any) => option.text.text) : singleSelect
  };

  console.log(pollResponse);

  await createPollResponses(pollResponse);
  
  await client.chat.postMessage({
    channel: body.channel.id,
    text: `Poll response submitted! 🎉`
  });

  await client.chat.postMessage({
    channel: body.user.id,
    text: "Your response has been recorded! 🎉"
  });
});

//accept selection
app.action("poll_vote", async ({ ack }) => {
  await ack();
});

//view polls so far
app.action("view_poll", async ({ body, ack, client }) => {
  await ack();

  console.log((body as any).actions[0].value)

  const pollId = JSON.parse((body as any).actions[0].value).id;
  const anonimity = JSON.parse((body as any).actions[0].value).anonimity;

  if (!pollId) {
    console.error("Poll ID is undefined");
    return;
  }

  const pollResponses = await getPollResponses(pollId);

  if (!pollResponses || pollResponses.length === 0) {
    console.log("No responses found for this poll.");
    return;
  }

  // Aggregate results
  const results: Record<string, { count: number; users: string[] }> = {};

  pollResponses.forEach((response: any) => {
    response.answer.forEach((choice: string) => {
      if (!results[choice]) {
        results[choice] = { count: 0, users: [] };
      }
      results[choice].count += 1;
      results[choice].users.push(response.userId);
    });
  });

  // Convert results into Block Kit elements
  const blocks: any[] = [];

  Object.entries(results).forEach(([choice, data]) => {
    blocks.push(
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${choice}* - ${data.count} votes`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: anonimity? 'Voted by: Anonymous' : `Voted by: ${data.users.map((id) => `<@${id}>`).join(", ")}`,
          },
        ],
      },
      {
        type: "divider",
      }
    );
  });

  // Open the modal with results
  await client.views.open({
    trigger_id: (body as any).trigger_id,
    view: {
      type: "modal",
      callback_id: "poll_results",
      title: {
        type: "plain_text",
        text: anonimity? "Anonymous Poll Results" : "Poll Results",
      },
      blocks,
    },
  });
});



