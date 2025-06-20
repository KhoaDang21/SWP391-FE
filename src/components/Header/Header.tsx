import { NavLink } from "react-router-dom";
import { Modal, Form, Input, Button } from 'antd';
import { changePassword } from '../../services/AuthServices';
import { notificationService } from '../../services/NotificationService';
import { useState } from 'react';

const Header = () => {
  // Class chung cho tất cả link
  const baseClass = "font-medium px-2 py-1 transition";
  // Class khi active (xanh) và khi không active (xám)
  const activeClass = "text-blue-600";
  const inactiveClass = "text-gray-700 hover:text-blue-600";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="/src/assets/images/medical-book.png"
            alt="Logo"
            className="w-10 h-10 object-cover"
          />
          <span className="text-xl font-bold text-blue-600">EduHealth</span>
        </div>

        <nav className="hidden md:flex space-x-6">
          {[
            { to: "/", label: "Trang chủ" },
            { to: "/gioi-thieu", label: "Giới thiệu" },
            { to: "/tin-tuc", label: "Tin tức" },
            { to: "/lien-he", label: "Liên hệ" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"} // để "/" chỉ active đúng trang chủ
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-4 py-2 rounded transition ${isActive
                ? "bg-blue-700 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`
            }
          >
            Đăng nhập
          </NavLink>
        </div>

        {localStorage.getItem('accessToken') && (
          <Button onClick={() => setIsModalVisible(true)}>
            Đổi mật khẩu
          </Button>
        )}
      </div>

      <Modal
        title="Đổi mật khẩu"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            try {
              setLoading(true);
              const token = localStorage.getItem('accessToken');
              if (!token) {
                notificationService.error('Vui lòng đăng nhập lại');
                return;
              }
              await changePassword(values.currentPassword, values.newPassword, token);
              notificationService.success('Đổi mật khẩu thành công');
              setIsModalVisible(false);
              form.resetFields();
            } catch (error: any) {
              notificationService.error(error.message || 'Đổi mật khẩu thất bại');
            } finally {
              setLoading(false);
            }
          }}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </header>
  );
};

export default Header;
