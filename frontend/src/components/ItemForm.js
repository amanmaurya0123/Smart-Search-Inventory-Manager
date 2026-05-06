import React, { useState } from 'react';

const ItemForm = ({ onAddItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.category.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const result = await onAddItem(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Item added successfully!' });
      setFormData({ name: '', description: '', category: '' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add item' });
    }
    
    setIsSubmitting(false);
  };

  const commonCategories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports & Outdoors',
    'Toys & Games',
    'Food & Beverages',
    'Health & Beauty',
    'Automotive',
    'Office Supplies'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Item</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Waterproof Jacket"
            className="search-input"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., A durable waterproof jacket perfect for rainy days and outdoor adventures"
            rows={3}
            className="search-input resize-none"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Clothing"
            list="categories"
            className="search-input"
            disabled={isSubmitting}
          />
          <datalist id="categories">
            {commonCategories.map(category => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
          <button
            type="button"
            onClick={() => setFormData({ name: '', description: '', category: '' })}
            disabled={isSubmitting}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>🤖 AI-Powered:</strong> Each item will be automatically analyzed using AI to enable smart semantic search capabilities.
        </p>
      </div>
    </div>
  );
};

export default ItemForm;
