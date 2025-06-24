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
    Popconfirm
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

                    <Form.Item
                        name="guardianPhone"
                        label="Số điện thoại phụ huynh"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại phụ huynh!' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" maxLength={15} />
                    </Form.Item>

                    <Form.Item name="medications" label="Tên và liều lượng thuốc" rules={[{ required: true, message: 'Vui lòng nhập thông tin thuốc!' }]}>
                        <TextArea rows={3} placeholder="Ví dụ: Paracetamol 500mg, 1 viên" />
                    </Form.Item>
                    <Form.Item name="deliveryTimeNote" label="Buổi uống" rules={[{ required: true, message: 'Vui lòng chọn buổi uống!' }]}>
                        <Select placeholder="Chọn buổi">
                            {timeOptions.map((time) => (<Select.Option key={time} value={time}>{time}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="prescriptionImage" label="Hình ảnh toa thuốc (nếu có)" valuePropName="fileList" getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}>
                        <Upload {...uploadProps}>
                            <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
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
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <MedicineBoxOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold">Chi Tiết Đơn Thuốc</div>
                            <div className="text-sm text-gray-500 font-normal">Thông tin giao thuốc cho học sinh</div>
                        </div>
                    </div>
                }
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                width={800}
                centered
                footer={[
                    <Button key="close" type="primary" onClick={() => setViewModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
            >
                {selectedRecord && (
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto px-2">
                        {/* Thông tin học sinh */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 shadow-sm">
                            <div className="flex items-center space-x-2 mb-3">
                                <UserOutlined className="text-blue-600" />
                                <span className="text-blue-800 font-semibold">Thông Tin Học Sinh</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex space-x-2 text-gray-700">
                                    <span className="font-semibold">Học sinh:</span>
                                    <span>{studentInfoMap.get(selectedRecord.User_ID)?.name || 'Không rõ'}</span>
                                </div>
                                <div className="flex space-x-2 text-gray-700">
                                    <span className="font-semibold">Lớp:</span>
                                    <span>{selectedRecord.Class || studentInfoMap.get(selectedRecord.User_ID)?.className || ''}</span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin giao thuốc */}
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 shadow-sm">
                            <div className="flex items-center space-x-2 mb-3">
                                <ClockCircleOutlined className="text-green-600" />
                                <span className="text-green-800 font-semibold">Thông Tin Giao Thuốc</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex space-x-2 text-gray-700">
                                    <CalendarOutlined className="text-gray-500" />
                                    <span className="font-semibold">Thời gian uống:</span>
                                    <span>{selectedRecord.Delivery_time?.split(' - ')[1]}</span>
                                </div>
                                <div className="flex space-x-2 text-gray-700">
                                    <span className="font-semibold">Tình trạng:</span>
                                    <span className={`px-2 py-1 rounded-full text-white text-sm font-medium
              ${selectedRecord.Status === 'delivered'
                                            ? 'bg-green-500'
                                            : selectedRecord.Status === 'pending'
                                                ? 'bg-orange-400'
                                                : 'bg-red-500'
                                        }`}>
                                        {statusConfig[selectedRecord.Status]?.text}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thuốc & liều lượng */}
                        <div className="bg-purple-50 border border-purple-200 rounded-md p-4 shadow-sm">
                            <div className="flex items-center space-x-2 mb-3">
                                <MedicineBoxOutlined className="text-purple-600" />
                                <span className="text-purple-800 font-semibold">Thuốc & Liều Lượng</span>
                            </div>
                            <div className="bg-white border border-purple-100 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {selectedRecord.Medications}
                            </div>
                        </div>

                        {/* Ghi chú */}
                        {selectedRecord.Notes && (
                            <div className="bg-orange-50 border border-orange-200 rounded-md p-4 shadow-sm">
                                <div className="flex items-center space-x-2 mb-3">
                                    <FileTextOutlined className="text-orange-600" />
                                    <span className="text-orange-800 font-semibold">Ghi Chú Đặc Biệt</span>
                                </div>
                                <div className="bg-white border border-orange-100 rounded-lg p-4 text-gray-700">
                                    {selectedRecord.Notes}
                                </div>
                            </div>
                        )}

                        {/* Ảnh toa thuốc */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 shadow-sm">
                            <div className="flex items-center space-x-2 mb-3">
                                <PictureOutlined className="text-indigo-600" />
                                <span className="text-indigo-800 font-semibold">Ảnh Toa Thuốc</span>
                            </div>
                            <div className="text-center">
                                {selectedRecord.Image_prescription ? (
                                    <div>
                                        <Image
                                            width={300}
                                            src={selectedRecord.Image_prescription}
                                            alt="Toa thuốc"
                                            className="rounded-lg border border-gray-200 shadow-sm max-h-[200px] object-cover mx-auto"
                                        />
                                        <p className="text-sm text-gray-500 mt-2">Nhấn vào ảnh để xem chi tiết</p>
                                    </div>
                                ) : (
                                    <div className="py-8 flex flex-col items-center text-gray-400">
                                        <PictureOutlined className="text-4xl mb-2" />
                                        <p>Không có ảnh toa thuốc</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default SendMedication;