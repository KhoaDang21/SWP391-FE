import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import Noti from "../../pages/Noti/Noti";
import { logout } from "../../services/AuthServices"; 
import { notificationService } from '../../services/NotificationService';

const Header = () => {
  const baseClass = "font-medium px-2 py-1 transition";
  const activeClass = "text-blue-600";
  const inactiveClass = "text-gray-700 hover:text-blue-600";
  const userInfo = localStorage.getItem("user");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
       notificationService.success('Đăng xuất thành công');
                  navigate('/login');
              } catch (error: any) {
                  notificationService.error(error.message || 'Có lỗi xảy ra khi đăng xuất');
              }
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <button className="w-full text-left">Cài đặt</button>
      </Menu.Item>
      <Menu.Item key="logout">
        <button onClick={handleLogout} className="w-full text-left">Đăng xuất</button>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="-ml-20 flex items-center space-x-2">
          <img
            src="/src/assets/images/medical-book.png"
            alt="Logo"
            className="w-10 h-10 object-cover"
          />
          <span className="text-xl font-bold text-blue-600">EduHealth</span>
        </div>

        <nav className="hidden md:flex space-x-6 ml-20">
          {[
            { to: "/student", label: "Trang chủ" },
            { to: "/student/healthrecord", label: "Hồ sơ sức khoẻ" },
            { to: "/student/healthcheckup", label: "Lịch khám sức khoẻ" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-4 -mr-20">
          <div className="ml-4">
            <Noti />
          </div>

          <Dropdown overlay={menu} trigger={["hover"]} arrow placement="bottomRight">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="text-left">
                <p className="font-bold">
                  {userInfo ? JSON.parse(userInfo).username : "Người dùng"}
                </p>
                <p className="text-sm">student@gmail.com</p>
              </div>
              <Avatar
                style={{ backgroundColor: "#155dfc", width: 40, height: 40 }}
                icon={<UserOutlined />}
              />
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
