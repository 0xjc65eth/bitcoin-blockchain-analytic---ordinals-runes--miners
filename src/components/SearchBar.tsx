import React, { useState } from 'react';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <input
        type="text"
        placeholder="Search Ordinals, Runes, or Trends..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 bg-[#2D2D2D] text-white border border-white rounded-lg focus:border-[#00A3FF] focus:outline-none font-inter"
      />
    </div>
  );
};

export default SearchBar; 