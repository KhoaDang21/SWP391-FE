import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, message, Skeleton, Tag, Modal, Form, Input } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { User, getUserById, getRoleName, updateUser, UpdateUserDto } from '../../../services/AccountService';

const UserDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchUserDetail = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                message.error('Vui lòng đăng nhập để tiếp tục');
                return;
            }
            if (!id) return;
            const data = await getUserById(parseInt(id), token);
            setUser(data);

            form.setFieldsValue({
                username: data.username,
                fullname: data.fullname,
                email: data.email,
                phoneNumber: data.phoneNumber,
            });
        } catch (error: any) {
            message.error(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetail();
    }, [id, form]);

    const handleEdit = () => {
        setIsEditModalVisible(true);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);

        if (user) {
            form.setFieldsValue({
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
            });
        }
    };

    const handleUpdate = async (values: UpdateUserDto) => {
        try {
            setUpdateLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) {
                message.error('Vui lòng đăng nhập để tiếp tục');
                return;
            }
            if (!id) return;

            await updateUser(parseInt(id), values, token);
            message.success('Cập nhật thông tin thành công');
            setIsEditModalVisible(false);
            // Refresh data after successful update
            await fetchUserDetail();
        } catch (error: any) {
            message.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setUpdateLoading(false);
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
                return 'purple';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Card className="shadow-md">
                <Skeleton active />
            </Card>
        );
    }

    if (!user) {
        return (
            <Card className="shadow-md">
                <div className="text-center text-gray-500">Không tìm thấy thông tin người dùng</div>
            </Card>
        );
    }

    return (
        <>
            <Card className="shadow-md">
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/admin/management/users')}
                        >
                            Quay lại
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-800 m-0">
                            Chi tiết người dùng
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            className="bg-blue-500"
                            onClick={handleEdit}
                        >
                            Chỉnh sửa
                        </Button>

                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-center mb-8">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <UserOutlined style={{ fontSize: '2rem', color: '#666' }} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.fullname}</h2>
                            <Tag color={getRoleColor(user.roleId)} className="text-sm uppercase">
                                {(user.Role?.name || getRoleName(user.roleId)).toUpperCase()}
                            </Tag>
                        </div>
                    </div>

                    <Descriptions
                        bordered
                        column={1}
                        labelStyle={{ width: '200px', background: '#fafafa' }}
                        contentStyle={{ background: 'white' }}
                    >
                        <Descriptions.Item
                            label={
                                <span className="flex items-center gap-2">
                                    <IdcardOutlined />
                                    Tên đăng nhập
                                </span>
                            }
                        >
                            {user.username}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="flex items-center gap-2">
                                    <MailOutlined />
                                    Email
                                </span>
                            }
                        >
                            {user.email}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="flex items-center gap-2">
                                    <PhoneOutlined />
                                    Số điện thoại
                                </span>
                            }
                        >
                            {user.phoneNumber}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </Card>

            <Modal
                title="Chỉnh sửa thông tin người dùng"
                open={isEditModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                    initialValues={{
                        username: user.username,
                        fullname: user.fullname,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                    }}
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
                        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={updateLoading} className="bg-blue-500">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserDetail;