import { Request, Response, NextFunction } from "express";
import { Pinecone } from '@pinecone-database/pinecone';
import getBertEmbedding from "../utils/bertEmbedding";

// Pinecone API Setup
const PINECONE_API_KEY = "pcsk_5FL492_g2vJnmKKbX52zVcv6yvK7UoeWEbiW2V7FwusT7D6iRB8mVxPCg4itupD4epKmk";
const PINECONE_INDEX_NAME = "paper-search";

// Initialize Pinecone
const pc = new Pinecone({ apiKey: PINECONE_API_KEY });
const index = pc.Index(PINECONE_INDEX_NAME);

export const fetchByQuery = async (req: Request, res: Response) => {
    try {
        // Define your query
        const query = 'I want papers on NLP';

        // Convert the query into a numerical vector that Pinecone can search with
        const queryEmbedding = await getBertEmbedding(query);

        // Check if embedding is empty
        if (queryEmbedding.length === 0) {
            return res.status(400).json({
                message: "Empty embeddings returned",
                error: "The BERT model returned empty embeddings.",
            });
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
