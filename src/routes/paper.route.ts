import { Router } from "express";
import { fetchByQuery } from "../controllers/paper.controller";

const paperRouter = Router();
paperRouter.get("/fetch-by-query", fetchByQuery);

export default paperRouter;
