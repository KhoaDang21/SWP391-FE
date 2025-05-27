import React from 'react';
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
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import logo from '../../assets/images/medical-book.png';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

interface AdminSidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onCollapse }) => {
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
            onCollapse={onCollapse}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                backgroundColor: '#fff',
                borderRight: '1px solid #f0f0f0',
                zIndex: 999
            }}
            theme="light"
            width={260}
            collapsedWidth={80}
            trigger={null}
        >
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-cyan-500">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <img
                            src={logo}
                            alt="EduHealth Logo"
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                    {!collapsed && (
                        <div className="ml-3 flex items-center">
                            <span className="text-xl font-bold text-white">EduHealth</span>
                        </div>
                    )}
                </div>
                <div
                    onClick={() => onCollapse(!collapsed)}
                    className="cursor-pointer p-1 hover:bg-white/20 rounded-lg text-white"
                >
                    {collapsed ? (
                        <MenuUnfoldOutlined className="text-lg" />
                    ) : (
                        <MenuFoldOutlined className="text-lg" />
                    )}
                </div>
            </div>

            <div className="flex flex-col h-[calc(100vh-64px)]">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    selectedKeys={[location.pathname.split('/')[2] || 'dashboard']}
                    items={items}
                    className="border-r-0 flex-1"
                />

                <div className="border-t border-gray-100">
                    <Menu
                        mode="inline"
                        className="border-r-0"
                        items={[
                            {
                                key: 'logout',
                                icon: <LogoutOutlined />,
                                label: 'Đăng xuất',
                                onClick: handleLogout,
                                danger: true,
                                style: { paddingLeft: '24px' }
                            }
                        ]}
                    />
                </div>
            </div>
        </Sider>
    );
};

export default AdminSidebar; 