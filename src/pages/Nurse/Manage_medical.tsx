import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllMedicalSents,
  getMedicalSentById,
  updateMedicalSent,
  MedicalSent,
  MedicalSentStatus
} from '../../services/MedicalSentService';
import { Modal, Button, Spin, Table, Tag, Dropdown, Menu, message } from 'antd';
import dayjs from 'dayjs';
import { DownOutlined } from '@ant-design/icons';

const statusColor: Record<string, string> = {
  pending: 'orange',
  processing: 'blue',
  delivered: 'green',
  cancelled: 'red',
};

const statusText: Record<string, string> = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const MedicineManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [medicineRecords, setMedicineRecords] = useState<MedicalSent[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<{ open: boolean; record: MedicalSent | null }>({ open: false, record: null });
  const token = localStorage.getItem('accessToken') || '';

  const fetchAllMedicalSents = async () => {
    setLoading(true);
    try {
      const data = await getAllMedicalSents(token);
      setMedicineRecords(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Lỗi lấy danh sách đơn thuốc:', err);
      message.error('Không thể tải danh sách đơn thuốc.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all medical sent records
  useEffect(() => {
    fetchAllMedicalSents();
  }, [token]);

  // Lọc theo ngày gửi
  const filteredRecords = selectedDate
    ? medicineRecords.filter(record => {
      const recordDate = dayjs(record.createdAt).toDate();
      return (
        recordDate.toDateString() === selectedDate.toDateString()
      );
    })
    : medicineRecords;

  // Xem chi tiết
  const handleViewDetail = async (record: MedicalSent) => {
    setLoading(true);
    try {
      const detail = await getMedicalSentById(record.id, token);
      setDetailModal({ open: true, record: detail });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Lỗi lấy chi tiết đơn thuốc:', err);
      message.error('Lỗi khi tải chi tiết đơn thuốc.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (record: MedicalSent, newStatus: MedicalSentStatus) => {
    try {
      const formData = new FormData();
      formData.append('Status', newStatus);
      formData.append('Guardian_phone', record.Guardian_phone);
      formData.append('Class', record.Class);
      formData.append('Medications', record.Medications);
      formData.append('Delivery_time', record.Delivery_time);
      if (record.Notes) {
        formData.append('Notes', record.Notes);
      }

      await updateMedicalSent(record.id, formData, token);

      // Cập nhật lại state để UI hiển thị đúng
      setMedicineRecords((prevRecords) =>
        prevRecords.map((rec) => (rec.id === record.id ? { ...rec, Status: newStatus } : rec))
      );

      message.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại.');
      // eslint-disable-next-line no-console
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_: any, __: any, idx: number) => idx + 1,
      width: 60,
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => dayjs(createdAt).format('HH:mm DD/MM/YYYY'),
      sorter: (a: MedicalSent, b: MedicalSent) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Tên học sinh',
      dataIndex: ['User', 'Full_name'],
      key: 'patientName',
    },
    {
      title: 'Lớp',
      dataIndex: 'Class',
      key: 'class',
    },
    {
      title: 'SĐT Phụ huynh',
      dataIndex: 'Guardian_phone',
      key: 'patientPhone',
    },
    {
      title: 'Thời gian uống thuốc',
      dataIndex: 'Delivery_time',
      key: 'deliveryTime',
      render: (time: string) => dayjs(time).format('HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'status',
      render: (status: MedicalSentStatus, record: MedicalSent) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleStatusChange(record, key as MedicalSentStatus)}
            items={Object.keys(statusText).map((s) => ({
              key: s,
              label: statusText[s]
            }))}
          />
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Tag color={statusColor[status]} style={{ cursor: 'pointer' }}>
              {statusText[status]} <DownOutlined />
            </Tag>
          </Dropdown>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: MedicalSent) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn thuốc</h1>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Chọn ngày xem đơn thuốc:
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="min-w-[200px] border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredRecords}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </div>

      <Modal
        open={detailModal.open}
        onCancel={() => setDetailModal({ open: false, record: null })}
        footer={<Button onClick={() => setDetailModal({ open: false, record: null })}>Đóng</Button>}
        width={700}
        title={`Chi tiết đơn gửi thuốc #${detailModal.record?.id}`}
      >
        {detailModal.record && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>Tên học sinh:</strong> {detailModal.record.User?.Full_name}<br />
              <strong>SĐT:</strong> {detailModal.record.Guardian_phone}<br />
              <strong>Lớp:</strong> {detailModal.record.Class}<br />
              <strong>Thời gian uống thuốc:</strong> {dayjs(detailModal.record.Delivery_time).format('HH:mm')}<br />
              <strong>Trạng thái:</strong> <Tag color={statusColor[detailModal.record.Status]}>{statusText[detailModal.record.Status]}</Tag><br />
              <strong>Thời gian tạo:</strong> {dayjs(detailModal.record.createdAt).format('HH:mm DD/MM/YYYY')}<br />
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Danh sách thuốc:</strong><br />
              <div dangerouslySetInnerHTML={{ __html: detailModal.record.Medications.replace(/\n/g, '<br />') }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Hình ảnh toa thuốc:</strong><br />
              <img src={detailModal.record.Image_prescription} alt="Toa thuốc" style={{ maxWidth: 300 }} />
            </div>
            {detailModal.record.Notes && (
              <div style={{ marginBottom: 16 }}>
                <strong>Ghi chú:</strong><br />
                {detailModal.record.Notes}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicineManagement;
