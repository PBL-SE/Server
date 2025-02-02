import { Request, Response } from "express";
import client from "../config/db.js";

// Utility function to handle queries with error logging
const executeAnalyticsQuery = async (query: string, params: any[], res: Response) => {
    try {
        const result = await client.query(query, params);
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ error: "No data found" });
        }
        return result.rows; // Ensure data is returned
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database query failed", details: error });
    }
};

export default executeAnalyticsQuery;