import pkg from "pg"; // Import the entire package
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg; // Extract Client from the package

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default client; // Export as default
