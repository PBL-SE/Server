import { Request, Response, NextFunction } from "express";
import { Pinecone } from '@pinecone-database/pinecone';
import getBertEmbedding from "../utils/bertEmbedding.js";
import dotenv from 'dotenv';
import client from "../config/db.js";
import axios from "axios";
import { mongoDB } from "../config/mongo.js";


dotenv.config();

// Initialize Pinecone
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.Index(process.env.PINECONE_INDEX_NAME!);

export const fetchByQuery = async (req: Request, res: Response) => {
    try {
        // Define your query
        const query = req.body.query;

        const data = {
            query: query,
            user_id: "000"
        };

        // Call the external server
        const response = await axios.post(`${process.env.AGENT_URL}/query`, data, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const candidateIDs = response.data; // Extract the candidate IDs from the response

        const queryText = `SELECT * FROM Papers WHERE arxiv_id = ANY($1);`;

        // Execute the query with the IDs as an array
        const result = await client.query(queryText, [candidateIDs]);

        res.json({
            message: "Search completed successfully",
            results: result.rows, // Return the matches in the response
        });
    } catch (error) {
        console.error("Error during query execution:", error);
        res.status(500).json({
            message: "Error processing request",
            error: error,
        });
    }
};


export const fetchByQueryAndTag = async (req: Request, res: Response) => {
    try {
        // Define your query
        const query = req.body.query;
        const difficulty_level = req.body.difficulty_level;

        const data = {
            query: query,
            difficulty_level: difficulty_level,
            user_id: "000"
        }

        const response = await axios.post(`${process.env.AGENT_URL}/query`, data, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const candidateIDs = response.data; // Extract the candidate IDs from the response


        const queryText = `SELECT * FROM Papers WHERE arxiv_id = ANY($1) AND difficulty_level = $2;`;

        // Execute the query with the ids as an array
        const result = await client.query(queryText, [candidateIDs, difficulty_level]);

        res.json({
            message: "Search completed successfully",
            results: result.rows, // Return the matches in the response
        });
    } catch (error) {
        console.error("Error during query execution:", error);
        res.status(500).json({
            message: "Error processing request",
            error: error,
        });
    }
};


export const recommendPapers = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user_id;

        if (!user_id) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        // ----------------------------
        // STEP 1: Fetch User Preferences from MongoDB
        // ----------------------------
        if (!mongoDB) {
            res.status(500).json({ message: "MongoDB connection is not initialized" });
            return;
        }

        const usersCollection = mongoDB.collection("users");
        const user = await usersCollection.findOne({ user_id });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Ensure required fields exist and are valid arrays
        if (!Array.isArray(user.preferences.favorite_categories)) {
            res.status(400).json({ message: "Invalid favorite_categories format" });
            return;
        }
        if (!Array.isArray(user.preferences.saved_papers)) {
            res.status(400).json({ message: "Invalid saved_papers format" });
            return;
        }

        // ----------------------------
        // STEP 2: Call FastAPI for Recommendations
        // ----------------------------
        const requestData = {
            user_id: user.user_id,
            difficulty_level: user.preferences.difficulty_level,
            favorite_categories: user.preferences.favorite_categories,
            saved_papers: user.preferences.saved_papers,
            custom_filters: user.preferences.custom_filters,
        };

        console.log("Sending request to FastAPI:", requestData);

        const agentUrl = process.env.AGENT_URL;
        if (!agentUrl) {
            throw new Error("AGENT_URL is not set in environment variables.");
        }

        const response = await axios.post(`${agentUrl}/recommend`, requestData, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        console.log("✅ FastAPI Response:", response.data);

        const recommendedIDs = response.data;

        if (!recommendedIDs || recommendedIDs.length === 0) {
            res.json({ message: "No recommendations found", results: [] });
            return;
        }

        // ----------------------------
        // STEP 3: Fetch Paper Details from PostgreSQL
        // ----------------------------
        const queryText = `SELECT * FROM Papers WHERE arxiv_id = ANY($1) AND difficulty_level = $2;`;
        const result = await client.query(queryText, [recommendedIDs, user.preferences.difficulty_level]);

        res.json({
            message: "Recommendation completed successfully",
            results: result.rows,
        });

    } catch (error) {
        console.error("❌ Error during recommendation execution:", error);
        res.status(500).json({
            message: "Error processing request",
            error: error,
        });
    }
};
