import React from 'react';
import { Select } from 'antd';

interface NewsFilterProps {
  onFilterChange: (value: string) => void;
}

const NewsFilter: React.FC<NewsFilterProps> = ({ onFilterChange }) => {
  return (
    <Select
      defaultValue="all"
      size="large"
      style={{ width: 200 }}
      onChange={onFilterChange}
      options={[
        { value: 'all', label: 'Tất cả' },
        { value: 'health', label: 'Sức khỏe' },
        { value: 'policy', label: 'Chính sách' },
        { value: 'activity', label: 'Hoạt động' },
      ]}
    />
  );
};

export default NewsFilter; 