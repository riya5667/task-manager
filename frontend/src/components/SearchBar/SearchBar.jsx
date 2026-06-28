import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition text-sm"
      />
    </div>
  );
};

export default SearchBar;
