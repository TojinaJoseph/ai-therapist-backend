import { Request, Response, NextFunction } from "express";
import { Activity, IActivity } from "../models/Activity";
import { logger } from "../utils/logger";
import { sendActivityCompletionEvent } from "../utils/inngestEvents";
import { Types } from "mongoose";

// Log a new activity
export const logActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, name, description, duration, difficulty, feedback } =
      req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const activity = new Activity({
      userId,
      type,
      name,
      description,
      duration,
      difficulty,
      feedback,
      timestamp: new Date(),
    });

    await activity.save();
    logger.info(`Activity logged for user ${userId}`);

    // Send activity completion event to Inngest
    await sendActivityCompletionEvent({
      userId: String(userId),
      id: String(activity._id),
      type,
      name,
      duration,
      difficulty,
      feedback,
      timestamp: new Date(activity.timestamp),
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

//get todays activity
export const getActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("inside today activity sessions");
    const userId = new Types.ObjectId(req.user?.id);

    // Find session by sessionId instead of _id
    const activities = await Activity.find({ userId: userId });
    if (!activities) {
      return res.status(404).json({ message: "Session not found" });
    }

    // if (activities.userId.toString() !== userId.toString()) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    res.json(activities);
  } catch (error) {
    logger.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Error fetching chat history" });
  }
};
