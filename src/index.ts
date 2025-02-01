import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import paperRouter from './routes/paper.route.js';
import cookieParser from 'cookie-parser';
import client from "./config/db.js";
import './migrations/createUserTable.js';
import './custom.js';
import { errorHandler } from './utils/error';


dotenv.config();
console.log("DATABASE_URL from env:", process.env.DATABASE_URL);

const connectDB = async () => {
    try {
        await client.connect();  // Connect to the PostgreSQL database
        console.log("Connected to Neon.tech PostgreSQL");
    } catch (err) {
        console.error("Neon.tech PostgreSQL connection error:", err);
        process.exit(1);
    }
};

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/papers", paperRouter);

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

export { client };
