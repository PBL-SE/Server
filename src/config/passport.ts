import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import client from "../config/db.js";
import { Profile } from "passport";
import { VerifyCallback } from "passport-oauth2";
import dotenv from "dotenv";

dotenv.config();

const authenticateUser = async (profile: any, done: any, provider: string) => {
  const provider_id = profile.id;
  try {
    const result = await client.query("SELECT user_id FROM users WHERE provider_id=$1 AND provider=$2", [
      provider_id,
      provider,
    ]);

    if (result.rows.length > 0) {
      return done(null, { user_id: result.rows[0].user_id });
    } else {
      const newUser = await client.query(
        "INSERT INTO users (provider_id, provider) VALUES ($1, $2) RETURNING user_id",
        [provider_id, provider]
      );

      return done(null, {
        user_id: newUser.rows[0].user_id,
        provider,
        provider_id,
        onboarded: false,
      });
    }
  } catch (err) {
    return done(err, null);
  }
};

// ✅ Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.BACKEND_URL + "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => authenticateUser(profile, done, "google")
  )
);

// ✅ GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.BACKEND_URL + "/api/auth/github/callback",
    },
    (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) =>
      authenticateUser(profile, done, "github")
  )
);

// ✅ Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.BACKEND_URL + "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    (accessToken, refreshToken, profile, done) => authenticateUser(profile, done, "facebook")
  )
);

// ✅ Session Management
passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user);
  done(null, {
    user_id: user.user_id,
    onboarded: user.onboarded,
  });
});

passport.deserializeUser(async (user: any, done) => {
  const user_id = typeof user === "object" ? user.user_id : user; // Ensure it's a number
  console.log("Deserializing user with ID:", user_id);
  
  try {
    const result = await client.query("SELECT * FROM users WHERE user_id=$1", [user_id]);
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      console.log("❌ User not found");
      done(null, null);
    }
  } catch (err) {
    console.error("❌ Error in deserializeUser:", err);
    done(err, null);
  }
});




export default passport;
