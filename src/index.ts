import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import paperRouter from './routes/paper.route.js';
import cookieParser from 'cookie-parser';
import client from "./config/db.js";
import { connectMongoDB } from "./config/mongo.js";
import cors from 'cors';
import './migrations/createUserTable.js';
import './custom.js';
import analyticsRouter from './routes/analytics.route.js';
import { errorHandler } from './utils/error';
import { VercelRequest, VercelResponse } from '@vercel/node';


dotenv.config();

const connectDB = async () => {
    try {
        await client.connect(); // Connect to PostgreSQL
        console.log("✅ Connected to Neon.tech PostgreSQL");

        await connectMongoDB(); // Connect to MongoDB
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    }
};

const app = express();

app.use(cors({
    origin: '*',  // Allow all origins (adjust this as needed for production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser());

export default function handler(req: VercelRequest, res: VercelResponse) {
    return res.status(200).json({ message: "Hello from Vercel!" });
}

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/papers", paperRouter);
app.use("/api/analytics", analyticsRouter);


interface CustomError extends Error {
    statusCode?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
};

app.use(errorMiddleware);

const startServer = async () => {
    console.log("Attempting to connect to database...");
    await connectDB();  // Ensure DB connection before starting server
    console.log("Database connection successful. Now running migrations...");

    app.listen(3000, () => {
        console.log("Listening on port 3000...");
    });
};

startServer();