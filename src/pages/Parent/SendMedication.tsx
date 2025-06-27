import React, { ReactElement, useEffect, useMemo, useState } from 'react';
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
    Popconfirm,
    Empty,
    Alert
} from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    FileTextOutlined,
    PictureOutlined,
    MedicineBoxOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';
import {
    getMedicalSentsByGuardian,
    createMedicalSent,
    updateMedicalSent,
    deleteMedicalSent,
    MedicalSent
} from '../../services/MedicalSentService';
import { getMedicalRecordsByGuardian } from '../../services/MedicalRecordService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const statusConfig: Record<string, { color: string; icon: ReactElement; text: string }> = {
    pending: { color: 'orange', icon: <ExclamationCircleOutlined />, text: 'Chờ xử lý' },
    processing: { color: 'blue', icon: <SyncOutlined />, text: 'Đang xử lý' },
    delivered: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã giao' },
    cancelled: { color: 'red', icon: <ExclamationCircleOutlined />, text: 'Đã hủy' }
};

const SendMedication: React.FC = () => {
    const [modalState, setModalState] = useState<{ open: boolean; mode: 'create' | 'edit'; record: MedicalSent | null }>({ open: false, mode: 'create', record: null });
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MedicalSent | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [deliveries, setDeliveries] = useState<MedicalSent[]>([]);
    const [students, setStudents] = useState<{ id: number; name: string; className: string; phone: string }[]>([]);
    const [fetching, setFetching] = useState(false);

    const studentInfoMap = useMemo(() => {
        const map = new Map<number, { name: string; className: string }>();
        students.forEach((s) => {
            map.set(s.id, { name: s.name, className: s.className });
        });
        return map;
    }, [students]);

    const token = localStorage.getItem('accessToken') || '';
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr).id : null;

    const loadData = async () => {
        if (!userId || !token) return;
        setFetching(true);
        try {
            const medicalRecords = await getMedicalRecordsByGuardian(token);
            const medicalSentsData = await getMedicalSentsByGuardian(token);

            const fetchedStudents = medicalRecords.map((s: any) => ({
                id: s.userId,
                name: s.fullname,
                className: s.Class || '',
                phone: s.phoneNumber || ''
            }));
            setStudents(fetchedStudents);

            const sortedData = medicalSentsData.sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());
            setDeliveries(sortedData);
        } catch (err) {
            console.error('Failed to load data:', err);
            message.error('Lỗi khi tải dữ liệu.');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [userId, token]);

    const showModal = (mode: 'create' | 'edit', record: MedicalSent | null = null) => {
        setModalState({ open: true, mode, record });
        if (mode === 'edit' && record) {
            const timeNote = record.Delivery_time.split(' - ')[1];
            const initialValues: any = {
                studentId: record.User_ID,
                medications: record.Medications,
                deliveryTimeNote: timeNote,
                notes: record.Notes
            };

            if (record.Image_prescription) {
                initialValues.prescriptionImage = [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: record.Image_prescription
                    }
                ];
            }

            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    };

    const handleModalCancel = () => {
        setModalState({ open: false, mode: 'create', record: null });
    };

    const handleFormSubmit = async (values: any) => {
        setLoading(true);
        try {
            const isCreate = modalState.mode === 'create';
            let student;

            if (isCreate) {
                student = students.find((s) => s.id === values.studentId);
            } else if (modalState.record) {
                student = students.find((s) => s.id === modalState.record!.User_ID);
            }

            if (!student) throw new Error('Không tìm thấy thông tin học sinh. Vui lòng thử lại.');

            const file = values.prescriptionImage?.[0];
            const fileObj = file?.originFileObj;

            const formData = new FormData();
            const deliveryTime = `${dayjs().format('YYYY-MM-DD')} - ${values.deliveryTimeNote}`;

            if (isCreate) {
                formData.append('userId', String(student.id));
                formData.append('guardianPhone', values.guardianPhone);
                formData.append('Class', student.className || '');
                if (fileObj) formData.append('prescriptionImage', fileObj);
                formData.append('medications', values.medications);
                formData.append('deliveryTime', deliveryTime);
                formData.append('status', 'pending');
                if (values.notes) formData.append('notes', values.notes);

                await createMedicalSent(formData, token);
                message.success('Tạo đơn gửi thuốc thành công!');
            } else if (modalState.record) {
                formData.append('userId', String(student.id));
                formData.append('guardianPhone', values.guardianPhone);
                formData.append('Class', student.className || modalState.record.Class || '');
                if (fileObj) {
                    formData.append('prescriptionImage', fileObj);
                }
                formData.append('medications', values.medications);
                formData.append('deliveryTime', deliveryTime);
                formData.append('status', modalState.record.Status);
                if (values.notes) {
                    formData.append('notes', values.notes);
                } else {
                    formData.append('notes', '');
                }
                await updateMedicalSent(modalState.record.id, formData, token);
                message.success('Cập nhật đơn thuốc thành công!');
            }

            handleModalCancel();
            await loadData();
        } catch (error: any) {
            message.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async (recordId: number) => {
        try {
            await deleteMedicalSent(recordId, token);
            message.success('Xóa đơn thuốc thành công!');
            await loadData();
        } catch (error) {
            message.error('Lỗi khi xóa đơn thuốc.');
        }
    };

    const handleViewDelivery = (record: MedicalSent) => {
        setSelectedRecord(record);
        setViewModalVisible(true);
    };

    const uploadProps: UploadProps = {
        name: 'prescriptionImage', listType: 'picture-card', maxCount: 1,
        beforeUpload: file => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) message.error('Chỉ có thể upload file JPG/PNG!');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) message.error('Hình ảnh phải nhỏ hơn 2MB!');
            return isJpgOrPng && isLt2M ? true : Upload.LIST_IGNORE;
        },
        customRequest: ({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)
    };

    const timeOptions = ['Trước ăn sáng', 'Sau ăn sáng', 'Trước ăn trưa', 'Sau ăn trưa', 'Trước ăn chiều', 'Sau ăn chiều'];

    const columns: ColumnsType<MedicalSent> = [
        { title: 'STT', key: 'stt', render: (_, __, index) => index + 1 },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt_date', render: (date: string) => dayjs(date).format('DD/MM/YYYY') },
        { title: 'Học sinh', dataIndex: 'User_ID', key: 'User_ID', render: (userId: number) => studentInfoMap.get(userId)?.name || 'Không rõ' },
        { title: 'Lớp', dataIndex: 'User_ID', key: 'Class', render: (userId: number, record) => record.Class || studentInfoMap.get(userId)?.className || '' },
        { title: 'Thời gian uống thuốc', dataIndex: 'Delivery_time', key: 'Delivery_time', render: (time: string) => time ? time.split(' - ')[1] || time : '' },
        { title: 'Trạng thái', dataIndex: 'Status', key: 'Status', render: (status: string) => { const config = statusConfig[status] || statusConfig['pending']; return (<Tag color={config.color} icon={config.icon}>{config.text}</Tag>); } },
        {
            title: 'Thao tác', key: 'action', render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết"><Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDelivery(record)} /></Tooltip>
                    <Tooltip title="Sửa"><Button type="text" icon={<EditOutlined />} onClick={() => showModal('edit', record)} /></Tooltip>
                    <Popconfirm
                        title="Xác nhận xóa"
                        description="Bạn chắc chắn muốn xóa đơn thuốc này?"
                        onConfirm={() => handleConfirmDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="topRight"
                    >
                        <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} /></Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0 }}><FileTextOutlined /> Quản lý gửi thuốc</Title>
                        <Text type="secondary">Theo dõi các toa thuốc đã gửi và trạng thái của chúng.</Text>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('create')}>Tạo đơn gửi thuốc</Button>
                    </Col>
                </Row>
            </Card>

            <Card style={{ marginTop: 24 }}>
                <Table columns={columns} dataSource={deliveries} rowKey="id" loading={fetching} pagination={{ position: ['bottomRight'] }} />
            </Card>

            <Modal
                title={modalState.mode === 'create' ? 'Tạo đơn gửi thuốc mới' : 'Cập nhật đơn thuốc'}
                open={modalState.open}
                onCancel={handleModalCancel}
                footer={null}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit} style={{ marginTop: 24 }}>
                    <Form.Item name="studentId" label="Chọn học sinh" rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]}>
                        <Select
                            loading={fetching}
                            placeholder="Chọn học sinh của bạn"
                            disabled={modalState.mode === 'edit'}
                            onChange={() => {
                                // Handle student change nếu cần
                            }}
                        >
                            {students.map((s) => (<Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="medications" label="Tên và liều lượng thuốc" rules={[{ required: true, message: 'Vui lòng nhập thông tin thuốc!' }]}>
                        <TextArea rows={3} placeholder="Ví dụ: Paracetamol 500mg, 1 viên" />
                    </Form.Item>
                    <Form.Item name="deliveryTimeNote" label="Buổi uống" rules={[{ required: true, message: 'Vui lòng chọn buổi uống!' }]}>
                        <Select placeholder="Chọn buổi">
                            {timeOptions.map((time) => (<Select.Option key={time} value={time}>{time}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="prescriptionImage"
                        label="Hình ảnh toa thuốc"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng tải lên hình ảnh toa thuốc',
                            },
                            {
                                validator: (_, value) => {
                                    return value && value.length > 0
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('Vui lòng tải lên ít nhất một hình ảnh'));
                                },
                            },
                        ]}
                    >
                        <Upload {...uploadProps} listType="picture-card">
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="notes" label="Ghi chú thêm"><TextArea rows={2} placeholder="Dặn dò thêm cho y tá..." /></Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleModalCancel}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {modalState.mode === 'create' ? 'Gửi đơn' : 'Cập nhật'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={
                    <div className="flex items-center space-x-3 py-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MedicineBoxOutlined className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-0">Chi Tiết Đơn Thuốc</h3>
                            <p className="text-sm text-gray-500 mb-0">Thông tin giao thuốc</p>
                        </div>
                    </div>
                }
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                width={750}
                centered
                style={{ paddingTop: 40, paddingBottom: 40 }}
                footer={[
                    <Button key="close" type="primary" size="large" onClick={() => setViewModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                styles={{
                    header: {
                        borderBottom: '1px solid #f0f0f0'
                    }
                }}
            >
                {selectedRecord && (
                    <div className="py-4">
                        <Space direction="vertical" size="large" className="w-full">

                            {/* Thông tin học sinh */}
                            <Card
                                size="small"
                                className="shadow-sm border-0 bg-blue-50"
                                styles={{ body: { padding: '16px' } }}
                            >
                                <div className="flex items-center mb-3">
                                    <UserOutlined className="text-blue-600 mr-2" />
                                    <Text strong className="text-blue-800">Thông tin học sinh</Text>
                                </div>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <div className="mb-2">
                                            <Text type="secondary" className="text-xs">HỌC SINH</Text>
                                            <div className="text-base font-medium text-gray-800">
                                                {studentInfoMap.get(selectedRecord.User_ID)?.name || 'Không rõ'}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="mb-2">
                                            <Text type="secondary" className="text-xs">LỚP</Text>
                                            <div className="text-base font-medium text-gray-800">
                                                {selectedRecord.Class || studentInfoMap.get(selectedRecord.User_ID)?.className || ''}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Thông tin giao thuốc */}
                            <Card
                                size="small"
                                className="shadow-sm border-0 bg-green-50"
                                styles={{ body: { padding: '16px' } }}
                            >
                                <div className="flex items-center mb-3">
                                    <ClockCircleOutlined className="text-green-600 mr-2" />
                                    <Text strong className="text-green-800">Thông tin giao thuốc</Text>
                                </div>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <div className="mb-2">
                                            <Text type="secondary" className="text-xs">THỜI GIAN UỐNG</Text>
                                            <div className="text-base font-medium text-gray-800">
                                                {selectedRecord.Delivery_time?.split(' - ')[1]}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="mb-2">
                                            <Text type="secondary" className="text-xs">TÌNH TRẠNG</Text>
                                            <div className="mt-1">
                                                <Tag
                                                    color={
                                                        selectedRecord.Status === 'delivered' ? 'success' :
                                                            selectedRecord.Status === 'pending' ? 'warning' : 'error'
                                                    }
                                                    className="px-3 py-1 rounded-full font-medium"
                                                >
                                                    {statusConfig[selectedRecord.Status]?.text}
                                                </Tag>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Thuốc & liều lượng */}
                            <Card
                                size="small"
                                className="shadow-sm border-0"
                                styles={{ body: { padding: '16px' } }}
                            >
                                <div className="flex items-center mb-3">
                                    <MedicineBoxOutlined className="text-purple-600 mr-2" />
                                    <Text strong className="text-purple-800">Thuốc & liều lượng</Text>
                                </div>
                                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                                    <Text className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                        {selectedRecord.Medications}
                                    </Text>
                                </div>
                            </Card>

                            {/* Ghi chú */}
                            {selectedRecord.Notes && (
                                <Card
                                    size="small"
                                    className="shadow-sm border-0"
                                    styles={{ body: { padding: '16px' } }}
                                >
                                    <div className="flex items-center mb-3">
                                        <FileTextOutlined className="text-orange-600 mr-2" />
                                        <Text strong className="text-orange-800">Ghi chú đặc biệt</Text>
                                    </div>
                                    <Alert
                                        message={selectedRecord.Notes}
                                        type="warning"
                                        showIcon
                                        className="bg-orange-50 border-orange-200"
                                    />
                                </Card>
                            )}

                            {/* Ảnh toa thuốc */}
                            <Card
                                size="small"
                                className="shadow-sm border-0"
                                styles={{ body: { padding: '16px' } }}
                            >
                                <div className="flex items-center mb-3">
                                    <PictureOutlined className="text-indigo-600 mr-2" />
                                    <Text strong className="text-indigo-800">Ảnh toa thuốc</Text>
                                </div>
                                <div className="text-center">
                                    {selectedRecord.Image_prescription ? (
                                        <div>
                                            <Image
                                                width={280}
                                                src={selectedRecord.Image_prescription}
                                                alt="Toa thuốc"
                                                className="rounded-lg shadow-sm"
                                                preview={{
                                                    mask: (
                                                        <div className="text-white">
                                                            <EyeOutlined className="text-lg mb-1" />
                                                            <div className="text-sm">Xem chi tiết</div>
                                                        </div>
                                                    )
                                                }}
                                            />
                                            <Text type="secondary" className="text-xs mt-2 block">
                                                Nhấn vào ảnh để phóng to
                                            </Text>
                                        </div>
                                    ) : (
                                        <Empty
                                            description={
                                                <Text type="secondary">Không có ảnh toa thuốc</Text>
                                            }
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            className="py-6"
                                        />
                                    )}
                                </div>
                            </Card>

                        </Space>
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default SendMedication;