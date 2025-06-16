import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Table, Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import { healthCheckService, HealthCheckEvent, CreateHealthCheckRequest } from '../../services/Healthcheck';
import { notificationService } from '../../services/NotificationService';

const { Option } = Select;
const { TextArea } = Input;

const ManageHealthcheck: React.FC = () => {
  const [healthEvents, setHealthEvents] = useState<HealthCheckEvent[]>([]);
  const [schoolYears, setSchoolYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('Tất cả');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const [form] = Form.useForm();
  const fetchEvents = async () => {
    try {
      const events = await healthCheckService.getAllHealthChecks();
      setHealthEvents(events);
      const uniqueYears = Array.from(
        new Set(events.map((e) => e.School_year)),
      );
      setSchoolYears(uniqueYears);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu khám sức khỏe:', error);
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

  const filteredEvents =
    selectedYear === 'Tất cả'
      ? healthEvents
      : healthEvents.filter((e) => e.School_year === selectedYear);

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_text: any, _record: any, index: number) => index + 1,
      width: 80,
    },
    {
      title: 'Tên đợt khám',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Năm học',
      dataIndex: 'School_year',
      key: 'School_year',
    },
    {
      title: 'Ngày khám',
      dataIndex: ['Event', 'dateEvent'],
      key: 'dateEvent',
      render: (date: string) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Loại',
      dataIndex: ['Event', 'type'],
      key: 'type',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn thuốc</h1>
          {/* <Button type="primary" onClick={handleCreatePhase}>
            + Tạo đợt khám
          </Button> */}
          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
            type="button"
            onClick={handleCreatePhase}>
            + Thêm đơn thuốc
          </button>
        </div>

        <Space align="center">
          <span>Năm học:</span>
          <Select
            value={selectedYear}
            onChange={(val) => setSelectedYear(val)}
            style={{ width: 200 }}
          >
            <Option value="Tất cả">Tất cả</Option>
            {schoolYears.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Space>

        <Table
          dataSource={filteredEvents}
          rowKey="HC_ID"
          pagination={{ pageSize: 10 }}
          bordered
          columns={columns}
        />
      </Space>

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
