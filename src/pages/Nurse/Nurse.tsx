import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Package, 
  Menu, 
  X,
  UserCircle,
  Bell,
  Settings,
  Pill,
  Stethoscope,
  ChevronRight,
  Home
} from 'lucide-react';
import ManageMedical from './Manage_medical';
import ManageHealthcheck from './Manage_healthcheck';
import MedicalEventManagement from './Manage_medical_events';
import ManageVaccine from './Manage_vaccine';

function Nurse() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100'
    },
    {
      title: 'Quản lý thuốc gửi đến',
      icon: Pill,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      title: 'Quản lý khám sức khỏe',
      icon: Stethoscope,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      title: 'Quản lý sự kiện tiêm',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      title: 'Sự kiện y tế khác',
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  const bottomItems = [
    { title: 'Thông báo', icon: Bell },
    { title: 'Cài đặt', icon: Settings }
  ];

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
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === index;
            return (
              <button
                key={index}
                onClick={() => setActiveItem(index)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                {!isCollapsed && (
                  <span className="ml-3 text-left">{item.title}</span>
                )}
                {!isCollapsed && isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
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
        </div>
      </div>


      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems[activeItem]?.title || 'Dashboard'}
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
          {activeItem === 1 ? (
            <ManageMedical />
          ) : activeItem === 2 ? (
            <ManageHealthcheck />
          ) : activeItem === 3 ? (
            <ManageVaccine />
          ) : activeItem === 4 ? (
            <MedicalEventManagement />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {menuItems[activeItem]?.title || 'Dashboard'}
              </h2>
              <p className="text-gray-600">
                Nội dung cho phần {menuItems[activeItem]?.title?.toLowerCase() || 'dashboard'} sẽ được hiển thị ở đây.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Nurse;