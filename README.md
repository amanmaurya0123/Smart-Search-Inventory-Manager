

An AI-powered inventory management system with semantic search capabilities. Users can search for items using natural language queries instead of exact keywords, making inventory discovery intuitive and intelligent.

## Features

- ** Semantic Search**: Search using natural language (e.g., "something for a rainy day")
- ** AI-Powered**: Uses OpenAI embeddings for intelligent search matching
- ** Modern UI**: Clean, responsive React frontend with Tailwind CSS
- ** Real-time Results**: Instant search with similarity scoring
- ** Inventory Management**: Add, browse, and manage inventory items
- ** Category Filtering**: Organize and filter items by categories
- ** Analytics**: View inventory statistics and insights

## Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose** ODM
- **OpenAI Embeddings API** (text-embedding-3-small)
- **Cosine Similarity** for vector comparison

### Frontend
- **React 18** with Hooks
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Responsive Design**

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd "Smart Search Inventory Manager"

# Setup Backend
cd backend
npm install

# Setup Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/smart-search-inventory

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas for cloud hosting
# Update MONGODB_URI in .env with your Atlas connection string
```

### 4. Seed Sample Data (Optional)

Populate the database with sample inventory items:

```bash
cd backend
node scripts/seedData.js
```

### 5. Run the Application

Start both backend and frontend servers:

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Usage Guide

### Semantic Search Examples

Try these natural language queries:

- `"something for a rainy day"` → Returns umbrellas, rain jackets, rain boots
- `"outdoor adventure gear"` → Returns camping tent, hiking boots, flashlight
- `"winter clothing"` → Returns winter coat, snow boots, warm accessories
- `"indoor entertainment"` → Returns board games, puzzles
- `"fitness equipment"` → Returns running shoes, yoga mat, dumbbells

### Adding Items

1. Navigate to the "Add Item" tab
2. Fill in the item name, description, and category
3. Click "Add Item" - the system will automatically generate embeddings
4. The item becomes immediately searchable

### Browsing Inventory

1. Use the "Browse Items" tab to view all inventory
2. Filter by category or search within items
3. View item details and similarity scores

## Project Structure

```
Smart Search Inventory Manager/
├── backend/
│   ├── models/
│   │   └── Item.js              # MongoDB schema with embeddings
│   ├── routes/
│   │   ├── items.js             # Item management endpoints
│   │   └── search.js            # Search endpoints
│   ├── utils/
│   │   └── embeddings.js        # OpenAI integration and similarity
│   ├── scripts/
│   │   └── seedData.js          # Sample data seeder
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.js     # Search input component
│   │   │   ├── SearchResults.js # Results display
│   │   │   ├── ItemForm.js      # Add item form
│   │   │   └── ItemList.js      # Browse items
│   │   ├── App.js               # Main application
│   │   └── index.css            # Tailwind styles
│   ├── public/
│   ├── tailwind.config.js       # Tailwind configuration
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Search
- `POST /api/search` - Semantic search with natural language
- `POST /api/search/category` - Search within specific category
- `GET /api/search/categories` - Get all available categories

### Items
- `GET /api/items` - List all items (with pagination)
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Add new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/stats/summary` - Get inventory statistics

### Health Check
- `GET /health` - API health status

## How It Works

1. **Embedding Generation**: When items are added, the system generates vector embeddings using OpenAI's text-embedding-3-small model
2. **Semantic Search**: User queries are converted to embeddings and compared with stored item embeddings
3. **Similarity Scoring**: Cosine similarity calculates relevance scores between query and items
4. **Ranking**: Results are ranked by similarity score and displayed with confidence indicators

## Search Algorithm

The semantic search uses:

- **Text Embedding**: Converts text to 1536-dimensional vectors
- **Cosine Similarity**: Measures vector similarity (0-1 range)
- **Ranking**: Sorts results by similarity score
- **Filtering**: Removes low-similarity results (< 0.1)

## UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Search**: Instant results as you type
- **Similarity Indicators**: Visual confidence scores for results
- **Category Badges**: Color-coded category labels
- **Loading States**: Smooth animations and loading indicators
- **Error Handling**: User-friendly error messages

## Deployment

### Backend (Render/Heroku)
1. Set environment variables in hosting platform
2. Deploy the backend code
3. Ensure MongoDB connection is configured

### Frontend (Vercel/Netlify)
1. Update API base URL in production
2. Deploy the React application
3. Configure CORS if needed

## Security Considerations

- OpenAI API key should be kept secure (environment variables)
- CORS is configured for development (adjust for production)
- Input validation on all API endpoints
- Error handling prevents information leakage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in .env
- Verify network connectivity

**OpenAI API Error**
- Verify API key is correct
- Check API quota and billing
- Ensure network can reach OpenAI servers

**Frontend Not Connecting**
- Ensure backend is running on port 5000
- Check for CORS issues
- Verify API endpoints are accessible

**Tailwind CSS Not Working**
- Install dependencies: `npm install tailwindcss autoprefixer postcss`
- Ensure PostCSS configuration exists
- Restart development server

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=*
```

## Future Enhancements

- [ ] Real-time search suggestions
- [ ] Advanced filtering (price, date, etc.)
- [ ] Image recognition for items
- [ ] Voice search capabilities
- [ ] Multi-language support
- [ ] Export/import functionality
- [ ] User authentication and permissions
- [ ] Analytics dashboard
- [ ] Mobile app version

---

**Built with using React, Node.js, and OpenAI**
