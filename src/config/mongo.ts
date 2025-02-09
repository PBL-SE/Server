import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const uri = process.env.MONGO_URL as string; // MongoDB connection string from .env
const dbName = "users-db"; // Change this to your actual database name

if (!uri) {
    throw new Error("❌ MONGO_URL is not defined in .env");
}

// MongoDB client instance with timeout & retry settings
const mongoClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 30000, // 30 seconds (default is 30,000ms)
    connectTimeoutMS: 45000, // 45 seconds (default is 10,000ms)
    maxPoolSize: 10, // Prevent too many connections
});

let mongoDB: Db;

// Function to initialize MongoDB connection
const connectMongoDB = async () => {
    try {
        if (!mongoDB) {
            console.log("⏳ Connecting to MongoDB...");
            await mongoClient.connect();
            mongoDB = mongoClient.db(dbName);
            console.log("✅ Successfully connected to MongoDB:", dbName);
        }
        return mongoDB;
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        console.log("🔄 Retrying connection in 5 seconds...");
        setTimeout(connectMongoDB, 5000); // Retry after 5 seconds
    }
};

// Export client and DB instance
export { mongoClient, mongoDB, connectMongoDB };
