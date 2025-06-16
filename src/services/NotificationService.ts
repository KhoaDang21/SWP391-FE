import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const API_URL = "http://localhost:3333/api/v1";

// Helper to decode JWT and get userId
function getUserIdFromToken(): number | null {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.id || null;
    } catch {
        return null;
    }
}

interface NotificationResponse {
  notifications: Array<{
    notiId: number;
    title: string;
    mess: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
  }>;
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
  unreadCount: number;
}

class NotificationService {
    private refreshInterval: number | null = null;
    
    success(message: string, options: ToastOptions = {}) {
        toast.success(message, { ...defaultOptions, ...options });
    }

    error(message: string, options: ToastOptions = {}) {
        toast.error(message, { ...defaultOptions, ...options });
    }

    info(message: string, options: ToastOptions = {}) {
        toast.info(message, { ...defaultOptions, ...options });
    }

    warning(message: string, options: ToastOptions = {}) {
        toast.warning(message, { ...defaultOptions, ...options });
    }

    async getNotificationsForCurrentUser(): Promise<NotificationResponse> {
        const userId = getUserIdFromToken();
        if (!userId) throw new Error("No userId in token");
        
        const response = await fetch(`${API_URL}/notify/user/${userId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch notifications");
        }

        return await response.json();
    }

    startAutoRefresh(callback: (data: NotificationResponse) => void) {
        
        this.getNotificationsForCurrentUser().then(callback);
        
        
        this.refreshInterval = setInterval(async () => {
            try {
                const data = await this.getNotificationsForCurrentUser();
                callback(data);
            } catch (error) {
                console.error('Auto refresh failed:', error);
            }
        }, 5000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

export const notificationService = new NotificationService();