import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getAllMedicalSents, getMedicalSentById, MedicalSent } from '../../services/MedicalSentService';
import { Modal, Button, Spin, Table, Tag } from 'antd';
import dayjs from 'dayjs';

const statusColor: Record<string, string> = {
  pending: 'orange',
  processing: 'blue',
  delivered: 'green',
  cancelled: 'red',
};

const statusText: Record<string, string> = {
  pending: 'Chờ xử lý',
  processing: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const MedicineManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [medicineRecords, setMedicineRecords] = useState<MedicalSent[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<{ open: boolean; record: MedicalSent | null }>({ open: false, record: null });
  const token = localStorage.getItem('accessToken') || '';

  // Fetch all medical sent records
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllMedicalSents(token);
        setMedicineRecords(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Lỗi lấy danh sách đơn thuốc:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Lọc theo ngày gửi
  const filteredRecords = selectedDate
    ? medicineRecords.filter(record => {
      const recordDate = dayjs(record.createdAt, 'DD/MM/YYYY HH:mm').toDate();
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
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      render: (_: any, __: any, idx: number) => idx + 1,
      width: 60,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      render: (createdAt: string) => createdAt,
    },
    {
      title: 'Tên học sinh',
      dataIndex: 'patientName',
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
    },
    {
      title: 'Người gửi',
      dataIndex: 'patientPhone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => <Tag color={statusColor[status]}>{statusText[status]}</Tag>,
    },
    {
      title: 'Thao tác',
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
              <strong>Tên học sinh:</strong> {detailModal.record.patientName}<br />
              <strong>SĐT:</strong> {detailModal.record.patientPhone}<br />
              <strong>Lớp:</strong> {detailModal.record.class}<br />
              <strong>Thời gian uống thuốc:</strong> {detailModal.record.deliveryTime}<br />
              <strong>Trạng thái:</strong> <Tag color={statusColor[detailModal.record.status]}>{statusText[detailModal.record.status]}</Tag><br />
              <strong>Thời gian tạo:</strong> {detailModal.record.createdAt}<br />
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Danh sách thuốc:</strong><br />
              {detailModal.record.medications}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Hình ảnh toa thuốc:</strong><br />
              <img src={detailModal.record.prescriptionImage} alt="Toa thuốc" style={{ maxWidth: 300 }} />
            </div>
            {detailModal.record.notes && (
              <div style={{ marginBottom: 16 }}>
                <strong>Ghi chú:</strong><br />
                {detailModal.record.notes}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicineManagement;
