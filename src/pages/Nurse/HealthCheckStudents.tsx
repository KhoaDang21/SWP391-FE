import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Table, Card, Row, Col, Statistic, Spin, Tag } from 'antd';
import { ArrowLeft, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { healthCheckService, HealthCheckForm } from '../../services/Healthcheck';
import { notificationService } from '../../services/NotificationService';

const HealthCheckStudents: React.FC = () => {
  const { hcId } = useParams<{ hcId: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<HealthCheckForm[]>([]);
  const [healthEventDetail, setHealthEventDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    reject: 0
  });

  useEffect(() => {
    if (hcId) {
      fetchData();
    }
  }, [hcId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsData, healthEventDetailRes] = await Promise.all([
        healthCheckService.getStudentsByHealthCheck(parseInt(hcId!)),
        healthCheckService.getHealthCheckById(parseInt(hcId!))
      ]);

      setStudents(studentsData.data);
      setHealthEventDetail(healthEventDetailRes.data);

      // Calculate stats
      const total = studentsData.data.length;
      const confirmed = studentsData.data.filter(s => s.status === 'approved').length;
      const pending = studentsData.data.filter(s => s.status === 'pending' || !s.status).length;
      const reject = studentsData.data.filter(s => s.status === 'rejected').length;
      
      setStats({
        total,
        confirmed,
        pending,
        reject
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      notificationService.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
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
      dataIndex: ['Student', 'fullname'],
      key: 'fullname',
      render: (text: string) => (
        <div className="font-medium text-gray-900">{text}</div>
      ),
    },
    {
      title: 'Email',
      dataIndex: ['Student', 'email'],
      key: 'email',
      render: (text: string) => (
        <div className="text-gray-600">{text}</div>
      ),
    },
    {
      title: 'Phụ huynh',
      key: 'guardians',
      render: (record: HealthCheckForm) => {
        const guardians = record.Student.Guardians;
        if (guardians && guardians.length > 0) {
          return (
            <div className="space-y-1">
              {guardians.map((guardian, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-gray-700">{guardian.roleInFamily}</div>
                  <div className="text-gray-500">{guardian.phoneNumber}</div>
                </div>
              ))}
            </div>
          );
        }
        return <span className="text-gray-400">Chưa có thông tin</span>;
      },
    },
    {
      title: 'Trạng thái xác nhận',
      key: 'confirmation',
      render: (record: HealthCheckForm) => {
        let color = 'orange';
        let text = 'Chờ xác nhận';
        let icon = <Clock className="w-3 h-3" />;
        if (record.status === 'approved') {
          color = 'green';
          text = 'Đã xác nhận';
          icon = <CheckCircle className="w-3 h-3" />;
        } else if (record.status === 'rejected') {
          color = 'red';
          text = 'Từ chối';
          icon = <AlertCircle className="w-3 h-3" />;
        }
        return (
          <Tag
            color={color}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              minWidth: '100px'
            }}
          >
            {icon} {text}
          </Tag>
        );
      },
    },
    {
      title: 'Cần gặp',
      key: 'needMeet',
      render: (record: HealthCheckForm) => (
        <Tag
          color={record.Is_need_meet ? 'red' : 'default'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            minWidth: '80px'
          }}
        >
          {record.Is_need_meet ? (
            <>
              <AlertCircle className="w-3 h-3" />
              Từ chối
            </>
          ) : (
            <>
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              Bình thường
            </>
          )}
        </Tag>
      ),
    },
    {
      title: 'Kết quả khám',
      key: 'results',
      render: (record: HealthCheckForm) => {
        const hasResults = record.Height || record.Weight || record.Blood_Pressure || 
                          record.Vision_Left || record.Vision_Right || record.Dental_Status ||
                          record.ENT_Status || record.Skin_Status || record.General_Conclusion;
        
        return (
          <Tag
            color={hasResults ? 'blue' : 'default'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              minWidth: '80px'
            }}
          >
            {hasResults ? (
              <>
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Đã khám
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                Chưa khám
              </>
            )}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (record: HealthCheckForm) => (
        <div className="text-sm text-gray-500">
          {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : ''}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/nurse/healthcheck')}
            className="flex items-center"
          >
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách học sinh - {healthEventDetail?.title}
            </h1>
            <p className="text-gray-600">
              Năm học: {healthEventDetail?.schoolYear} | Ngày khám: {healthEventDetail?.dateEvent ? new Date(healthEventDetail.dateEvent).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số học sinh"
              value={stats.total}
              prefix={<Users className="w-5 h-5 text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={stats.confirmed}
              prefix={<CheckCircle className="w-5 h-5 text-green-500" />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={stats.pending}
              prefix={<Clock className="w-5 h-5 text-orange-500" />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={stats.reject}
              prefix={<AlertCircle className="w-5 h-5 text-red-500" />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Students Table */}
      <Card title="Danh sách học sinh" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={students}
          rowKey="Form_ID"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} học sinh`,
          }}
          scroll={{ x: 1200 }}
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default HealthCheckStudents; 