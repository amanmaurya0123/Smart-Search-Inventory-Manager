const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embedding for a given text using OpenAI's API
 * @param {string} text - The text to generate embedding for
 * @returns {Promise<number[]>} - The embedding vector
 */
const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
};

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vecA - First vector
 * @param {number[]} vecB - Second vector
 * @returns {number} - Cosine similarity score (0 to 1)
 */
const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
};

/**
 * Find most similar items based on cosine similarity
 * @param {number[]} queryEmbedding - The query embedding vector
 * @param {Array} items - Array of items with embeddings
 * @param {number} limit - Maximum number of results to return
 * @returns {Array} - Array of items with similarity scores
 */
const findMostSimilar = (queryEmbedding, items, limit = 10) => {
  const itemsWithSimilarity = items.map(item => {
    const similarity = cosineSimilarity(queryEmbedding, item.embedding);
    return {
      ...item.toObject(),
      similarity: similarity
    };
  });

  // Sort by similarity in descending order
  itemsWithSimilarity.sort((a, b) => b.similarity - a.similarity);

  // Return top results
  return itemsWithSimilarity.slice(0, limit);
};

module.exports = {
  generateEmbedding,
  cosineSimilarity,
  findMostSimilar
};
