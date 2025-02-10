import dotenv from "dotenv";
import { app } from "./config/bot.config";
import express from "express";
import cors from "cors";
import teamRoutes from "./routes/teamRoutes";
import memberRoutes from "./routes/memberRoutes";
import standupRoutes from "./routes/standupRoutes";
import pollRoutes from "./routes/pollRoutes";
import kudosRoutes from "./routes/kudosRoutes";
import mood from "./routes/moodRoutes";
import { homeDesign, listenForChannelCreation, addJoinedMmebers, addJoinedTeamMembers } from "./utils/update";
import { listenKudos } from "./utils/slack_bot";
import authRouter from './routes/auth';
import { authenticateJWT } from './middleware/auth';

dotenv.config();

const express_app = express();

//middleware
express_app.use(express.json());
express_app.use(cors());

//routes
express_app.get('/', (req, res) => {
    res.send('Hello, this is the Slack Bot Server!');
});
express_app.use('/auth', authRouter);
express_app.use('/api/v1/team', teamRoutes);  //express_app.use('/api/v1/team', teamRoutes); 
express_app.use('/api/v1/members', memberRoutes);   //express_app.use('/api/v1/members', authenticateJWT, memberRoutes);
express_app.use('/api/v1/standup', standupRoutes);  //express_app.use('/api/v1/standup', authenticateJWT, standupRoutes);
express_app.use('/api/v1/poll', pollRoutes);       //express_app.use('/api/v1/poll', authenticateJWT, pollRoutes);  
express_app.use('/api/v1/kudos', kudosRoutes);    //express_app.use('/api/v1/kudos', authenticateJWT, kudosRoutes);   
express_app.use('/api/v1/mood', mood);           //express_app.use('/api/v1/mood', authenticateJWT, mood);        
//slack listeners
homeDesign();
listenForChannelCreation();
addJoinedMmebers();
listenKudos();
addJoinedTeamMembers();




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