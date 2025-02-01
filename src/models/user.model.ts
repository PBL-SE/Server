import db from "../config/db"; // Ensure db is the pg client

export interface User {
    username: string;
    email: string;
    password: string;
}

export interface UserWithId extends User {
    id: string;
}

export const createUser = async (user: User): Promise<UserWithId> => {
    try {
        const result = await db.query<UserWithId>(
            `INSERT INTO users (username, email, password) 
             VALUES ($1, $2, $3) RETURNING *`,
            [user.username, user.email, user.password]
        );
        return result.rows[0]; // Accessing the first row
    } catch (error) {
        console.error(error);
        throw new Error("Error creating user");
    }
};

export const getUserByEmail = async (email: string): Promise<UserWithId | null> => {
    try {
        const result = await db.query<UserWithId>(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return result.rows[0] || null; // If no result, return null
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching user by email");
    }
};

export const getUserById = async (id: string): Promise<UserWithId | null> => {
    try {
        const result = await db.query<UserWithId>(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        return result.rows[0] || null; // If no result, return null
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching user by ID");
    }
};

export const updatePassword = async (id: string, newPassword: string): Promise<void> => {
    try {
        await db.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [newPassword, id]
        );
    } catch (error) {
        console.error(error);
        throw new Error("Error updating password");
    }
};

export const deleteUserById = async (id: string): Promise<void> => {
    try {
        await db.query("DELETE FROM users WHERE id = $1", [id]);
    } catch (error) {
        console.error(error);
        throw new Error("Error deleting user");
    }
};

export default {
    createUser,
    getUserByEmail,
    getUserById,
    updatePassword,
    deleteUserById, // Add the transaction-based method if needed
};
