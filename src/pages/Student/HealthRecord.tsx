import React from 'react';
import { Card, Row, Col, Timeline, Table, Tag, Progress } from 'antd';
import {
  HeartFilled,
  ColumnHeightOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';

const HealthRecord = () => {
  const healthData = {
    height: [
      { date: '08/2023', value: 132 },
      { date: '11/2023', value: 134 },
      { date: '02/2024', value: 135 },
    ],
    weight: [
      { date: '08/2023', value: 30 },
      { date: '11/2023', value: 31 },
      { date: '02/2024', value: 32 },
    ],
  };

  const columns = [
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
      render: (value: number) => (
        <span className="font-bold text-blue-600">{value}</span>
      ),
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
      render: (value: number) => (
        <span className="font-bold text-green-600">{value}</span>
      ),
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      key: 'bmi',
      render: (value: number) => {
        let color = 'green';
        if (value < 18.5) color = 'gold';
        if (value > 25) color = 'red';
        return <Tag color={color}>{value}</Tag>;
      },
    },
  ];

  const data = healthData.height.map((item, index) => ({
    key: index,
    date: item.date,
    height: item.value,
    weight: healthData.weight[index].value,
    bmi: Number((healthData.weight[index].value / Math.pow(item.value / 100, 2)).toFixed(1)),
  }));

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Hồ Sơ Sức Khỏe</h1>
      
      {/* Current Health Status */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={8}>
          <Card className="text-center shadow-md">
            <ColumnHeightOutlined className="text-4xl text-blue-500 mb-2" />
            <h3 className="font-bold mb-2">Chiều cao hiện tại</h3>
            <p className="text-2xl font-bold text-blue-600">135 cm</p>
            <Progress 
              percent={75} 
              strokeColor="#1890ff"
              format={() => 'Phát triển tốt'}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center shadow-md">
            <HeartFilled className="text-4xl text-pink-500 mb-2" />
            <h3 className="font-bold mb-2">Cân nặng hiện tại</h3>
            <p className="text-2xl font-bold text-pink-600">32 kg</p>
            <Progress 
              percent={80} 
              strokeColor="#eb2f96"
              format={() => 'Cân đối'}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center shadow-md">
            <FieldTimeOutlined className="text-4xl text-green-500 mb-2" />
            <h3 className="font-bold mb-2">Chỉ số BMI</h3>
            <p className="text-2xl font-bold text-green-600">17.5</p>
            <Progress 
              percent={85} 
              strokeColor="#52c41a"
              format={() => 'Khỏe mạnh'}
            />
          </Card>
        </Col>
      </Row>

      {/* Health History */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Lịch sử theo dõi sức khỏe" className="shadow-md">
            <Table 
              columns={columns} 
              dataSource={data} 
              pagination={false}
              className="mb-4"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Tiến trình phát triển" className="shadow-md">
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <p className="font-bold">Tháng 2/2024</p>
                      <p>Chiều cao tăng 1cm</p>
                      <p>Cân nặng tăng 1kg</p>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <p className="font-bold">Tháng 11/2023</p>
                      <p>Chiều cao tăng 2cm</p>
                      <p>Cân nặng tăng 1kg</p>
                    </div>
                  ),
                },
                {
                  color: 'gray',
                  children: (
                    <div>
                      <p className="font-bold">Tháng 8/2023</p>
                      <p>Khám sức khỏe đầu năm</p>
                      <p>Tình trạng: Khỏe mạnh</p>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HealthRecord;