import React, { useState } from 'react';
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
    Badge
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
    ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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

// Interface cho lịch sử tiêm vaccine
interface VaccineRecord {
    vaccineId: string;
    isVaccinated: boolean;
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
}

const Vaccine: React.FC = () => {
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

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

    // Mock data học sinh
    const [students, setStudents] = useState<Student[]>([
        {
            id: '1',
            name: 'Nguyễn Văn A',
            dateOfBirth: '2018-05-15',
            class: '4A3',
            studentCode: 'HS001',
            totalVaccinated: 12,
            vaccineRecords: [
                { vaccineId: '1', isVaccinated: true, vaccinatedDate: '2018-06-01', location: 'Bệnh viện Nhi Trung ương' },
                { vaccineId: '2', isVaccinated: true, vaccinatedDate: '2018-07-15', location: 'Trạm y tế phường' },
                { vaccineId: '3', isVaccinated: true, vaccinatedDate: '2018-08-20', location: 'Trường học' },
                { vaccineId: '4', isVaccinated: true, vaccinatedDate: '2018-08-20', location: 'Trường học' },
                { vaccineId: '5', isVaccinated: true, vaccinatedDate: '2018-09-10', location: 'Bệnh viện tư' },
                { vaccineId: '6', isVaccinated: true, vaccinatedDate: '2018-09-25', location: 'Trường học' },
                { vaccineId: '7', isVaccinated: true, vaccinatedDate: '2018-10-15', location: 'Trạm y tế' },
                { vaccineId: '8', isVaccinated: true, vaccinatedDate: '2019-02-10', location: 'Trường học' },
                { vaccineId: '9', isVaccinated: true, vaccinatedDate: '2019-02-10', location: 'Trường học' },
                { vaccineId: '10', isVaccinated: true, vaccinatedDate: '2019-02-10', location: 'Trường học' },
                { vaccineId: '11', isVaccinated: true, vaccinatedDate: '2019-03-15', location: 'Bệnh viện tư' },
                { vaccineId: '12', isVaccinated: true, vaccinatedDate: '2019-04-20', location: 'Trạm y tế' },
                { vaccineId: '13', isVaccinated: false },
                { vaccineId: '14', isVaccinated: false }
            ]
        },
        {
            id: '2',
            name: 'Trần Thị B',
            dateOfBirth: '2019-03-20',
            class: '2A5',
            studentCode: 'HS002',
            totalVaccinated: 10,
            vaccineRecords: [
                { vaccineId: '1', isVaccinated: true, vaccinatedDate: '2019-04-01', location: 'Trường học' },
                { vaccineId: '2', isVaccinated: true, vaccinatedDate: '2019-05-15', location: 'Trường học' },
                { vaccineId: '3', isVaccinated: true, vaccinatedDate: '2019-06-20', location: 'Trạm y tế' },
                { vaccineId: '4', isVaccinated: true, vaccinatedDate: '2019-06-20', location: 'Trạm y tế' },
                { vaccineId: '5', isVaccinated: true, vaccinatedDate: '2019-07-10', location: 'Bệnh viện tư' },
                { vaccineId: '6', isVaccinated: false },
                { vaccineId: '7', isVaccinated: true, vaccinatedDate: '2019-08-15', location: 'Trường học' },
                { vaccineId: '8', isVaccinated: true, vaccinatedDate: '2019-12-10', location: 'Trường học' },
                { vaccineId: '9', isVaccinated: true, vaccinatedDate: '2020-01-15', location: 'Trường học' },
                { vaccineId: '10', isVaccinated: true, vaccinatedDate: '2020-01-15', location: 'Trường học' },
                { vaccineId: '11', isVaccinated: true, vaccinatedDate: '2020-02-20', location: 'Bệnh viện tư' },
                { vaccineId: '12', isVaccinated: true, vaccinatedDate: '2020-03-25', location: 'Trạm y tế' },
                { vaccineId: '13', isVaccinated: false },
                { vaccineId: '14', isVaccinated: false }
            ]
        }

    ]);

    // Xem chi tiết vaccine của học sinh
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

            // Cập nhật selectedStudent để hiển thị dữ liệu mới
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
                                extra={<Text type="secondary">Mã HS: {student.studentCode}</Text>}
                                actions={[
                                    <Button type="link" onClick={() => handleViewDetail(student)}>
                                        Chi tiết
                                    </Button>
                                ]}
                            >
                                <p><Text type="secondary">Lớp:</Text> {student.class}</p>
                                <p><Text type="secondary">Ngày sinh:</Text> {dayjs(student.dateOfBirth).format('DD/MM/YYYY')}</p>
                                <p><Text type="secondary">Tổng vaccine đã tiêm:</Text> {student.totalVaccinated}/14</p>
                                <p><Text type="secondary">Vaccine bắt buộc:</Text> {vaccinatedRequired}/{requiredVaccines}</p>

                                <Progress
                                    percent={Math.round(percentage)}
                                    status={
                                        percentage >= 90 ? 'success' :
                                            percentage >= 70 ? 'active' :
                                                percentage >= 50 ? 'normal' : 'exception'
                                    }
                                    size="small"
                                />

                                <div style={{ marginTop: 12 }}>
                                    {
                                        percentage >= 90 ? <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn thành</Tag> :
                                            percentage >= 70 ? <Tag color="blue" icon={<ExclamationCircleOutlined />}>Gần hoàn thành</Tag> :
                                                percentage >= 50 ? <Tag color="orange" icon={<ExclamationCircleOutlined />}>Đang tiêm</Tag> :
                                                    <Tag color="red" icon={<CloseCircleOutlined />}>Chưa đầy đủ</Tag>
                                    }
                                </div>
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
                                    <Text strong>Mã HS:</Text> {selectedStudent.studentCode}
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
                            dataSource={vaccineTypes}
                            renderItem={(vaccine) => {
                                const record = selectedStudent.vaccineRecords.find(r => r.vaccineId === vaccine.id);
                                const isEditing = editMode === vaccine.id;

                                return (
                                    <List.Item
                                        style={{
                                            backgroundColor: record?.isVaccinated ? '#f6ffed' : '#fafafa',
                                            marginBottom: 8,
                                            padding: 16,
                                            borderRadius: 8,
                                            border: `1px solid ${record?.isVaccinated ? '#b7eb8f' : '#d9d9d9'}`
                                        }}
                                        actions={[
                                            <Button
                                                key="edit"
                                                type={isEditing ? "primary" : "default"}
                                                icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                                                size="small"
                                                loading={loading && isEditing}
                                                onClick={() => {
                                                    if (isEditing) {
                                                        form.submit();
                                                    } else {
                                                        setEditMode(vaccine.id);
                                                        form.setFieldsValue({
                                                            isVaccinated: record?.isVaccinated || false,
                                                            vaccinatedDate: record?.vaccinatedDate ? dayjs(record.vaccinatedDate) : null,
                                                            location: record?.location || '',
                                                            notes: record?.notes || '',
                                                            batchNumber: record?.batchNumber || ''
                                                        });
                                                    }
                                                }}
                                            >
                                                {isEditing ? 'Lưu' : 'Sửa'}
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Badge
                                                    count={record?.isVaccinated ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                                                >
                                                    <Avatar
                                                        style={{ backgroundColor: record?.isVaccinated ? '#52c41a' : '#d9d9d9' }}
                                                        icon={<MedicineBoxOutlined />}
                                                    />
                                                </Badge>
                                            }
                                            title={
                                                <Space>
                                                    <Text strong style={{ color: record?.isVaccinated ? '#52c41a' : '#8c8c8c' }}>
                                                        {vaccine.name}
                                                    </Text>
                                                    {vaccine.isRequired && <Tag color="red" >Bắt buộc</Tag>}
                                                </Space>
                                            }
                                            description={
                                                <div>
                                                    <Text type="secondary">{vaccine.description}</Text>
                                                    <br />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        Độ tuổi khuyến nghị: {vaccine.recommendedAge}
                                                    </Text>
                                                    {record?.isVaccinated && record.vaccinatedDate && (
                                                        <>
                                                            <br />
                                                            <Space size="small">
                                                                <CalendarOutlined style={{ color: '#52c41a' }} />
                                                                <Text style={{ color: '#52c41a', fontSize: 12 }}>
                                                                    Đã tiêm: {dayjs(record.vaccinatedDate).format('DD/MM/YYYY')}
                                                                </Text>
                                                                {record.location && <Text type="secondary" style={{ fontSize: 12 }}>• {record.location}</Text>}
                                                            </Space>
                                                        </>
                                                    )}

                                                    {isEditing && (
                                                        <Form
                                                            form={form}
                                                            onFinish={(values) => handleUpdateVaccine(vaccine.id, values)}
                                                            style={{ marginTop: 12 }}
                                                        >
                                                            <Row gutter={8}>
                                                                <Col span={6}>
                                                                    <Form.Item name="isVaccinated" valuePropName="checked" style={{ marginBottom: 8 }}>
                                                                        <Switch checkedChildren="Đã tiêm" unCheckedChildren="Chưa tiêm" />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col span={6}>
                                                                    <Form.Item name="vaccinatedDate" style={{ marginBottom: 8 }}>
                                                                        <DatePicker size="small" placeholder="Ngày tiêm" style={{ width: '100%' }} />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col span={12}>
                                                                    <Form.Item name="location" style={{ marginBottom: 8 }}>
                                                                        <Select size="small" placeholder="Nơi tiêm" allowClear>
                                                                            <Option value="Trường học">Trường học</Option>
                                                                            <Option value="Trạm y tế phường">Trạm y tế phường</Option>
                                                                            <Option value="Bệnh viện tư">Bệnh viện tư</Option>
                                                                            <Option value="Bệnh viện công">Bệnh viện công</Option>
                                                                            <Option value="Khác">Khác</Option>
                                                                        </Select>
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                            <Row gutter={8}>
                                                                <Col span={12}>
                                                                    <Form.Item name="batchNumber" style={{ marginBottom: 8 }}>
                                                                        <Input size="small" placeholder="Số lô vaccine" />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col span={12}>
                                                                    <Form.Item name="notes" style={{ marginBottom: 0 }}>
                                                                        <Input size="small" placeholder="Ghi chú" />
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        </Form>
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
        </div>
    );
};

export default Vaccine;