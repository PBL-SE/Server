import { Request, Response } from "express";
import { mongoDB } from "../config/mongo.js";
import { getUserId } from "../config/sessionStore.js";

export const onboarding = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Received onboarding request:", req.body);

    const user_id = getUserId();
    if (!user_id) {
      console.log("⚠️ User ID missing");
      return res.status(400).json({ message: "User ID missing" });
    }
    console.log("🔐 User ID found in session:", user_id);

    const { username, preferences } = req.body;
    if (!username || !preferences) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }
    console.log(mongoDB);
    const usersCollection = mongoDB.collection("users");

    // Check if user already exists in MongoDB
    // const existingUser = await usersCollection.findOne({ user_id });
    // if (existingUser) {
    //   console.log("✅ User already exists in MongoDB, skipping insert.");
    //   return res.status(200).json({ message: "User already onboarded", user: existingUser });
    // }

    const userData = {
      user_id,
      username,
      preferences,
      difficulty_levels: { ML: 0, hardware: 0, AI: 0 },
      favorite_categories: {},
      saved_papers: [],
      custom_filters: { journals: [], year_range: { start: 0, end: 0 } },
    };

    console.log("📝 Preparing to insert new user into MongoDB:", userData);

    try {
      const result = await usersCollection.insertOne(userData);
      if (!result.acknowledged) {
        console.log("❌ Failed to insert user into MongoDB");
        return res.status(500).json({ message: "Failed to insert user into MongoDB" });
      }
      console.log("✅ Successfully inserted user into MongoDB with ID:", result.insertedId);
      return res.status(201).json({ message: "User onboarded successfully", user: userData });
    } catch (mongoErr) {
      console.error("❌ MongoDB Insertion Error:", mongoErr);
      return res.status(500).json({ message: "MongoDB Insertion Error" });
    }
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
