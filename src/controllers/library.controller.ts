import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import client from "../config/db.js";
import axios from "axios";
import { mongoDB, client as mongoClient } from "../config/mongo.js";

dotenv.config();

export const getAllOrganizations = async (req: Request, res: Response) => {
    try {
        const result = await client.query('SELECT * FROM Organizations');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving organizations:', error);
        res.status(500).json({ error: 'Error retrieving organizations' });
    }
};

export const getAllJournals = async (req: Request, res: Response) => {
    try {
        const result = await client.query('SELECT * FROM Journals');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving journals:', error);
        res.status(500).json({ error: 'Error retrieving journals' });
    }
};

export const getAllAuthors = async (req: Request, res: Response) => {
    try {
        const result = await client.query('SELECT * FROM Authors');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving authors:', error);
        res.status(500).json({ error: 'Error retrieving authors' });
    }
};

export const getAllPapers = async (req: Request, res: Response) => {
    try {
        const result = await client.query('SELECT * FROM Papers');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving papers:', error);
        res.status(500).json({ error: 'Error retrieving papers' });
    }
};

export const getAuthorsOfAnOrganization = async (req: Request, res: Response) => {
    try {
        const organizationId = req.query.organizationId;
        const result = await client.query('SELECT * FROM Authors WHERE organization_id = $1', [organizationId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving authors of an organization:', error);
        res.status(500).json({ error: 'Error retrieving authors of an organization' });
    }
};

export const getPaperByJournal = async (req: Request, res: Response) => {
    try {
        const journalId = req.query.journalId;
        const result = await client.query('SELECT * FROM Paper_Journal WHERE journal_id = $1', [journalId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving books by journal:', error);
        res.status(500).json({ error: 'Error retrieving books by journal' });
    }
};

export const getPaperByAuthor = async (req: Request, res: Response) => {
    try {
        const authorId = req.query.authorId;
        const result = await client.query('SELECT * FROM Paper_Author WHERE author_id = $1', [authorId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving books by author:', error);
        res.status(500).json({ error: 'Error retrieving books by author' });
    }
};

export const getPaperByCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = parseInt(req.query.category_id as string, 10);
        const result = await client.query('SELECT * FROM Paper_Category WHERE category_id = $1', [categoryId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving books by category:', error);
        res.status(500).json({ error: 'Error retrieving books by category' });
    }
};

export const getPaperCitations = async (req: Request, res: Response) => {
    try {
        const arxivId = req.query.arxivId;
        const result = await client.query('SELECT cited_doi_id FROM Citations WHERE citing_arxiv_id = $1', [arxivId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving paper citations:', error);
        res.status(500).json({ error: 'Error retrieving paper citations' });
    }
};