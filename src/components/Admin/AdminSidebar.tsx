import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    MedicineBoxOutlined,
    FileExcelOutlined,
    BarChartOutlined,
    TeamOutlined,
    FormOutlined,
    UserOutlined,
    FileTextOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const AdminSidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const items: MenuItem[] = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            children: [
                {
                    key: 'health-overview',
                    icon: <MedicineBoxOutlined />,
                    label: <Link to="/admin/health-overview">Tình hình y tế học đường</Link>
                },
                {
                    key: 'export-excel',
                    icon: <FileExcelOutlined />,
                    label: <Link to="/admin/export-excel">Xuất file Excel</Link>
                }
            ]
        },
        {
            key: 'reports',
            icon: <BarChartOutlined />,
            label: 'Báo cáo & Thống kê',
            children: [
                {
                    key: 'health-events',
                    label: <Link to="/admin/reports/health-events">Báo cáo sự kiện y tế</Link>
                },
                {
                    key: 'medicine-reports',
                    label: <Link to="/admin/reports/medicine">Báo cáo số lượng thuốc</Link>
                },
                {
                    key: 'vaccination-reports',
                    label: <Link to="/admin/reports/vaccination">Báo cáo kiểm tra & tiêm chủng</Link>
                },
                {
                    key: 'health-analysis',
                    label: <Link to="/admin/reports/analysis">Phân tích sức khỏe học đường</Link>
                }
            ]
        },
        {
            key: 'student-profiles',
            icon: <TeamOutlined />,
            label: 'Hồ sơ học sinh',
            children: [
                {
                    key: 'health-records',
                    label: <Link to="/admin/students/health-records">Hồ sơ y tế học sinh</Link>
                }
            ]
        },
        {
            key: 'forms',
            icon: <FormOutlined />,
            label: 'Biểu mẫu xác nhận',
            children: [
                {
                    key: 'create-form',
                    label: <Link to="/admin/forms/create">Tạo form xác nhận</Link>
                },
                {
                    key: 'send-form',
                    label: <Link to="/admin/forms/send">Gửi form xác nhận</Link>
                }
            ]
        },
        {
            key: 'management',
            icon: <UserOutlined />,
            label: 'Quản lý',
            children: [
                {
                    key: 'user-management',
                    label: <Link to="/admin/management/users">Quản lý người dùng</Link>
                },
                {
                    key: 'content-management',
                    icon: <FileTextOutlined />,
                    label: <Link to="/admin/management/content">Cập nhật tài liệu & bài viết</Link>
                }
            ]
        }
    ];

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            <div className="logo p-4">
                <h1 className="text-white text-center text-lg font-bold">
                    {collapsed ? 'EH' : 'EduHealth'}
                </h1>
            </div>
            <Menu
                theme="dark"
                defaultSelectedKeys={['dashboard']}
                mode="inline"
                items={[
                    ...items,
                    {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: 'Đăng xuất',
                        onClick: handleLogout,
                        className: 'mt-auto'
                    }
                ]}
                selectedKeys={[location.pathname.split('/')[2] || 'dashboard']}
            />
        </Sider>
    );
};

export default AdminSidebar; 