import React, { useState } from 'react';
import {
    Layout,
    Card,
    Button,
    Avatar,
    Row,
    Col,
    Statistic,
    Badge,
    List,
    Progress,
    Tag,
    Space,
    Typography,
    Divider,
    Alert,
    Timeline,
    notification,
    Tabs,
    Table,
    Modal
} from 'antd';
import {
    UserOutlined,
    BellOutlined,
    BookOutlined,
    TrophyOutlined,
    CalendarOutlined,
    MessageOutlined,
    DollarOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    MedicineBoxOutlined,
    HeartOutlined,
    EyeOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Child {
    id: number;
    name: string;
    class: string;
    avatar?: string;
    healthStatus: 'good' | 'warning' | 'attention';
    lastCheckup: string;
    vaccinations: number;
    totalVaccinations: number;
}

interface HealthRecord {
    id: number;
    date: string;
    type: string;
    result: string;
    status: 'normal' | 'abnormal' | 'follow-up';
    doctor: string;
}

interface Notification {
    id: number;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'error';
    date: string;
    isRead: boolean;
}

// Mock thông báo
const notifications: Notification[] = [
    {
        id: 1,
        title: "Nhắc nhở tiêm chủng mũi 1",
        content: "Hãy đưa bé đến trung tâm y tế để tiêm mũi 1 vào ngày mai.",
        type: 'warning',
        date: '2024-04-20',
        isRead: false
    },
    {
        id: 2,
        title: "Kết quả khám sức khỏe",
        content: "Kết quả khám sức khỏe của con bạn đã có. Vui lòng xem chi tiết.",
        type: 'success',
        date: '2024-04-18',
        isRead: true
    },
    {
        id: 3,
        title: "Tiêm chủng sắp tới",
        content: "Con bạn cần tiêm vaccine sởi vào tháng 5/2024",
        type: 'info',
        date: '2024-04-15',
        isRead: false
    }
];

const Parent: React.FC = () => {
    const [selectedChild, setSelectedChild] = useState<number>(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [noti, setNoti] = useState<Notification[]>(notifications);

    // Mock data cho con em
    const children: Child[] = [
        {
            id: 1,
            name: "Nguyễn Minh An",
            class: "10A1",
            healthStatus: 'good',
            lastCheckup: '2024-03-15',
            vaccinations: 12,
            totalVaccinations: 14
        },
        {
            id: 2,
            name: "Nguyễn Minh Châu",
            class: "7B2",
            healthStatus: 'warning',
            lastCheckup: '2024-02-20',
            vaccinations: 10,
            totalVaccinations: 12
        }
    ];

    // Mock data hồ sơ sức khỏe
    const healthRecords: HealthRecord[] = [
        {
            id: 1,
            date: '2024-03-15',
            type: 'Khám tổng quát',
            result: 'Sức khỏe tốt',
            status: 'normal',
            doctor: 'BS. Nguyễn Văn A'
        },
        {
            id: 2,
            date: '2024-03-10',
            type: 'Khám mắt',
            result: 'Cận thị nhẹ',
            status: 'follow-up',
            doctor: 'BS. Trần Thị B'
        },
        {
            id: 3,
            date: '2024-02-28',
            type: 'Tiêm chủng',
            result: 'Hoàn thành',
            status: 'normal',
            doctor: 'Y tá Lê Văn C'
        }
    ];


    const currentChild = children.find(child => child.id === selectedChild) || children[0];

    const handleViewHealthRecord = () => {
        setModalVisible(true);
    };

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case 'good': return '#52c41a';
            case 'warning': return '#faad14';
            case 'attention': return '#ff4d4f';
            default: return '#d9d9d9';
        }
    };

    const getHealthStatusText = (status: string) => {
        switch (status) {
            case 'good': return 'Tốt';
            case 'warning': return 'Cần chú ý';
            case 'attention': return 'Cần khám';
            default: return 'Chưa rõ';
        }
    };

    const healthRecordColumns = [
        {
            title: 'Ngày khám',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Loại khám',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Kết quả',
            dataIndex: 'result',
            key: 'result',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const color = status === 'normal' ? 'green' : status === 'follow-up' ? 'orange' : 'red';
                const text = status === 'normal' ? 'Bình thường' : status === 'follow-up' ? 'Theo dõi' : 'Bất thường';
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Bác sĩ',
            dataIndex: 'doctor',
            key: 'doctor',
        },
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Content>
                {/* Header với thông tin phụ huynh */}
                <Card style={{ marginBottom: '24px' }}>
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Space size="large">
                                <Avatar size={64} icon={<UserOutlined />} />
                                <div>
                                    <Title level={3} style={{ margin: 0 }}>Chào mừng, Phụ huynh!</Title>
                                    <Text type="secondary">Theo dõi sức khỏe con em một cách toàn diện</Text>
                                </div>
                            </Space>
                        </Col>
                        {/* <Col>
                            <Space>
                                <Badge count={3}>
                                    <Button icon={<BellOutlined />} size="large">
                                        Thông báo
                                    </Button>
                                </Badge>
                                <Button type="primary" icon={<MessageOutlined />} size="large">
                                    Liên hệ bác sĩ
                                </Button>
                            </Space>
                        </Col> */}
                    </Row>
                </Card>

                {/* Chọn con */}
                <Card title="Chọn con em" style={{ marginBottom: '24px' }}>
                    <Row gutter={16}>
                        {children.map(child => (
                            <Col key={child.id} xs={12} sm={8} md={6}>
                                <Card
                                    hoverable
                                    onClick={() => setSelectedChild(child.id)}
                                    style={{
                                        border: selectedChild === child.id ? '2px solid #1677ff' : '1px solid #d9d9d9'
                                    }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <Avatar size={48} icon={<UserOutlined />} />
                                        <div style={{ marginTop: '8px' }}>
                                            <Text strong>{child.name}</Text>
                                            <br />
                                            <Text type="secondary">{child.class}</Text>
                                            <br />
                                            <Tag
                                                color={getHealthStatusColor(child.healthStatus)}
                                                style={{ marginTop: '4px' }}
                                            >
                                                {getHealthStatusText(child.healthStatus)}
                                            </Tag>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>

                <Row gutter={24}>
                    {/* Cột trái - Thông tin tổng quan */}
                    <Col xs={24} lg={16}>
                        {/* Tình trạng sức khỏe tổng quan */}
                        <Card title={`Tình trạng sức khỏe - ${currentChild.name}`} style={{ marginBottom: '24px' }}>
                            <Row gutter={16}>
                                <Col xs={12} sm={6}>
                                    <Statistic
                                        title="Tình trạng"
                                        value={getHealthStatusText(currentChild.healthStatus)}
                                        valueStyle={{ color: getHealthStatusColor(currentChild.healthStatus) }}
                                        prefix={<HeartOutlined />}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Statistic
                                        title="Lần khám cuối"
                                        value={currentChild.lastCheckup}
                                        prefix={<CalendarOutlined />}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div>
                                        <Text type="secondary">Tiêm chủng</Text>
                                        <br />
                                        <Progress
                                            percent={Math.round((currentChild.vaccinations / currentChild.totalVaccinations) * 100)}
                                            format={() => `${currentChild.vaccinations}/${currentChild.totalVaccinations}`}
                                        />
                                    </div>
                                </Col>
                                <Col >
                                    <Space >
                                        {/* <Button type="primary" icon={<CalendarOutlined />} block onClick={handleScheduleCheckup}>
                                            Đặt lịch khám
                                        </Button> */}
                                        <Button className='mt-3' icon={<EyeOutlined />} onClick={handleViewHealthRecord}>
                                            Xem hồ sơ
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>

                        {/* Lịch sử khám gần đây */}
                        <Card title="Lịch sử khám gần đây" style={{ marginBottom: '24px' }}>
                            <Timeline>
                                {healthRecords.slice(0, 3).map(record => (
                                    <Timeline.Item
                                        key={record.id}
                                        color={record.status === 'normal' ? 'green' : record.status === 'follow-up' ? 'orange' : 'red'}
                                        dot={<MedicineBoxOutlined />}
                                    >
                                        <div>
                                            <Text strong>{record.type}</Text>
                                            <br />
                                            <Text>{record.result}</Text>
                                            <br />
                                            <Text type="secondary">{record.date} - {record.doctor}</Text>
                                        </div>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                            <Button type="link" onClick={handleViewHealthRecord}>
                                Xem tất cả →
                            </Button>
                        </Card>

                        {/* Khuyến nghị sức khỏe */}
                        {/* <Card title="Khuyến nghị sức khỏe">
                            <List
                                dataSource={[
                                    {
                                        title: "Khám mắt định kỳ",
                                        description: "Nên khám mắt 6 tháng/lần để phát hiện sớm các vấn đề về thị lực",
                                        icon: <EyeOutlined />,
                                        type: "info"
                                    },
                                    {
                                        title: "Tiêm vaccine HPV",
                                        description: "Đã đến lúc tiêm vaccine HPV cho trẻ. Vui lòng đặt lịch sớm.",
                                        icon: <MedicineBoxOutlined />,
                                        type: "warning"
                                    },
                                    {
                                        title: "Chế độ dinh dưỡng",
                                        description: "Bổ sung vitamin D và canxi cho sự phát triển của trẻ",
                                        icon: <HeartOutlined />,
                                        type: "success"
                                    }
                                ]}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={item.icon} style={{
                                                backgroundColor: item.type === 'warning' ? '#faad14' :
                                                    item.type === 'success' ? '#52c41a' : '#1677ff'
                                            }} />}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card> */}
                    </Col>

                    {/* Cột phải - Thông báo và tiện ích */}
                    <Col xs={24} lg={8}>
                        {/* Thông báo */}
                        <Card title="Thông báo mới" style={{ marginBottom: '24px' }}>
                            <List
                                dataSource={noti}
                                renderItem={(item) => (
                                    <List.Item
                                        onClick={() => {
                                            setNoti((prev) =>
                                                prev.map((n) =>
                                                    n.id === item.id ? { ...n, isRead: true } : n
                                                )
                                            );
                                        }}
                                        style={{
                                            backgroundColor: !item.isRead ? '#f6ffed' : 'transparent',
                                            padding: '12px',
                                            borderRadius: '6px',
                                            marginBottom: '8px'

                                        }}>
                                        <List.Item.Meta
                                            avatar={
                                                <Badge dot={!item.isRead}>
                                                    <Avatar
                                                        icon={<BellOutlined />}
                                                        style={{
                                                            backgroundColor: item.type === 'warning' ? '#faad14' :
                                                                item.type === 'success' ? '#52c41a' :
                                                                    item.type === 'error' ? '#ff4d4f' : '#1677ff'
                                                        }}
                                                    />
                                                </Badge>
                                            }
                                            title={<Text strong={!item.isRead}>{item.title}</Text>}
                                            description={
                                                <div>
                                                    <Paragraph ellipsis={{ rows: 2 }}>{item.content}</Paragraph>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>{item.date}</Text>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                            <Button type="link" block>Xem tất cả thông báo</Button>
                        </Card>

                        {/* Liên hệ nhanh */}
                        {/* <Card title="Liên hệ nhanh">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button icon={<MessageOutlined />} block onClick={handleContactDoctor}>
                                    Chat với bác sĩ
                                </Button>
                                <Button icon={<CalendarOutlined />} block>
                                    Đặt lịch hẹn
                                </Button>
                                <Button icon={<FileTextOutlined />} block>
                                    Tải báo cáo sức khỏe
                                </Button>
                                <Divider />
                                <div style={{ textAlign: 'center' }}>
                                    <Text type="secondary">Hotline hỗ trợ</Text>
                                    <br />
                                    <Text strong style={{ fontSize: '16px', color: '#1677ff' }}>
                                        1900-1234
                                    </Text>
                                </div>
                            </Space>
                        </Card> */}
                    </Col>
                </Row>

                {/* Modal xem hồ sơ sức khỏe */}
                <Modal
                    title={`Hồ sơ sức khỏe - ${currentChild.name}`}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width={800}
                >
                    <Table
                        dataSource={healthRecords}
                        columns={healthRecordColumns}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
                </Modal>
            </Content>
        </div>
    );
};

export default Parent;