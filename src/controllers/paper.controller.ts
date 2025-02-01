import { Request, Response, NextFunction } from "express";
import { Pinecone } from '@pinecone-database/pinecone';
import getBertEmbedding from "../utils/bertEmbedding";
import dotenv from 'dotenv';
import client from "../config/db";

dotenv.config();

// Initialize Pinecone
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.Index(process.env.PINECONE_INDEX_NAME!);

export const fetchByQuery = async (req: Request, res: Response) => {
    try {
        // Define your query
        const query = req.body.query;

        // Convert the query into a numerical vector that Pinecone can search with
        const queryEmbedding = await getBertEmbedding(query);

        // Check if embedding is empty
        if (queryEmbedding.length === 0) {
            res.status(400).json({
                message: "Empty embeddings returned",
                error: "The BERT model returned empty embeddings.",
            });
            return;
        }

        const queryEmbeddingArray = Array.from(queryEmbedding);

        // Search the index for the three most similar vectors
        const queryResponse = await index.namespace("ns1").query({
            topK: 5,
            vector: queryEmbeddingArray, // The vector is now directly passed
            includeValues: false,
            includeMetadata: true
        });

        console.log(queryResponse);

        res.json({
            message: "Search completed successfully",
            results: queryResponse.matches, // Return the matches in the response
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

        // Convert the query into a numerical vector that Pinecone can search with
        const queryEmbedding = await getBertEmbedding(query);

        // Check if embedding is empty
        if (queryEmbedding.length === 0) {
            res.status(400).json({
                message: "Empty embeddings returned",
                error: "The BERT model returned empty embeddings.",
            });
            return;
        }

        const queryEmbeddingArray = Array.from(queryEmbedding);

        // Search the index for the three most similar vectors
        const queryResponse = await index.namespace("ns1").query({
            topK: 5,
            vector: queryEmbeddingArray, // The vector is now directly passed
            includeValues: false,
            includeMetadata: true
        });

        const paperIDs = queryResponse.matches.map(item => item.id);

        const queryText = `SELECT * FROM Papers WHERE arxiv_id = ANY($1) AND difficulty_level = $2;`;

        // Execute the query with the ids as an array
        const result = await client.query(queryText, [paperIDs, difficulty_level]);

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
