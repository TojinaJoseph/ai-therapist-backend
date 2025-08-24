import { Request, Response, NextFunction } from "express";
import { Mood } from "../models/Mood";
import { logger } from "../utils/logger";
import { sendMoodUpdateEvent } from "../utils/inngestEvents";
import { Activity } from "../models/Activity";
import { Types } from "mongoose";

// Create a new mood entry
export const createMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const { score, note, context, activities, priority } = req.body;
    const userId = req.user?._id; // From auth middleware

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const mood = new Mood({
      userId,
      score,
      note,
      context,
      activities,
      timestamp: new Date(),
    });

    await mood.save();

    logger.info(`Mood entry created for user ${userId}`);

    // Send mood update event to Inngest
    await sendMoodUpdateEvent({
      userId: String(userId),
      mood: score,
      note,
      context,
      activities,
      priority,
      timestamp: String(mood.timestamp),
    });

    res.status(201).json({
      success: true,
      data: mood,
    });
  } catch (error) {
    next(error);
  }
};

export const getMood = async (req: Request, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.user?.id);

    // Find mood by userId instead of _id
    const moodEntries = await Mood.find({ userId: userId });
    if (!moodEntries) {
      return res.status(404).json({ message: "Session not found" });
    }

    // if (activities.userId.toString() !== userId.toString()) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    res.json(moodEntries);
  } catch (error) {
    logger.error("Error fetching mood:", error);
    res.status(500).json({ message: "Error fetching mood" });
  }
};
