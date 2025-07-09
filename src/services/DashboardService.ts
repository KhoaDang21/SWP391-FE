const API_URL = 'http://localhost:3333/api/v1/dashboard';

export async function getTotalUsers(): Promise<number> {
    const res = await fetch(`${API_URL}/users/count`);
    if (!res.ok) throw new Error('Lỗi lấy tổng số người dùng');
    const data = await res.json();
    return data.data;
}

export async function getTotalStudents(): Promise<number> {
    const res = await fetch(`${API_URL}/students/count`);
    if (!res.ok) throw new Error('Lỗi lấy tổng số học sinh');
    const data = await res.json();
    return data.data;
}

export async function getTotalGuardians(): Promise<number> {
    const res = await fetch(`${API_URL}/guardians/count`);
    if (!res.ok) throw new Error('Lỗi lấy tổng số phụ huynh');
    const data = await res.json();
    return data.data;
}

export async function getConfirmationRate(): Promise<number> {
    const res = await fetch(`${API_URL}/guardian/confirmation-rate`);
    if (!res.ok) throw new Error('Lỗi lấy tỷ lệ xác nhận từ phụ huynh');
    const data = await res.json();
    return data.data; // Có thể là phần trăm (ví dụ: 0.85 hoặc 85)
}
