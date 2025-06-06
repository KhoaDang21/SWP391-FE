import React, { useState } from 'react';
import { Card, Table, Select, DatePicker, Row, Col, Divider } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

interface EventData {
    key: string;
    event: string;
    date: string;
    student: string;
    status: string;
}

const initialData: EventData[] = [
    { key: '1', event: 'Sốt', date: '10/05/2025', student: 'Nguyễn Văn A', status: 'Đã xử lý' },
    { key: '2', event: 'Chấn thương', date: '12/04/2025', student: 'Trần Thị B', status: 'Đang theo dõi' },
    { key: '3', event: 'Buồn nôn', date: '15/05/2025', student: 'Lê Minh C', status: 'Đang theo dõi' },
];

const statusColorMap: Record<string, string> = {
    'Đã xử lý': '#52c41a',
    'Đang theo dõi': '#faad14',
};

const columns = [
    {
        title: '📝 Sự kiện',
        dataIndex: 'event',
        key: 'event',
        render: (text: string) => (
            <span className="font-medium text-gray-800">{text}</span>
        ),
    },
    {
        title: '📅 Ngày',
        dataIndex: 'date',
        key: 'date',
        render: (text: string) => (
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-lg text-blue-700 font-medium shadow-sm">
                <CalendarOutlined />
                {text}
            </div>
        ),
    },
    {
        title: '👩‍🎓 Học sinh',
        dataIndex: 'student',
        key: 'student',
        render: (text: string) => <span className="text-gray-700">{text}</span>
    },
    {
        title: '📌 Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <span style={{ color: statusColorMap[status], fontWeight: 600 }}>
                {status}
            </span>
        ),
    },
];

const HealthEvents: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

    const filteredData = initialData.filter(item => {
        // Lọc theo trạng thái
        const statusMatch = statusFilter === 'Tất cả' || item.status === statusFilter;
        // Lọc theo ngày
        const itemDate = dayjs(item.date, 'DD/MM/YYYY');
        let dateMatch = true;
        if (startDate && endDate) {
            dateMatch = itemDate.isSame(startDate, 'day') || itemDate.isSame(endDate, 'day') ||
                (itemDate.isAfter(startDate, 'day') && itemDate.isBefore(endDate, 'day'));
        } else if (startDate) {
            dateMatch = itemDate.isSame(startDate, 'day') || itemDate.isAfter(startDate, 'day');
        } else if (endDate) {
            dateMatch = itemDate.isSame(endDate, 'day') || itemDate.isBefore(endDate, 'day');
        }
        return statusMatch && dateMatch;
    });

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen flex justify-center">
            <div className="w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">
                    Báo cáo sự kiện y tế
                </h1>

                <Card className="mb-6 shadow-xl rounded-2xl">
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col xs={24} md={6}>
                            <label className="block font-medium mb-1">Lọc theo trạng thái</label>
                            <Select
                                value={statusFilter}
                                onChange={value => setStatusFilter(value)}
                                className="w-full"
                            >
                                <Option value="Tất cả">Tất cả</Option>
                                <Option value="Đã xử lý">Đã xử lý</Option>
                                <Option value="Đang theo dõi">Đang theo dõi</Option>
                            </Select>
                        </Col>
                        <Col xs={12} md={9}>
                            <label className="block font-medium mb-1">Ngày bắt đầu</label>
                            <DatePicker
                                format="DD/MM/YYYY"
                                value={startDate}
                                onChange={date => setStartDate(date)}
                                className="w-full"
                                allowClear
                            />
                        </Col>
                        <Col xs={12} md={9}>
                            <label className="block font-medium mb-1">Ngày kết thúc</label>
                            <DatePicker
                                format="DD/MM/YYYY"
                                value={endDate}
                                onChange={date => setEndDate(date)}
                                className="w-full"
                                allowClear
                            />
                        </Col>
                    </Row>

                    <Divider />

                    <div className="mb-4 text-right text-sm text-gray-500">
                        Tổng số sự kiện: <span className="font-semibold text-blue-600">{filteredData.length}</span>
                    </div>

                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        pagination={{ pageSize: 5 }}
                        bordered
                        className="rounded-lg"
                        rowKey="key"
                    />
                </Card>
            </div>
        </div>
    );
};

export default HealthEvents;
