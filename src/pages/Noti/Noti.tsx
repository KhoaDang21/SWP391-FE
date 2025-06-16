// src/components/Noti.tsx
import React, { useState, useEffect } from 'react';
import { Badge, Popover, List, Spin, Divider } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { notificationService } from '../../services/NotificationService';

interface Notification {
  notiId: number;
  title: string;
  mess: string;
  isRead: boolean;
  createdAt: string;
}

const Noti: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await notificationService.getNotificationsForCurrentUser();
        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleOpenChange = (visible: boolean) => {
    setOpen(visible);
  };

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
            <React.Fragment key={item.notiId}>
              <List.Item
                style={{ padding: '12px 16px' }}
                onClick={() => {
                  setNotifications((prev) =>
                    prev.map((n) =>
                      n.notiId === item.notiId ? { ...n, isRead: true } : n
                    )
                  );
                }}
              >
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
                      <div style={{ marginTop: 4 }}>{item.mess}</div>
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
            