import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Input, Space, message, Tooltip } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { User, getAllUsers, getRoleName } from '../../../services/AccountService';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                message.error('Vui lòng đăng nhập để tiếp tục');
                return;
            }
            const data = await getAllUsers(token);
            setUsers(data);
            setFilteredUsers(data);
        } catch (error: any) {
            message.error(error.message || 'Có lỗi xảy ra khi tải danh sách người dùng');
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
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: () => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            className="text-blue-500 hover:text-blue-600"
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button 
                            type="text" 
                            icon={<DeleteOutlined />} 
                            className="text-red-500 hover:text-red-600"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card className="shadow-md">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <UserOutlined />
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
                    <Button type="primary" className="bg-blue-500">
                        Thêm người dùng
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
        </Card>
    );
};

export default UserManagement; 