import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, message, Skeleton, Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { User, getUserById, getRoleName } from '../../../services/AccountService';

const UserDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            } catch (error: any) {
                message.error(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetail();
    }, [id]);

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
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    className="bg-blue-500"
                    onClick={() => message.info('Tính năng đang được phát triển')}
                >
                    Chỉnh sửa
                </Button>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <UserOutlined style={{ fontSize: '2rem', color: '#666' }} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.fullname}</h2>
                        <Tag color={getRoleColor(user.roleId)} className="text-sm">
                            {user.Role?.name || getRoleName(user.roleId)}
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
    );
};

export default UserDetail; 