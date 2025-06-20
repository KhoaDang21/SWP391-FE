export interface Vaccine {
    name: string;
    date: string;
    status: string;
}

export interface ChronicDisease {
    name: string;
}

export interface Allergy {
    name: string;
}

export interface PastIllness {
    disease: string;
    date: string;
    treatment: string;
}

export interface MedicalRecord {
    ID: number;
    userId: number;
    fullname: string;
    dateOfBirth: string;
    gender: string;
    class: string;
    height: number;
    weight: number;
    bloodType: string;
    chronicDiseases: ChronicDisease[];
    allergies: Allergy[];
    pastIllnesses: PastIllness[];
    vaccines: Vaccine[];
}

export interface CreateStudentMedicalPayload {
    guardianUserId: number;
    student: {
        fullname: string;
        dateOfBirth: string;
        gender: string;
    };
    medicalRecord: {
        class: string;
        height: number;
        weight: number;
        bloodType: string;
        chronicDiseases?: ChronicDisease[];
        allergies?: Allergy[];
        pastIllnesses?: PastIllness[];
        vaccines?: Vaccine[];
    };
}


const API_URL = 'http://localhost:3333/api/v1/medical-records';

export async function getAllMedicalRecords(token: string): Promise<MedicalRecord[]> {
    const res = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Lỗi lấy danh sách hồ sơ y tế');
    const data = await res.json();
    return data;
}

export async function getMedicalRecordsByGuardian(token: string): Promise<MedicalRecord[]> {
    const res = await fetch(`${API_URL}/by-guardian`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Lỗi lấy danh sách hồ sơ y tế của học sinh');
    }

    const data = await res.json();
    return data;
}

export async function getMedicalRecordById(id: number, token: string): Promise<MedicalRecord> {
    const res = await fetch(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Không tìm thấy hồ sơ y tế');
    const data = await res.json();
    return data;
}

export async function createMedicalRecord(
    record: Omit<MedicalRecord, 'ID'>,
    token: string
): Promise<MedicalRecord> {
    const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(record)
    });

    if (!res.ok) throw new Error('Lỗi tạo hồ sơ y tế');
    const data = await res.json();
    return data;
}

export async function updateMedicalRecord(
    id: number,
    record: Partial<MedicalRecord>,
    token: string
): Promise<MedicalRecord> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record)
    });

    if (!res.ok) throw new Error('Lỗi cập nhật hồ sơ y tế');
    const data = await res.json();
    return data;
}

export async function deleteMedicalRecord(id: number, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error('Lỗi xóa hồ sơ y tế');
}

export async function createStudentWithMedicalRecord(
    payload: CreateStudentMedicalPayload,
    token: string
): Promise<any> {
    const res = await fetch(`${API_URL}/student`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Lỗi tạo học sinh và hồ sơ y tế');
    return await res.json();
}
