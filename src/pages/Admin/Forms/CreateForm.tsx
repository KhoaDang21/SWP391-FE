import React from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    message,
    Row,
    Col,
    Checkbox
} from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const HealthCheckFormAdmin: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Form data sent to parent:', values);
        message.success('Đã gửi phiếu xác nhận cho phụ huynh!');
    };

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-[calc(100vh-64px)]">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
                Gửi Phiếu Xác Nhận Khám Sức Khỏe
            </h1>

            <Card className="shadow-lg rounded-xl p-8 w-full bg-white">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        checkConfirmed: false,
                        checkupDate: dayjs()
                    }}
                >
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Tên học sinh"
                                name="studentName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên học sinh' }]}
                            >
                                <Input placeholder="Nhập họ tên học sinh" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Lớp"
                                name="class"
                                rules={[{ required: true, message: 'Vui lòng nhập lớp học' }]}
                            >
                                <Input placeholder="Nhập lớp học" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Loại khám"
                                name="checkupType"
                                rules={[{ required: true, message: 'Vui lòng chọn loại khám' }]}
                            >
                                <Select placeholder="Chọn loại khám" size="large">
                                    <Option value="tongquat">Khám tổng quát</Option>
                                    <Option value="ranghammat">Khám răng hàm mặt</Option>
                                    <Option value="tai-mui-hong">Khám tai mũi họng</Option>
                                    <Option value="khac">Khác</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Ngày khám"
                                name="checkupDate"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
                            >
                                <DatePicker className="w-full" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú thêm"
                                name="notes"
                            >
                                <TextArea rows={6} placeholder="Nhập ghi chú (nếu có)" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="space-between" align="middle" className="mt-4">
                        <Col xs={24} md={16}>
                            <Form.Item
                                name="checkConfirmed"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value
                                                ? Promise.resolve()
                                                : Promise.reject(new Error('Vui lòng xác nhận')),
                                    },
                                ]}
                            >
                                <Checkbox>Tôi xác nhận thông tin trên là chính xác</Checkbox>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full md:w-auto mt-2 md:mt-0 float-right"
                                size="large"
                                style={{
                                    backgroundColor: '#2563eb',
                                    border: 'none',
                                    fontSize: '16px',
                                    height: '48px',
                                    minWidth: '200px'
                                }}
                            >
                                Gửi phiếu xác nhận
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
};

export default HealthCheckFormAdmin;