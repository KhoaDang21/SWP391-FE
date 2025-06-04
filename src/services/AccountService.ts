export interface User {
    id: number;
    username: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    roleId: number;
    Role?: {
        name: string;
    };
}

export interface UpdateUserDto {
    username: string;
    fullname: string;
    email: string;
    phoneNumber: string;
}

const API_URL = 'http://localhost:3333/api/v1';

export async function getAllUsers(token: string): Promise<User[]> {
    const res = await fetch(`${API_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Lỗi khi lấy danh sách người dùng');
    }

    const data = await res.json();
    return data;
}

export const getRoleName = (roleId: number): string => {
    switch (roleId) {
        case 1:
            return 'Admin';
        case 2:
            return 'Nurse';
        case 3:
            return 'Student';
        case 4:
            return 'Guardian';
    
        default:
            return 'Unknown';
    }
};

export async function getUserById(id: number, token: string): Promise<User> {
    const res = await fetch(`${API_URL}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Lỗi khi lấy thông tin người dùng');
    }

    const data = await res.json();
    return data;
}

export async function updateUser(id: number, updateData: UpdateUserDto, token: string): Promise<User> {
    const res = await fetch(`${API_URL}/users/edit/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Lỗi khi cập nhật thông tin người dùng');
    }

    const data = await res.json();
    return data;
}

export async function deleteUser(id: number, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Lỗi khi xóa người dùng');
    }
}