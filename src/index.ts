import express from "express";
import type { Request, Response } from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest";
import { logger } from "./utils/logger";
import { functions as inggestFunctions } from "./inngest/functions";
import { connectDB } from "./utils/db";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import moodRouter from "./routes/mood";
import activityRouter from "./routes/activity";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());

//middlewares
// app.use(cors());
app.use(
  cors({
    origin: [
      "https://ai-therapist-frontend-chi.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use(
  "/api/inngest",
  serve({ client: inngest, functions: inggestFunctions })
);

//routes
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/api/mood", moodRouter);
app.use("/api/activity", activityRouter);

//error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(
        `Inngest endpoint available at http://localhost:${PORT}/api/inngest`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
