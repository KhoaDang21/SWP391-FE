import React, { useState } from 'react';
import {
    Card,
    Button,
    Space,
    Row,
    Col,
    Statistic,
    Tag,
    Typography,
    Select
} from 'antd';
import {
    MedicineBoxOutlined,
    HeartOutlined,
    ExperimentOutlined,
    AlertOutlined,
} from '@ant-design/icons';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
    ResponsiveContainer
} from 'recharts';

// import { healthCheckService, HealthCheckEvent, CreateHealthCheckRequest } from '../../services/DashboardService';

// const { Title, Text } = Typography;
const { Option } = Select;

// Types
interface Medicine {
    id: string;
    studentName: string;
    parentName: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    notes?: string;
}

interface HealthCheck {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    participants: number;
    status: 'scheduled' | 'ongoing' | 'completed';
    description: string;
}

interface Vaccination {
    id: string;
    vaccineName: string;
    date: string;
    time: string;
    location: string;
    ageGroup: string;
    participants: number;
    status: 'scheduled' | 'ongoing' | 'completed';
    notes: string;
}

interface MedicalEvent {
    id: string;
    studentName: string;
    eventType: 'fall' | 'fever' | 'cough' | 'injury' | 'other';
    severity: 'low' | 'medium' | 'high';
    description: string;
    action: string;
    reportedBy: string;
    reportedAt: string;
    status: 'new' | 'handled' | 'follow-up';
}

