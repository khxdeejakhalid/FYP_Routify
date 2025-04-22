import express from "express";
import session from "express-session";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import testCenterRoutes from "./routes/test-center.js";
import waypointRoutes from "./routes/waypoint.js";
import feedbackRoutes from "./routes/feedback.js";
import turnRoutes from "./routes/turns.js";
import maneuverRoutes from "./routes/maneuver.js";
import instructorLearnerRoutes from "./routes/instructor_learner.js";
import lessonsRoutes from "./routes/lessons.js";
import lessonsFeedbackRoutes from "./routes/lessons_feedback.js";
import quizRoutes from "./routes/quiz.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/centers", testCenterRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/waypoints", waypointRoutes);
app.use("/api/turns", turnRoutes);
app.use("/api/maneuver", maneuverRoutes);
app.use("/api/instructor_learner", instructorLearnerRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/lessons_feedback", lessonsFeedbackRoutes);
app.use("/api/quiz", quizRoutes);

app.listen(8080, () => {
  console.log("Running on localhost 8080");
});
