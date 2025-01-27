const { openai } = require('../config')

// Generate embedding from query
async function generateEmbedding(texts) {
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
      encoding_format: "float"
    });

    return embeddingResponse.data.map(item => item.embedding);
  } catch (e) {
    console.error("Error generating embeddings:", e);
    return [];
  }
}

module.exports = {
  generateEmbedding
}