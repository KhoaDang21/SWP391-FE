import { Card, Row, Col, Statistic } from 'antd';
import {
  HeartTwoTone,
  SmileTwoTone,
  ThunderboltTwoTone,
} from '@ant-design/icons';

const Student = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-[calc(100vh-64px)]">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Chào bạn nhỏ! 👋</h1>
        <p className="text-gray-600">Hãy cùng theo dõi sức khỏe của mình nào!</p>
      </div>

      {/* Health Overview */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={8}>
          <Card hoverable className="text-center shadow-md">
            <Statistic
              title="Chỉ số BMI"
              value={18.5}
              precision={1}
              prefix={<HeartTwoTone twoToneColor="#eb2f96" />}
              suffix="kg/m²"
            />
            <p className="mt-2 text-green-500">Khỏe mạnh</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable className="text-center shadow-md">
            <Statistic
              title="Số lần khám"
              value={2}
              prefix={<SmileTwoTone twoToneColor="#52c41a" />}
              suffix="/4"
            />
            <p className="mt-2 text-blue-500">Trong năm học</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable className="text-center shadow-md">
            <Statistic
              title="Điểm sức khỏe"
              value={85}
              prefix={<ThunderboltTwoTone twoToneColor="#faad14" />}
              suffix="/100"
            />
            <p className="mt-2 text-yellow-500">Rất tốt</p>
          </Card>
        </Col>
      </Row>

      {/* Health Activities */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title="Hoạt động sắp tới" 
            className="shadow-md"
            headStyle={{ color: '#1890ff', fontWeight: 'bold' }}
          >
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="mr-4 text-2xl">📅</div>
                <div>
                  <h4 className="font-bold">Khám sức khỏe định kỳ</h4>
                  <p className="text-gray-600">Thứ 2, ngày 15/05/2024</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="mr-4 text-2xl">💉</div>
                <div>
                  <h4 className="font-bold">Tiêm phòng</h4>
                  <p className="text-gray-600">Thứ 4, ngày 20/05/2024</p>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="Lời khuyên cho bé" 
            className="shadow-md"
            headStyle={{ color: '#52c41a', fontWeight: 'bold' }}
          >
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <div className="mr-4 text-2xl">🍎</div>
                <div>
                  <h4 className="font-bold">Dinh dưỡng</h4>
                  <p className="text-gray-600">Ăn đủ 4 nhóm chất dinh dưỡng mỗi ngày</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="mr-4 text-2xl">😴</div>
                <div>
                  <h4 className="font-bold">Giấc ngủ</h4>
                  <p className="text-gray-600">Ngủ đủ 8-10 tiếng mỗi ngày</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                <div className="mr-4 text-2xl">🏃‍♂️</div>
                <div>
                  <h4 className="font-bold">Vận động</h4>
                  <p className="text-gray-600">Tập thể dục 30 phút mỗi ngày</p>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Student;
