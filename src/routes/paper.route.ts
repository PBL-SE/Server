import { Router } from "express";
import { fetchByQuery, fetchByQueryAndTag } from "../controllers/paper.controller.js";

const paperRouter = Router();
paperRouter.post("/fetch-by-query", fetchByQuery);
paperRouter.post("/fetch-by-query-and-tag", fetchByQueryAndTag);

export default paperRouter;
