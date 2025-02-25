import { Request, Response } from "express";
import passport from "passport";
import userModel, { UserWithId } from "../models/user.model.js";

import dotenv from "dotenv";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL


// Extend the Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: UserWithId;
}

// OAuth authentication handlers
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });
export const githubAuth = passport.authenticate("github", { scope: ["user:email"] });
export const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

export const authCallback = (provider: string) => async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  // Check if user exists in the database
  const existingUser = await userModel.getUserById(req.user.id);

  if (existingUser) {
    res.redirect(existingUser.onboarded ? `${FRONTEND_URL}/home` : `${FRONTEND_URL}/onboarding`);
  } else {
    res.redirect(`${FRONTEND_URL}/home`);
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid"); // Clear session cookie
    res.json({ message: "Logged out successfully" });
  });
};
