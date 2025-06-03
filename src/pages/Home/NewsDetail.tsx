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
              <time>{blog.createdAt}</time>
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
            <div className="w-full h-[400px] overflow-hidden rounded-lg shadow-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  backgroundColor: '#f0f0f0'
                }}
              />
            </div>
            <figcaption className="mt-2 text-sm text-gray-600 text-center">
              Hình ảnh minh họa cho bài viết
            </figcaption>
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