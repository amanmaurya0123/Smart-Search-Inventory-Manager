const mongoose = require('mongoose');
const Item = require('../models/Item');
const { generateEmbedding } = require('../utils/embeddings');
require('dotenv').config();

const sampleItems = [
  {
    name: "Waterproof Rain Jacket",
    description: "A durable waterproof jacket perfect for rainy days and outdoor adventures",
    category: "Clothing"
  },
  {
    name: "Umbrella",
    description: "Large automatic umbrella with wind-resistant frame for storm protection",
    category: "Clothing"
  },
  {
    name: "Rain Boots",
    description: "Waterproof rubber boots with non-slip sole for wet weather",
    category: "Clothing"
  },
  {
    name: "Board Game Collection",
    description: "Classic board games perfect for indoor entertainment on rainy days",
    category: "Toys & Games"
  },
  {
    name: "Puzzle Set",
    description: "1000-piece jigsaw puzzle for relaxing indoor activities",
    category: "Toys & Games"
  },
  {
    name: "Camping Tent",
    description: "4-person waterproof tent for outdoor adventures and camping trips",
    category: "Sports & Outdoors"
  },
  {
    name: "Hiking Boots",
    description: "Durable waterproof hiking boots with excellent grip for trail adventures",
    category: "Sports & Outdoors"
  },
  {
    name: "LED Flashlight",
    description: "Bright LED flashlight with long battery life for outdoor activities",
    category: "Electronics"
  },
  {
    name: "Winter Coat",
    description: "Warm insulated winter coat with hood for cold weather protection",
    category: "Clothing"
  },
  {
    name: "Snow Boots",
    description: "Insulated waterproof boots designed for snow and ice conditions",
    category: "Clothing"
  },
  {
    name: "Space Heater",
    description: "Portable electric heater for warming up cold rooms efficiently",
    category: "Home & Garden"
  },
  {
    name: "Hot Chocolate Mix",
    description: "Premium hot chocolate mix for warm drinks on cold days",
    category: "Food & Beverages"
  },
  {
    name: "Running Shoes",
    description: "Lightweight athletic shoes designed for running and fitness activities",
    category: "Sports & Outdoors"
  },
  {
    name: "Yoga Mat",
    description: "Non-slip exercise mat for yoga, pilates, and home workouts",
    category: "Sports & Outdoors"
  },
  {
    name: "Dumbbell Set",
    description: "Adjustable weight dumbbells for strength training at home",
    category: "Sports & Outdoors"
  },
  {
    name: "Laptop Computer",
    description: "High-performance laptop for work, gaming, and entertainment",
    category: "Electronics"
  },
  {
    name: "Wireless Headphones",
    description: "Noise-cancelling Bluetooth headphones for music and calls",
    category: "Electronics"
  },
  {
    name: "Smartphone",
    description: "Latest smartphone with advanced camera and productivity features",
    category: "Electronics"
  },
  {
    name: "Coffee Maker",
    description: "Automatic drip coffee maker for brewing fresh coffee daily",
    category: "Home & Garden"
  },
  {
    name: "Blender",
    description: "High-speed blender for smoothies, soups, and food preparation",
    category: "Home & Garden"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-search-inventory');
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Add sample items with embeddings
    for (const item of sampleItems) {
      console.log(`Processing: ${item.name}`);
      
      // Generate embedding
      const textForEmbedding = `${item.name} ${item.description} ${item.category}`;
      const embedding = await generateEmbedding(textForEmbedding);

      // Create and save item
      const newItem = new Item({
        ...item,
        embedding
      });

      await newItem.save();
      console.log(`✓ Added: ${item.name}`);
    }

    console.log(`\n✅ Successfully seeded ${sampleItems.length} items!`);
    
    // Display statistics
    const totalItems = await Item.countDocuments();
    const categories = await Item.distinct('category');
    console.log(`\n📊 Database Statistics:`);
    console.log(`Total Items: ${totalItems}`);
    console.log(`Categories: ${categories.join(', ')}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
