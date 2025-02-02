import { Request, Response } from "express";
import executeAnalyticsQuery from "../utils/executeAnalyticsQuery.js";

// 1. Organization with the most papers
export const getTopOrganization = async (req: Request, res: Response) => {
    const query = `
        SELECT o.name, COUNT(p.arxiv_id) AS total_papers
        FROM Organizations o
        JOIN Authors a ON o.organization_id = a.organization_id
        JOIN Paper_Author pa ON a.author_id = pa.author_id
        JOIN Papers p ON pa.arxiv_id = p.arxiv_id
        GROUP BY o.name
        ORDER BY total_papers DESC
        LIMIT 5;
    `;
    const data: any = await executeAnalyticsQuery(query, [], res);
    res.json({
        labels: data.map((item: any) => item.name),
        datasets: [{
            label: 'Total Papers',
            data: data.map((item: any) => item.total_papers),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    });
};

export const getMostCitedPapers = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const query = `
        SELECT p.title, COUNT(c.citing_arxiv_id) AS citation_count
        FROM Papers p
        LEFT JOIN Citations c ON p.DOI = c.cited_doi_id
        GROUP BY p.title
        ORDER BY citation_count DESC
        LIMIT $1;
    `;
    const data: any = await executeAnalyticsQuery(query, [limit], res);
    res.json({
        labels: data.map((item: any) => item.title),
        datasets: [{
            label: 'Citations',
            data: data.map((item: any) => item.citation_count),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    });
};


export const getAvgDifficultyByCategory = async (req: Request, res: Response) => {
    const query = `
        SELECT c.name AS category_name, AVG(p.difficulty_level) AS avg_difficulty
        FROM Categories c
        JOIN Paper_Category pc ON c.category_id = pc.category_id
        JOIN Papers p ON pc.arxiv_id = p.arxiv_id
        GROUP BY c.name
        ORDER BY avg_difficulty DESC;
    `;
    const data: any = await executeAnalyticsQuery(query, [], res);
    res.json({
        labels: data.map((item: any) => item.category_name),
        datasets: [{
            label: 'Avg. Difficulty',
            data: data.map((item: any) => item.avg_difficulty),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    });
};

export const getTopAuthorsByDifficulty = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const query = `
        SELECT a.name, AVG(p.difficulty_level) AS avg_difficulty
        FROM Authors a
        JOIN Paper_Author pa ON a.author_id = pa.author_id
        JOIN Papers p ON pa.arxiv_id = p.arxiv_id
        GROUP BY a.name
        ORDER BY avg_difficulty DESC
        LIMIT $1;
    `;
    const data: any = await executeAnalyticsQuery(query, [limit], res);
    res.json({
        labels: data.map((item: any) => item.name),
        datasets: [{
            label: 'Avg. Difficulty',
            data: data.map((item: any) => item.avg_difficulty),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    });
};

export const getTopOrganizationsByCitations = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const query = `
        SELECT o.name AS organization, COUNT(c.citing_arxiv_id) AS total_citations
        FROM Organizations o
        JOIN Authors a ON o.organization_id = a.organization_id
        JOIN Paper_Author pa ON a.author_id = pa.author_id
        JOIN Papers p ON pa.arxiv_id = p.arxiv_id
        LEFT JOIN Citations c ON p.DOI = c.cited_doi_id
        GROUP BY o.name
        ORDER BY total_citations DESC
        LIMIT $1;
    `;
    const data: any = await executeAnalyticsQuery(query, [limit], res);
    res.json({
        labels: data.map((item: any) => item.organization),
        datasets: [{
            label: 'Total Citations',
            data: data.map((item: any) => item.total_citations),
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }]
    });
};

export const getPapersPerYear = async (req: Request, res: Response) => {
    const query = `
        SELECT year, COUNT(*) AS total_papers
        FROM Papers
        GROUP BY year
        ORDER BY year DESC;
    `;
    const data: any = await executeAnalyticsQuery(query, [], res);
    res.json({
        labels: data.map((item: any) => item.year),
        datasets: [{
            label: 'Total Papers',
            data: data.map((item: any) => item.total_papers),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 2,
            fill: true
        }]
    });
};

export const getTopAuthorsByCitations = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const query = `
        SELECT a.name, COUNT(c.citing_arxiv_id) AS total_citations
        FROM Authors a
        JOIN Paper_Author pa ON a.author_id = pa.author_id
        JOIN Papers p ON pa.arxiv_id = p.arxiv_id
        LEFT JOIN Citations c ON p.DOI = c.cited_doi_id
        GROUP BY a.name
        ORDER BY total_citations DESC
        LIMIT $1;
    `;
    const data: any = await executeAnalyticsQuery(query, [limit], res);
    res.json({
        labels: data.map((item: any) => item.name),
        datasets: [{
            label: 'Total Citations',
            data: data.map((item: any) => item.total_citations),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    });
};