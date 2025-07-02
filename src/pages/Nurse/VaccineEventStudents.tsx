import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Table, Card, Row, Col, Statistic, Spin, Tag, Input, Select } from 'antd';
import { ArrowLeft, Users, CheckCircle, Clock, AlertCircle, Pencil } from 'lucide-react';
import { vaccineService, VaccinePayload } from '../../services/Vaccineservice';
import { notificationService } from '../../services/NotificationService';

const VaccineEventStudents: React.FC = () => {
  const { eventName, eventDate } = useParams<{ eventName: string; eventDate: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state || {}) as { vaccineName?: string; grade?: string; eventDate?: string };
  const [students, setStudents] = useState<VaccinePayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    allowed: 0,
    rejected: 0,
    pending: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [noteInputs, setNoteInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (eventName) {
      fetchData();
    }
  }, [eventName, eventDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const vaccineName = navState.vaccineName || (eventName ? decodeURIComponent(eventName) : '');
      let grade: string | undefined = navState.grade;
      if (grade === undefined && eventDate) {
        const possibleGrade = parseInt(eventDate);
        if (!isNaN(possibleGrade)) grade = possibleGrade.toString();
      }
      const eventDateParam = navState.eventDate || undefined;
      const records = await vaccineService.getVaccineByName(vaccineName, grade, eventDateParam);
      setStudents(records);

      const total = records.length;
      const confirmed = records.filter(s => s.Status === 'Đã tiêm').length;
      const allowed = records.filter(s => s.Status === 'Cho phép tiêm').length;
      const rejected = records.filter(s => s.Status === 'Không tiêm').length;
      const pending = records.filter(s => s.Status === 'Chờ xác nhận').length;
      setStats({ total, confirmed, allowed, rejected, pending });
    } catch (error) {
      notificationService.error('Có lỗi xảy ra khi tải dữ liệu');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const editableStudents = students.filter(s => s.Status === 'Cho phép tiêm' || s.Status === 'Đã tiêm' || s.Status === 'Không tiêm');

  const handleEditSave = async () => {
    if (isEditing) {
      try {
        const updates = editableStudents
          .filter(record => noteInputs[record.VH_ID] !== undefined || noteInputs[`status_${record.VH_ID}`] !== undefined)
          .map(record => ({
            VH_ID: record.VH_ID,
            status: noteInputs[`status_${record.VH_ID}`] || record.Status,
            note_affter_injection: noteInputs[record.VH_ID] ?? record.note_affter_injection ?? ''
          }));
        console.log('Updates:', updates);

        if (updates.length === 0) {
          setIsEditing(false);
          setNoteInputs({});
          return;
        }

        await vaccineService.updateVaccineStatus({ updates });

        notificationService.success('Cập nhật ghi chú thành công!');
        fetchData();
      } catch (error) {
        notificationService.error('Có lỗi xảy ra khi cập nhật!');
      }
    }
    setIsEditing(!isEditing);
    setNoteInputs({});
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'PatientName',
      key: 'PatientName',
      render: (text: string) => (
        <div className="font-medium text-gray-900">{text}</div>
      ),
    },
    {
      title: 'Lớp',
      dataIndex: ['MedicalRecord', 'Class'],
      key: 'Class',
      render: (text: string) => <div className="text-gray-600">{text}</div>,
    },
    {
      title: 'Trạng thái tiêm',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: string) => (
        <Tag
          color={
            status === 'Đã tiêm'
              ? 'green'
              : status === 'Cho phép tiêm'
                ? 'blue'
                : status === 'Không tiêm'
                  ? 'red'
                  : 'orange'
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            minWidth: '140px'
          }}
        >
          {status === 'Chờ xác nhận' && (
            <>
              <Clock className="w-3 h-3" />
              Chờ xác nhận
            </>
          )}
          {status === 'Cho phép tiêm' && (
            <>
              <Clock className="w-3 h-3" />
              Cho phép tiêm
            </>
          )}
          {status === 'Không tiêm' && (
            <>
              <AlertCircle className="w-3 h-3 text-red-500" />
              Không tiêm
            </>
          )}
          {status === 'Đã tiêm' && (
            <>
              <CheckCircle className="w-3 h-3" />
              Đã tiêm
            </>
          )}
          {status !== 'Chờ xác nhận' && status !== 'Cho phép tiêm' && status !== 'Không tiêm' && status !== 'Đã tiêm' && (
            <>
              <AlertCircle className="w-3 h-3" />
              {status}
            </>
          )}
        </Tag>
      ),
    },
    {
      title: 'Ghi chú sau tiêm',
      dataIndex: 'note_affter_injection',
      key: 'note_affter_injection',
      render: (_: string, record: VaccinePayload) =>
        isEditing && (record.Status === 'Cho phép tiêm' || record.Status === 'Đã tiêm' || record.Status === 'Không tiêm') ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Input
              defaultValue={record.note_affter_injection || ''}
              onChange={e =>
                setNoteInputs(prev => ({
                  ...prev,
                  [record.VH_ID]: e.target.value
                }))
              }
              placeholder="Ghi chú sau tiêm (ví dụ: Đã tiêm, không có phản ứng...)"
              style={{
                flex: 1,
                borderRadius: 6,
                border: '1px solid #d9d9d9',
                padding: '6px 12px',
                fontSize: 13
              }}
            />
            <Select
              style={{
                width: 150,
                borderRadius: 8,
                background: '#f6ffed',
                border: '1.5px solid #b7eb8f',
                fontWeight: 600,
                fontSize: 14,
                boxShadow: '0 2px 8px #b7eb8f22'
              }}
              dropdownStyle={{
                borderRadius: 12,
                boxShadow: '0 4px 16px #36cfc933',
                padding: 8
              }}
              onChange={value => {
                setNoteInputs(prev => ({
                  ...prev,
                  [`status_${record.VH_ID}`]: value
                }));
              }}
              options={[
                {
                  value: 'Đã tiêm',
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle size={18} style={{ color: '#389e0d' }} />
                      <span style={{ color: '#389e0d', fontWeight: 600 }}>Đã tiêm</span>
                    </div>
                  )
                },
                {
                  value: 'Không tiêm',
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertCircle size={18} style={{ color: '#cf1322' }} />
                      <span style={{ color: '#cf1322', fontWeight: 600 }}>Không tiêm</span>
                    </div>
                  )
                }
              ]}
              placeholder={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={18} style={{ color: '#389e0d' }} />
                  <span style={{ color: '#389e0d', fontWeight: 600 }}>Đã tiêm</span>
                </div>
              }
            />
          </div>
        ) : (
          <div className="text-gray-600">{record.note_affter_injection || 'Không có'}</div>
        ),
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'Date_injection',
      key: 'Date_injection',
      render: (text: string) =>
        <div className="text-sm text-gray-500">
          {text ? new Date(text).toLocaleDateString('vi-VN') : ''}
        </div>,
    },
  ];

  const hasPending = students.some(s => s.Status === 'Chờ xác nhận');
  const hasAllowed = students.some(s => s.Status === 'Cho phép tiêm' || s.Status === 'Đã tiêm');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/nurse/vaccine')}
            className="flex items-center"
          >
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách học sinh
              <p> Đợt tiêm {eventName} - {students[0]?.MedicalRecord?.Class.charAt(0) ? `Khối Lớp ${students[0].MedicalRecord.Class.charAt(0)}` : ''} </p>
            </h1>
            <p className="text-gray-600">
              Ngày tiêm: {eventDate ? new Date(eventDate).toLocaleDateString('vi-VN') : 'N/A'}
            </p>
          </div>
        </div>
        {!hasPending && hasAllowed && (
          <Button
            icon={<Pencil className="w-4 h-4" />}
            type="default"
            style={{
              background: isEditing
                ? 'linear-gradient(to right, #22c55e, #16a34a)'
                : 'linear-gradient(to right, #2563eb, #1d4ed8)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              boxShadow: isEditing
                ? '0 2px 8px 0 rgba(34,197,94,0.15)'
                : '0 2px 8px 0 rgba(37,99,235,0.15)',
              transition: 'all 0.2s'
            }}
            className="flex items-center px-5 py-2 rounded-lg"
            onClick={handleEditSave}
          >
            {isEditing ? 'Lưu ghi chú' : 'Ghi chú sau tiêm'}
          </Button>
        )}
      </div>

      <Row gutter={16}>
        <Col span={5}>
          <Card>
            <Statistic
              title="Tổng số học sinh"
              value={stats.total}
              prefix={<Users className="w-5 h-5 text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={stats.pending}
              prefix={<Clock className="w-5 h-5 text-orange-500" />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Cho phép tiêm"
              value={stats.allowed}
              prefix={<CheckCircle className="w-5 h-5 text-blue-500" />}
              valueStyle={{ color: '#2563eb' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Không tiêm"
              value={stats.rejected}
              prefix={<AlertCircle className="w-5 h-5 text-red-500" />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã tiêm"
              value={stats.confirmed}
              prefix={<CheckCircle className="w-5 h-5 text-green-500" />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
      </Row>
      <Card title="Danh sách học sinh" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={isEditing ? editableStudents : students}
          rowKey="VH_ID"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} học sinh`,
          }}
          scroll={{ x: 900 }}
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default VaccineEventStudents;
