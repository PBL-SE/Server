import { Router } from 'express';
import passport from 'passport';
import {
  googleAuth,
  googleAuthCallback,
  getUser,
  completeOnboarding,
  logout
} from '../controllers/auth.controller';

const router = Router();

router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { session: false }), googleAuthCallback);
router.get('/me', getUser);
router.post('/complete-onboarding', completeOnboarding);
router.post('/logout', logout);

export default router;
