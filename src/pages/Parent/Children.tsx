import React, { useEffect, useState } from 'react';
import {
    Card,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Table,
    Modal,
    Tabs,
    Tag,
    Space,
    Divider,
    Row,
    Col,
    Avatar,
    Typography,
    Alert,
    Checkbox,
    InputNumber
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    MedicineBoxOutlined,
    HeartOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import { getStudentsByGuardianUserId } from '../../services/AccountService';
import { createStudentWithMedicalRecord, deleteMedicalRecord, getMedicalRecordsByGuardian, updateMedicalRecord } from '../../services/MedicalRecordService';
import type { MedicalRecord } from '../../services/MedicalRecordService';
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Children = () => {
    const token = localStorage.getItem('accessToken') as string;


    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState<MedicalRecord[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const records = await getMedicalRecordsByGuardian(token);
                console.log('Fetched medical records:', records);
                setChildren(records);
            } catch (error) {
                console.error('Lỗi khi lấy hồ sơ y tế:', error);
            }
        };

        fetchData();
    }, []);

    interface Child {
        id: number;
        name: string;
        dateOfBirth: string;
        gender: string;
        bloodType: string;
        height: number;
        weight: number;
        vaccines: { name: string; date: string; status: string }[];
        chronicDiseases: string[];
        allergies: string[];
        pastIllnesses: { disease: string; treatment: string; date: string }[];
    }


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingChild, setEditingChild] = useState<MedicalRecord | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const user = localStorage.getItem('user');

                const userIdStr = user ? JSON.parse(user).id : null;

                if (!userIdStr || !token) {
                    console.error('Không tìm thấy userId hoặc token');
                    return;
                }

                const userId = parseInt(userIdStr, 10);
                const data = await getStudentsByGuardianUserId(userId, token);
                console.log('Fetched children data:', data);
                const studentList = data.students.map((student: any) => ({
                    id: student.id,
                    name: student.fullname
                }));
                console.log('Processed children list:', studentList);
                setChildrenList(studentList);
            } catch (error) {
                console.error('Lỗi lấy danh sách học sinh:', error);
            }
        };

        fetchChildren();
    }, []);


    const [childrenList, setChildrenList] = useState<{ id: number; name: string }[]>([]);

    // const availableChildren = childrenList.filter(child => {
    //     const alreadyUsed = children.some(record =>
    //         record.userId === child.id && record.userId !== editingChild?.userId
    //     );
    //     return !alreadyUsed;
    // });


    const vaccineOptions = [
        'BCG', 'Viêm gan B', 'DPT', 'Bại liệt', 'Sởi', 'Rubella',
        'Quai bị', 'Thủy đậu', 'Cúm', 'Phế cầu', 'Não mô cầu',
        'Rotavirus', 'HPV', 'COVID-19'
    ];

    const commonDiseases = [
        'Hen suyễn', 'Dị ứng da', 'Viêm mũi dị ứng', 'Tiểu đường type 1',
        'Bệnh tim bẩm sinh', 'Động kinh', 'Tự kỷ', 'ADHD'
    ];

    const commonAllergies = [
        'Phấn hoa', 'Bụi nhà', 'Lông động vật', 'Tôm cua', 'Sữa',
        'Trứng', 'Đậu phộng', 'Kháng sinh Penicillin', 'Aspirin'
    ];
    const genderOptions = ['Nam', 'Nữ', 'Khác'];
    const showModal = (child: MedicalRecord | null = null) => {
        setEditingChild(child);
        setIsModalVisible(true);
        console.log('Editing child:', child);
        if (child) {
            form.setFieldsValue({
                ...child,
                vaccines: child.vaccines || [],
                chronicDiseases: child.chronicDiseases || [],
                allergies: child.allergies || [],
                pastIllnesses: child.pastIllnesses || []
            });
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingChild(null);
        form.resetFields();
    };

    useEffect(() => {
        if (editingChild) {
            form.setFieldsValue({
                ...editingChild,
                chronicDiseases: editingChild.chronicDiseases?.map((item: any) =>
                    typeof item.name === 'string' ? item.name : item.name?.name
                ),
                allergies: editingChild.allergies?.map((item: any) =>
                    typeof item.name === 'string' ? item.name : item.name?.name
                ),
                pastIllnesses: editingChild.pastIllnesses || [],
                vaccines: editingChild.vaccines || [],
            });
        }
    }, [editingChild]);


    const handleSubmit = async (values: any) => {
        const token = localStorage.getItem('accessToken') as string;
        if (!token) {
            console.error('Không tìm thấy token');
            return;
        }

        const user = localStorage.getItem('user');

        const userIdStr = user ? JSON.parse(user).id : null;
        console.log('User ID String:', userIdStr);

        setLoading(true);

        try {
            const newChild = {
                guardianUserId: userIdStr,
                student: {
                    fullname: values.fullname,
                    dateOfBirth: values.dateOfBirth,
                    gender: values.gender
                },
                medicalRecord: {
                    class: values.class,
                    height: Number(values.height),
                    weight: Number(values.weight),
                    bloodType: values.bloodType,
                    chronicDiseases: values.chronicDiseases?.map((d: string) => ({ name: d })) || [],
                    allergies: values.allergies?.map((a: string) => ({ name: a })) || [],
                    pastIllnesses: values.pastIllnesses || []
                }
            };

            console.log('Payload gửi BE:', newChild);

            // if (editingChild) {
            //     await updateMedicalRecord(editingChild.MR_ID!, newChild, token);
            // } else {
            await createStudentWithMedicalRecord(newChild, token);
            // }

            const updatedRecords = await getMedicalRecordsByGuardian(token);
            setChildren(updatedRecords);

            setIsModalVisible(false);
            setEditingChild(null);
            form.resetFields();
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi gửi form:', error);
            setLoading(false);
        }
    };


    const deleteChild = async (id: number) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            await deleteMedicalRecord(id, token);
            const updatedRecords = await getMedicalRecordsByGuardian(token);
            setChildren(updatedRecords);
        } catch (error) {
            console.error('Lỗi khi xóa hồ sơ y tế:', error);
        }
    };


    const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
                {/* Banner full width */}
                <div
                    style={{
                        marginBottom: '24px',
                        textAlign: 'center',
                        padding: '50px',
                        paddingBottom: '80px',
                        paddingTop: '80px',
                        background: 'linear-gradient(to right, #2563eb, #06b6d4)',
                        color: '#ffffff',
                    }}
                >
                    <Title
                        level={2}
                        style={{
                            color: '#ffffff',
                            marginBottom: '8px',
                        }}
                    >
                        <HeartOutlined /> Hồ Sơ Sức Khỏe Trẻ Em
                    </Title>
                    <Text style={{ color: '#ffffff', opacity: 0.9 }}>
                        Quản lý thông tin sức khỏe toàn diện cho con em của bạn
                    </Text>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => showModal()}
                                size="large"
                            >
                                Thêm Hồ Sơ Con Em
                            </Button>
                        </div>


                        <Row gutter={[16, 16]}>
                            {children.map(child => (
                                <Col xs={24} lg={12} key={child.userId}>
                                    <Card
                                        style={{ height: '100%' }}
                                        actions={[
                                            <EditOutlined key="edit" onClick={() => showModal(child)} />,
                                            <DeleteOutlined key="delete" onClick={() => deleteChild(child.ID)} />
                                        ]}
                                    >
                                        <div style={{ marginBottom: '16px' }}>
                                            <Space>
                                                <Avatar size={64} icon={<UserOutlined />} />
                                                <div>
                                                    <Title level={4} style={{ margin: 0 }}>{child.fullname}</Title>
                                                    <Text type="secondary">Chiều cao: {child.height || 'Chưa xác định'} cm  • Cân nặng: {child.weight || 'Chưa xác định'} kg</Text>
                                                </div>
                                            </Space>
                                        </div>

                                        <Tabs size="small">
                                            <TabPane tab={<span><SafetyOutlined />Vaccine</span>} key="1">
                                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {child.vaccines && child.vaccines.length > 0 ? (
                                                        child.vaccines.map((vaccine, index) => (
                                                            <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                                                                <Text strong>{vaccine.name}</Text>
                                                                <br />
                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                    {vaccine.date} • {vaccine.status}
                                                                </Text>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <Text type="secondary">Chưa có thông tin vaccine</Text>
                                                    )}
                                                </div>
                                            </TabPane>

                                            <TabPane tab={<div><MedicineBoxOutlined />Sức khỏe</div>} key="2">
                                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {Array.isArray(child.chronicDiseases) && child.chronicDiseases.length > 0 && (
                                                        <div style={{ marginBottom: '12px' }}>
                                                            <Text strong>Bệnh nền:</Text>
                                                            <div style={{ marginTop: '4px' }}>
                                                                {child.chronicDiseases.map((disease, index) => (
                                                                    <Tag key={index} color="orange">{disease.name}</Tag>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {Array.isArray(child.allergies) && child.allergies.length > 0 && (
                                                        <div style={{ marginBottom: '12px' }}>
                                                            <Text strong>Dị ứng:</Text>
                                                            <div style={{ marginTop: '4px' }}>
                                                                {child.allergies.map((allergy, index) => (
                                                                    <Tag key={index} color="red">{allergy.name}</Tag>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {Array.isArray(child.pastIllnesses) && child.pastIllnesses.length > 0 && (
                                                        <div>
                                                            <Text strong>Bệnh đã mắc:</Text>
                                                            <div style={{ marginTop: '4px' }}>
                                                                {child.pastIllnesses.map((illness, index) => (
                                                                    <div key={index} style={{ marginBottom: '4px', fontSize: '12px' }}>
                                                                        <Text>{illness.disease}</Text> - <Text type="secondary">{illness.date}</Text>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabPane>

                                        </Tabs>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* Modal for adding/editing child profile */}

                <Modal
                    title={editingChild ? "Chỉnh Sửa Hồ Sơ" : "Thêm Hồ Sơ Mới"}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={800}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Alert
                            message="Thông tin cơ bản"
                            type="info"
                            showIcon
                            style={{ marginBottom: '16px' }}
                        />

                        <Form.Item
                            name="fullname"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input placeholder="Nhập họ và tên" />
                        </Form.Item>



                        <Form.Item
                            name="class"
                            label="Lớp"
                            rules={[{ required: true, message: 'Vui lòng nhập lớp!' }]}
                        >
                            <Input placeholder="Nhập lớp" />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Giới tính"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        >
                            <Select placeholder="Chọn giới tính">
                                {genderOptions.map(gender => (
                                    <Select.Option key={gender} value={gender}>{gender}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="dateOfBirth"
                            label="Ngày sinh"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                        >
                            <Input
                                type="date"
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="height"
                            label="Chiều cao (cm)"
                            rules={[
                                { required: true, message: 'Vui lòng nhập chiều cao!' },
                                {
                                    validator: (_, value) =>
                                        value > 0 ? Promise.resolve() : Promise.reject('Chiều cao phải lớn hơn 0'),
                                },
                            ]}
                        >
                            <Input type="number" min={1} placeholder="Nhập chiều cao" />
                        </Form.Item>

                        <Form.Item
                            name="weight"
                            label="Cân nặng (kg)"
                            rules={[
                                { required: true, message: 'Vui lòng nhập cân nặng!' },
                                {
                                    validator: (_, value) =>
                                        value > 0 ? Promise.resolve() : Promise.reject('Cân nặng phải lớn hơn 0'),
                                },
                            ]}
                        >
                            <Input type="number" min={1} placeholder="Nhập cân nặng" />
                        </Form.Item>



                        <Divider />

                        <Alert
                            message="Thông tin tiêm chủng"
                            type="success"
                            showIcon
                            style={{ marginBottom: '16px' }}
                        />

                        <Form.List name="vaccines">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(field => (
                                        <Row key={field.key} gutter={16} align="middle">
                                            <Col span={8}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'name']}
                                                    label={field.key === 0 ? "Tên Vaccine" : ""}
                                                >
                                                    <Select placeholder="Chọn vaccine">
                                                        {vaccineOptions.map(vaccine => (
                                                            <Option key={vaccine} value={vaccine}>{vaccine}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'date']}
                                                    label={field.key === 0 ? "Ngày tiêm" : ""}
                                                >
                                                    <Input
                                                        type="date"
                                                        max={new Date().toISOString().split("T")[0]}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'status']}
                                                    label={field.key === 0 ? "Trạng thái" : ""}
                                                >
                                                    <Select placeholder="Trạng thái">
                                                        <Option value="Đã tiêm">Đã tiêm</Option>
                                                        <Option value="Chưa tiêm">Chưa tiêm</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                {field.key === 0 && <div style={{ height: '22px' }} />}
                                                <Button className='mb-4' onClick={() => remove(field.name)}>
                                                    Xóa
                                                </Button>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm Vaccine
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Divider />

                        <Alert
                            message="Thông tin sức khỏe"
                            type="warning"
                            showIcon
                            style={{ marginBottom: '16px' }}
                        />

                        <Form.Item name="bloodType" label="Nhóm máu">
                            <Select placeholder="Chọn nhóm máu">
                                <Option value="A+">A+</Option>
                                <Option value="A-">A-</Option>
                                <Option value="B+">B+</Option>
                                <Option value="B-">B-</Option>
                                <Option value="AB+">AB+</Option>
                                <Option value="AB-">AB-</Option>
                                <Option value="O+">O+</Option>
                                <Option value="O-">O-</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="chronicDiseases" label="Bệnh nền">
                            <Select
                                mode="multiple"
                                placeholder="Chọn các bệnh nền (nếu có)"
                                style={{ width: '100%' }}
                            >
                                {commonDiseases.map(disease => (
                                    <Option key={disease} value={disease}>{disease}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="allergies" label="Dị ứng">
                            <Select
                                mode="multiple"
                                placeholder="Chọn các loại dị ứng (nếu có)"
                                style={{ width: '100%' }}
                            >
                                {commonAllergies.map(allergy => (
                                    <Option key={allergy} value={allergy}>{allergy}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.List name="pastIllnesses">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(field => (
                                        <Row key={field.key} gutter={16} align="middle">
                                            <Col span={8}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'disease']}
                                                    label={field.key === 0 ? "Bệnh đã mắc" : ""}
                                                >
                                                    <Input placeholder="Tên bệnh" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'date']}
                                                    label={field.key === 0 ? "Ngày mắc" : ""}
                                                >
                                                    <Input
                                                        type="date"
                                                        max={new Date().toISOString().split("T")[0]}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'treatment']}
                                                    label={field.key === 0 ? "Điều trị" : ""}
                                                >
                                                    <Input placeholder="Cách điều trị" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                {field.key === 0 && <div style={{ height: '22px' }} />}
                                                <Button className='mb-4' onClick={() => remove(field.name)}>
                                                    Xóa
                                                </Button>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm Bệnh Đã Mắc
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
                            <Space>
                                <Button onClick={handleCancel}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {editingChild ? 'Cập Nhật' : 'Thêm Mới'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Children;