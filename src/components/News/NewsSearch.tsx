import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

interface NewsSearchProps {
  onSearch: (value: string) => void;
}

const NewsSearch: React.FC<NewsSearchProps> = ({ onSearch }) => {
  return (
    <Search
      placeholder="Tìm kiếm tin tức..."
      allowClear
      enterButton="Tìm kiếm"
      size="large"
      onSearch={onSearch}
    />
  );
};

export default NewsSearch; 