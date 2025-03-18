import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
// import paperRouter from "./routes/paper.route";
// import libraryRouter from "./routes/library.route";
// import analyticsRouter from "./routes/analytics.route";
import cookieParser from "cookie-parser";
import client from "./config/db";
import "./config/passport.js"; // Ensure Passport is loaded
import { connectMongoDB } from "./config/mongo";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ CORS Middleware (Before Routes)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

app.use(express.json());
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === 'production';

// For secure cookies behind a proxy
if (isProduction) {
  app.set("trust proxy", 1);
}

// ✅ SESSION SETUP
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction, // Only use secure in production
      sameSite: isProduction ? 'none' : 'lax', // Use 'lax' for local development
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: isProduction ? '.edc-pict.site' : undefined,
    }
  })
);

// ✅ Initialize Passport with sessions
app.use(passport.initialize());
app.use(passport.session());

/* app.use((req, res, next) => {
  console.log('----SESSION DEBUG----');
  console.log('Session ID:', req.sessionID);
  console.log('Is Authenticated:', req.isAuthenticated?.());
  console.log('Session Cookie:', req.cookies['connect.sid'] ? 'Exists' : 'Missing');
  console.log('Request Origin:', req.headers.origin);
  console.log('Request Referrer:', req.headers.referer);
  next();
}); */

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);
// app.use("/api/papers", paperRouter);
// app.use("/api/analytics", analyticsRouter);
// app.use("/api/library", libraryRouter);

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
