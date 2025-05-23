import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const HeroNews: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] bg-blue-600">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-90"></div>
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <Title level={1} className="text-white mb-4">
          Tin tức Y tế Học đường
        </Title>
        <p className="text-white text-lg max-w-2xl">
          Cập nhật những thông tin mới nhất về sức khỏe học đường, chính sách y tế và các hoạt động chăm sóc sức khỏe cho học sinh
        </p>
      </div>
    </div>
  );
};

export default HeroNews; 