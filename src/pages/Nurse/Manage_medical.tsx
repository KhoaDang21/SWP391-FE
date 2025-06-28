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
import { Modal, Button, Spin, Table, Tag, Dropdown, Menu, message, Image } from 'antd';
import dayjs from 'dayjs';
import { DownOutlined, FileTextOutlined, MedicineBoxOutlined, PictureOutlined, UserOutlined } from '@ant-design/icons';
import { getAllMedicalRecords, MedicalRecord } from '../../services/MedicalRecordService';
import { getAllGuardians, Guardian } from '../../services/AccountService';

const statusColor: Record<string, string> = {
  pending: 'orange',
  received: 'blue',
  rejected: 'red',
  given: 'green',
};

const statusText: Record<string, string> = {
  pending: 'Chờ xử lý',
  received: 'Đã nhận',
  rejected: 'Từ chối',
  given: 'Đã cho uống',
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
    console.log('Medical records:', medicalRecords);
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
  console.log('Filtered records:', filteredRecords);
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

  const getNextStatuses = (current: MedicalSentStatus): MedicalSentStatus[] => {
    if (current === 'pending') return ['received', 'rejected'];
    if (current === 'received') return ['given'];
    return [];
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
      render: (_: any, record: MedicalSent) => {
        const className = medicalRecordMap[record.User_ID]?.Class || '';
        console.log('User_ID:', record.User_ID, '→ Class:', className);
        return className;
      }
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
        const nextStatuses = getNextStatuses(status as MedicalSentStatus);
        if (nextStatuses.length === 0) {
          return <Tag color={statusColor[status]}>{statusText[status]}</Tag>;
        }
        const menu = (
          <Menu
            onClick={({ key }) => handleStatusChange(record, key as MedicalSentStatus)}
            items={nextStatuses.map((s) => ({
              key: s,
              label: <Tag color={statusColor[s]}>{statusText[s]}</Tag>,
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
        {/* <button
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
          type="button"
          onClick={handleCreateSent}>
          + Tạo đơn gửi thuốc
        </button> */}
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
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModal({ open: false, record: null })}>
            Đóng
          </Button>
        ]}
        width={800}
        centered
        title={
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MedicineBoxOutlined className="text-blue-600 text-xl" />
            </div>
            <div>
              <div className="text-lg font-semibold">Chi Tiết Đơn Thuốc</div>
              <div className="text-sm text-gray-500 font-normal">Thông tin giao thuốc cho học sinh</div>
            </div>
          </div>
        }
        className="medicine-detail-modal"
      >
        {detailModal.record && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto px-2">
            {/* Thông tin học sinh */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <UserOutlined className="text-blue-600" />
                <span className="text-blue-800 font-semibold">Thông Tin Học Sinh</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                <div><span className="font-semibold">Tên học sinh:</span> {medicalRecordMap[detailModal.record.User_ID]?.fullname || ''}</div>
                <div><span className="font-semibold">SĐT:</span> {guardianMap[detailModal.record.Guardian_phone]?.phoneNumber || detailModal.record.Guardian_phone || ''}</div>
                <div><span className="font-semibold">Lớp:</span> {medicalRecordMap[detailModal.record.User_ID]?.Class || ''}</div>
                <div><span className="font-semibold">Thời gian uống:</span> {detailModal.record.Delivery_time?.split(' - ')[1]}</div>
                <div><span className="font-semibold">Tình trạng:</span>
                  <Tag color={statusColor[detailModal.record.Status]}>
                    {statusText[detailModal.record.Status]}
                  </Tag>
                </div>
                <div><span className="font-semibold">Thời gian tạo:</span> {dayjs(detailModal.record.createdAt).format('HH:mm DD/MM/YYYY')}</div>
              </div>
            </div>

            {/* Thuốc & liều lượng */}
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <MedicineBoxOutlined className="text-purple-600" />
                <span className="text-purple-800 font-semibold">Thuốc & Liều Lượng</span>
              </div>
              <div className="bg-white border border-purple-100 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: detailModal.record.Medications.replace(/\n/g, '<br />') }} />
              </div>
            </div>

            {/* Ảnh toa thuốc */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <PictureOutlined className="text-indigo-600" />
                <span className="text-indigo-800 font-semibold">Ảnh Toa Thuốc</span>
              </div>
              {detailModal.record.Image_prescription ? (
                <div className="flex justify-center">
                  <Image
                    width={300}
                    src={detailModal.record.Image_prescription}
                    alt="Toa thuốc"
                    className="rounded-lg border border-gray-200 shadow-sm max-h-[200px] object-cover"
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <PictureOutlined className="text-4xl mb-2" />
                  <p>Không có ảnh toa thuốc</p>
                </div>
              )}

            </div>

            {/* Ghi chú */}
            {detailModal.record.Notes && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <FileTextOutlined className="text-orange-600" />
                  <span className="text-orange-800 font-semibold">Ghi Chú Đặc Biệt</span>
                </div>
                <div className="bg-white border border-orange-100 rounded-lg p-4 text-gray-700">
                  {detailModal.record.Notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};

export default MedicineManagement;