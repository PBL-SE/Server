import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth.route.js";
import paperRouter from "./routes/paper.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import cookieParser from "cookie-parser";
import client from "./config/db.js";
import "./config/passport.js"; // Ensure Passport is loaded
import { connectMongoDB } from "./config/mongo.js";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ CORS Middleware (Before Routes)
app.use(
  cors({
    origin: process.env.FRONTEND_URL ,
    credentials: true, // ✅ Allow cookies
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ SESSION SETUP
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  // Make sure this is set properly
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days expiration
    },
  })
);

// ✅ Initialize Passport with sessions
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/papers", paperRouter);
app.use("/api/analytics", analyticsRouter);

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// ✅ Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// ✅ Start Server
const startServer = async () => {
  try {
    console.log("Connecting to DB...");
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    await connectMongoDB();
    console.log("✅ Connected to MongoDB");

    app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
  } catch (err) {
    console.error("❌ Database error:", err);
    process.exit(1);
  }
};

startServer();
