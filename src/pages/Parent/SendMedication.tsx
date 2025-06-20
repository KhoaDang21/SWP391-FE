import React, { ReactElement, useEffect, useState } from 'react';
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
    Row,
    Col,
    Typography,
    Divider,
    message,
    Image,
    Tooltip,
    Select,
    DatePicker
} from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    UploadOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';
import {
    getMedicalSentsByGuardian,
    createMedicalSent,
    getMedicalSentById,
    MedicalSent
} from '../../services/MedicalSentService';
import { getStudentsByGuardianUserId } from '../../services/AccountService';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Status config
const statusConfig: Record<string, { color: string; icon: ReactElement; text: string }> = {
    pending: { color: 'orange', icon: <ExclamationCircleOutlined />, text: 'Chờ xử lý' },
    processing: { color: 'blue', icon: <SyncOutlined />, text: 'Đang giao' },
    delivered: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã giao' },
    cancelled: { color: 'red', icon: <ExclamationCircleOutlined />, text: 'Đã hủy' }
};

const SendMedication: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MedicalSent | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [deliveries, setDeliveries] = useState<MedicalSent[]>([]);
    const [students, setStudents] = useState<{ id: number; name: string; className: string; phone: string }[]>([]);
    const [fetching, setFetching] = useState(false);

    // Lấy token và userId
    const token = localStorage.getItem('accessToken') || '';
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr).id : null;

    useEffect(() => {
        const fetchStudents = async () => {
            if (!userId || !token) return;
            try {
                setFetching(true);
                const res = await getStudentsByGuardianUserId(userId, token);
                setStudents(
                    res.students.map((s: any) => ({
                        id: s.id,
                        name: s.fullname,
                        className: s.className || '',
                        phone: s.phoneNumber || ''
                    }))
                );
            } catch (err) {
                message.error('Lỗi lấy danh sách học sinh');
            } finally {
                setFetching(false);
            }
        };
        fetchStudents();
    }, [userId, token]);

    const fetchDeliveries = async () => {
        if (!token) return;
        try {
            setFetching(true);
            const data = await getMedicalSentsByGuardian(token);
            setDeliveries(data);
        } catch (err) {
            message.error('Lỗi lấy danh sách đơn thuốc');
        } finally {
            setFetching(false);
        }
    };
    useEffect(() => {
        fetchDeliveries();
    }, [token]);

    const uploadProps: UploadProps = {
        name: 'prescriptionImage',
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
            return isJpgOrPng && isLt2M ? true : Upload.LIST_IGNORE;
        },
        customRequest: ({ onSuccess }) => {
            setTimeout(() => {
                onSuccess && onSuccess('ok');
            }, 0);
        }
    };

    const timeOptions = [
        'Trước ăn sáng',
        'Sau ăn sáng',
        'Trước ăn trưa',
        'Sau ăn trưa',
        'Trước ăn chiều',
        'Sau ăn chiều',
    ];

    const handleCreateDelivery = async (values: any) => {
        setLoading(true);
        try {
            const student = students.find((s) => s.id === values.studentId);
            if (!student) throw new Error('Không tìm thấy học sinh');
            const fileObj = values.prescriptionImage?.file?.originFileObj;
            if (!fileObj) throw new Error('Vui lòng upload hình ảnh toa thuốc hợp lệ!');
            const formData = new FormData();
            formData.append('userId', String(values.studentId));
            formData.append('guardianPhone', student.phone);
            formData.append('class', student.className);
            formData.append('prescriptionImage', fileObj);
            formData.append('medications', values.medications);
            const deliveryTime = `${values.deliveryDate.format('YYYY-MM-DD')} - ${values.deliveryTimeNote}`;
            formData.append('deliveryTime', deliveryTime);
            formData.append('status', 'pending');
            if (values.notes) formData.append('notes', values.notes);

            // Log FormData for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            const res = await fetch('http://localhost:3333/api/v1/medical-sents', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (!res.ok) {
                let errorMsg = 'Lỗi tạo đơn thuốc';
                try {
                    const errData = await res.json();
                    errorMsg = errData.message || errorMsg;
                } catch { }
                throw new Error(errorMsg);
            }

            message.success('Tạo đơn gửi thuốc thành công!');
            setIsModalVisible(false);
            form.resetFields();
            fetchDeliveries();
        } catch (error: any) {
            message.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDelivery = async (record: MedicalSent) => {
        try {
            setFetching(true);
            const detail = await getMedicalSentById(record.id, token);
            setSelectedRecord(detail);
            setViewModalVisible(true);
        } catch (err) {
            message.error('Lỗi lấy chi tiết đơn thuốc');
        } finally {
            setFetching(false);
        }
    };

    const columns: ColumnsType<MedicalSent> = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
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
        },
        {
            title: 'Số điện thoại phụ huynh',
            dataIndex: 'patientPhone',
            key: 'patientPhone',
        },
        {
            title: 'Thời gian uống thuốc',
            dataIndex: 'deliveryTime',
            key: 'deliveryTime',
            render: (time) => <Text>{dayjs(time, 'HH:mm').format('HH:mm')}</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config = statusConfig[status] || statusConfig['pending'];
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
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Tooltip title="Xem chi tiết">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDelivery(record)}
                        loading={fetching}
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
                    loading={fetching}
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
                        deliveryFee: 25000
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Học sinh" name="studentId" rules={[{ required: false, message: 'Vui lòng chọn học sinh' }]}>
                                <Select placeholder="Chọn học sinh" loading={fetching}>
                                    {students.map((student) => (
                                        <Select.Option key={student.id} value={student.id}>
                                            {student.name} ({student.className})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày uống thuốc"
                                name="deliveryDate"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Thời điểm uống thuốc"
                                name="deliveryTimeNote"
                                rules={[{ required: true, message: 'Vui lòng chọn thời điểm!' }]}
                            >
                                <Select placeholder="Chọn thời điểm">
                                    {timeOptions.map((opt) => (
                                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

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