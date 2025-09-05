import { App } from "@slack/bolt";
import dotenv from "dotenv";
const { WebClient } = require('@slack/web-api');



dotenv.config();

// Initialize the Slack WebClient with your bot token
const webclient = new WebClient(process.env.SLACK_BOT_TOKEN as string);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN as string,
  // logLevel: LogLevel.DEBUG,
});

//function to get all slack channels


export { app, webclient};