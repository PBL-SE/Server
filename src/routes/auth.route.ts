import { Router, Request, Response, NextFunction } from "express";
import { googleAuth, githubAuth, facebookAuth, authCallback } from "../controllers/auth.controller.js";
import passport from "passport";

const router = Router();

// ✅ Google Auth
router.get("/google", (req: Request, res: Response, next: NextFunction): void => {
  googleAuth(req, res, next);
});
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response, next: NextFunction): void => {
    authCallback("Google")(req, res, next);
  }
);

// ✅ GitHub Auth
router.get("/github", (req: Request, res: Response, next: NextFunction): void => {
  githubAuth(req, res, next);
});
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req: Request, res: Response, next: NextFunction): void => {
    authCallback("GitHub")(req, res, next);
  }
);

// ✅ Facebook Auth
router.get("/facebook", (req: Request, res: Response, next: NextFunction): void => {
  facebookAuth(req, res, next);
});
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req: Request, res: Response, next: NextFunction): void => {
    authCallback("Facebook")(req, res, next);
  }
);

export default router;