const NurseDashboard: React.FC = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([
        {
            id: '1',
            studentName: 'Nguyễn Văn A',
            parentName: 'Nguyễn Thị B',
            medicineName: 'Paracetamol',
            dosage: '500mg',
            frequency: '2 lần/ngày',
            duration: '3 ngày',
            instructions: 'Uống sau bữa ăn',
            status: 'pending',
            submittedAt: '2024-12-01 09:00'
        },
        {
            id: '2',
            studentName: 'Trần Văn C',
            parentName: 'Trần Thị D',
            medicineName: 'Amoxicillin',
            dosage: '250mg',
            frequency: '3 lần/ngày',
            duration: '7 ngày',
            instructions: 'Uống trước bữa ăn 30 phút',
            status: 'approved',
            submittedAt: '2024-12-01 08:30'
        },
        {
            id: '3',
            studentName: 'Lê Thị E',
            parentName: 'Lê Văn F',
            medicineName: 'Ibuprofen',
            dosage: '200mg',
            frequency: '2 lần/ngày',
            duration: '5 ngày',
            instructions: 'Uống cùng thức ăn',
            status: 'rejected',
            submittedAt: '2024-11-30 14:20'
        },
        {
            id: '4',
            studentName: 'Phạm Văn G',
            parentName: 'Phạm Thị H',
            medicineName: 'Cefixime',
            dosage: '100mg',
            frequency: '2 lần/ngày',
            duration: '7 ngày',
            instructions: 'Uống sau bữa ăn',
            status: 'approved',
            submittedAt: '2024-11-29 10:15'
        }
    ]);

    const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
        {
            id: '1',
            title: 'Khám sức khỏe định kỳ lớp 1',
            date: '2024-12-15',
            time: '08:00',
            location: 'Phòng y tế',
            type: 'Khám tổng quát',
            participants: 25,
            status: 'scheduled',
            description: 'Khám sức khỏe định kỳ cho học sinh lớp 1'
        },
        {
            id: '2',
            title: 'Khám sức khỏe định kỳ lớp 2',
            date: '2024-12-16',
            time: '09:00',
            location: 'Phòng y tế',
            type: 'Khám tổng quát',
            participants: 30,
            status: 'scheduled',
            description: 'Khám sức khỏe định kỳ cho học sinh lớp 2'
        },
        {
            id: '3',
            title: 'Khám mắt học sinh lớp 3',
            date: '2024-12-10',
            time: '14:00',
            location: 'Phòng y tế',
            type: 'Khám chuyên khoa',
            participants: 28,
            status: 'completed',
            description: 'Khám mắt định kỳ'
        }
    ]);

    const [vaccinations, setVaccinations] = useState<Vaccination[]>([
        {
            id: '1',
            vaccineName: 'Vaccine cúm mùa',
            date: '2024-12-20',
            time: '09:00',
            location: 'Phòng y tế',
            ageGroup: '6-12 tuổi',
            participants: 100,
            status: 'scheduled',
            notes: 'Cần thông báo phụ huynh trước 3 ngày'
        },
        {
            id: '2',
            vaccineName: 'Vaccine HPV',
            date: '2024-12-25',
            time: '10:00',
            location: 'Phòng y tế',
            ageGroup: '11-12 tuổi',
            participants: 45,
            status: 'scheduled',
            notes: 'Chỉ dành cho học sinh nữ'
        },
        {
            id: '3',
            vaccineName: 'Vaccine viêm gan B',
            date: '2024-11-30',
            time: '08:30',
            location: 'Phòng y tế',
            ageGroup: '6-8 tuổi',
            participants: 60,
            status: 'completed',
            notes: 'Hoàn thành thành công'
        }
    ]);

    const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([
        {
            id: '1',
            studentName: 'Lê Văn E',
            eventType: 'fall',
            severity: 'low',
            description: 'Bị trượt ngã khi chơi ở sân trường',
            action: 'Sơ cứu, kiểm tra vết thương',
            reportedBy: 'Cô giáo Hoa',
            reportedAt: '2024-12-01 10:30',
            status: 'handled'
        },
        {
            id: '2',
            studentName: 'Phạm Thị F',
            eventType: 'fever',
            severity: 'medium',
            description: 'Sốt 38.5°C, mệt mỏi',
            action: 'Đo nhiệt độ, liên hệ phụ huynh',
            reportedBy: 'Y tá Lan',
            reportedAt: '2024-12-01 11:15',
            status: 'follow-up'
        },
        {
            id: '3',
            studentName: 'Nguyễn Văn G',
            eventType: 'cough',
            severity: 'low',
            description: 'Ho khan, không sốt',
            action: 'Theo dõi, khuyên uống nước',
            reportedBy: 'Y tá Mai',
            reportedAt: '2024-11-30 15:20',
            status: 'handled'
        },
        {
            id: '4',
            studentName: 'Trần Thị H',
            eventType: 'injury',
            severity: 'high',
            description: 'Chấn thương đầu gối khi chơi thể thao',
            action: 'Sơ cứu, chuyển bệnh viện',
            reportedBy: 'Thầy Nam',
            reportedAt: '2024-11-29 16:45',
            status: 'handled'
        },
        {
            id: '5',
            studentName: 'Võ Văn I',
            eventType: 'fever',
            severity: 'medium',
            description: 'Sốt 38.2°C, đau đầu',
            action: 'Đo nhiệt độ, liên hệ phụ huynh',
            reportedBy: 'Y tá Lan',
            reportedAt: '2024-11-28 09:30',
            status: 'handled'
        }
    ]);

    // Prepare chart data
    const medicineStatusData = [
        { name: 'Chờ duyệt', value: medicines.filter(m => m.status === 'pending').length, color: '#fa8c16' },
        { name: 'Đã duyệt', value: medicines.filter(m => m.status === 'approved').length, color: '#52c41a' },
        { name: 'Từ chối', value: medicines.filter(m => m.status === 'rejected').length, color: '#f5222d' }
    ];

    const eventTypeData = [
        { name: 'Té ngã', value: medicalEvents.filter(e => e.eventType === 'fall').length },
        { name: 'Sốt', value: medicalEvents.filter(e => e.eventType === 'fever').length },
        { name: 'Ho', value: medicalEvents.filter(e => e.eventType === 'cough').length },
        { name: 'Chấn thương', value: medicalEvents.filter(e => e.eventType === 'injury').length },
        { name: 'Khác', value: medicalEvents.filter(e => e.eventType === 'other').length }
    ];

    const severityData = [
        { name: 'Nhẹ', value: medicalEvents.filter(e => e.severity === 'low').length, color: '#52c41a' },
        { name: 'Trung bình', value: medicalEvents.filter(e => e.severity === 'medium').length, color: '#fa8c16' },
        { name: 'Nặng', value: medicalEvents.filter(e => e.severity === 'high').length, color: '#f5222d' }
    ];

    const vaccinationData = [
        { name: 'Cúm mùa', participants: 100, status: 'scheduled' },
        { name: 'HPV', participants: 45, status: 'scheduled' },
        { name: 'Viêm gan B', participants: 60, status: 'completed' }
    ];

    const healthCheckData = [
        { name: 'Khám tổng quát', participants: 55, completed: 28 },
        { name: 'Khám chuyên khoa', participants: 28, completed: 28 }
    ];

    const monthlyTrendData = [
        { month: 'T10', medicines: 8, events: 12, vaccinations: 2 },
        { month: 'T11', medicines: 15, events: 18, vaccinations: 3 },
        { month: 'T12', medicines: 12, events: 15, vaccinations: 4 }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': case 'new': case 'scheduled': return 'orange';
            case 'approved': case 'handled': case 'completed': return 'green';
            case 'rejected': return 'red';
            case 'follow-up': case 'ongoing': return 'blue';
            default: return 'default';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Y Tá</h1>

            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đơn thuốc gửi đến"
                            value={medicines.filter(m => m.status === 'pending').length}
                            valueStyle={{ color: '#f5222d' }}
                            prefix={<MedicineBoxOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đợt khám sức khỏe"
                            value={healthChecks.filter(h => h.status === 'scheduled').length}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<HeartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đợt tiêm vaccine"
                            value={vaccinations.filter(v => v.status === 'scheduled').length}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<ExperimentOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Sự kiện y tế mới"
                            value={medicalEvents.filter(e => e.status === 'new').length}
                            valueStyle={{ color: '#fa8c16' }}
                            prefix={<AlertOutlined />}
                        />
                    </Card>
                </Col>

            </Row>

            {/* Charts Row 1 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card title="Các trạng thái đơn thuốc" extra={<Button type="link">Chi tiết</Button>}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={medicineStatusData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {medicineStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Thống kê sự kiện y tế theo tháng" extra={<Button type="link">Chi tiết</Button>}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={eventTypeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#1890ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Charts Row 2 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card title="Các trạng thái đợt tiêm" extra={<Button type="link">Chi tiết</Button>}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={severityData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Các trạng thái đợt khám sức khỏe" extra={<Button type="link">Chi tiết</Button>}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={severityData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

        </div>
    );
};

export default NurseDashboard;