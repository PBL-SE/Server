import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import client from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const authenticateUser = async (profile: any, done: any, provider: string) => {
  const provider_id = profile.id;

  try {
    // Insert only provider_id and provider (Avoid name since your DB doesn't have it)
    await client.query(
      "INSERT INTO users (provider_id, provider) VALUES ($1, $2) ON CONFLICT (provider, provider_id) DO NOTHING",
      [provider_id, provider]
    );

    // Send user data back (includes name, but not stored in DB)
    done(null, { id: provider_id, provider, name: profile.displayName });
  } catch (err) {
    done(err, null);
  }
};

// ✅ Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
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
      callbackURL: "/api/auth/github/callback",
    },
    (accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: any) => void) => 
      authenticateUser(profile, done, "github")
  )
);


// ✅ Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    (accessToken, refreshToken, profile, done) => authenticateUser(profile, done, "facebook")
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

export default passport;
