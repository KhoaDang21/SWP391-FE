import React, { useState, useEffect } from 'react';
import {
    Button,
    Table,
    Modal,
    Form,
    Input,
    Space,
    Card,
    Tag,
    DatePicker,
    Row,
    Col,
    Typography,
    Divider,
    message,
    Progress,
    Tooltip,
    Select,
    Switch,
    List,
    Avatar,
    Badge,
    Alert
} from 'antd';
import {
    EyeOutlined,
    UserOutlined,
    MedicineBoxOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EditOutlined,
    SaveOutlined,
    CalendarOutlined,
    ExclamationCircleOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { vaccineService } from '../../services/Vaccineservice';
import type { GuardianVaccineResponse, GuardianVaccineHistory } from '../../services/Vaccineservice';

const { Title, Text } = Typography;
const { Option } = Select;

// Interface cho thông tin vaccine
interface VaccineInfo {
    id: string;
    name: string;
    description: string;
    recommendedAge: string;
    isRequired: boolean;
}

// Update the VaccineRecord interface
interface VaccineRecord {
    vaccineId: string;
    isVaccinated: boolean;
    status: string;
    vaccineName: string;    // Add this
    vaccineType: string;    // Add this
    vaccinatedDate?: string;
    location?: string;
    notes?: string;
    batchNumber?: string;
}

// Interface cho học sinh
interface Student {
    id: string;
    name: string;
    dateOfBirth: string;
    class: string;
    studentCode: string;
    vaccineRecords: VaccineRecord[];
    totalVaccinated: number;
    totalNeedConfirm: number; 
}

const Vaccine: React.FC = () => {
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedVaccine, setSelectedVaccine] = useState<VaccineRecord | null>(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    // 14 loại vaccine cơ bản
    const vaccineTypes: VaccineInfo[] = [
        { id: '1', name: 'BCG', description: 'Phòng bệnh lao', recommendedAge: '0-1 tháng', isRequired: true },
        { id: '2', name: 'Viêm gan B', description: 'Phòng viêm gan B', recommendedAge: '0-2 tháng', isRequired: true },
        { id: '3', name: 'DPT (Bạch hầu)', description: 'Phòng bạch hầu, ho gà, uốn ván', recommendedAge: '2-4 tháng', isRequired: true },
        { id: '4', name: 'Polio', description: 'Phòng bại liệt', recommendedAge: '2-4 tháng', isRequired: true },
        { id: '5', name: 'Hib', description: 'Phòng Haemophilus influenzae type b', recommendedAge: '2-6 tháng', isRequired: true },
        { id: '6', name: 'PCV', description: 'Phòng phế cầu khuẩn', recommendedAge: '2-6 tháng', isRequired: false },
        { id: '7', name: 'Rotavirus', description: 'Phòng tiêu chảy do Rotavirus', recommendedAge: '2-6 tháng', isRequired: false },
        { id: '8', name: 'Sởi', description: 'Phòng bệnh sởi', recommendedAge: '9-15 tháng', isRequired: true },
        { id: '9', name: 'Rubella', description: 'Phòng bệnh rubella', recommendedAge: '12-15 tháng', isRequired: true },
        { id: '10', name: 'Quai bị', description: 'Phòng bệnh quai bị', recommendedAge: '12-15 tháng', isRequired: true },
        { id: '11', name: 'Varicella', description: 'Phòng bệnh thủy đậu', recommendedAge: '12-15 tháng', isRequired: false },
        { id: '12', name: 'Viêm gan A', description: 'Phòng viêm gan A', recommendedAge: '12-23 tháng', isRequired: false },
        { id: '13', name: 'JE', description: 'Phòng viêm não Nhật Bản', recommendedAge: '12-24 tháng', isRequired: true },
        { id: '14', name: 'Td', description: 'Nhắc lại uốn ván và bạch hầu', recommendedAge: '4-6 tuổi', isRequired: true }
    ];

    const fetchVaccineData = async () => {
        try {
            const response = await vaccineService.getVaccinesByGuardian();
            
            const transformedStudents: Student[] = response.histories.map(history => ({
                id: history.medicalRecord.ID.toString(),
                name: history.user.fullname,
                dateOfBirth: '',
                class: history.medicalRecord.class,
                studentCode: history.medicalRecord.ID.toString(),
                totalVaccinated: history.vaccineHistory.filter(v => v.Status === 'Đã tiêm').length,
                totalNeedConfirm: history.vaccineHistory.filter(v => v.Status === 'Chờ xác nhận').length,
                vaccineRecords: history.vaccineHistory.map(vh => ({
                    vaccineId: vh.VH_ID.toString(),
                    isVaccinated: vh.Status === 'Đã tiêm',
                    status: vh.Status || 'Chưa tiêm',
                    vaccineName: vh.Vaccine_name || '',
                    vaccineType: vh.Vaccince_type || '',
                    vaccinatedDate: vh.Date_injection,
                    location: '', 
                    notes: vh.note_affter_injection || '',
                }))
            }));

            setStudents(transformedStudents);

            // Update selectedStudent if exists
            if (selectedStudent) {
                const updatedSelectedStudent = transformedStudents.find(s => s.id === selectedStudent.id);
                if (updatedSelectedStudent) {
                    setSelectedStudent(updatedSelectedStudent);
                }
            }
        } catch (error) {
            message.error('Failed to fetch vaccine data');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchVaccineData();
    }, []);

    const handleViewDetail = (student: Student) => {
        setSelectedStudent(student);
        setDetailModalVisible(true);
        setEditMode(null);
    };

    // Cập nhật thông tin vaccine
    const handleUpdateVaccine = async (vaccineId: string, values: any) => {
        if (!selectedStudent) return;

        setLoading(true);
        try {
            const updatedStudents = students.map(student => {
                if (student.id === selectedStudent.id) {
                    const updatedRecords = student.vaccineRecords.map(record => {
                        if (record.vaccineId === vaccineId) {
                            return {
                                ...record,
                                isVaccinated: values.isVaccinated,
                                vaccinatedDate: values.isVaccinated ? values.vaccinatedDate?.format('YYYY-MM-DD') : undefined,
                                location: values.location,
                                notes: values.notes,
                                batchNumber: values.batchNumber
                            };
                        }
                        return record;
                    });

                    const totalVaccinated = updatedRecords.filter(r => r.isVaccinated).length;

                    return {
                        ...student,
                        vaccineRecords: updatedRecords,
                        totalVaccinated
                    };
                }
                return student;
            });

            setStudents(updatedStudents);

            const updatedStudent = updatedStudents.find(s => s.id === selectedStudent.id);
            if (updatedStudent) {
                setSelectedStudent(updatedStudent);
            }

            message.success('Cập nhật thông tin vaccine thành công!');
            setEditMode(null);
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleVaccineClick = (record: VaccineRecord) => {
        setSelectedVaccine(record);
        setConfirmModalVisible(true);
    };

    const handleConfirmVaccine = async (approved: boolean) => {
        if (!selectedVaccine) return;
        
        setLoading(true);
        try {
            await vaccineService.confirmVaccine(selectedVaccine.vaccineId, approved);
            
            // Always reload data and show success message
            await fetchVaccineData();
            message.success(`Đã ${approved ? 'cho phép' : 'từ chối'} tiêm vaccine`);
            setConfirmModalVisible(false);
        } catch (error: any) {
            // Only show error message for non-validation errors
            if (error.message !== "Validation error") {
                message.error('Có lỗi xảy ra khi xác nhận vaccine');
                console.error('Error confirming vaccine:', error);
            } else {
                // For validation errors, still reload data and close modal
                await fetchVaccineData();
                setConfirmModalVisible(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Đã tiêm': return 'success';
            case 'Cho phép tiêm': return '#faad14';
            case 'Không cho phép tiêm': return '#ff4d4f';
            case 'Chờ xác nhận': return '#fa8c16';
            default: return '#d9d9d9';
        }
    };

    const getBackgroundColor = (status: string) => {
        switch(status) {
            case 'Đã tiêm': return '#f6ffed';
            case 'Cho phép tiêm': return '#fffbe6';
            case 'Không cho phép tiêm': return '#fff1f0';
            case 'Chờ xác nhận': return '#fff7e6';
            default: return '#fafafa';
        }
    };

    const getBorderColor = (status: string) => {
        switch(status) {
            case 'Đã tiêm': return '#b7eb8f';
            case 'Cho phép tiêm': return '#ffd591';
            case 'Không cho phép tiêm': return '#ffa39e';
            case 'Chờ xác nhận': return '#ffd591';
            default: return '#d9d9d9';
        }
    };

    const getStatusText = (status: string) => {
        switch(status) {
            case 'completed': return 'Đã tiêm';
            case 'approved': return 'Cho phép tiêm';
            case 'rejected': return 'Không cho phép tiêm';
            case 'pending': return 'Chờ xác nhận';
            default: return status;
        }
    };

    const getTagColor = (status: string) => {
        switch(status) {
            case 'Đã tiêm': return 'success';
            case 'Cho phép tiêm': return 'warning';
            case 'Không cho phép tiêm': return 'error';
            case 'Chờ xác nhận': return 'processing';
            default: return 'default';
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <Card>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                            <MedicineBoxOutlined /> Quản lý tiêm chủng
                        </Title>
                        <Text type="secondary">
                            Theo dõi tình hình tiêm vaccine của học sinh
                        </Text>
                    </Col>
                </Row>
            </Card>


            {/* Crad danh sách học sinh */}


            <Row className='mt-4' gutter={[16, 16]}>
                {students.map(student => {
                    const percentage = (student.totalVaccinated / 14) * 100;
                    const requiredVaccines = vaccineTypes.filter(v => v.isRequired).length;
                    const vaccinatedRequired = student.vaccineRecords.filter(r => {
                        const v = vaccineTypes.find(vac => vac.id === r.vaccineId);
                        return r.isVaccinated && v?.isRequired;
                    }).length;

                    return (
                        <Col xs={24} md={12} lg={8} key={student.id}>
                            <Card
                                title={<Text strong>{student.name}</Text>}
                                extra={<Text type="secondary">Mã sổ sức khỏe: {student.studentCode}</Text>}
                                actions={[
                                    <Button type="link" onClick={() => handleViewDetail(student)}>
                                        Chi tiết
                                    </Button>
                                ]}
                            >
                                <p><Text type="secondary">Lớp:</Text> {student.class}</p>
                                <p><Text type="secondary">Ngày sinh:</Text> {dayjs(student.dateOfBirth).format('DD/MM/YYYY')}</p>
                                <p><Text type="secondary">Tổng vaccine đã tiêm:</Text> {student.totalVaccinated}/14</p>
                                <p><Text type="secondary">Vaccine đang chờ xác nhận:</Text> {student.totalNeedConfirm}</p>
                             
{/* 
                                <Progress
                                    percent={Math.round(percentage)}
                                    status={
                                        percentage >= 90 ? 'success' :
                                            percentage >= 70 ? 'active' :
                                                percentage >= 50 ? 'normal' : 'exception'
                                    }
                                    size="small"
                                /> */}

                                {/* <div style={{ marginTop: 12 }}>
                                    {
                                        percentage >= 90 ? <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn thành</Tag> :
                                            percentage >= 70 ? <Tag color="blue" icon={<ExclamationCircleOutlined />}>Gần hoàn thành</Tag> :
                                                percentage >= 50 ? <Tag color="orange" icon={<ExclamationCircleOutlined />}>Đang tiêm</Tag> :
                                                    <Tag color="red" icon={<CloseCircleOutlined />}>Chưa đầy đủ</Tag>
                                    }
                                </div> */}
                            </Card>
                        </Col>
                    );
                })}
            </Row>


            {/* Modal chi tiết vaccine */}
            <Modal
                title={
                    <Space>
                        <UserOutlined />
                        Chi tiết tiêm chủng - {selectedStudent?.name}
                    </Space>
                }
                open={detailModalVisible}
                onCancel={() => {
                    setDetailModalVisible(false);
                    setEditMode(null);
                }}
                footer={null}
                width={900}
            >
                {selectedStudent && (
                    <div>
                        {/* Thông tin học sinh */}
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Text strong>Mã sổ sức khỏe:</Text> {selectedStudent.studentCode}
                                </Col>
                                <Col span={6}>
                                    <Text strong>Lớp:</Text> {selectedStudent.class}
                                </Col>
                                <Col span={6}>
                                    <Text strong>Ngày sinh:</Text> {dayjs(selectedStudent.dateOfBirth).format('DD/MM/YYYY')}
                                </Col>
                                <Col span={6}>
                                    <Text strong>Tiến độ:</Text> {selectedStudent.totalVaccinated}/14
                                </Col>
                            </Row>
                        </Card>

                        {/* Danh sách vaccine */}
                        <List
                            itemLayout="horizontal"
                            dataSource={selectedStudent.vaccineRecords}
                            renderItem={(vaccineRecord) => {
                                const getBackgroundColor = () => {
                                    switch(vaccineRecord.status) {
                                        case 'Đã tiêm': return '#f6ffed';
                                        case 'Chờ xác nhận': return '#fff2e8';
                                        case 'Cho phép tiêm': return '#fffbe6';
                                        case 'Không cho phép tiêm': return '#fff1f0';
                                        default: return '#fafafa';
                                    }
                                };

                                const getBorderColor = () => {
                                    switch(vaccineRecord.status) {
                                        case 'Đã tiêm': return '#b7eb8f';
                                        case 'Chờ xác nhận': return '#ffbb96';
                                        case 'Cho phép tiêm': return '#ffd591';
                                        case 'Không cho phép tiêm': return '#ffa39e';
                                        default: return '#d9d9d9';
                                    }
                                };

                                return (
                                    <List.Item
                                        style={{
                                            backgroundColor: getBackgroundColor(),
                                            marginBottom: 8,
                                            padding: 16,
                                            borderRadius: 8,
                                            border: `1px solid ${getBorderColor()}`,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleVaccineClick(vaccineRecord)}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Badge
                                                    count={
                                                        vaccineRecord.status === 'Đã tiêm' ? 
                                                            <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                                                        vaccineRecord.status === 'Chờ xác nhận' || vaccineRecord.status === 'Cho phép tiêm' ?
                                                            <ExclamationCircleOutlined style={{ color: '#fa8c16' }} /> :
                                                            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                                    }
                                                >
                                                    <Avatar
                                                        style={{ 
                                                            backgroundColor: vaccineRecord.status === 'Đã tiêm' ? '#52c41a' : 
                                                                           vaccineRecord.status === 'Chờ xác nhận' || vaccineRecord.status === 'Cho phép tiêm' ? '#fa8c16' : '#d9d9d9'
                                                        }}
                                                        icon={<MedicineBoxOutlined />}
                                                    />
                                                </Badge>
                                            }
                                            title={
                                                <Space align="center">
                                                    <Text strong style={{ 
                                                        color: getStatusColor(vaccineRecord.status)
                                                    }}>
                                                        {vaccineRecord.vaccineName}
                                                    </Text>
                                                    <Tag color={getTagColor(vaccineRecord.status)}>
                                                        {vaccineRecord.status}
                                                    </Tag>
                                                </Space>
                                            }
                                            description={
                                                <div>
                                                    <Tag color="blue" style={{ marginBottom: 8 }}>{vaccineRecord.vaccineType}</Tag>
                                                    {vaccineRecord.vaccinatedDate && (
                                                        <div>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                                Ngày tiêm: {dayjs(vaccineRecord.vaccinatedDate).format('DD/MM/YYYY')}
                                                            </Text>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                );
                            }}
                        />
                    </div>
                )}
            </Modal>

            {/* Vaccine Detail Modal */}
            <Modal
                title={
                    <Space>
                        <MedicineBoxOutlined />
                        {selectedVaccine?.status === 'Chờ xác nhận' ? 'Xác nhận tiêm vaccine' : 'Chi tiết vaccine'}
                    </Space>
                }
                open={confirmModalVisible}
                onCancel={() => setConfirmModalVisible(false)}
                footer={
                    selectedVaccine?.status === 'Chờ xác nhận' ? (
                        <Space>
                            <Button 
                                onClick={() => handleConfirmVaccine(false)} 
                                danger
                                loading={loading}
                            >
                                Không cho phép tiêm
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => handleConfirmVaccine(true)}
                                loading={loading}
                            >
                                Cho phép tiêm
                            </Button>
                        </Space>
                    ) : null
                }
                width={600}
            >
                {selectedVaccine && (
                    <div>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Card 
                                    size="small"
                                    title={
                                        <Space>
                                            <Text strong>{selectedVaccine.vaccineName}</Text>
                                            <Tag color="blue">{selectedVaccine.vaccineType}</Tag>
                                        </Space>
                                    }
                                >
                                    <Row gutter={[16, 8]}>
                                        <Col span={12}>
                                            <Text type="secondary">Trạng thái:</Text>
                                            <br />
                                            <Tag color={
                                                selectedVaccine.status === 'Đã tiêm' ? 'success' :
                                                selectedVaccine.status === 'Chờ xác nhận' ? 'warning' : 'default'
                                            }>
                                                {selectedVaccine.status}
                                            </Tag>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">Ngày tiêm:</Text>
                                            <br />
                                            <Text>{selectedVaccine.vaccinatedDate ? 
                                                dayjs(selectedVaccine.vaccinatedDate).format('DD/MM/YYYY') : 
                                                'Chưa có'}</Text>
                                        </Col>
                                        {selectedVaccine.status === 'Đã tiêm' && (
                                            <>
                                                <Col span={24}>
                                                    <Divider style={{ margin: '12px 0' }} />
                                                    <Text type="secondary">Ghi chú sau tiêm:</Text>
                                                    <br />
                                                    <Text>{selectedVaccine.notes || 'Không có ghi chú'}</Text>
                                                </Col>
                                                {selectedVaccine.location && (
                                                    <Col span={24}>
                                                        <Text type="secondary">Địa điểm tiêm:</Text>
                                                        <br />
                                                        <Text>{selectedVaccine.location}</Text>
                                                    </Col>
                                                )}
                                            </>
                                        )}
                                    </Row>
                                </Card>
                            </Col>
                            
                            {selectedVaccine.status === 'Chờ xác nhận' && (
                                <Col span={24}>
                                    <Alert
                                        message="Xác nhận tiêm vaccine"
                                        description="Vui lòng xem xét thông tin và quyết định cho phép tiêm vaccine này."
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
        </div>
    );
};

export default Vaccine;