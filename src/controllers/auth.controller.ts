import { Request, Response } from "express";
import passport from "passport";
import userModel, { UserWithId } from "../models/user.model.js";
import { setUserId } from "../config/sessionStore.js";
import dotenv from "dotenv";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;

// Extend the Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: UserWithId;
}

// OAuth authentication handlers
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });
export const githubAuth = passport.authenticate("github", { scope: ["user:email"] });
export const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

export const authCallback = (provider: string) => async (req: AuthenticatedRequest, res: Response) => {
  

  // if (!req.user) {
  //   console.error("❌ Authentication failed: No user found");
  //   return res.status(401).json({ message: "Authentication failed" });
  // }

  const { user_id } = req.user as any;
  console.log(`auth success: user_id=${user_id}`);

  setUserId(user_id);

  console.log(`🔍 Checking if user exists in MongoDB: user_id=${user_id}`);
  const existingUser = await userModel.getUserById(user_id);

  // if (existingUser) {
  //   console.log(`✅ User found in MongoDB: ${JSON.stringify(existingUser)}`);
  // } else {
  //   console.warn(`⚠️ User not found in MongoDB: user_id=${user_id}`);
  // }

  res.redirect(existingUser?.onboarded ? `${FRONTEND_URL}/home` : `${FRONTEND_URL}/onboarding`);
};

export const logout = (req: Request, res: Response) => {
  console.log("🔄 Logout requested");
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Logout failed:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    console.log("✅ Session destroyed, cookie removed");
    res.status(200).json({ message: "Logged out successfully" });
  });
};

export const getSession = (req: Request, res: Response) => {
  console.log("🔄 Fetching user session");
  if (!req.user) {
    console.warn("⚠️ No active session found");
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { user_id, provider, provider_id } = req.user as any;
  console.log(`✅ Active session: user_id=${user_id}, provider=${provider}, provider_id=${provider_id}`);
  res.json({ user_id, provider, provider_id });
};
