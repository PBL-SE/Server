import { Router } from "express";
import { fetchByQuery, fetchByQueryAndTag } from "../controllers/paper.controller";

const paperRouter = Router();
paperRouter.get("/fetch-by-query", fetchByQuery);
paperRouter.get("/fetch-by-query-and-tag", fetchByQueryAndTag);

export default paperRouter;
