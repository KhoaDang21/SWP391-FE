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
import { vaccineService, VaccineHistoryByMedicalRecordResponse } from '../../services/Vaccineservice';
import type { MedicalRecord } from '../../services/MedicalRecordService';
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Children = () => {
    const token = localStorage.getItem('accessToken') as string;


    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState<MedicalRecord[]>([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [vaccineHistories, setVaccineHistories] = useState<{ [medicalRecordId: number]: VaccineHistoryByMedicalRecordResponse }>(
        {}
    );

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
    const genderOptions = ['Nam', 'Nữ'];
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
            // chronicDiseases có thể là string hoặc mảng đối tượng
            const chronicArr: string[] = [];
            if (typeof editingChild.chronicDiseases === 'string') {
                chronicArr.push(
                    ...editingChild.chronicDiseases.split(',').map(s => s.trim()).filter(s => s)
                );
            }
            // allergies tương tự
            const allergyArr: string[] = [];
            if (typeof editingChild.allergies === 'string') {
                allergyArr.push(
                    ...editingChild.allergies.split(',').map(s => s.trim()).filter(s => s)
                );
            }

            form.setFieldsValue({
                ...editingChild,
                chronicDiseases: chronicArr,
                allergies: allergyArr,
                vaccines: editingChild.vaccines || [],
                // Nếu bạn dùng field "Class" trong Form.Item, nhớ setFieldsValue({ Class: editingChild.class || ... })
                Class: (editingChild as any).class || (editingChild as any).Class || undefined
            });
        }
    }, [editingChild]);

    const parseToObjArray = (val: any): { name: string }[] => {
        if (!val) return [];
        if (Array.isArray(val)) {
            return val.map((d: string) => ({ name: d }));
        }
        if (typeof val === 'string') {
            return val.split(',').map(s => ({ name: s.trim() })).filter(item => item.name);
        }
        return [];
    };

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
                    Class: values.Class,
                    height: Number(values.height),
                    weight: Number(values.weight),
                    bloodType: values.bloodType,
                    chronicDiseases: parseToObjArray(values.chronicDiseases),
                    allergies: parseToObjArray(values.allergies),
                    pastIllnesses: values.pastIllnesses || []
                }
            };

            console.log('Payload gửi BE:', newChild);

            if (editingChild) {
                await updateMedicalRecord(editingChild.ID!, newChild, token);
            } else {
                await createStudentWithMedicalRecord(newChild, token);
            }

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


    const showDeleteConfirm = (id: number) => {
        setDeletingId(id);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token || deletingId === null) return;

        try {
            await deleteMedicalRecord(deletingId, token);
            const updatedRecords = await getMedicalRecordsByGuardian(token);
            setChildren(updatedRecords);
        } catch (error) {
            console.error('Lỗi khi xóa hồ sơ y tế:', error);
        } finally {
            setIsDeleteModalVisible(false);
            setDeletingId(null);
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

    useEffect(() => {
        const fetchVaccineHistories = async () => {
            try {
                const histories: { [medicalRecordId: number]: VaccineHistoryByMedicalRecordResponse } = {};
                for (const child of children) {
                    if (child.ID) {
                        try {
                            const data = await vaccineService.getVaccineHistoryByMedicalRecordId(child.ID);
                            histories[child.ID] = data;
                            console.log(`Fetched vaccine history for child ID ${child.ID}:`, data);
                        } catch (e) {
                        }
                    }
                }
                setVaccineHistories(histories);
            } catch (error) {
            }
        };
        if (children.length > 0) {
            fetchVaccineHistories();
        }
    }, [children]);

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
                                            <DeleteOutlined key="delete" onClick={() => showDeleteConfirm(child.ID)} />
                                        ]}
                                    >
                                        <div style={{ marginBottom: '16px' }}>
                                            <Space>
                                                <Avatar size={64} icon={<UserOutlined />} />
                                                <div>
                                                    <Title level={4} style={{ margin: 0 }}>{child.fullname}</Title>
                                                    <Text type="secondary">Lớp : {child.Class || 'Chưa xác định'}  • Tuổi: {calculateAge(child.dateOfBirth)}</Text>
                                                    <br />
                                                    <Text type="secondary">Chiều cao: {child.height || 'Chưa xác định'} cm  • Cân nặng: {child.weight || 'Chưa xác định'} kg</Text>
                                                </div>
                                            </Space>
                                        </div>

                                        <Tabs size="small">
                                            <TabPane tab={<span><SafetyOutlined />Vaccine</span>} key="1">
                                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {vaccineHistories[child.ID] && vaccineHistories[child.ID].vaccineHistory.filter(v => v.Status === 'Đã tiêm').length > 0 ? (
                                                        vaccineHistories[child.ID].vaccineHistory
                                                            .filter(vaccine => vaccine.Status === 'Đã tiêm')
                                                            .map((vaccine, index) => (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        marginBottom: '8px',
                                                                        padding: '8px',
                                                                        backgroundColor: '#f6ffed',
                                                                        borderRadius: '4px',
                                                                        border: '1px solid #b7eb8f'
                                                                    }}
                                                                >
                                                                    <Text strong style={{ color: '#389e0d' }}>{vaccine.Vaccine_name}</Text>
                                                                    <br />
                                                                    <Text type="secondary" style={{ fontSize: '12px', color: '#389e0d' }}>
                                                                       Ngày Tiêm: {vaccine.Date_injection ? new Date(vaccine.Date_injection).toLocaleDateString('vi-VN') : ''} 
                                                                    </Text>
                                                                </div>
                                                            ))
                                                    ) : (
                                                        <Text type="secondary">Chưa có thông tin vaccine đã tiêm</Text>
                                                    )}
                                                </div>
                                            </TabPane>

                                            <TabPane tab={<div><MedicineBoxOutlined />Sức khỏe</div>} key="2">
                                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {(() => {
                                                        // Chuyển chronicDiseases thành array đối tượng { name: string }
                                                        let chronicArr: { name: string }[] = [];
                                                        if (Array.isArray(child.chronicDiseases)) {
                                                            chronicArr = child.chronicDiseases;
                                                        } else if (typeof child.chronicDiseases === 'string') {
                                                            chronicArr = child.chronicDiseases
                                                                .split(',')
                                                                .map(s => ({ name: s.trim() }))
                                                                .filter(item => item.name);
                                                        }
                                                        // Chuyển allergies thành array đối tượng { name: string }
                                                        let allergyArr: { name: string }[] = [];
                                                        if (Array.isArray(child.allergies)) {
                                                            allergyArr = child.allergies;
                                                        } else if (typeof child.allergies === 'string') {
                                                            allergyArr = child.allergies
                                                                .split(',')
                                                                .map(s => ({ name: s.trim() }))
                                                                .filter(item => item.name);
                                                        }
                                                        // Chuyển pastIllnesses thành array đối tượng { disease, date, treatment? }


                                                        return (
                                                            <>
                                                                {chronicArr.length > 0 && (
                                                                    <div style={{ marginBottom: 12 }}>
                                                                        <Text strong>Bệnh nền:</Text>
                                                                        <div style={{ marginTop: 4 }}>
                                                                            {chronicArr.map((disease, idx) => (
                                                                                <Tag key={idx} color="orange">{disease.name}</Tag>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {allergyArr.length > 0 && (
                                                                    <div style={{ marginBottom: 12 }}>
                                                                        <Text strong>Dị ứng:</Text>
                                                                        <div style={{ marginTop: 4 }}>
                                                                            {allergyArr.map((allergy, idx) => (
                                                                                <Tag key={idx} color="red">{allergy.name}</Tag>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}


                                                            </>
                                                        );
                                                    })()}
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
                            name="Class"
                            label="Lớp"
                            rules={[
                                { required: true, message: 'Vui lòng nhập lớp!' },
                                {
                                    pattern: /^[1-5][A-Z]$/,
                                    message: 'Lớp phải có định dạng như 1A, 2B... với số từ 1 đến 5 và một chữ cái in hoa.'
                                }
                            ]}
                        >
                            <Input placeholder="Nhập lớp (ví dụ: 1A, 5E)" />
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
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày sinh!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value) return Promise.resolve();

                                        const birthDate = new Date(value);
                                        const today = new Date();
                                        const age = today.getFullYear() - birthDate.getFullYear();
                                        const m = today.getMonth() - birthDate.getMonth();

                                        const isBirthdayPassed =
                                            m > 0 || (m === 0 && today.getDate() >= birthDate.getDate());
                                        const actualAge = isBirthdayPassed ? age : age - 1;

                                        if (actualAge < 5 || actualAge > 13) {
                                            return Promise.reject(new Error('Độ tuổi phải từ 5 đến 13 tuổi!'));
                                        }

                                        return Promise.resolve();
                                    }
                                })
                            ]}
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

                <Modal
                    title={
                        <span className="text-lg font-bold">
                            Xác nhận xóa
                        </span>
                    }
                    open={isDeleteModalVisible}
                    onOk={handleDelete}
                    onCancel={() => setIsDeleteModalVisible(false)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okType="danger"
                >
                    <p className="text-base font-semibold text-gray-800">Bạn có chắc chắn muốn xóa hồ sơ y tế của học sinh này không?</p>
                    <Text type="danger" className='text-sm'>
                        * Nếu xóa hồ sơ này, học sinh cũng sẽ bị xóa khỏi hệ thống. Hãy kiểm tra kỹ trước khi thực hiện.
                    </Text>
                </Modal>

            </div>
        </div>
    );
};

export default Children;