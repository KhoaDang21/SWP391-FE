import React, { useState } from 'react';
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

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Children = () => {
    const [children, setChildren] = useState([
        {
            id: 1,
            name: 'Nguyễn Văn A',
            dateOfBirth: '2018-05-15',
            gender: 'Nam',
            bloodType: 'O+',
            vaccines: [
                { name: 'BCG', date: '2018-06-01', status: 'Đã tiêm' },
                { name: 'Viêm gan B', date: '2018-07-15', status: 'Đã tiêm' },
                { name: 'DPT', date: '2018-08-20', status: 'Đã tiêm' }
            ],
            chronicDiseases: ['Hen suyễn nhẹ'],
            allergies: ['Phấn hoa', 'Tôm cua'],
            pastIllnesses: [
                { disease: 'Viêm phổi', date: '2020-12-10', treatment: 'Kháng sinh' },
                { disease: 'Sốt xuất huyết', date: '2021-06-20', treatment: 'Nhập viện 5 ngày' }
            ]
        }
    ]);

    interface Child {
        id: number;
        name: string;
        dateOfBirth: string;
        gender: string;
        bloodType: string;
        vaccines: { name: string; date: string; status: string }[];
        chronicDiseases: string[];
        allergies: string[];
        pastIllnesses: { disease: string; treatment: string; date: string }[];
    }


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [form] = Form.useForm();

    const childrenList = [
        { id: '1', name: 'Nguyễn Văn A' },
        { id: '2', name: 'Trần Thị B' },
        { id: '3', name: 'Lê Văn C' }
    ];

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

    const showModal = (child: Child | null = null) => {
        setEditingChild(child);
        setIsModalVisible(true);
        if (child) {
            form.setFieldsValue({
                ...child,
                dateOfBirth: child.dateOfBirth,
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

    const handleSubmit = (values: Omit<Child, 'id'>) => {
        const newChild = {
            ...values,
            id: editingChild ? editingChild.id : Date.now(),
        };
        console.log('Submitted values:', newChild);

        if (editingChild) {
            setChildren(children.map(child =>
                child.id === editingChild.id ? newChild : child
            ));
        } else {
            setChildren([...children, newChild]);
        }

        setIsModalVisible(false);
        setEditingChild(null);
        form.resetFields();
    };

    const deleteChild = (id: number) => {
        setChildren(children.filter(child => child.id !== id));
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

    const vaccineColumns = [
        {
            title: 'Vaccine',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ngày tiêm',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Đã tiêm' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
    ];


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
                                <Col xs={24} lg={12} key={child.id}>
                                    <Card
                                        style={{ height: '100%' }}
                                        actions={[
                                            <EditOutlined key="edit" onClick={() => showModal(child)} />,
                                            <DeleteOutlined key="delete" onClick={() => deleteChild(child.id)} />
                                        ]}
                                    >
                                        <div style={{ marginBottom: '16px' }}>
                                            <Space>
                                                <Avatar size={64} icon={<UserOutlined />} />
                                                <div>
                                                    <Title level={4} style={{ margin: 0 }}>{child.name}</Title>
                                                    <Text type="secondary">
                                                        {calculateAge(child.dateOfBirth)} tuổi • {child.gender}
                                                    </Text>
                                                    <br />
                                                    <Text type="secondary">Nhóm máu: {child.bloodType || 'Chưa xác định'}</Text>
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

                                            <TabPane tab={<span><MedicineBoxOutlined />Sức khỏe</span>} key="2">
                                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {child.chronicDiseases && child.chronicDiseases.length > 0 && (
                                                        <div style={{ marginBottom: '12px' }}>
                                                            <Text strong>Bệnh nền:</Text>
                                                            <div style={{ marginTop: '4px' }}>
                                                                {child.chronicDiseases.map((disease, index) => (
                                                                    <Tag key={index} color="orange">{disease}</Tag>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {child.allergies && child.allergies.length > 0 && (
                                                        <div style={{ marginBottom: '12px' }}>
                                                            <Text strong>Dị ứng:</Text>
                                                            <div style={{ marginTop: '4px' }}>
                                                                {child.allergies.map((allergy, index) => (
                                                                    <Tag key={index} color="red">{allergy}</Tag>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {child.pastIllnesses && child.pastIllnesses.length > 0 && (
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
                            name="name"
                            label="Chọn con"
                            rules={[{ required: true, message: 'Vui lòng chọn con!' }]}
                        >
                            <Select placeholder="Chọn tên con">
                                {childrenList.map(child => (
                                    <Select.Option key={child.id} value={child.name}>
                                        {child.name}
                                    </Select.Option>
                                ))}
                            </Select>
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
                                                    <Input type="date" />
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
                                                <Button type="link" onClick={() => remove(field.name)}>
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
                                                    <Input type="date" />
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
                                                <Button type="link" onClick={() => remove(field.name)}>
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
                                <Button type="primary" htmlType="submit">
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