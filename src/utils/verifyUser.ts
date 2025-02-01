import { Request, Response, NextFunction } from 'express';
import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies["access-token"];
    if (!token) {
        return next(errorHandler(401, "access denied"));
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
            if (err) {
                return next(errorHandler(401, "access denied"));
            }
            req.user = user;
            next();
        });
    } catch (err) {
        return next(errorHandler(401, "access denied"));
    }
};
