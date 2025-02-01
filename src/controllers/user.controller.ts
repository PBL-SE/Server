import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import client from "../config/db.js";

export const test = (req: Request, res: Response) => {
  res.json({
    message: "sab changa si",
  });
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.id !== req.params.id) return next(errorHandler(401, "Unauthorized"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    
    const { id, username, email, password, avatar } = req.body;
    const result = await client.query(
      `UPDATE users SET username = $1, email = $2, password = $3, avatar = $4 WHERE id = $5 RETURNING id, username, email, avatar`,
      [username, email, password, avatar, req.params.id]
    );
    const updatedUser = result.rows[0];  // Access the updated user from result.rows

    if (!updatedUser) return next(errorHandler(404, "User not found"));
    const { password: pass, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (err) {
    return next(errorHandler(500, "Internal server error"));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.id !== req.params.id) return next(errorHandler(401, "Unauthorized"));
  try {
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    const deletedUser = result.rows[0];  // Access the deleted user from result.rows

    if (!deletedUser) return next(errorHandler(404, "User not found"));
    res.status(200).json("User has been deleted");
  } catch (err) {
    return next(err);
  }
};
