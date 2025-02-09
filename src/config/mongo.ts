import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const uri = process.env.MONGO_URL as string; // MongoDB connection string from .env
const dbName = "users-db"; // Change this to your actual database name

if (!uri) {
    throw new Error("MONGO_URL is not defined in .env");
}

// Create MongoDB client instance (similar to PostgreSQL)
const mongoClient = new MongoClient(uri);
let mongoDB: Db;

// Function to initialize MongoDB connection
const connectMongoDB = async () => {
    try {
        await mongoClient.connect();
        mongoDB = mongoClient.db(dbName);
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Exit on connection failure
    }
};

// Export client and DB instance
export { mongoClient, mongoDB, connectMongoDB };
