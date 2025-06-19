import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { healthCheckService, HealthCheckEvent, CreateHealthCheckRequest } from '../../services/Healthcheck';
import { notificationService } from '../../services/NotificationService';
import { Send, Check } from 'lucide-react';

const { Option } = Select;
const { TextArea } = Input;

const ManageHealthcheck: React.FC = () => {
  const [healthEvents, setHealthEvents] = useState<HealthCheckEvent[]>([]);
  const [schoolYears, setSchoolYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('Tất cả');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingConfirmation, setSendingConfirmation] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // Load sent confirmations from localStorage on component mount
  const [sentConfirmations, setSentConfirmations] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('sentHealthCheckConfirmations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return new Set(parsed);
      } catch (error) {
        console.error('Error parsing saved confirmations:', error);
        return new Set();
      }
    }
    return new Set();
  });

  // Save sent confirmations to localStorage whenever it changes
  const updateSentConfirmations = (newSet: Set<number>) => {
    setSentConfirmations(newSet);
    localStorage.setItem('sentHealthCheckConfirmations', JSON.stringify([...newSet]));
  };

  const [form] = Form.useForm();
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const events = await healthCheckService.getAllHealthChecks();
      setHealthEvents(events);
      const uniqueYears = Array.from(
        new Set(events.map((e) => e.School_year)),
      );
      setSchoolYears(uniqueYears);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu khám sức khỏe:', error);
      notificationService.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreatePhase = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const payload: CreateHealthCheckRequest = {
      title: values.title,
      type: values.type,
      description: values.description,
      dateEvent: values.dateEvent.format('YYYY-MM-DD'),
      schoolYear: values.schoolYear,
    };
    setIsLoading(true);
    try {
      await healthCheckService.createHealthCheck(payload);
      await fetchEvents();
      notificationService.success('Tạo đợt khám thành công!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating health check:', error);
      notificationService.error(
        'Có lỗi xảy ra khi tạo đợt khám sức khỏe',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendConfirmation = async (hcId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSendingConfirmation(hcId);
    try {
      const result = await healthCheckService.sendConfirmationForm(hcId);
      if (result.success) {
        // Thêm vào danh sách đã gửi và lưu vào localStorage
        const newSet = new Set([...sentConfirmations, hcId]);
        updateSentConfirmations(newSet);
        notificationService.success(result.message || 'Đã gửi form xác nhận thành công!');
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra khi gửi form xác nhận');
      }
    } catch (error: any) {
      console.error('Error sending confirmation form:', error);
      notificationService.error(error.message || 'Có lỗi xảy ra khi gửi form xác nhận');
    } finally {
      setSendingConfirmation(null);
    }
  };

  const handleRowClick = (event: HealthCheckEvent) => {
    navigate(`/nurse/healthcheck/students/${event.HC_ID}`);
  };

  const filteredEvents =
    selectedYear === 'Tất cả'
      ? healthEvents
      : healthEvents.filter((e) => e.School_year === selectedYear);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý đợt khám sức khỏe</h1>
        <button 
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
          type="button"
          onClick={handleCreatePhase}>
          + Thêm đợt khám
        </button>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Năm học:</span>
          <Select
            value={selectedYear}
            onChange={(val) => setSelectedYear(val)}
            style={{ width: 200 }}
            className="min-w-[200px]"
          >
            <Option value="Tất cả">Tất cả</Option>
            {schoolYears.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đợt khám</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năm học</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày khám</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">Không có dữ liệu</td>
              </tr>
            ) : (
              filteredEvents.map((event, index) => {
                const isSent = sentConfirmations.has(event.HC_ID);
                const isSending = sendingConfirmation === event.HC_ID;
                
                return (
                  <tr 
                    key={event.HC_ID} 
                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleRowClick(event)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {event.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.School_year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {event.Event?.dateEvent ? moment(event.Event.dateEvent).format('DD/MM/YYYY') : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.Event?.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center space-x-3">
                       
                        {isSent ? (
                          <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-lg border border-green-200">
                            <Check className="h-4 w-4 mr-1" />
                            Đã gửi
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleSendConfirmation(event.HC_ID, e)}
                            disabled={isSending}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Gửi form xác nhận cho phụ huynh"
                          >
                            {isSending ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                              <Send className="h-4 w-4 mr-1" />
                            )}
                            {isSending ? 'Đang gửi...' : ''}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Tạo đợt khám mới"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{}}
        >
          <Form.Item
            name="title"
            label="Tên đợt khám"
            rules={[{ required: true, message: 'Vui lòng nhập tên đợt khám' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại khám"
            rules={[{ required: true, message: 'Vui lòng nhập loại khám' }]}
          >
            <Input placeholder="VD: Khám sức khỏe định kỳ" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="dateEvent"
            label="Ngày khám"
            rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="schoolYear"
            label="Năm học"
            rules={[{ required: true, message: 'Vui lòng nhập năm học' }]}
          >
            <Input placeholder="VD: 2025-2026" />
          </Form.Item>

          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setIsModalOpen(false)}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Tạo đợt khám
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageHealthcheck;
