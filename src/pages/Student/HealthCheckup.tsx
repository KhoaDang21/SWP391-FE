import React from 'react';
import { Card, Row, Col, Calendar, Badge, List, Tag } from 'antd';
import type { Dayjs } from 'dayjs';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const HealthCheckup = () => {
  const upcomingCheckups = [
    {
      id: 1,
      title: 'Khám sức khỏe định kỳ',
      date: '15/05/2024',
      time: '08:30',
      location: 'Phòng Y tế trường',
      doctor: 'Bác sĩ Nguyễn Thị A',
      type: 'Định kỳ',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Tiêm phòng',
      date: '20/05/2024',
      time: '09:00',
      location: 'Phòng Y tế trường',
      doctor: 'Bác sĩ Trần Văn B',
      type: 'Tiêm chủng',
      status: 'upcoming',
    },
  ];

  const pastCheckups = [
    {
      id: 3,
      title: 'Khám sức khỏe định kỳ',
      date: '15/02/2024',
      time: '08:30',
      location: 'Phòng Y tế trường',
      doctor: 'Bác sĩ Nguyễn Thị A',
      type: 'Định kỳ',
      status: 'completed',
    },
    {
      id: 4,
      title: 'Khám răng',
      date: '10/01/2024',
      time: '10:00',
      location: 'Phòng Y tế trường',
      doctor: 'Bác sĩ Lê Thị C',
      type: 'Nha khoa',
      status: 'completed',
    },
  ];

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('DD/MM/YYYY');
    const hasCheckup = [...upcomingCheckups, ...pastCheckups].some(
      checkup => checkup.date === dateStr
    );

    if (hasCheckup) {
      return <Badge status="success" />;
    }
    return null;
  };

  const CheckupCard = ({ checkup }: { checkup: any }) => (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-blue-600">{checkup.title}</h3>
        <Tag color={checkup.status === 'upcoming' ? 'blue' : 'green'}>
          {checkup.status === 'upcoming' ? 'Sắp tới' : 'Đã hoàn thành'}
        </Tag>
      </div>
      <div className="space-y-2 text-gray-600">
        <div className="flex items-center">
          <CalendarOutlined className="mr-2" />
          <span>{checkup.date}</span>
          <ClockCircleOutlined className="ml-4 mr-2" />
          <span>{checkup.time}</span>
        </div>
        <div className="flex items-center">
          <EnvironmentOutlined className="mr-2" />
          <span>{checkup.location}</span>
        </div>
        <div className="flex items-center">
          <TeamOutlined className="mr-2" />
          <span>{checkup.doctor}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Lịch Khám Sức Khỏe</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card className="shadow-md mb-6">
            <Calendar fullscreen={false} dateCellRender={dateCellRender} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <div className="space-y-6">
            <Card title="Lịch khám sắp tới" className="shadow-md">
              <List
                dataSource={upcomingCheckups}
                renderItem={(checkup) => (
                  <List.Item>
                    <CheckupCard checkup={checkup} />
                  </List.Item>
                )}
              />
            </Card>

            <Card title="Lịch sử khám" className="shadow-md">
              <List
                dataSource={pastCheckups}
                renderItem={(checkup) => (
                  <List.Item>
                    <CheckupCard checkup={checkup} />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HealthCheckup;