import { Router } from "express";
import { resolveDOI } from "../controllers/doi.controller.js";

const doiRouter = Router();

doiRouter.get("/resolve-doi", resolveDOI);

export default doiRouter;
