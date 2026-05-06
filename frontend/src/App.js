import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items?limit=20');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items/stats/summary');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit: 20 }),
      });

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        fetchItems();
        fetchStats();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error adding item:', error);
      return { success: false, error: 'Failed to add item' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Smart Search Inventory Manager
            </h1>
            {stats && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Total Items: <strong>{stats.totalItems}</strong></span>
                <span>Categories: <strong>{stats.totalCategories}</strong></span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'add'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Add Item
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Browse Items
            </button>
          </nav>
        </div>

        {activeTab === 'search' && (
          <div className="space-y-6">
            <SearchBar onSearch={handleSearch} isSearching={isSearching} />
            <SearchResults results={searchResults} query="" />
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-2xl">
            <ItemForm onAddItem={handleAddItem} />
          </div>
        )}

        {activeTab === 'browse' && (
          <ItemList items={items} onRefresh={fetchItems} />
        )}
      </main>
    </div>
  );
}

export default App;
