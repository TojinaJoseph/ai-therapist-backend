import express from "express";
import { auth } from "../middlewares/auth";
import { getActivity, logActivity } from "../controllers/activityController";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Log a new activity
router.post("/log", logActivity);

// get all activity
router.get("/", getActivity);

export default router;
