import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import pool from './config/db';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`

    },
    async (accessToken: string, refreshToken: string, profile: any, done) => {
      const { id, displayName, emails } = profile;
      const email = emails[0].value;

      try {
        const user = await pool.query(
          'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
          ['google', id]
        );

        if (user.rows.length === 0) {
          const newUser = await pool.query(
            'INSERT INTO users (provider, provider_id, username, email) VALUES ($1, $2, $3, $4) RETURNING *',
            ['google', id, displayName, email]
          );

          const token = jwt.sign(
            {
              user_id: newUser.rows[0].id,
              username: displayName,
              email,
              provider: 'google',
              isNew: true
            },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return done(null, { token, isNew: true });
        } else {
          const token = jwt.sign(
            {
              user_id: user.rows[0].id,
              username: user.rows[0].username,
              email: user.rows[0].email,
              provider: 'google',
              isNew: false
            },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return done(null, { token, isNew: false });
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
