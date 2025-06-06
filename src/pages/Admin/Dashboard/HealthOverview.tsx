import React from 'react';
import { Card, Col, Row, Statistic, Table } from 'antd';
import {
    UserOutlined,
    SmileTwoTone,
    HeartTwoTone,
    FrownTwoTone,
} from '@ant-design/icons';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const HealthOverview: React.FC = () => {
    const total = 1200;
    const healthy = 1100;
    const followUp = 80;
    const injured = 20;

    const healthData = [
        { name: 'Sức khỏe tốt', value: healthy },
        { name: 'Cần theo dõi', value: followUp },
        { name: 'Bệnh/chấn thương', value: injured },
    ];

    const COLORS = ['#52c41a', '#1890ff', '#faad14'];

    const recentCases = [
        { key: '1', name: 'Nguyễn Văn A', class: '10A1', issue: 'Đau đầu', status: 'Cần theo dõi' },
        { key: '2', name: 'Trần Thị B', class: '11B2', issue: 'Gãy tay', status: 'Bệnh/chấn thương' },
        { key: '3', name: 'Lê Văn C', class: '12C3', issue: 'Ổn định', status: 'Sức khỏe tốt' },
    ];

    const columns = [
        { title: 'Họ tên', dataIndex: 'name', key: 'name' },
        { title: 'Lớp', dataIndex: 'class', key: 'class' },
        { title: 'Tình trạng', dataIndex: 'issue', key: 'issue' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => {
                const colorMap: any = {
                    'Sức khỏe tốt': '#52c41a',
                    'Cần theo dõi': '#faad14',
                    'Bệnh/chấn thương': '#ff4d4f',
                };
                return <span style={{ color: colorMap[text], fontWeight: 600 }}>{text}</span>;
            },
        },
    ];

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-[calc(100vh-64px)]">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
                Tình hình Y tế học đường
            </h1>

            <Row gutter={[24, 24]} justify="center">
                {[
                    {
                        title: 'Tổng số học sinh',
                        value: total,
                        icon: <UserOutlined style={{ color: '#2563eb', fontSize: 28 }} />,
                        color: '#2563eb',
                    },
                    {
                        title: 'Sức khỏe tốt',
                        value: healthy,
                        icon: <SmileTwoTone twoToneColor="#52c41a" style={{ fontSize: 28 }} />,
                        color: '#52c41a',
                    },
                    {
                        title: 'Cần theo dõi',
                        value: followUp,
                        icon: <HeartTwoTone twoToneColor="#1890ff" style={{ fontSize: 28 }} />,
                        color: '#1890ff',
                    },
                    {
                        title: 'Bệnh/chấn thương',
                        value: injured,
                        icon: <FrownTwoTone twoToneColor="#faad14" style={{ fontSize: 28 }} />,
                        color: '#faad14',
                    },
                ].map((item, idx) => (
                    <Col xs={24} sm={12} md={6} key={idx}>
                        <Card
                            hoverable
                            className="text-center shadow-md rounded-xl h-full"
                            bodyStyle={{ height: '100%' }}
                        >
                            <Statistic
                                title={<span className="text-gray-500">{item.title}</span>}
                                value={item.value}
                                prefix={item.icon}
                                valueStyle={{ color: item.color, fontWeight: 700, fontSize: 28 }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Phân bổ và bảng */}
            <Row gutter={[24, 24]} className="mt-10" justify="center">
                {/* Biểu đồ phân bổ sức khỏe */}
                <Col xs={24}>
                    <Card title="Phân bổ sức khỏe" className="rounded-xl shadow-md">
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={healthData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        dataKey="value"
                                    >
                                        {healthData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                {/* Bảng các trường hợp gần đây */}
                <Col xs={24}>
                    <Card title="Các trường hợp gần đây" className="rounded-xl shadow-md">
                        <Table
                            columns={columns}
                            dataSource={recentCases}
                            pagination={false}
                            size="middle"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HealthOverview;
