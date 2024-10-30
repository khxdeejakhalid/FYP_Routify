import express from "express";
import session from "express-session";
import cors from "cors";
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'yourSecretKey', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 1000 * 60 * 60 
  }
}));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(8080, () => {
  console.log("Running on localhost 8080");
});
