import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Input, Space, Tooltip, Popconfirm, Modal, Form, Switch } from 'antd';
import { SearchOutlined, EyeOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, MailOutlined, LockOutlined, IdcardOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { User, getAllUsers, getRoleName, deleteUser, registerUser, RegisterUserDto, createGuardianWithStudents, deleteGuardianByObId, Guardian, getAllGuardians } from '../../../services/AccountService';
import { notificationService } from '../../../services/NotificationService';

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [registerForm] = Form.useForm();
    const [registerLoading, setRegisterLoading] = useState(false);
    const [isGuardianRegisterModalVisible, setIsGuardianRegisterModalVisible] = useState(false);
    const [guardianRegisterForm] = Form.useForm();
    const [guardianRegisterLoading, setGuardianRegisterLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                notificationService.error('Vui lòng đăng nhập để tiếp tục');
                return;
            }
            const data = await getAllUsers(token);
            setUsers(data);
            setFilteredUsers(data);
        } catch (error: any) {
            notificationService.error(error.message || 'Có lỗi xảy ra khi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(value.toLowerCase()) ||
            user.fullname.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase()) ||
            user.phoneNumber.includes(value)
        );
        setFilteredUsers(filtered);
    };

    const handleDelete = async (userId: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                notificationService.error('Vui lòng đăng nhập để tiếp tục');
                return;
            }

            // Find the user to get their roleId
            const userToDelete = users.find(user => user.id === userId);

            if (!userToDelete) {
                notificationService.error('Không tìm thấy người dùng để xóa.');
                return;
            }

            if (userToDelete.roleId === 4) { // If it's a Guardian
                try {
                    const allGuardians: Guardian[] = await getAllGuardians(token);
                    const guardian = allGuardians.find(g => g.userId === userId);
                    if (guardian) {
                        await deleteGuardianByObId(guardian.obId, token);
                        notificationService.success('Xóa người dùng thành công');
                    } else {
                        notificationService.error('Không tìm thấy thông tin phụ huynh để xóa.');
                    }
                } catch (guardianError: any) {
                    const message = guardianError.message === 'Cannot delete admin user'
                        ? 'Không thể xóa người dùng có vai trò admin'
                        : guardianError.message || 'Có lỗi xảy ra khi xóa người dùng';
                    notificationService.error(message);
                }
            } else {
                await deleteUser(userId, token);
                notificationService.success('Xóa người dùng thành công');
            }
            fetchUsers();
        } catch (error: any) {
            const message = error.message === 'Cannot delete admin user'
                ? 'Không thể xóa người dùng có vai trò admin'
                : error.message || 'Có lỗi xảy ra khi xóa người dùng';
            notificationService.error(message);
        }
    };

    const getRoleColor = (roleId: number): string => {
        switch (roleId) {
            case 1:
                return 'red';
            case 2:
                return 'green';
            case 3:
                return 'blue';
            case 4:
                return 'purple'
            default:
                return 'default';
        }
    };

    const columns: ColumnsType<User> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id: number) => (
                <span className="font-medium text-gray-600">#{id}</span>
            ),
        },
        {
            title: 'Thông tin người dùng',
            dataIndex: 'fullname',
            key: 'fullname',
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{record.fullname}</span>
                    <span className="text-sm text-gray-500">@{record.username}</span>
                </div>
            ),
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            render: (_, record) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <MailOutlined className="text-blue-500" />
                        <span className="text-gray-600">{record.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PhoneOutlined className="text-green-500" />
                        <span className="text-gray-600">{record.phoneNumber}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'roleId',
            key: 'roleId',
            width: 120,
            render: (roleId: number) => {
                const roleStyles = {
                    minWidth: '90px',
                    textAlign: 'center',
                    padding: '4px 12px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    fontSize: '12px'
                } as React.CSSProperties;

                return (
                    <Tag
                        color={getRoleColor(roleId)}
                        style={roleStyles}
                    >
                        {getRoleName(roleId)}
                    </Tag>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined className="text-blue-500 hover:text-blue-600" />}
                            onClick={() => navigate(`/admin/management/users/${record.id}`)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="topRight"
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    const handleRegister = async (values: RegisterUserDto) => {
        try {
            setRegisterLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) {
                notificationService.error('Vui lòng đăng nhập để tiếp tục');
                return;
            }

            await registerUser(values, token);
            notificationService.success('Đăng ký người dùng thành công');
            setIsRegisterModalVisible(false);
            registerForm.resetFields();
            fetchUsers();
        } catch (error: any) {
            notificationService.error(error.message || 'Có lỗi xảy ra khi đăng ký người dùng');
        } finally {
            setRegisterLoading(false);
        }
    };

    const handleRegisterGuardian = async (values: any) => {
        try {
            setGuardianRegisterLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) {
                notificationService.error('Vui lòng đăng nhập để tiếp tục');
                return;
            }

            await createGuardianWithStudents(values, token);
            notificationService.success('Đăng ký phụ huynh và học sinh thành công');
            setIsGuardianRegisterModalVisible(false);
            guardianRegisterForm.resetFields();
            fetchUsers();
        } catch (error: any) {
            notificationService.error(error.message || 'Có lỗi xảy ra khi đăng ký phụ huynh và học sinh');
        } finally {
            setGuardianRegisterLoading(false);
        }
    };

    return (
        <Card className="shadow-md">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">
                    Quản lý người dùng
                </h1>
                <Space>
                    <Input
                        placeholder="Tìm kiếm người dùng..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="min-w-[300px]"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear
                    />
                    <Button
                        type="primary"
                        onClick={() => setIsRegisterModalVisible(true)}
                        style={{ backgroundColor: '#28a745' }}
                    >
                        Thêm quản lý
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => setIsGuardianRegisterModalVisible(true)}
                        style={{ backgroundColor: '#1890ff' }}
                    >
                        Thêm phụ huynh
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) => `Tổng số ${total} người dùng`,
                }}
                className="border border-gray-200 rounded-lg"
            />

            <Modal
                title="Thêm quản lý mới"
                open={isRegisterModalVisible}
                onCancel={() => {
                    setIsRegisterModalVisible(false);
                    registerForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={registerForm}
                    layout="vertical"
                    onFinish={handleRegister}
                >
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                            { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
                        ]}
                    >
                        <Input prefix={<IdcardOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="fullname"
                        label="Họ và tên"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên' },
                            { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
                            }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} />
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Button
                            onClick={() => {
                                setIsRegisterModalVisible(false);
                                registerForm.resetFields();
                            }}
                            style={{ marginRight: 8 }}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={registerLoading}
                            style={{ backgroundColor: '#1890ff' }}
                        >
                            Thêm quản lý
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm phụ huynh và học sinh mới"
                open={isGuardianRegisterModalVisible}
                onCancel={() => {
                    setIsGuardianRegisterModalVisible(false);
                    guardianRegisterForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={guardianRegisterForm}
                    layout="vertical"
                    onFinish={handleRegisterGuardian}
                >
                    <Form.Item
                        name="fullname"
                        label="Họ và tên phụ huynh"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên phụ huynh' }, { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự' }]}
                    >
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Tên đăng nhập phụ huynh"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập phụ huynh' }, { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }]}
                    >
                        <Input prefix={<IdcardOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email phụ huynh"
                        rules={[{ required: true, message: 'Vui lòng nhập email phụ huynh' }, { type: 'email', message: 'Email không hợp lệ' }]}
                    >
                        <Input prefix={<MailOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu phụ huynh"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu phụ huynh' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại phụ huynh"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại phụ huynh' }, { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }]}
                    >
                        <Input prefix={<PhoneOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="roleInFamily"
                        label="Vai trò trong gia đình"
                        rules={[{ required: true, message: 'Vui lòng nhập vai trò trong gia đình' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="isCallFirst"
                        label="Ưu tiên gọi đầu tiên"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.List name="students">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card
                                        key={key}
                                        size="small"
                                        title={`Học sinh ${name + 1}`}
                                        extra={<Button type="text" danger onClick={() => remove(name)}>Xóa</Button>}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'fullname']}
                                            label="Họ và tên học sinh"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên học sinh' }]}
                                        >
                                            <Input prefix={<UserOutlined />} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'username']}
                                            label="Tên đăng nhập học sinh"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập học sinh' }]}
                                        >
                                            <Input prefix={<IdcardOutlined />} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'email']}
                                            label="Email học sinh"
                                            rules={[{ required: true, message: 'Vui lòng nhập email học sinh' }, { type: 'email', message: 'Email không hợp lệ' }]}
                                        >
                                            <Input prefix={<MailOutlined />} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'password']}
                                            label="Mật khẩu học sinh"
                                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu học sinh' }]}
                                        >
                                            <Input.Password prefix={<LockOutlined />} />
                                        </Form.Item>
                                    </Card>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm học sinh
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item className="mb-0 text-right">
                        <Button
                            onClick={() => {
                                setIsGuardianRegisterModalVisible(false);
                                guardianRegisterForm.resetFields();
                            }}
                            style={{ marginRight: 8 }}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={guardianRegisterLoading}
                            style={{ backgroundColor: '#28a745' }}
                        >
                            Thêm phụ huynh và học sinh
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default UserManagement; 