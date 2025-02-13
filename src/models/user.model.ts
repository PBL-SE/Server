import db from "../config/db.js";

export interface User {
    username?: string;
    email?: string;
    provider?: string;
    provider_id?: string;
}

export interface UserWithId extends User {
    id: string;
}

export const createUser = async (user: User): Promise<UserWithId> => {
    const result = await db.query<UserWithId>(
        "INSERT INTO users (username, email, provider, provider_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [user.username, user.email, user.provider, user.provider_id]
    );
    return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<UserWithId | null> => {
    const result = await db.query<UserWithId>(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0] || null;
};

export const getUserById = async (id: string): Promise<UserWithId | null> => {
    const result = await db.query<UserWithId>(
        "SELECT * FROM users WHERE id = $1",
        [id]
    );
    return result.rows[0] || null;
};

export default {
    createUser,
    getUserByEmail,
    getUserById,
};
