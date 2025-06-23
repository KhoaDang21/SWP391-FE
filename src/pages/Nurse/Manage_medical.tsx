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
import { getAllMedicalRecords, MedicalRecord } from '../../services/MedicalRecordService';
import { getAllGuardians, Guardian } from '../../services/AccountService';

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
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<{ open: boolean; record: MedicalSent | null }>({ open: false, record: null });
  const token = localStorage.getItem('accessToken') || '';

  const medicalRecordMap = React.useMemo(() => {
    const map: Record<number, MedicalRecord> = {};
    medicalRecords.forEach((rec) => {
      map[rec.userId] = rec;
    });
    return map;
  }, [medicalRecords]);

  const guardianMap = React.useMemo(() => {
    const map: Record<string, Guardian> = {};
    guardians.forEach((g) => {
      map[g.phoneNumber] = g;
    });
    return map;
  }, [guardians]);

  const normalizePhone = (phone?: string) => {
    if (!phone) return '';
    let p = phone.replace(/\D/g, '');
    if (p.startsWith('84')) p = '0' + p.slice(2);
    if (p.length === 9) p = '0' + p;
    return p;
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [medicalSents, medicalRecordsRes, guardiansRes] = await Promise.all([
          getAllMedicalSents(token),
          getAllMedicalRecords(token),
          getAllGuardians(token),
        ]);
        const sorted = medicalSents.sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());
        setMedicineRecords(sorted);
        setMedicalRecords(medicalRecordsRes);
        setGuardians(guardiansRes);
      } catch (err) {
        console.error('Lỗi lấy dữ liệu:', err);
        message.error('Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const filteredRecords = selectedDate
    ? medicineRecords.filter(record => {
      const recordDate = dayjs(record.createdAt).toDate();
      return (
        recordDate.toDateString() === selectedDate.toDateString()
      );
    })
    : medicineRecords;

  const handleViewDetail = async (record: MedicalSent) => {
    setLoading(true);
    try {
      const detail = await getMedicalSentById(record.id, token);
      setDetailModal({ open: true, record: detail });
    } catch (err) {
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

      setMedicineRecords((prevRecords) =>
        prevRecords.map((rec) => (rec.id === record.id ? { ...rec, Status: newStatus } : rec))
      );

      message.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại.');
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
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'ngaygui',
      render: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'),
    },
    {
      title: 'Tên học sinh',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (_: any, record: MedicalSent) => medicalRecordMap[record.User_ID]?.fullname || '',
    },
    {
      title: 'Lớp',
      dataIndex: 'Class',
      key: 'Class',
      render: (_: any, record: MedicalSent) => medicalRecordMap[record.User_ID]?.Class || '',
    },
    {
      title: 'SĐT Phụ huynh',
      dataIndex: 'Guardian_phone',
      key: 'Guardian_phone',
      render: (_: any, record: MedicalSent) => {
        const phoneVariants = [
          normalizePhone(record.Guardian_phone),
          normalizePhone('0' + record.Guardian_phone),
          normalizePhone(record.Guardian_phone?.replace(/^\+84/, '0')),
        ];
        let found = null;
        for (const v of phoneVariants) {
          if (guardianMap[v]) {
            found = guardianMap[v].phoneNumber;
            break;
          }
        }
        return found || record.Guardian_phone || 'Không có';
      },
    },
    {
      title: 'Thời gian uống thuốc',
      dataIndex: 'Delivery_time',
      key: 'Delivery_time',
      render: (time: string) => time ? (time.split(' - ')[1] || time) : '',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: string, record: MedicalSent) => {
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
              <strong>Tên học sinh:</strong> {medicalRecordMap[detailModal.record.User_ID]?.fullname || ''}<br />
              <strong>SĐT:</strong> {guardianMap[detailModal.record.Guardian_phone]?.phoneNumber || detailModal.record.Guardian_phone || ''}<br />
              <strong>Lớp:</strong> {medicalRecordMap[detailModal.record.User_ID]?.Class || ''}<br />
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