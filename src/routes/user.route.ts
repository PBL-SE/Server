import { Router } from "express";
import { test, updateUser, deleteUser } from "../controllers/user.controller";
import { verifyToken } from "../utils/verifyUser";

const userRouter = Router();
userRouter.get("/test", test);
userRouter.post("/update/:id", verifyToken, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);

export default userRouter;
