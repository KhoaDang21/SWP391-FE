import React, { ReactElement, useState } from 'react';
import {
    Button,
    Table,
    Modal,
    Form,
    Input,
    Upload,
    Space,
    Card,
    Tag,
    DatePicker,
    TimePicker,
    Row,
    Col,
    Typography,
    Divider,
    message,
    Image,
    Tooltip,
    Select
} from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    UploadOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Interface cho dữ liệu gửi thuốc
interface MedicationDelivery {
    id: string;
    patientName: string;
    patientPhone: string;
    class: string;
    prescriptionImage: string;
    medications: string;
    deliveryTime: string;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    createdAt: string;
    notes?: string;
    deliveryFee: number;
}

type StatusType = 'pending' | 'processing' | 'delivered' | 'cancelled';

const statusConfig: Record<StatusType, {
    color: string;
    icon: ReactElement;
    text: string;
}> = {
    pending: { color: 'orange', icon: <ExclamationCircleOutlined />, text: 'Chờ xử lý' },
    processing: { color: 'blue', icon: <SyncOutlined />, text: 'Đang giao' },
    delivered: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã giao' },
    cancelled: { color: 'red', icon: <ExclamationCircleOutlined />, text: 'Đã hủy' }
};

const students = [
    { id: '1', name: 'Nguyễn Văn A', className: '4A3', phone: '0901234567' },
    { id: '2', name: 'Trần Thị B', className: '2A5', phone: '0907654321' },
];


