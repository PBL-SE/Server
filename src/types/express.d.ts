import { Request } from "express";
import { UserWithId } from "./models/user.model.js"; // Adjust based on your actual user model location

// Extend the Request interface to include user information
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    onboarded: boolean;
  };
}

// Extend the Express namespace to include a custom session
declare global {
  namespace Express {
    interface Session {
      user?: {
        id: string;
        onboarded: boolean;
      };
    }
  }
}
