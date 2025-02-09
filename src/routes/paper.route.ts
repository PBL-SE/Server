import { Router } from "express";
import { fetchByQuery, fetchByQueryAndTag, recommendPapers } from "../controllers/paper.controller.js";

const paperRouter = Router();
paperRouter.post("/fetch-by-query", fetchByQuery);
paperRouter.post("/fetch-by-query-and-tag", fetchByQueryAndTag);
paperRouter.post("/recommend", recommendPapers);

export default paperRouter;
