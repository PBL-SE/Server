import { Request, Response } from "express";


export const resolveDOI = async (req: Request, res: Response) => {
    const doi = req.query.doi as string;
    if (!doi) return res.status(400).json({ error: "DOI is required" });

    try {
        const response = await fetch(`https://doi.org/${doi}`, {
            method: "HEAD",
            redirect: "follow"
        });

        if (!response.ok) throw new Error(`DOI resolution failed with status ${response.status}`);

        const resolvedUrl = response.url;
        res.json({ doi, resolvedUrl });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
