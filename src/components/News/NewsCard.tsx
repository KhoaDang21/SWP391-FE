import React from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

interface NewsCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  slug: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, description, image, date, author, slug }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tintuc/${slug}`);
  };

  return (
    <Card
      hoverable
      className="w-full shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
      cover={
        <div
          className="w-full overflow-hidden"
          style={{
            position: 'relative',
            aspectRatio: '710 / 474', 
            backgroundColor: '#f0f0f0',
          }}
        >
          <img
            alt={title}
            src={image}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain', 
              objectPosition: 'center',
            }}
          />
        </div>
      }
    >
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{date}</span>
          <span>{author}</span>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
