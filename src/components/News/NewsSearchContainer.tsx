import React from 'react';
import NewsSearch from './NewsSearch';
import NewsFilter from './NewsFilter';

const NewsSearchContainer: React.FC = () => {
  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  const handleFilterChange = (value: string) => {
    console.log('Filter:', value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <NewsSearch onSearch={handleSearch} />
        </div>
        <NewsFilter onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
};

export default NewsSearchContainer; 