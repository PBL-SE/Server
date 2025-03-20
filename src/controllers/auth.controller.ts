import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import MongoUser from '../models/mongomodel';

import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;

const DEFAULT_PREFERENCES = new Map<string, string[]>();
const DEFAULT_DIFFICULTY_LEVELS = new Map<string, number>();
const DEFAULT_FAVORITE_CATEGORIES = new Map<string, string>();
const DEFAULT_SAVED_PAPERS: string[] = [];
const DEFAULT_CUSTOM_FILTERS = {
  journals: [] as string[],
  yearRange: { start: 0, end: 0 }
};

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication failed' });

  const { token, isNew } = req.user as { token: string; isNew: boolean };
  res.cookie('token', token, { httpOnly: true, secure: false });
  res.redirect(isNew ? `${FRONTEND_URL}/onboarding` : `${FRONTEND_URL}/home`);
};

export const getUser = (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    // console.log("token in /me", token);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // if (decoded) console.log("decoded is true hence correct");
    // else console.log("decoded is false hence incorrect");

    res.json(decoded);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const completeOnboarding = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET) as {
      user_id: string;
      username: string;
      email: string;
      provider: string;
    };

    const { user_id, username, email, provider } = decoded;
    const { preferences } = req.body;

    if (!preferences || preferences.length === 0) {
      return res.status(400).json({ message: 'Preferences are required' });
    }
    
    console.log('Searching for user...');
    let mongoUser = await MongoUser.findOne({ postgresId: user_id });
    
    

    

    if (mongoUser) {
      mongoUser.preferences = preferences;
      mongoUser.onboardingCompleted = true;
      await mongoUser.save();
    } else {
      mongoUser = new MongoUser({
        postgresId: user_id,
        username,
        email,
        provider,
        preferences,
        onboardingCompleted: true
      });
     
      await mongoUser.save();
     
    }

    const newToken = jwt.sign(
      { user_id, username, email, provider, isNew: false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', newToken, { httpOnly: true, secure: false });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};
