import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI || '';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let mongoDB: Db | null = null;

export const connectMongoDB = async () => {
  try {
    if (!mongoDB) {
      await client.connect();  // Connect once
      console.log("✅ Connected to MongoDB");
      mongoDB = client.db("Users"); 
      console.log("Connected to database:", mongoDB.databaseName);
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export { client, mongoDB };
