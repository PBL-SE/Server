import db from "../config/db"; // Ensure db is exported as a default module

export interface User {
    username: string;
    email: string;
    password: string;
}

export const createUser = async (user: User) => {
    try {
        const result = await db.one(
            `INSERT INTO users (username, email, password) 
             VALUES ($1, $2, $3) RETURNING *`,
            [user.username, user.email, user.password]
        );
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error creating user");
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.oneOrNone(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return user;
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching user by email");
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await db.oneOrNone(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        return user;
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching user by ID");
    }
};

export const updatePassword = async (id: string, newPassword: string) => {
    try {
        await db.none(
            "UPDATE users SET password = $1 WHERE id = $2",
            [newPassword, id]
        );
    } catch (error) {
        console.error(error);
        throw new Error("Error updating password");
    }
};

export const deleteUserById = async (id: string) => {
    try {
        await db.none("DELETE FROM users WHERE id = $1", [id]);
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
    deleteUserById
};
