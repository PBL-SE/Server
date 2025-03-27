import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth.route";
import './auth';

import doiRouter from "./routes/doi.route.js";
import paperRouter from "./routes/paper.route";
import libraryRouter from "./routes/library.route";
import analyticsRouter from "./routes/analytics.route";
import cookieParser from "cookie-parser";
import "./controllers/auth.controller";
import { connectMongoDB,connectMongo } from "./config/mongo"; 
import cors from "cors";
import pool from './config/db'; 

dotenv.config();

const app = express();

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


app.use(passport.initialize());

app.use("/api/auth", authRouter);

app.use("/api/papers", paperRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/library", libraryRouter);
app.use("/doi", doiRouter);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

const startServer = async () => {
  try {
    console.log("Connecting to DB...");

   
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL");
    client.release();

  
    await connectMongoDB();
    console.log("✅ Connected to MongoDB using mongo");

    await connectMongo();
    console.log("✅ Connected to MongoDB using mongoose");

    app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
  } catch (err) {
    console.error("❌ Database error:", err);
    process.exit(1);
  }
};

startServer();
