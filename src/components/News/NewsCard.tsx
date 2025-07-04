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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Card
      hoverable
      className="w-full shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
      cover={
        <div className="relative w-full pt-[56.25%]">
          <img
            alt={title}
            src={image}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      }
      bodyStyle={{ padding: '12px 16px' }}
    >
      <div className="flex flex-col flex-1">
        <div className="flex-none h-[30px]">
          <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
        </div>
        <div className="flex-none  my-2">
          {category && (
            <div className=" border-gray-100">
              <Tag color="blue" className=" text-center">
                {category.Name}
              </Tag>
            </div>
          )}
        </div>
        <div className="flex-none h-[72px] my-2">
          <div
            className="text-gray-600 text-sm line-clamp-3"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{formatDate(date)}</span>
          </div>

        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
