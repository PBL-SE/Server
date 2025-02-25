import db from "../config/db.js";

export interface User {
    username?: string;
    email?: string;
    provider?: string;
    provider_id?: string;
}

export interface UserWithId extends User {
    id: string;
    onboarded: boolean;
}

export const createUser = async (user: User): Promise<UserWithId> => {
    const result = await db.query<UserWithId>(
        "INSERT INTO users (username, email, provider, provider_id, onboarded) VALUES ($1, $2, $3, $4, FALSE) RETURNING *",
        [user.username, user.email, user.provider, user.provider_id]
    );
    return result.rows[0];
};

export const getUserById = async (user_id: string): Promise<UserWithId | null> => {
    const result = await db.query<UserWithId>(
        "SELECT * FROM users WHERE user_id = $1",
        [user_id]
    );
    return result.rows[0] || null;
};


const updateOnboardedStatus = async (userId: string, onboarded: boolean) => {
    try {
        // console.log(`🔹 Running UPDATE query for user ${userId}...`);
        const result = await db.query(
            "UPDATE users SET onboarded = $1 WHERE user_id = $2", 
            [onboarded, userId]
        );
        // console.log("✅ Update query result:", result);
        return result;
    } catch (error) {
        // console.error("❌ Error in updateOnboardedStatus:", error);
        throw error;
    }
};




export default {
    createUser,
    getUserById,
    updateOnboardedStatus,
};
