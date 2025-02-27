import { Router } from "express";
import { getAllOrganizations, getAllJournals, getAllAuthors, getAllPapers, getAuthorsOfAnOrganization, getPaperByJournal, getPaperByAuthor, getPaperByCategory, getPaperCitations } from "../controllers/library.controller";

const libraryRouter = Router();
libraryRouter.get("/get-all-organizations", getAllOrganizations);
libraryRouter.get("/get-all-journals", getAllJournals);
libraryRouter.get("/get-all-authors", getAllAuthors);
libraryRouter.get("/get-all-papers", getAllPapers);
libraryRouter.get("/get-authors-of-an-organization", getAuthorsOfAnOrganization);
libraryRouter.get("/get-paper-by-journal", getPaperByJournal);
libraryRouter.get("/get-paper-by-author", getPaperByAuthor);
libraryRouter.get("/get-paper-by-category", getPaperByCategory);
libraryRouter.get("/get-paper-citations", getPaperCitations);

export default libraryRouter;
