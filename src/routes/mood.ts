import express from "express";
import { auth } from "../middlewares/auth";
import { createMood, getMood } from "../controllers/moodController";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Track a new mood entry
router.post("/", createMood);

// get mood entry
router.get("/", getMood);

export default router;
