import { inngest } from "../inngest/index";
import { logger } from "./logger";

export interface SessionData {
  id: string; // Unique session ID
  userId: string; // ID of the user
  requiresFollowUp?: boolean; // Optional, defaults to false
  type: "therapy" | "counseling" | "other"; // Session type (can extend)
  duration: number; // Duration in minutes
  notes?: string; // Optional notes
  [key: string]: unknown; // Allow extra properties (because of ...sessionData)
}

export interface MoodData {
  userId: string;
  mood: string; // could be "happy" | "sad" | "neutral" etc. if you want stricter typing
  timestamp?: string; // optional, we'll set default
  context?: string;
  activities?: string[]; // e.g., ["exercise", "reading"]
  notes?: string;
  [key: string]: unknown; // allow extra fields
}

export interface ActivityData {
  userId: string;
  id: string; // activityId
  timestamp?: string | Date; // will be set automatically
  duration?: number; // in minutes or seconds depending on your system
  difficulty?: "easy" | "medium" | "hard" | string;
  feedback?: string;
  [key: string]: unknown; // for additional optional properties
}
export const sendTherapySessionEvent = async (sessionData: SessionData) => {
  const { id, userId, ...rest } = sessionData;
  try {
    await inngest.send({
      name: "therapy/session.created",
      data: {
        sessionId: id,
        userId: userId,
        timestamp: new Date().toISOString(),
        requiresFollowUp: sessionData.requiresFollowUp || false,
        sessionType: sessionData.type,
        notes: sessionData.notes,
        ...rest,
      },
    });
    logger.info("Therapy session event sent successfully");
  } catch (error) {
    logger.error("Failed to send therapy session event:", error);
    throw error;
  }
};

// Add more event sending functions as needed
export const sendMoodUpdateEvent = async (moodData: MoodData) => {
  const { userId, mood, priority, ...rest } = moodData;
  try {
    await inngest.send({
      name: "mood/updated",
      data: {
        userId: userId,
        mood: mood,
        timestamp: new Date().toISOString(),
        context: moodData.context,
        activities: moodData.activities,
        preferences: priority,
        notes: moodData.notes,
        ...rest,
      },
    });
    logger.info("Mood update event sent successfully");
  } catch (error) {
    logger.error("Failed to send mood update event:", error);
    throw error;
  }
};

export const sendActivityCompletionEvent = async (
  activityData: ActivityData
) => {
  const { userId, id, ...rest } = activityData;
  try {
    await inngest.send({
      name: "activity/completed",
      data: {
        userId: userId,
        activityId: id,
        timestamp: new Date().toISOString(),
        duration: activityData.duration,
        difficulty: activityData.difficulty,
        feedback: activityData.feedback,
        ...rest,
      },
    });
    logger.info("Activity completion event sent successfully");
  } catch (error) {
    logger.error("Failed to send activity completion event:", error);
    throw error;
  }
};
