import React, { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    Card,
    Tag,
    Row,
    Col,
    Typography,
    List,
    Alert,
    Space,
    Divider,
    Empty,
    Skeleton,
    Spin
} from 'antd';
import {
    UserOutlined,
    MedicineBoxOutlined,
    ExclamationCircleFilled,
    FileTextOutlined,
    CalendarOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getStudentsByGuardianUserId } from '../../services/AccountService';
import { getHealthCheckFormsByStudent, healthCheckService } from '../../services/Healthcheck';
import { notificationService } from '../../services/NotificationService';

const { Title, Text } = Typography;



const Checkup: React.FC = () => {
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [selectedCheckup, setSelectedCheckup] = useState<any>(null);
    const [checkupModalVisible, setCheckupModalVisible] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentForms, setStudentForms] = useState<any[]>([]);
    const [formsLoading, setFormsLoading] = useState(false);
    const [selectedForm, setSelectedForm] = useState<any>(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [selectedResult, setSelectedResult] = useState<any>(null);
    const [resultLoading, setResultLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const token = localStorage.getItem('accessToken') as string;
                if (!userStr || !token) {
                    setLoading(false);
                    return;
                }
                const userId = JSON.parse(userStr).id;
                const data = await getStudentsByGuardianUserId(userId, token);
                setStudents(data.students || []);
            } catch (error) {
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleViewDetail = async (student: any) => {
        setSelectedStudent(student);
        setDetailModalVisible(true);
        setFormsLoading(true);
        setStudentForms([]);
        try {
            const res = await getHealthCheckFormsByStudent(student.id);
            setStudentForms(res.data || []);
        } catch (e) {
            setStudentForms([]);
        } finally {
            setFormsLoading(false);
        }
    };

    const handleCheckupClick = (record: any) => {
        setSelectedCheckup(record);
        setCheckupModalVisible(true);
    };

    const handleViewResult = async (form: any) => {
        setResultLoading(true);
        try {
            const result = await healthCheckService.getHealthCheckResult(form.eventId, form.studentId);
            setSelectedResult(result);
            setResultModalVisible(true);
        } catch (error) {
            console.error('Error fetching health check result:', error);
            notificationService.error('Có lỗi xảy ra khi tải kết quả khám');
        } finally {
            setResultLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                            <MedicineBoxOutlined /> Quản lý khám sức khỏe
                        </Title>
                        <Text type="secondary">
                            Theo dõi lịch sử khám sức khỏe của học sinh
                        </Text>
                    </Col>
                </Row>
            </Card>

            <Row className='mt-4' gutter={[16, 16]}>
                {loading ? (
                    <Col span={24}><Text>Đang tải danh sách học sinh...</Text></Col>
                ) : students.length === 0 ? (
                    <Col span={24}><Text type="secondary">Không có học sinh nào.</Text></Col>
                ) : (
                    students.map(student => (
                        <Col xs={24} md={12} lg={8} key={student.id}>
                            <Card
                                title={<Text strong>{student.fullname}</Text>}
                                extra={<Text type="secondary">Mã học sinh: {student.username}</Text>}
                                actions={[
                                    <Button type="link" onClick={() => handleViewDetail(student)}>
                                        Chi tiết
                                    </Button>
                                ]}
                            >
                                <p><Text type="secondary">Lớp:</Text> {student.className || '-'}</p>
                                <p><Text type="secondary">Ngày sinh:</Text> {student.dateOfBirth ? dayjs(student.dateOfBirth).format('DD/MM/YYYY') : '-'}</p>
                                {/* Có thể bổ sung thêm các trường khác nếu cần */}
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            <Modal
                title={
                    <Space>
                        <UserOutlined />
                        Chi tiết khám sức khỏe - {selectedStudent?.fullname}
                    </Space>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={900}
            >
                {selectedStudent && (
                    <div>
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Text strong>Mã học sinh:</Text> {selectedStudent.username}
                                </Col>
                                <Col span={6}>
                                    <Text strong>Lớp:</Text> {selectedStudent.className || '-'}
                                </Col>
                                <Col span={6}>
                                    <Text strong>Ngày sinh:</Text> {selectedStudent.dateOfBirth ? dayjs(selectedStudent.dateOfBirth).format('DD/MM/YYYY') : '-'}
                                </Col>
                            </Row>
                        </Card>
                        <div style={{ marginBottom: 16 }}>
                            <Title level={5}>Danh sách form khám sức khỏe</Title>
                            {formsLoading ? (
                                <Skeleton active paragraph={{ rows: 3 }} />
                            ) : studentForms.length === 0 ? (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<span>Không có form khám sức khỏe nào.</span>}
                                />
                            ) : (
                                <List
                                    itemLayout="vertical"
                                    dataSource={[...studentForms].sort((a, b) => new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime())}
                                    renderItem={(form: any) => {
                                        let tagColor = 'default';
                                        let displayStatus = form.status;
                                        // Nếu là 'created' thì hiển thị như 'pending' và cho phép xác nhận
                                        if (form.status === 'created') {
                                            tagColor = 'orange';
                                            displayStatus = 'pending';
                                        } else {
                                            switch (form.status) {
                                                case 'pending': tagColor = 'orange'; break;
                                                case 'approved': tagColor = 'green'; break;
                                                case 'checked': tagColor = 'yellow'; break;
                                                case 'rejected': tagColor = 'red'; break;
                                                default: tagColor = 'default';
                                            }
                                        }
                                        return (
                                            <List.Item key={form.formId} style={{ padding: 0, border: 'none', cursor: 'pointer' }}
                                                onClick={() => {
                                                    if (form.status === 'checked') {
                                                        // Hiển thị kết quả khám thay vì modal xác nhận
                                                        handleViewResult(form);
                                                    } else {
                                                        setSelectedForm(form);
                                                        setConfirmModalVisible(true);
                                                    }
                                                }}
                                            >
                                                <Card
                                                    size="small"
                                                    style={{ marginBottom: 12, borderLeft: `4px solid #1890ff`, boxShadow: '0 2px 8px #f0f1f2' }}
                                                    bodyStyle={{ padding: 16 }}
                                                >
                                                    <Row gutter={[8, 8]} align="middle">
                                                        <Col xs={24} md={16}>
                                                            <Space direction="vertical" size={2}>
                                                                <Space>
                                                                    <FileTextOutlined style={{ color: '#1890ff' }} />
                                                                    <Text strong>{form.title}</Text>
                                                                </Space>
                                                                <Space>
                                                                    <InfoCircleOutlined />
                                                                    <Text type="secondary">{form.description}</Text>
                                                                </Space>
                                                            </Space>
                                                        </Col>
                                                        <Col xs={12} md={4}>
                                                            <Space>
                                                                <Tag color={tagColor} style={{ fontWeight: 500, fontSize: 14, padding: '2px 10px' }}>
                                                                    {displayStatus === 'pending' ? 'Chờ xác nhận' : 
                                                                     displayStatus === 'approved' ? 'Đã xác nhận' : 
                                                                     displayStatus === 'checked' ? 'Đã có kết quả khám' :
                                                                     displayStatus === 'rejected' ? 'Từ chối' : form.status}
                                                                </Tag>
                                                            </Space>
                                                        </Col>
                                                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                                                            <Space direction="vertical" size={0}>
                                                                <Space>
                                                                    <CalendarOutlined />
                                                                    <Text>{form.dateEvent ? dayjs(form.dateEvent).format('DD/MM/YYYY') : '-'}</Text>
                                                                </Space>
                                                                <Text type="secondary" style={{ fontSize: 12 }}>{form.schoolYear}</Text>
                                                                <Tag color="blue" style={{ marginTop: 2 }}>{form.type}</Tag>
                                                            </Space>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </List.Item>
                                        );
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                title={
                    <Space>
                        <MedicineBoxOutlined />
                        Chi tiết lần khám sức khỏe
                    </Space>
                }
                open={checkupModalVisible}
                onCancel={() => setCheckupModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedCheckup && (
                    <div>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Card
                                    size="small"
                                    title={
                                        <Space>
                                            <Text strong>{selectedCheckup.checkupType}</Text>
                                            <Tag color="blue">{selectedCheckup.status}</Tag>
                                        </Space>
                                    }
                                >
                                    <Row gutter={[16, 8]}>
                                        <Col span={12}>
                                            <Text type="secondary">Trạng thái:</Text>
                                            <br />
                                            <Tag color={
                                                selectedCheckup.status === 'Đã khám' ? 'success' :
                                                    selectedCheckup.status === 'Chờ xác nhận' ? 'warning' : 'default'
                                            }>
                                                {selectedCheckup.status}
                                            </Tag>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">Ngày khám:</Text>
                                            <br />
                                            <Text>{selectedCheckup.checkupDate ?
                                                dayjs(selectedCheckup.checkupDate).format('DD/MM/YYYY') :
                                                'Chưa có'}</Text>
                                        </Col>
                                        {selectedCheckup.status === 'Đã khám' && (
                                            <>
                                                <Col span={24}>
                                                    <Divider style={{ margin: '12px 0' }} />
                                                    <Text type="secondary">Ghi chú:</Text>
                                                    <br />
                                                    <Text>{selectedCheckup.notes || 'Không có ghi chú'}</Text>
                                                </Col>
                                                {selectedCheckup.location && (
                                                    <Col span={24}>
                                                        <Text type="secondary">Địa điểm khám:</Text>
                                                        <br />
                                                        <Text>{selectedCheckup.location}</Text>
                                                    </Col>
                                                )}
                                            </>
                                        )}
                                    </Row>
                                </Card>
                            </Col>

                            {selectedCheckup.status === 'Chờ xác nhận' && (
                                <Col span={24}>
                                    <Alert
                                        message="Xác nhận khám sức khỏe"
                                        description="Vui lòng xem xét thông tin và xác nhận lần khám này."
                                        type="warning"
                                        showIcon
                                        icon={<ExclamationCircleFilled />}
                                    />
                                </Col>
                            )}
                        </Row>
                    </div>
                )}
            </Modal>

            <Modal
                title={<Space><FileTextOutlined /> Xác nhận khám sức khỏe</Space>}
                open={confirmModalVisible}
                onCancel={() => setConfirmModalVisible(false)}
                footer={null}
                width={500}
            >
                {selectedForm && (
                    <div>
                        <Row gutter={[8, 8]}>
                            <Col span={24}><Text strong>Tiêu đề:</Text> {selectedForm.title}</Col>
                            <Col span={24}><Text strong>Ngày khám:</Text> {selectedForm.dateEvent ? dayjs(selectedForm.dateEvent).format('DD/MM/YYYY') : '-'}</Col>
                            <Col span={24}><Text strong>Mô tả:</Text> {selectedForm.description}</Col>
                            <Col span={24}><Text strong>Trạng thái hiện tại:</Text> <Tag color={
                                selectedForm.status === 'created' || selectedForm.status === 'pending' ? 'orange' :
                                selectedForm.status === 'approved' ? 'green' :
                                selectedForm.status === 'checked' ? 'yellow' :
                                selectedForm.status === 'rejected' ? 'red' : 'default'
                            }>
                                {(selectedForm.status === 'created' || selectedForm.status === 'pending') ? 'Chờ xác nhận' :
                                 selectedForm.status === 'approved' ? 'Đã xác nhận' :
                                 selectedForm.status === 'checked' ? 'Đã có kết quả khám' :
                                 selectedForm.status === 'rejected' ? 'Từ chối' : selectedForm.status}
                            </Tag></Col>
                        </Row>
                        <Divider />
                        <Space style={{ width: '100%', justifyContent: 'center' }}>
                            {(selectedForm.status === 'pending' || selectedForm.status === 'created') && (
                                <>
                                    <Button
                                        type="primary"
                                        loading={confirmLoading}
                                        onClick={async () => {
                                            setConfirmLoading(true);
                                            try {
                                                await healthCheckService.confirmHealthCheckForm(selectedForm.formId, 'approve');
                                                setConfirmModalVisible(false);
                                                // reload lại danh sách form
                                                if (selectedStudent) {
                                                    setFormsLoading(true);
                                                    const res = await getHealthCheckFormsByStudent(selectedStudent.id);
                                                    setStudentForms(res.data || []);
                                                    setFormsLoading(false);
                                                }
                                            } catch (e) {
                                                setConfirmLoading(false);
                                            }
                                        }}
                                    >Đồng ý khám</Button>
                                    <Button
                                        danger
                                        loading={confirmLoading}
                                        onClick={async () => {
                                            setConfirmLoading(true);
                                            try {
                                                await healthCheckService.confirmHealthCheckForm(selectedForm.formId, 'reject');
                                                setConfirmModalVisible(false);
                                                // reload lại danh sách form
                                                if (selectedStudent) {
                                                    setFormsLoading(true);
                                                    const res = await getHealthCheckFormsByStudent(selectedStudent.id);
                                                    setStudentForms(res.data || []);
                                                    setFormsLoading(false);
                                                }
                                            } catch (e) {
                                                setConfirmLoading(false);
                                            }
                                        }}
                                    >Từ chối khám</Button>
                                </>
                            )}
                        </Space>
                    </div>
                )}
            </Modal>

            <Modal
                title={<Space><FileTextOutlined /> Kết quả khám sức khỏe</Space>}
                open={resultModalVisible}
                onCancel={() => setResultModalVisible(false)}
                footer={null}
                width={600}
            >
                {resultLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin size="large" />
                        <div style={{ marginTop: '10px' }}>Đang tải kết quả khám...</div>
                    </div>
                ) : selectedResult ? (
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text strong>Chiều cao:</Text>
                                <br />
                                <Text>{selectedResult.Height} cm</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Cân nặng:</Text>
                                <br />
                                <Text>{selectedResult.Weight} kg</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Huyết áp:</Text>
                                <br />
                                <Text>{selectedResult.Blood_Pressure}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Thị lực mắt trái:</Text>
                                <br />
                                <Text>{selectedResult.Vision_Left}/10</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Thị lực mắt phải:</Text>
                                <br />
                                <Text>{selectedResult.Vision_Right}/10</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Tình trạng răng:</Text>
                                <br />
                                <Text>{selectedResult.Dental_Status}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Tai mũi họng:</Text>
                                <br />
                                <Text>{selectedResult.ENT_Status}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Tình trạng da:</Text>
                                <br />
                                <Text>{selectedResult.Skin_Status}</Text>
                            </Col>
                            <Col span={24}>
                                <Text strong>Kết luận chung:</Text>
                                <br />
                                <Text>{selectedResult.General_Conclusion}</Text>
                            </Col>
                            <Col span={24}>
                                <Text strong>Cần gặp phụ huynh:</Text>
                                <br />
                                <Tag color={selectedResult.Is_need_meet ? 'red' : 'green'}>
                                    {selectedResult.Is_need_meet ? 'Có' : 'Không'}
                                </Tag>
                            </Col>
                            <Col span={24}>
                                <Divider />
                                <Text type="secondary">
                                    Ngày khám: {selectedResult.createdAt ? dayjs(selectedResult.createdAt).format('DD/MM/YYYY HH:mm') : '-'}
                                </Text>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Text type="secondary">Không tìm thấy kết quả khám</Text>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Checkup;