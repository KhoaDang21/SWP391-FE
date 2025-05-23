import React, { useState } from 'react';
import { Pagination } from 'antd';
import NewsCard from './NewsCard';
import { NewsData } from '../../data/NewsData';

const NewsCardsContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; 

 
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
 
  const currentNews = NewsData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentNews.map((news) => (
          <NewsCard 
            key={news.id}
            title={news.title}
            description={news.description}
            image={news.image}
            date={news.date}
            author="Admin"
            slug={news.slug}
          />
        ))}
      </div>
      

      <div className="flex justify-center">
        <Pagination
          current={currentPage}
          total={NewsData.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default NewsCardsContainer;