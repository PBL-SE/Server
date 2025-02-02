import { Router } from "express";
import { 
    getTopOrganization, 
    getMostCitedPapers, 
    getAvgDifficultyByCategory, 
    getTopAuthorsByDifficulty, 
    getTopOrganizationsByCitations, 
    getPapersPerYear, 
    getTopAuthorsByCitations,
} from "../controllers/analytics.controller.js";

const analyticsRouter = Router();

// Route for the organization with the most papers
analyticsRouter.get("/top-organization", getTopOrganization);

// Route for the most cited papers
analyticsRouter.get("/most-cited-papers", getMostCitedPapers);

// Route for average difficulty per category
analyticsRouter.get("/avg-difficulty-by-category", getAvgDifficultyByCategory);

// Route for top authors by difficulty
analyticsRouter.get("/top-authors-by-difficulty", getTopAuthorsByDifficulty);

// Route for organizations with the most citations
analyticsRouter.get("/top-organizations-by-citations", getTopOrganizationsByCitations);

// Route for papers published per year
analyticsRouter.get("/papers-per-year", getPapersPerYear);

// Route for top authors by citations
analyticsRouter.get("/top-authors-by-citations", getTopAuthorsByCitations);

export default analyticsRouter;
