import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { getBlogById, Blog } from '../../services/BlogService';
import { Spin, message } from 'antd';

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const blogId = parseInt(slug);
        const data = await getBlogById(blogId);
        setBlog(data);
      } catch (err: any) {
        message.error(err.message || 'Lỗi tải tin tức');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy tin tức</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title Section */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center text-gray-600 space-x-6">
            <div className="flex items-center">
              <CalendarOutlined className="mr-2" />
              <time>{blog.createdAt ? formatDate(blog.createdAt) : ''}</time>
            </div>
            <div className="flex items-center">
              <UserOutlined className="mr-2" />
              <span>{blog.author}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.image && (
          <figure className="mb-10">
            <div className="w-full max-h-[600px] overflow-hidden rounded-lg shadow-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto object-contain"
                style={{
                  maxHeight: '600px',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>
          </figure>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-xl text-gray-700 mb-8 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail; 