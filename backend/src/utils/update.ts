import { app } from '../config/bot.config';
import { createMembers, getMembers, createTeam } from "../db";

//function to add members to our database
app.event("team_join", async ({ event, client }) => {
    try {
        // Fetch all users from Slack
        const result = await client.users.list({});
        const slackUsers = result.members || [];

        // Fetch all users from the database
        const dbUsers = await getMembers();
        const dbUserIds = dbUsers.map(user => user.id);

        // Filter out users that are not in the database
        const newUsers = slackUsers
            .filter(user => user.id && !dbUserIds.includes(user.id))
            .map(user => ({
                id: user.id as string,
                memberName: (user.real_name || user.name) as string,
            }));

        // Add new users to the database
        if (newUsers.length > 0) {
            await createMembers(newUsers);
        }
    } catch (error) {
        console.error("Error handling team_join event:", error);
    }
});

//listener to add new teams
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

//our home page code
app.event('app_home_opened', async ({ event, client }) => {
    try {
      await client.views.publish({
        user_id: event.user,
        view: {
          type: 'home',
          callback_id: 'home_view',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Welcome to The Daily Grind!* 🎉\nSelect an option below:',
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
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error publishing app home view:', error);
    }
  });
  