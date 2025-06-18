const API_URL = 'http://localhost:3333/api/v1/medical-sents';

export type MedicalSentStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

export interface MedicalSent {
  id: number;
  userId: number;
  patientName: string;
  patientPhone: string;
  class: string;
  prescriptionImage: string;
  medications: string;
  deliveryTime: string;
  status: MedicalSentStatus;
  createdAt: string;
  notes?: string;
  deliveryFee?: number;
}

// Guardian: lấy danh sách đơn thuốc của mình
export async function getMedicalSentsByGuardian(token: string): Promise<MedicalSent[]> {
  const res = await fetch(`${API_URL}/by-guardian`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy danh sách đơn thuốc của học sinh');
  return await res.json();
}

// Nurse: lấy tất cả đơn thuốc
export async function getAllMedicalSents(token?: string): Promise<MedicalSent[]> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_URL, { headers });
  if (!res.ok) throw new Error('Lỗi lấy danh sách đơn thuốc');
  return await res.json();
}

// Lấy chi tiết đơn thuốc theo ID
export async function getMedicalSentById(id: number, token?: string): Promise<MedicalSent> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, { headers });
  if (!res.ok) throw new Error('Không tìm thấy đơn thuốc');
  return await res.json();
}

// Guardian/Nurse: tạo mới đơn thuốc (có upload file)
export async function createMedicalSent(formData: FormData, token: string): Promise<MedicalSent> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error('Lỗi tạo đơn thuốc');
  return await res.json();
}

// Guardian/Nurse: cập nhật đơn thuốc
export async function updateMedicalSent(id: number, formData: FormData, token: string): Promise<MedicalSent> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error('Lỗi cập nhật đơn thuốc');
  return await res.json();
}

// Guardian/Nurse: xoá đơn thuốc
export async function deleteMedicalSent(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi xoá đơn thuốc');
}
