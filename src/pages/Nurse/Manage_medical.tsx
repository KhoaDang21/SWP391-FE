import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllMedicalSents,
  getMedicalSentById,
  updateMedicalSent,
  MedicalSent,
  MedicalSentStatus,
  createMedicalSent,
  deleteMedicalSent
} from '../../services/MedicalSentService';
import { Modal, Button, Spin, Table, Tag, Dropdown, Menu, message, Image, Form, Input, Upload, Select, Space, Tooltip, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { DownOutlined, FileTextOutlined, MedicineBoxOutlined, PictureOutlined, UserOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [medicineRecords, setMedicineRecords] = useState<MedicalSent[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<{ open: boolean; record: MedicalSent | null }>({ open: false, record: null });
  const token = localStorage.getItem('accessToken') || '';
  const [createModal, setCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [nurseForm] = Form.useForm();
  const timeOptions = ['Trước ăn sáng', 'Sau ăn sáng', 'Trước ăn trưa', 'Sau ăn trưa', 'Trước ăn chiều', 'Sau ăn chiều'];
  const [editRecord, setEditRecord] = useState<MedicalSent | null>(null);

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

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteMedicalSent(id, token);
      message.success('Xóa đơn thuốc thành công!');
      const medicalSents = await getAllMedicalSents(token);
      setMedicineRecords(medicalSents.sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()));
    } catch (err) {
      message.error('Lỗi khi xóa đơn thuốc.');
    } finally {
      setLoading(false);
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
      render: (_: any, record: MedicalSent) => record.Guardian_phone || 'Không có',
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
        <Space>
          <Tooltip title="Xem chi tiết"><Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} /></Tooltip>
          <Tooltip title="Sửa"><Button type="text" icon={<EditOutlined />} onClick={() => { setEditRecord(record); setCreateModal(true); nurseForm.setFieldsValue({ studentName: medicalRecordMap[record.User_ID]?.fullname || '', className: record.Class, deliveryTimeNote: record.Delivery_time?.split(' - ')[1], prescriptionImage: [] }); }} /></Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn chắc chắn muốn xóa đơn thuốc này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            placement="topRight"
          >
            <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn thuốc</h1>
        <Button type="primary" onClick={() => { nurseForm.resetFields(); setCreateModal(true); }}>
          + Tạo đơn
        </Button>
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

      <Modal
        open={createModal}
        onCancel={() => { setCreateModal(false); setEditRecord(null); }}
        title="Tạo đơn gửi thuốc mới"
        footer={null}
        destroyOnClose
      >
        <Form
          form={nurseForm}
          layout="vertical"
          onFinish={async (values) => {
            setCreateLoading(true);
            try {
              const { studentName, deliveryTimeNote, prescriptionImage, className, guardianPhone } = values;
              if (!studentName || !prescriptionImage || !deliveryTimeNote || !className || !guardianPhone) {
                message.error('Vui lòng nhập đầy đủ thông tin!');
                setCreateLoading(false);
                return;
              }
              const formData = new FormData();
              formData.append('fullname', studentName);
              formData.append('Class', className);
              formData.append('guardianPhone', guardianPhone);
              formData.append('prescriptionImage', prescriptionImage[0].originFileObj);
              formData.append('deliveryTime', `${dayjs().format('YYYY-MM-DD')} - ${deliveryTimeNote}`);
              formData.append('status', 'received');
              await createMedicalSent(formData, token);
              message.success('Tạo đơn gửi thuốc thành công!');
              setCreateModal(false);
              nurseForm.resetFields();
              const medicalSents = await getAllMedicalSents(token);
              setMedicineRecords(medicalSents.sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()));
            } catch (err) {
              message.error('Có lỗi xảy ra, vui lòng thử lại!');
            } finally {
              setCreateLoading(false);
            }
          }}
        >
          <Form.Item name="studentName" label="Tên học sinh" rules={[{ required: true, message: 'Vui lòng nhập tên học sinh!' }]}>
            <Input placeholder="Nhập tên học sinh" onChange={() => nurseForm.setFields([{ name: 'studentName', errors: [] }])} />
          </Form.Item>
          <Form.Item
            name="className"
            label="Lớp"
            rules={[
              { required: true, message: 'Vui lòng nhập lớp!' },
              { pattern: /^[1-9][0-2]?[A-Z]$/, message: 'Lớp phải có định dạng như 1A, 2B... với số từ 1 đến 5 và một chữ cái in hoa.' }
            ]}
          >
            <Input placeholder="Nhập lớp (ví dụ: 1A, 5E)" onChange={() => nurseForm.setFields([{ name: 'className', errors: [] }])} />
          </Form.Item>
          <Form.Item
            name="deliveryTimeNote"
            label="Buổi uống"
            rules={[{ required: true, message: 'Vui lòng chọn buổi uống!' }]}
          >
            <Select placeholder="Chọn buổi">
              {timeOptions.map((time) => (<Select.Option key={time} value={time}>{time}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item
            name="prescriptionImage"
            label="Hình ảnh toa thuốc"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
            rules={[
              { required: true, message: 'Vui lòng tải lên hình ảnh toa thuốc' },
              { validator: (_, value) => value && value.length > 0 ? Promise.resolve() : Promise.reject(new Error('Vui lòng tải lên ít nhất một hình ảnh')) }
            ]}
          >
            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            name="guardianPhone"
            label="SĐT Phụ huynh"
            rules={[
              { required: true, message: 'Vui lòng nhập SĐT phụ huynh!' },
              { pattern: /^0\d{9,10}$/, message: 'SĐT không hợp lệ!' }
            ]}
          >
            <Input
              placeholder="Nhập số điện thoại phụ huynh"
              maxLength={11}
              onChange={e => {
                if (nurseForm.getFieldError('guardianPhone').length) {
                  nurseForm.setFields([{ name: 'guardianPhone', errors: [] }]);
                }
              }}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button onClick={() => setCreateModal(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={createLoading}>Tạo đơn</Button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default MedicineManagement;