import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const createTable = async () => {
    console.log("Running user table migration...");

    const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );
    `;
    try {
        await client.connect();  // Connect to the database
        await client.query(query); // Run the query to create the table
        console.log("User table created or already exists.");
    } catch (error) {
        console.error("Error creating user table:", error);
    } finally {
        await client.end(); // Close the connection
    }
};

// Immediately run the migration when this file is imported
createTable();
