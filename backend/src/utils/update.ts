import { app } from '../config/bot.config';
import { createMembers, getMembers, createTeam, addMembersToTeam } from "../db";

//function to add members to our database
export function addJoinedMmebers(){
  try {
        app.event("member_joined_channel", async ({ event, client }) => {
          try {
              // Fetch the channel ID and user who joined
              const teamId = event.channel; // Channel where the member joined
              const userId = event.user;
      
              // Fetch user details from Slack
              const result = await client.users.info({ user: userId });
              const userInfo = result.user;
      
              if (!userInfo || !userInfo.id) {
                  console.log("User information not found");
                  return;
              }
      
              // Fetch all users from the database
              const dbUsers = await getMembers();
              const dbUserIds = dbUsers.map(user => user.id);
      
              // Add the user if they're not already in the database
              if (!dbUserIds.includes(userInfo.id)) {
                  const newUser = {
                      id: userInfo.id,
                      memberName: userInfo.real_name as string || userInfo.name as string,
                  };
                  await createMembers([newUser]);
              }
      
              // Add the user to the correct team (channel)
              await addMembersToTeam(teamId, [userId]);
      
              console.log(`User ${userId} added to team ${teamId}`);
      
          } catch (error) {
              console.error("Error handling member_joined_channel event:", error);
          }
      });
  } catch (error) {
    console.log(error);
  }
}

//listener to add new teams
export function listenForChannelCreation(){
  try {
        app.event("channel_created", async ({ event, client }) => {
          try {
              // Get team information (no parameter required for team.info)
              const teamInfo = await client.team.info();
      
              if (!teamInfo.team) {
                  throw new Error("Team information is undefined");
              }
      
              const teamId = teamInfo.team.id
              const teamName = teamInfo.team.name;
              const timezone = "UTC"; // Default or manually set timezone
      
              // Add new team to your database
              await createTeam(teamId as string, teamName as string, timezone);
          } catch (error) {
              console.error("Error handling team_created event:", error);
          }
  });
  } catch (error) {
    console.log(error)
  }
}


//listener for homepage design
export function homeDesign(){
  try {
    app.event('app_home_opened', async ({ event, client }) => {
      try {
        await client.views.publish({
          user_id: event.user,
          view: {
            type: 'home',
            callback_id: 'home_view',
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: 'Welcome to The Daily Grind! 🎉',
                  emoji: true,
                },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Your go-to Slack app for boosting team productivity and engagement! 🚀\n\n',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*📅 Standup Collection*\nEasily collect daily standup updates from your team right here in Slack.\n\n*Example:* `/standup What did you work on yesterday? What will you do today? Any blockers?`',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*📊 Data Exportation*\nExport your standup data seamlessly for reporting and analytics.\n\n*To export:* `/export_standups`',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*😊 Mood Tracking*\nTrack and visualize your team\'s mood over time to improve well-being.\n\n*Example:* `/update_mood Feeling awesome today! 😊`',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*🎖 Kudos System*\nShow appreciation by sending kudos to your teammates.\n\n*Example:* `/kudos @teammate Great work on the presentation! 🎉`',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*📋 Poll Collections*\nGather opinions and feedback with simple polls.\n\n*Example:* `/poll "What day should we have the team outing?" "Monday" "Friday" "Wednesday"`',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Ready to configure your app features? Click below to get started:',
                },
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: 'Get Started',
                      emoji: true,
                    },
                    action_id: 'get_started',
                    url: 'https://your-configuration-page.com',
                  },
                ],
              },
            ],
          },
        });
      } catch (error) {
        console.log('Error publishing app home view:', error);
      }
    });    
    
  } catch (error) {
    console.log(error)
  }
}