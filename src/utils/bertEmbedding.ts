// This file was created initially to generate embeddings for the text using the BERT model
// However, it is not used in the project anymore, we are using the remote API to generate embeddings

let bertModel: any;

const loadBertEmbeddingModel = async () => {
    console.log("🔄 Loading BERT model...");

    // Use dynamic import for the module
    const { pipeline } = await import('@xenova/transformers');

    // Ensure the pipeline loads correctly
    return await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
};

const getBertEmbedding = async (text: string): Promise<number[]> => {
    try {
        if (!bertModel) {
            console.log("🟡 BERT model is not loaded, loading now...");
            bertModel = await loadBertEmbeddingModel();
        }

        console.log("📌 Generating embeddings for:", text);
        const embeddings = await bertModel(text, { pooling: 'cls', normalize: true });

        if (!embeddings || !embeddings.data || embeddings.data.length === 0) {
            console.error("❌ BERT model returned an empty embedding.");
            return []; // Ensure we handle the empty case
        }

        console.log("✅ Generated embedding:", embeddings.data);
        return embeddings.data;
    } catch (error) {
        console.error("❌ Error generating BERT embedding:", error);
        return [];
    }
};

export default getBertEmbedding;
