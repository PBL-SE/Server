import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import client from "../config/db.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const existingUser = result.rows[0];
    if (existingUser) return next(errorHandler(400, "Email already in use"));
    const hashpass = await bcrypt.hash(password, 7);
    await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashpass]);
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const validUser = result.rows[0];
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));
    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET as string);
    const { password: pass, ...rest } = validUser;
    res.cookie("access-token", token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
      const { password, ...rest } = user;
      return res.cookie("access-token", token, { httpOnly: true }).status(200).json(rest);
    }
    const generatePass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashpass = await bcrypt.hash(generatePass, 6);
    const username = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
    const newUserResult = await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email', [username, email, hashpass]);
    const newUser = newUserResult.rows[0];
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string);
    const { password, ...rest } = newUser;
    res.cookie("access-token", token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
