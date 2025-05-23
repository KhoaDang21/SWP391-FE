import React from 'react';
import HeroNews from '../../components/News/HeroNews';
import NewsSearchContainer from '../../components/News/NewsSearchContainer';
import NewsCardsContainer from '../../components/News/NewsCardsContainer';

const News: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroNews />
      
      {/* Search Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <NewsSearchContainer />
        </div>
      </section>
      
      {/* News Cards Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <NewsCardsContainer />
        </div>
      </section>
    </div>
  );
};

export default News;