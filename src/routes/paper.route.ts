import { Router } from "express";
import { fetch } from "../controllers/paper.controller";

const paperRouter = Router();
paperRouter.get("/fetch-by-query", fetch);

export default paperRouter;
