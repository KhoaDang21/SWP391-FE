import React from 'react';
import { Card, Table, Input } from 'antd';

const { Search } = Input;

const dataSource = [
    { key: '1', name: 'Nguyễn Văn A', class: '1A', status: 'Đã tiêm', date: '01/05/2025' },
    { key: '3', name: 'Lê Hoàng C', class: '1C', status: 'Đã tiêm', date: '03/01/2025' },
    { key: '4', name: 'Phạm Thị D', class: '1A', status: 'Chưa tiêm', date: '-' },
    { key: '5', name: 'Võ Minh E', class: '1D', status: 'Đã tiêm', date: '04/02/2025' },
    { key: '6', name: 'Đặng Tuyết F', class: '1B', status: 'Chưa tiêm', date: '-' },
    { key: '7', name: 'Ngô Văn G', class: '1C', status: 'Đã tiêm', date: '05/03/2025' },
];

const columns = [
    {
        title: 'Họ tên',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
        title: 'Lớp',
        dataIndex: 'class',
        key: 'class',
        render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            const colorMap: Record<string, string> = {
                'Đã tiêm': '#52c41a',
                'Chưa tiêm': '#faad14',
            };
            return (
                <span style={{ color: colorMap[status], fontWeight: 600 }}>{status}</span>
            );
        },
    },
    {
        title: 'Ngày tiêm',
        dataIndex: 'date',
        key: 'date',
        render: (text: string) => <span className="text-gray-500">{text}</span>,
    },
];

const VaccinationReports: React.FC = () => {
    return (
        <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-[calc(100vh-64px)]">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
                Báo cáo kiểm tra & tiêm chủng
            </h1>

            <Card className="shadow-lg rounded-xl">
                <div className="mb-4">
                    <Search
                        placeholder="Tìm kiếm theo họ tên..."
                        allowClear
                        enterButton
                        size="middle"
                        onSearch={(value) => console.log(value)}
                    />
                </div>

                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    className="rounded-lg border border-gray-200 hover:shadow transition"
                />
            </Card>
        </div>
    );
};

export default VaccinationReports;
