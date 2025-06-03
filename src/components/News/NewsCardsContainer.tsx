import React, { useState, useEffect } from 'react';
import { Pagination, Spin, message } from 'antd';
import NewsCard from './NewsCard';
import { getAllBlogs, Blog } from '../../services/BlogService';

const NewsCardsContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (err: any) {
        message.error(err.message || 'Lỗi tải danh sách tin tức');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBlogs.map((blog) => (
          <NewsCard
            key={blog.id}
            title={blog.title}
            description={blog.content}
            image={blog.image || ''}
            date={blog.createdAt || ''}
            author={blog.author}
            slug={`${blog.id}`}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Pagination
          current={currentPage}
          total={blogs.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default NewsCardsContainer;