const SendMedication: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MedicationDelivery | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Mock data - trong thực tế sẽ lấy từ API
    const [deliveries, setDeliveries] = useState<MedicationDelivery[]>([
        {
            id: '1',
            patientName: 'Nguyễn Văn A',
            patientPhone: '0901234567',
            class: '4A3',
            prescriptionImage: 'https://via.placeholder.com/400x300',
            medications: 'Paracetamol 500mg x2 viên, Amoxicillin 250mg x3 viên',
            deliveryTime: '14:30',
            status: 'delivered',
            createdAt: dayjs().format('DD/MM/YYYY HH:mm'),
            notes: 'Giao hàng thành công',
            deliveryFee: 25000
        },
        {
            id: '2',
            patientName: 'Trần Thị B',
            patientPhone: '0907654321',
            class: '2A5',
            prescriptionImage: 'https://via.placeholder.com/400x300',
            medications: 'Vitamin C x1 lọ, Cảm cúm 999 x2 gói',
            deliveryTime: '16:00',
            status: 'processing',
            createdAt: dayjs().subtract(1, 'hour').format('DD/MM/YYYY HH:mm'),
            deliveryFee: 30000
        }
    ]);

    // Cấu hình upload
    const uploadProps: UploadProps = {
        name: 'prescription',
        listType: 'picture-card',
        maxCount: 1,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Chỉ có thể upload file JPG/PNG!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Hình ảnh phải nhỏ hơn 2MB!');
            }
            return false; // Prevent auto upload
        },
    };

    // Xử lý tạo đơn thuốc mới
    const handleCreateDelivery = async (values: any) => {
        setLoading(true);
        try {
            const newDelivery: MedicationDelivery = {
                id: Date.now().toString(),
                patientName: values.patientName,
                patientPhone: values.patientPhone,
                class: values.patientAddress,
                prescriptionImage: 'https://via.placeholder.com/400x300', // Mock URL
                medications: values.medications,
                deliveryTime: values.deliveryTime.format('HH:mm'),
                status: 'pending',
                createdAt: dayjs().format('DD/MM/YYYY HH:mm'),
                notes: values.notes,
                deliveryFee: values.deliveryFee
            };

            setDeliveries([newDelivery, ...deliveries]);
            message.success('Tạo đơn gửi thuốc thành công!');
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    // Xem chi tiết đơn thuốc
    const handleViewDelivery = (record: MedicationDelivery) => {
        setSelectedRecord(record);
        setViewModalVisible(true);
    };

    // Cấu hình cột bảng
    const columns: ColumnsType<MedicationDelivery> = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            // width: 80,
            render: (id) => <Text code>#{id}</Text>
        },
        {
            title: 'Học sinh',
            dataIndex: 'patientName',
            key: 'patientName',
            render: (name, record) => (
                <div>
                    <Text strong>{name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.patientPhone}
                    </Text>
                </div>
            )
        },
        {
            title: 'Lớp',
            dataIndex: 'class',
            key: 'class',
            ellipsis: true,
            // width: 200
        },
        {
            title: 'Số điện thoại phụ huynh',
            dataIndex: 'patientPhone',
            key: 'patientPhone',
            // width: 120,
        },
        {
            title: 'Thời gian uống thuốc',
            dataIndex: 'deliveryTime',
            key: 'deliveryTime',
            // width: 120,
            render: (time) => <Text>{dayjs(time, 'HH:mm').format('HH:mm')}</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: StatusType) => {
                const config = statusConfig[status];
                return (
                    <Tag color={config.color} icon={config.icon}>
                        {config.text}
                    </Tag>
                );
            }
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            // width: 130
        },
        {
            title: 'Thao tác',
            key: 'actions',
            // width: 100,
            render: (_, record) => (
                <Tooltip title="Xem chi tiết">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDelivery(record)}
                    />
                </Tooltip>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <Card>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                            <FileTextOutlined /> Quản lý gửi thuốc
                        </Title>
                        <Text type="secondary">
                            Theo dõi các toa thuốc đã gửi và trạng thái đơn thuốc
                        </Text>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Tạo đơn gửi thuốc
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Bảng danh sách */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={deliveries}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} đơn`
                    }}
                />
            </Card>

            {/* Modal tạo đơn mới */}
            <Modal
                title={
                    <Space>
                        <PlusOutlined />
                        Tạo đơn gửi thuốc mới
                    </Space>
                }
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateDelivery}
                    initialValues={{
                        deliveryTime: dayjs(),
                        deliveryFee: 25000
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Học sinh" name="studentId" rules={[{ required: true, message: 'Vui lòng chọn học sinh' }]}>
                                <Select placeholder="Chọn học sinh">
                                    {students.map((student) => (
                                        <Select.Option key={student.id} value={student.id}>
                                            {student.name} ({student.className})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại phụ huynh"
                                name="patientPhone"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Thời gian uống thuốc"
                        name="deliveryTime"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                    >
                        <TimePicker
                            format="HH:mm"
                            placeholder="Chọn giờ uống"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Danh sách thuốc"
                        name="medications"
                        rules={[{ required: true, message: 'Vui lòng nhập danh sách thuốc!' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Nhập danh sách thuốc (VD: Paracetamol 500mg x2 viên, Amoxicillin 250mg x3 viên)"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh toa thuốc"
                        name="prescriptionImage"
                        rules={[{ required: true, message: 'Vui lòng upload hình ảnh toa thuốc!' }]}
                    >
                        <Upload {...uploadProps}>
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload toa thuốc</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Ghi chú"
                        name="notes"
                    >
                        <TextArea rows={2} placeholder="Ghi chú thêm (tùy chọn)" />
                    </Form.Item>

                    <Divider />

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Tạo đơn gửi thuốc
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xem chi tiết */}
            <Modal
                title={
                    <Space>
                        <EyeOutlined />
                        Chi tiết đơn gửi thuốc #{selectedRecord?.id}
                    </Space>
                }
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={
                    <Button type="primary" onClick={() => setViewModalVisible(false)}>
                        Đóng
                    </Button>
                }
                width={700}
            >
                {selectedRecord && (
                    <div>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size="small" title="Thông tin bệnh nhân">
                                    <p><strong>Tên:</strong> {selectedRecord.patientName}</p>
                                    <p><strong>SĐT:</strong> {selectedRecord.patientPhone}</p>
                                    <p><strong>Lớp:</strong> {selectedRecord.class}</p>
                                </Card>
                            </Col>

                        </Row>

                        <Card size="small" title="Danh sách thuốc" style={{ marginTop: 16 }}>
                            <Text>{selectedRecord.medications}</Text>
                        </Card>

                        <Card size="small" title="Hình ảnh toa thuốc" style={{ marginTop: 16 }}>
                            <Image
                                width={200}
                                src={selectedRecord.prescriptionImage}
                                alt="Toa thuốc"
                            />
                        </Card>

                        {selectedRecord.notes && (
                            <Card size="small" title="Ghi chú" style={{ marginTop: 16 }}>
                                <Text>{selectedRecord.notes}</Text>
                            </Card>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SendMedication;