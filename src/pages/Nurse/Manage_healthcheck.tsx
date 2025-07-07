import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Modal, Form, Input } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { healthCheckService, HealthCheckEvent, CreateHealthCheckRequest } from '../../services/Healthcheck';
import { notificationService } from '../../services/NotificationService';
import { Send, Check, Edit, Trash2 } from 'lucide-react';

const { Option } = Select;
const { TextArea } = Input;

function formatDate(date: Date | null) {
  if (!date) return '';
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

const ManageHealthcheck: React.FC = () => {
  const [healthEvents, setHealthEvents] = useState<HealthCheckEvent[]>([]);
  const [schoolYears, setSchoolYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('Tất cả');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingConfirmation, setSendingConfirmation] = useState<number | null>(null);
  const navigate = useNavigate();

  const [sentStatus, setSentStatus] = useState<{ [key: number]: boolean }>({});

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState<HealthCheckEvent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<HealthCheckEvent | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createDate, setCreateDate] = useState<Date | null>(null);
  const [editDate, setEditDate] = useState<Date | null>(null);

  // Hàm kiểm tra trạng thái gửi form cho từng đợt khám
  const checkSentStatus = async (events: HealthCheckEvent[]) => {
    const statusObj: { [key: number]: boolean } = {};
    await Promise.all(
      events.map(async (event) => {
        try {
          const res = await healthCheckService.getStudentsByHealthCheck(event.HC_ID);
          statusObj[event.HC_ID] = Array.isArray(res.data) && res.data.length > 0;
        } catch {
          statusObj[event.HC_ID] = false;
        }
      })
    );
    setSentStatus(statusObj);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const events = await healthCheckService.getAllHealthChecks();
      setHealthEvents(events);
      const uniqueYears = Array.from(
        new Set(events.map((e) => e.School_year)),
      );
      setSchoolYears(uniqueYears);
      await checkSentStatus(events);
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
    setCreateDate(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const payload: CreateHealthCheckRequest = {
      title: values.title,
      type: values.type,
      description: values.description,
      dateEvent: formatDate(createDate),
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
      console.log('Send confirmation result:', hcId, result);
      if (result.success) {
        notificationService.success(result.message || 'Đã gửi form xác nhận thành công!');
        // Gửi xong thì cập nhật lại trạng thái gửi form
        await checkSentStatus(healthEvents);
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

  const showEditModal = (event: HealthCheckEvent) => {
    setEditingEvent(event);
    editForm.setFieldsValue({
      title: event.title,
      type: event.Event?.type,
      description: event.description,
      schoolYear: event.School_year,
    });
    setEditDate(event.Event?.dateEvent ? new Date(event.Event.dateEvent) : null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!editingEvent) return;
    setEditLoading(true);
    try {
      await healthCheckService.updateHealthCheck(editingEvent.HC_ID, {
        title: values.title,
        type: values.type,
        description: values.description,
        dateEvent: formatDate(editDate),
        schoolYear: values.schoolYear,
      });
      await fetchEvents();
      notificationService.success('Cập nhật đợt khám thành công!');
      setIsEditModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      notificationService.error('Có lỗi xảy ra khi cập nhật đợt khám');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (event: HealthCheckEvent) => {
    setDeletingEvent(event);
  };

  const confirmDelete = async () => {
    if (!deletingEvent) return;
    setDeleteLoading(true);
    try {
      await healthCheckService.deleteHealthCheck(deletingEvent.HC_ID);
      await fetchEvents();
      notificationService.success('Xoá đợt khám thành công!');
      setDeletingEvent(null);
    } catch (error) {
      notificationService.error('Có lỗi xảy ra khi xoá đợt khám');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeletingEvent(null);
  };

  const filteredEvents =
    selectedYear === 'Tất cả'
      ? healthEvents
      : healthEvents.filter((e) => e.School_year === selectedYear);
  console.log('Filtered Events:', filteredEvents);
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
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
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
                const isSent = sentStatus[event.HC_ID];
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
                      {event.Event?.dateEvent ? new Date(event.Event.dateEvent).toLocaleDateString() : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.Event?.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {/* Trạng thái đợt khám */}
                      {(() => {
                        let color = '';
                        let label = '';
                        switch (event.status) {
                          case 'created':
                            color = 'bg-gray-400 text-white';
                            label = 'Chờ gửi';
                            break;
                          case 'pending':
                            color = 'bg-orange-400 text-white';
                            label = 'Chờ xác nhận';
                            break;
                          case 'inProgress':
                            color = 'bg-blue-500 text-white';
                            label = 'Đang diễn ra';
                            break;
                          case 'checked':
                            color = 'bg-yellow-400 text-gray-900';
                            label = 'Đã có kết quả';
                            break;
                          default:
                            color = 'bg-gray-200 text-gray-700';
                            label = event.status || '';
                        }
                        return (
                          <span className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${color}`}>{label}</span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showEditModal(event);
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-yellow-400 text-white text-sm rounded-lg hover:bg-yellow-500 transition-colors duration-200"
                          title="Sửa đợt khám"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(event);
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200"
                          title="Xoá đợt khám"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {isSent ? (
                          <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-lg border border-green-200">
                            <Check className="h-4 w-4 mr-1" />
                            Đã gửi
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleSendConfirmation(event.Event_ID, e)}
                            disabled={isSending}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Gửi form xác nhận cho phụ huynh"
                          >
                            {isSending ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
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
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
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
            <DatePicker
              selected={createDate}
              onChange={date => setCreateDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholderText="Chọn ngày khám"
            />
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

      <Modal
        title="Chỉnh sửa đợt khám"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
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
            <DatePicker
              selected={editDate}
              onChange={date => setEditDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholderText="Chọn ngày khám"
            />
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
                onClick={() => setIsEditModalOpen(false)}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={editLoading}
              >
                Lưu thay đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={!!deletingEvent}
        title="Xác nhận xoá đợt khám"
        onCancel={cancelDelete}
        footer={null}
        centered
      >
        <p>Bạn có chắc chắn muốn xoá đợt khám <b>{deletingEvent?.title}</b> không?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <Button onClick={cancelDelete} style={{ marginRight: 8 }}>
            Huỷ
          </Button>
          <Button type="primary" danger loading={deleteLoading} onClick={confirmDelete}>
            Xoá
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageHealthcheck;