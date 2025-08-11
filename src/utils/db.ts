import mongoose from "mongoose";
import { logger } from "./logger";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://tojinajoseph123:WLRKGbnERmIyemND@ai-therapy-agent.zrv3gkv.mongodb.net/?retryWrites=true&w=majority&appName=ai-therapy-agent";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB Atlas");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
