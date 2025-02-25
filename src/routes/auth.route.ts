import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { googleAuth, githubAuth, facebookAuth, authCallback, logout } from "../controllers/auth.controller.js";
import userModel from "../models/user.model.js";
import { AuthenticatedRequest } from "../types/express.js"; 

const router = Router();

// Google Authentication
router.get("/google", googleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: Request, res: Response) => authCallback("Google")(req as AuthenticatedRequest, res)
);

// GitHub Authentication
router.get("/github", githubAuth);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req: Request, res: Response) => authCallback("GitHub")(req as AuthenticatedRequest, res)
);

// Facebook Authentication
router.get("/facebook", facebookAuth);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req: Request, res: Response) => authCallback("Facebook")(req as AuthenticatedRequest, res)
);



router.get("/me", (req: AuthenticatedRequest, res: Response) => {
  console.log("🔍 Checking /me route...");
  console.log("🔹 Cookies received:", req.cookies);
  console.log("🔹 Session ID:", req.sessionID);
  console.log("🔹 Session Data:", req.session);

  if (req.isAuthenticated() && req.user) {
    // console.log("✅ User is authenticated:", req.user);
    return res.json({ existing: true, user: req.user });
  }

  // console.log("❌ User is not authenticated!");
  return res.status(401).json({ existing: false, error: "Unauthorized" });
});




// ✅ Verify Session
router.get("/onboarding-status", (req: AuthenticatedRequest, res: Response) => {
  // console.log("🔍 Checking /onboarding-status route...");
  // console.log("🔹 Is Authenticated:", req.isAuthenticated());
  // console.log("🔹 User in Request:", req.user);

  if (req.isAuthenticated() && req.user) {
    return res.json({ user: { user_id: req.user.id, onboarded: req.user.onboarded } });
  }

  return res.status(401).json({ error: "Unauthorized" });
});





const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // console.log("🔍 Checking Authentication Middleware...");
  // console.log("🔹 Is Authenticated:", req.isAuthenticated());
  // console.log("🔹 User in Request:", req.user);

  if (req.isAuthenticated() && req.user && req.user.user_id) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
};


// ✅ Update Onboarding Status
router.post("/onboarding", isAuthenticated, async (req, res) => {
  const { user_id } = req.user as any;

  if (!user_id) {
      // console.log("❌ User ID not found.");
      return res.status(401).json({ message: "Unauthorized" });
  }

  try {
      // console.log(`🔹 Attempting to update onboarding for user: ${user_id}`);
      const success = await userModel.updateOnboardedStatus(user_id, true);
      
      if (!success) {
          // console.log("❌ No rows updated. Maybe user_id is wrong?");
          return res.status(400).json({ message: "Failed to update onboarding status" });
      }

      res.status(200).json({ message: "Onboarding status updated successfully" });
  } catch (error) {
      // console.error("❌ Error updating onboarding status:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});






// ✅ Logout
router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
});

export default router;
