const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { generateEmbedding, findMostSimilar } = require('../utils/embeddings');

/**
 * POST /api/search
 * Search for items using semantic similarity
 * Request body: { query: string, limit?: number }
 */
router.post('/', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query.trim());

    // Get all items from database
    const items = await Item.find({});

    if (items.length === 0) {
      return res.json({ results: [], message: 'No items found in inventory' });
    }

    // Find most similar items
    const similarItems = findMostSimilar(queryEmbedding, items, limit);

    // Filter out items with very low similarity scores (optional)
    const filteredResults = similarItems.filter(item => item.similarity > 0.1);

    res.json({
      results: filteredResults,
      query: query,
      totalResults: filteredResults.length,
      searchedItems: items.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

/**
 * GET /api/search/categories
 * Get all available categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Item.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * POST /api/search/category
 * Search within a specific category
 * Request body: { query: string, category: string, limit?: number }
 */
router.post('/category', async (req, res) => {
  try {
    const { query, category, limit = 10 } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!category || category.trim() === '') {
      return res.status(400).json({ error: 'Category is required' });
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query.trim());

    // Get items from specific category
    const items = await Item.find({ category: category.trim() });

    if (items.length === 0) {
      return res.json({ 
        results: [], 
        message: `No items found in category: ${category}` 
      });
    }

    // Find most similar items within the category
    const similarItems = findMostSimilar(queryEmbedding, items, limit);

    // Filter out items with very low similarity scores
    const filteredResults = similarItems.filter(item => item.similarity > 0.1);

    res.json({
      results: filteredResults,
      query: query,
      category: category,
      totalResults: filteredResults.length,
      searchedItems: items.length
    });

  } catch (error) {
    console.error('Category search error:', error);
    res.status(500).json({ error: 'Failed to perform category search' });
  }
});

module.exports = router;
