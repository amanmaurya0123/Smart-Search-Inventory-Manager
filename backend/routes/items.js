const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { generateEmbedding } = require('../utils/embeddings');

/**
 * GET /api/items
 * Get all items in the inventory
 */
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50, page = 1 } = req.query;
    
    // Build query
    const query = {};
    if (category) {
      query.category = category;
    }

    const items = await Item.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

/**
 * GET /api/items/:id
 * Get a specific item by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ item });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

/**
 * POST /api/items
 * Add a new item to the inventory
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Validate required fields
    if (!name || !description || !category) {
      return res.status(400).json({ 
        error: 'Name, description, and category are required' 
      });
    }

    // Generate text for embedding (combine name, description, and category)
    const textForEmbedding = `${name} ${description} ${category}`;
    
    // Generate embedding
    const embedding = await generateEmbedding(textForEmbedding);

    // Create new item
    const newItem = new Item({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      embedding
    });

    // Save to database
    const savedItem = await newItem.save();

    res.status(201).json({ 
      message: 'Item added successfully',
      item: savedItem 
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

/**
 * PUT /api/items/:id
 * Update an existing item
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, description, category } = req.body;
    
    // Find existing item
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update fields if provided
    if (name) item.name = name.trim();
    if (description) item.description = description.trim();
    if (category) item.category = category.trim();

    // Regenerate embedding if any text field changed
    if (name || description || category) {
      const textForEmbedding = `${item.name} ${item.description} ${item.category}`;
      item.embedding = await generateEmbedding(textForEmbedding);
    }

    // Save updated item
    const updatedItem = await item.save();

    res.json({ 
      message: 'Item updated successfully',
      item: updatedItem 
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

/**
 * DELETE /api/items/:id
 * Delete an item from the inventory
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ 
      message: 'Item deleted successfully',
      item 
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

/**
 * GET /api/items/stats
 * Get inventory statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const categories = await Item.distinct('category');
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Item.countDocuments({ category });
        return { category, count };
      })
    );

    res.json({
      totalItems,
      totalCategories: categories.length,
      categories: categoryCounts.sort((a, b) => b.count - a.count)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
