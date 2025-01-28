import dotenv from "dotenv";
import { app } from "./config/bot.config";
import express from "express";
import cors from "cors";
import teamRoutes from "./routes/teamRoutes";
import memberRoutes from "./routes/memberRoutes";
import standupRoutes from "./routes/standupRoutes";
dotenv.config();

const express_app = express();

//middleware
express_app.use(express.json());
express_app.use(cors());

//routes
express_app.get('/', (req, res) => {
    res.send('Hello, this is the Slack Bot Server!');
});
express_app.use('/api/v1/team', teamRoutes);
express_app.use('/api/v1/members', memberRoutes);
express_app.use('/api/v1/standup', standupRoutes);



(async () => {
    try {
      await app.start(process.env.SLACK_PORT || 4000);
      console.log("Bolt app is running!Running On Port", process.env.SLACK_PORT);
 
      console.log("Bot initialized and ready.");
    } catch (error) {
      console.error("Unable to start the app:", error);
    }
  })();

  //run the express server
  express_app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });

//   // Add an event listener for the 'message' event