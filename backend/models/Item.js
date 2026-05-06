const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text index for basic search functionality
itemSchema.index({ name: 'text', description: 'text', category: 'text' });

// Create vector index for efficient similarity search (MongoDB Atlas required)
// itemSchema.index({ embedding: 'vector' }, { name: 'embedding_index' });

module.exports = mongoose.model('Item', itemSchema);
