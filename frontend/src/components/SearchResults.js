import React from 'react';

const SearchResults = ({ results, query }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search terms or add more items to the inventory.
        </p>
      </div>
    );
  }

  const getSimilarityColor = (similarity) => {
    if (similarity >= 0.8) return 'bg-green-100 text-green-800';
    if (similarity >= 0.6) return 'bg-yellow-100 text-yellow-800';
    if (similarity >= 0.4) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatSimilarity = (similarity) => {
    return `${Math.round(similarity * 100)}%`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Search Results {query && <span className="font-normal text-gray-600">for "{query}"</span>}
        </h2>
        <span className="text-sm text-gray-500">
          {results.length} {results.length === 1 ? 'item' : 'items'} found
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <div key={item._id} className="item-card animate-fade-in">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              <span className={`similarity-badge ${getSimilarityColor(item.similarity)}`}>
                {formatSimilarity(item.similarity)}
              </span>
            </div>
            
            <p className="text-gray-600 mb-3">{item.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {item.category}
              </span>
              <span className="text-xs text-gray-500">
                Added {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
