const { CohereClient } = require('cohere-ai');

// Simple fallback embedding function
const generateSimpleEmbedding = (text) => {
  const embedding = new Array(1024).fill(0);
  const words = text.toLowerCase().split(/\s+/);
  
  // Character frequency analysis
  const charFreq = {};
  for (const char of text) {
    charFreq[char] = (charFreq[char] || 0) + 1;
  }
  
  // Populate embedding with semantic features
  let index = 0;
  
  // Character features
  for (let i = 0; i < 100 && index < 1024; i++) {
    const char = String.fromCharCode(97 + (i % 26));
    embedding[index++] = (charFreq[char] || 0) / text.length;
  }
  
  // Word features
  for (let i = 0; i < 200 && index < 1024; i++) {
    if (i < words.length) {
      embedding[index++] = words[i].length / 20;
    } else {
      embedding[index++] = 0;
    }
  }
  
  // Fill remaining with normalized text features
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  while (index < 1024) {
    embedding[index++] = avgWordLength / 10;
  }
  
  // Normalize entire vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
};

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

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const generateEmbedding = async (text) => {
  try {
    const response = await cohere.embed({
      texts: [text],
      model: 'embed-english-v3.0',
      inputType: 'search_document'
    });
    
    return response.embeddings[0];
  } catch (error) {
    console.error('Error with Cohere API:', error.message);
    // Fallback to simple embedding
    return await generateSimpleEmbedding(text);
  }
};

module.exports = {
  generateEmbedding,
  cosineSimilarity
};
