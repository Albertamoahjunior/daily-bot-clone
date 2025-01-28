import dotenv from "dotenv";
import { app } from "./config/bot.config";



dotenv.config();


(async () => {
    try {
      await app.start(process.env.PORT || 3000);
      console.log("Bolt app is running!Running On Port", process.env.PORT);
 
      console.log("Bot initialized and ready.");
    } catch (error) {
      console.error("Unable to start the app:", error);
    }
  })();