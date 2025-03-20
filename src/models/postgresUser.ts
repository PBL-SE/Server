import pool from '../config/db';

export const findOrCreateUser = async (
  provider: string,
  providerId: string,
  email: string,
  username: string
) => {
  try {
    let user = await pool.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      [provider, providerId]
    );

    if (user.rows.length === 0) {
      const newUser = await pool.query(
        'INSERT INTO users (provider, provider_id, email, username) VALUES ($1, $2, $3, $4) RETURNING *',
        [provider, providerId, email, username]
      );
      user = { rows: newUser.rows };
      return { user: user.rows[0], isNew: true };
    }

    return { user: user.rows[0], isNew: false };
  } catch (err) {
    throw new Error('Database error');
  }
};
