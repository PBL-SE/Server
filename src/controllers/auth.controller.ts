import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });
export const githubAuth = passport.authenticate("github", { scope: ["user:email"] });
export const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

export const authCallback = (provider: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: "Authentication failed" });

  const token = jwt.sign({ id: (req.user as any).id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

  res.cookie("access-token", token, { httpOnly: true })
     .status(200)
     .json({ success: true, message: `Signed in with ${provider}`, user: req.user });

  return next();
};
