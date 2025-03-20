import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from "dotenv";

export { client, mongoDB }; 


import mongoose from 'mongoose';

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
      await client.connect();  // ✅ Keep MongoDB Client
      console.log("✅ Connected to MongoDB");
      mongoDB = client.db("users-db"); 
      console.log("Connected to database:", mongoDB.databaseName);
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};



export const connectMongo = async () => {
  try {
    await mongoose.connect(uri, { dbName: "Users" });

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};


