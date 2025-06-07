import React, { useState } from 'react';
import { Card, Table, Input, Tag, Select } from 'antd';

const { Search } = Input;
const { Option } = Select;

const originalData = [
    { key: '1', name: 'Nguyễn Văn A', class: '1A', health: 'Tốt' },
    { key: '2', name: 'Trần Thị B', class: '1B', health: 'Cần theo dõi' },
    { key: '3', name: 'Lê Hoàng C', class: '1C', health: 'Tốt' },
    { key: '4', name: 'Phạm Thị D', class: '1A', health: 'Cần theo dõi' },
    { key: '5', name: 'Võ Minh E', class: '1D', health: 'Tốt' },
    { key: '6', name: 'Đặng Tuyết F', class: '1B', health: 'Cần theo dõi' },
    { key: '7', name: 'Ngô Văn G', class: '1C', health: 'Tốt' },
    { key: '8', name: 'Bùi Hồng H', class: '1D', health: 'Tốt' },
];

const HealthRecords: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [filterHealth, setFilterHealth] = useState<string | null>(null);

    const filteredData = originalData.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesHealth = filterHealth ? item.health === filterHealth : true;
        return matchesSearch && matchesHealth;
    });

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Lớp',
            dataIndex: 'class',
            key: 'class',
        },
        {
            title: 'Tình trạng sức khỏe',
            dataIndex: 'health',
            key: 'health',
            render: (health: string) => (
                <Tag color={health === 'Tốt' ? 'green' : 'orange'}>
                    {health}
                </Tag>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-[calc(100vh-64px)]">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
                Hồ sơ y tế học sinh
            </h1>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <Search
                    placeholder="Tìm theo họ tên"
                    allowClear
                    onChange={(e) => setSearchText(e.target.value)}
                    className="max-w-xs"
                />
                <Select
                    allowClear
                    placeholder="Lọc theo tình trạng"
                    onChange={(value) => setFilterHealth(value)}
                    className="w-48"
                >
                    <Option value="Tốt">Tốt</Option>
                    <Option value="Cần theo dõi">Cần theo dõi</Option>
                </Select>
            </div>

            <Card className="shadow-md rounded-xl">
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                    className="bg-white rounded-lg"
                />
            </Card>
        </div>
    );
};

export default HealthRecords;
