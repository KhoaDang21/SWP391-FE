import React, { useEffect, useState } from 'react';
import { Card, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCategoryById, Category } from '../../services/CategoryService';

interface NewsCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  slug: string;
  Category_id: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  title, 
  description, 
  image, 
  date, 
  author, 
  slug,
  Category_id 
}) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(Category_id);
        setCategory(data);
      } catch (err) {
        console.error('Error fetching category:', err);
      }
    };

    if (Category_id) {
      fetchCategory();
    }
  }, [Category_id]);

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
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold line-clamp-2 flex-1 mr-2">{title}</h3>
          {category && (
            <Tag color="blue" className="whitespace-nowrap">
              {category.Name}
            </Tag>
          )}
        </div>
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
