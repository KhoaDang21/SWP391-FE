import React, { useEffect, useState } from 'react';
import { Typography, Table, Button, Modal, Form, Input, message, Popconfirm, Space, Card, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAllBlogs, createBlog, updateBlog, deleteBlog, Blog } from '../../../services/BlogService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ContentManagement: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const data = await getAllBlogs();
            setBlogs(data);
        } catch (err: any) {
            message.error(err.message || 'Lỗi tải blog');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleCreate = () => {
        setEditingBlog(null);
        setImageUrl(undefined);
        setSubmitAttempted(false);
        setModalOpen(true);
    };

    const handleEdit = (blog: Blog) => {
        setEditingBlog(blog);
        setImageUrl(blog.image || undefined);
        setSubmitAttempted(false);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                message.error('Bạn cần đăng nhập để thực hiện thao tác này');
                return;
            }

            setLoading(true);
            await deleteBlog(id, token);
            message.success('Đã xóa blog');
            fetchBlogs();
        } catch (err: any) {
            message.error(err.message || 'Lỗi xóa blog');
        } finally {
            setLoading(false);
        }
    };

    const handleModalOk = async () => {
        setSubmitAttempted(true);

        try {
            const values = await form.validateFields();

            if (!imageUrl) {
                message.error('Vui lòng upload ảnh');
                return;
            }

            const token = localStorage.getItem('accessToken');
            if (!token) {
                message.error('Bạn cần đăng nhập để thực hiện thao tác này');
                return;
            }

            setSubmitting(true);
            const payload = { ...values, image: imageUrl };

            if (editingBlog) {
                await updateBlog(editingBlog.id!, payload, token);
                message.success('Đã cập nhật blog');
            } else {
                await createBlog(payload, token);
                message.success('Đã tạo blog');
            }

            setModalOpen(false);
            form.resetFields();
            setImageUrl(undefined);
            fetchBlogs();
        } catch (err: any) {
            console.error('Error:', err);
            if (!err.errorFields) {
                message.error(err.message || 'Lỗi xử lý');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Reset form fields when modal is opened
    React.useEffect(() => {
        if (modalOpen && !editingBlog) {
            form.resetFields();
        }
        if (modalOpen && editingBlog) {
            form.setFieldsValue({
                title: editingBlog.title,
                content: editingBlog.content,
                author: editingBlog.author
            });
        }
    }, [modalOpen, editingBlog, form]);

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <Text strong>{text || '--'}</Text>
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
            render: (text: string) => <Text type="secondary">{text || '--'}</Text>
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (v: string) => (
                <Text type="secondary">{v ? new Date(v).toLocaleDateString() : '--'}</Text>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Blog) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa blog này?"
                        onConfirm={() => handleDelete(record.id!)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="topRight"
                    >
                        <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            variant="borderless"
            style={{ maxWidth: 1200, margin: '0 auto' }}
            styles={{ body: { padding: 24 } }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>Quản lý Blog</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                >
                    Tạo bài viết mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={blogs}
                rowKey="id"
                loading={loading}
                bordered
                pagination={{ pageSize: 6 }}
            />

            <Modal
                title={<Text strong>{editingBlog ? 'Cập nhật Blog' : 'Tạo Blog mới'}</Text>}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={() => {
                    setModalOpen(false);
                    setImageUrl(undefined);
                }}
                okText={editingBlog ? 'Cập nhật' : 'Tạo mới'}
                cancelText="Hủy"
                confirmLoading={submitting}
                width={700}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ title: '', content: '', author: '' }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                rules={[
                                    { required: true, message: 'Nhập tiêu đề' },
                                    { max: 200, message: 'Tiêu đề tối đa 200 ký tự' }
                                ]}
                                validateStatus={submitAttempted && form.getFieldError('title').length ? 'error' : ''}
                                help={submitAttempted && form.getFieldError('title')[0]}
                            >
                                <Input placeholder="Nhập tiêu đề blog" maxLength={200} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="content"
                                label="Nội dung"
                                rules={[
                                    { required: true, message: 'Nhập nội dung' },
                                    { min: 10, message: 'Nội dung tối thiểu 10 ký tự' }
                                ]}
                                validateStatus={submitAttempted && form.getFieldError('content').length ? 'error' : ''}
                                help={submitAttempted && form.getFieldError('content')[0]}
                            >
                                <TextArea rows={5} placeholder="Nhập nội dung blog" minLength={10} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="author"
                                label="Tác giả"
                                rules={[
                                    { required: true, message: 'Nhập tên tác giả' },
                                    { max: 100, message: 'Tên tác giả tối đa 100 ký tự' }
                                ]}
                                validateStatus={submitAttempted && form.getFieldError('author').length ? 'error' : ''}
                                help={submitAttempted && form.getFieldError('author')[0]}
                            >
                                <Input placeholder="Nhập tên tác giả" maxLength={100} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Ảnh minh họa"
                        required
                        validateStatus={submitAttempted && !imageUrl ? 'error' : ''}
                        help={submitAttempted && !imageUrl ? 'Vui lòng upload ảnh minh họa' : ''}
                    >
                        <div
                            style={{
                                border: '1px dashed #d9d9d9',
                                borderRadius: '8px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#fafafa',
                                transition: 'border-color 0.3s',
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*"  // Chấp nhận tất cả loại ảnh
                                style={{ display: 'none' }}
                                id="upload-input"
                                onChange={async (e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (!file) return;

                                    // Bỏ kiểm tra loại file và kích thước
                                    setUploading(true);
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    try {
                                        const res = await fetch('http://localhost:3333/api/v1/upload', {
                                            method: 'POST',
                                            body: formData,
                                        });
                                        if (!res.ok) throw new Error('Upload ảnh thất bại');
                                        const data = await res.json();
                                        setImageUrl(data.url);
                                        message.success('Upload ảnh thành công');
                                    } catch (err: any) {
                                        message.error(err.message || 'Lỗi upload ảnh');
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                                disabled={uploading}
                            />

                            <label htmlFor="upload-input" style={{ cursor: 'pointer' }}>
                                {imageUrl ? (
                                    <div>
                                        <img
                                            src={imageUrl}
                                            alt="blog cover"
                                            style={{
                                                width: '100%',
                                                maxHeight: '300px',
                                                objectFit: 'contain',
                                                marginBottom: '16px',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <Button type="primary" onClick={() => document.getElementById('upload-input')?.click()}>
                                            Thay đổi ảnh
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <PlusOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                                        <div style={{ marginTop: '8px' }}>
                                            {uploading ? (
                                                <span>Đang tải lên...</span>
                                            ) : (
                                                <>
                                                    <div>Nhấn để tải ảnh lên</div>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        Hỗ trợ tất cả định dạng ảnh
                                                    </Text>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ContentManagement;