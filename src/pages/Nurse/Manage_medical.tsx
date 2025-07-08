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
import { Modal, Button, Spin, Table, Tag, Dropdown, Menu, message, Image, Form, Input, Upload, Select, Space, Tooltip, Popconfirm, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { DownOutlined, FileTextOutlined, MedicineBoxOutlined, PictureOutlined, UserOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllMedicalRecords, MedicalRecord } from '../../services/MedicalRecordService';
import { getAllGuardians, Guardian } from '../../services/AccountService';
import type { UploadFile } from 'antd/es/upload/interface';

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
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [detailPreviewVisible, setDetailPreviewVisible] = useState(false);
  const [detailPreviewImage, setDetailPreviewImage] = useState('');

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

  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj!);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(file.url || file.preview || '');
    setPreviewVisible(true);
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
          <Tooltip title="Sửa"><Button type="text" icon={<EditOutlined />} onClick={() => { nurseForm.setFieldsValue({ studentName: medicalRecordMap[record.User_ID]?.fullname || '', className: record.Class, deliveryTimeNote: record.Delivery_time?.split(' - ')[1], prescriptionImage: [] }); }} /></Tooltip>
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
              {detailModal.record?.Image_prescription ? (
                <div className="flex justify-center">
                  <Image
                    width={220}
                    style={{ maxWidth: 220, height: 'auto', display: 'block', margin: '0 auto', cursor: 'pointer' }}
                    src={detailModal.record.Image_prescription}
                    alt="Toa thuốc"
                    className="rounded-lg border border-gray-200 shadow-sm object-contain"
                    preview={false}
                    onClick={() => {
                      if (detailModal.record?.Image_prescription) {
                        setDetailPreviewImage(detailModal.record.Image_prescription);
                        setDetailPreviewVisible(true);
                      }
                    }}
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
        onCancel={() => { setCreateModal(false); }}
        title="Tạo đơn gửi thuốc mới"
        footer={null}
        destroyOnClose
        width={1000}
      >
        <Form
          form={nurseForm}
          layout="vertical"
          onFinish={async (values) => {
            setCreateLoading(true);
            try {
              const { selectedStudentId, deliveryTimeNote, prescriptionImage, notes } = values;
              if (!selectedStudentId || !prescriptionImage || !deliveryTimeNote) {
                message.error('Vui lòng nhập đầy đủ thông tin!');
                setCreateLoading(false);
                return;
              }
              const student = medicalRecords.find(s => s.userId === selectedStudentId);
              const formData = new FormData();
              formData.append('userId', String(selectedStudentId));
              formData.append('Class', student?.Class || '');
              formData.append('guardianPhone', student?.guardian?.phoneNumber || '');
              formData.append('deliveryTime', `${dayjs().format('YYYY-MM-DD')} - ${deliveryTimeNote}`);
              formData.append('status', 'received');
              formData.append('notes', notes || '');
              formData.append('prescriptionImage', prescriptionImage[0].originFileObj);
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
          <Row gutter={32}>
            <Col xs={24} md={12}>
              <Form.Item name="selectedStudentId" label="Chọn học sinh" rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]} style={{ marginBottom: 24 }}>
                <Select
                  showSearch
                  placeholder="Nhấn để chọn hồ sơ y tế học sinh"
                  optionFilterProp="children"
                  onChange={id => {
                    const student = medicalRecords.find(s => s.userId === id);
                    nurseForm.setFieldsValue({
                      className: student?.Class,
                      guardianPhone: student?.guardian?.phoneNumber
                    });
                  }}
                  filterOption={(input, option) => {
                    const children = option?.children as unknown;
                    if (typeof children === 'string') {
                      return children.toLowerCase().includes(input.toLowerCase());
                    }
                    if (typeof children === 'number') {
                      return children.toString().toLowerCase().includes(input.toLowerCase());
                    }
                    if (Array.isArray(children)) {
                      const label = children.map(child =>
                        typeof child === 'string' ? child :
                          typeof child === 'number' ? child.toString() : ''
                      ).join('');
                      return label.toLowerCase().includes(input.toLowerCase());
                    }
                    return false;
                  }}
                  style={{ width: '100%', fontSize: 16 }}
                >
                  {medicalRecords.map(s => (
                    <Select.Option key={s.userId} value={s.userId}>
                      {s.fullname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Lớp" name="className" style={{ marginBottom: 24 }}>
                <Input readOnly disabled style={{ fontSize: 16 }} />
              </Form.Item>
              <Form.Item label="SĐT phụ huynh" name="guardianPhone" style={{ marginBottom: 24 }}>
                <Input readOnly disabled style={{ fontSize: 16 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="deliveryTimeNote"
                label="Buổi uống"
                rules={[{ required: true, message: 'Vui lòng chọn buổi uống!' }]}
                style={{ marginBottom: 24 }}
              >
                <Select placeholder="Chọn buổi" style={{ width: '100%', fontSize: 16 }}>
                  {timeOptions.map((time) => (<Select.Option key={time} value={time}>{time}</Select.Option>))}
                </Select>
              </Form.Item>
              <Form.Item
                name="prescriptionImage"
                label="Hình ảnh toa thuốc"
                valuePropName="fileList"
                getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
                rules={[
                  { required: true, message: 'Vui lòng tải lên hình ảnh toa thuốc' }
                ]}
                style={{ marginBottom: 24 }}
              >
                <Upload
                  listType="picture-card"
                  accept="image/*"
                  beforeUpload={file => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                      message.error('Chỉ cho phép upload file ảnh!');
                    }
                    const isLt5M = file.size / 1024 / 1024 < 5;
                    if (!isLt5M) {
                      message.error('Ảnh phải nhỏ hơn 5MB!');
                    }
                    return isImage && isLt5M ? false : Upload.LIST_IGNORE;
                  }}
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  onPreview={handlePreview}
                  style={{ width: '100%' }}
                >
                  {fileList.length >= 1 ? null : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <PlusOutlined />
                      <span>Upload</span>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
              </Modal>
              <Form.Item name="notes" label="Ghi chú" style={{ marginBottom: 24 }}>
                <Input.TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" style={{ fontSize: 16 }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button onClick={() => setCreateModal(false)} style={{ marginRight: 8, fontSize: 16 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={createLoading} style={{ fontSize: 16 }}>Tạo đơn</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={detailPreviewVisible} footer={null} onCancel={() => setDetailPreviewVisible(false)}>
        <img alt="preview" style={{ width: '100%' }} src={detailPreviewImage} />
      </Modal>

    </div>
  );
};

export default MedicineManagement;