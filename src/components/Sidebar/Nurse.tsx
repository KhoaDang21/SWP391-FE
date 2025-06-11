import { useState } from 'react';
import {
  Heart,
  Activity,
  Menu,
  UserCircle,
  Bell,
  Pill,
  Stethoscope,
  ChevronRight,
  Home
} from 'lucide-react';
import medicalLogo from '../../assets/images/medical-book.png';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { logout } from '../../services/AuthServices';
import { notificationService } from '../../services/NotificationService';

function Nurse() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      path: '/nurse',
      icon: Home,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100'
    },
    {
      key: 'medical',
      title: 'Quản lý thuốc gửi đến',
      path: '/nurse/medical',
      icon: Pill,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      key: 'healthcheck',
      title: 'Quản lý khám sức khỏe',
      path: '/nurse/healthcheck',
      icon: Stethoscope,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      key: 'vaccine',
      title: 'Quản lý sự kiện tiêm',
      path: '/nurse/vaccine',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      key: 'medical-events',
      title: 'Sự kiện y tế khác',
      path: '/nurse/medical-events',
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  const bottomItems = [
    { title: 'Thông báo', icon: Bell },
  ];

  const isActive = (path: string) => {
    if (path === '/nurse' && location.pathname === '/nurse') {
      return true;
    }
    if (path === '/nurse/medical') {
      return location.pathname.startsWith(path) && !location.pathname.includes('medical-events');
    }
    return location.pathname.startsWith(path) && path !== '/nurse';
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      notificationService.success('Đăng xuất thành công');
      navigate('/login');
    } catch (error: any) {
      notificationService.error(error.message || 'Có lỗi xảy ra khi đăng xuất');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`bg-gradient-to-b from-blue-600 via-cyan-600 to-teal-600 opacity-90 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <img src={medicalLogo} alt="Medical Logo" className="w-5 h-5 object-contain" />
                </div>
                <span className="ml-3 text-lg font-semibold">EduHealth</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Y tá Nguyễn</p>
                <p className="text-xs text-white/70">Trực ca sáng</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive(item.path)
                  ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive(item.path) ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                {!isCollapsed && (
                  <span className="ml-3 text-left">{item.title}</span>
                )}
                {!isCollapsed && isActive(item.path) && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20 space-y-2">
          {bottomItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 group"
              >
                <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} text-white/70 group-hover:text-white`} />
                {!isCollapsed && (
                  <span className="ml-3">{item.title}</span>
                )}
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          >
            <span className="w-4 h-4 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m0 0l3-3m-3 3l3 3" />
              </svg>
            </span>
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => isActive(item.path))?.title || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Chào mừng bạn đến với hệ thống quản lý y tế
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Nurse;