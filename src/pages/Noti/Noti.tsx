// src/components/Noti.tsx
import React, { useState } from 'react';
import { Badge, Popover, List, Spin, Divider } from 'antd';
import { BellOutlined } from '@ant-design/icons';

interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

const sampleData: Notification[] = [
    {
        id: '1',
        title: 'Nhắc nhở tiêm chủng mũi 1 ',
        message: 'Hãy đưa bé đến trung tâm y tế để tiêm mũi 1 vào ngày mai.',
        createdAt: new Date().toISOString(),
        isRead: false,
    },
    {
        id: '2',
        title: 'Kết quả khám sức khỏe',
        message: 'Kết quả khám định kỳ đã có, vui lòng xem chi tiết.',
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        isRead: true,
    },
    {
        id: '3',
        title: 'Đơn thuốc mới',
        message: 'Bác sĩ đã kê đơn thuốc cho bé, vui lòng kiểm tra.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        isRead: false,
    },

];

const Noti: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(sampleData);
    const [loading, setLoading] = useState(false);

    const handleOpenChange = (visible: boolean) => {
        setOpen(visible);
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const content = (
        <div style={{ width: 360, maxHeight: 400, overflowY: 'auto' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin />
                </div>
            ) : (
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                        <React.Fragment key={item.id}>
                            <List.Item
                                style={{ padding: '12px 16px' }}
                                onClick={() => {
                                    setNotifications((prev) =>
                                        prev.map((n) =>
                                            n.id === item.id ? { ...n, isRead: true } : n
                                        )
                                    );
                                }}      >
                                <List.Item.Meta
                                    avatar={
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                backgroundColor: item.isRead ? 'transparent' : '#1890ff',
                                                marginTop: 6,
                                                marginRight: 8
                                            }}
                                        />
                                    }
                                    title={
                                        <span style={{ fontWeight: item.isRead ? 'normal' : 'bold' }}>
                                            {item.title}
                                        </span>
                                    }
                                    description={
                                        <div>
                                            <div style={{ fontSize: 12, color: '#888' }}>
                                                {new Date(item.createdAt).toLocaleString()}
                                            </div>
                                            <div style={{ marginTop: 4 }}>{item.message}</div>
                                        </div>
                                    }
                                />
                            </List.Item>
                            <Divider style={{ margin: 0, opacity: 0.3 }} />
                        </React.Fragment>
                    )}
                />

            )}
        </div>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            placement="bottomRight"
        >
            <Badge count={unreadCount} size="small">
                <BellOutlined
                    style={{
                        fontSize: 24,
                        color: open ? '#1890ff' : '#000',
                        cursor: 'pointer',
                    }}
                />
            </Badge>
        </Popover>
    );
};

export default Noti;
