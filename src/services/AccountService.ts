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
  students?: Student[];
}

export interface Student {
  id: number;
  fullname: string;
  username: string;
  email: string;
  password?: string;
  roleId: number;
}

export interface UpdateUserDto {
  username: string;
  fullname: string;
  email: string;
  phoneNumber: string;
}

export interface RegisterUserDto {
  fullname: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleId?: number;
}

export interface StudentRegisterDto {
  fullname: string;
  username: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface GuardianRegisterDto {
  fullname: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleInFamily: string;
  isCallFirst: boolean;
  students: StudentRegisterDto[];
  roleId?: number;
}

export interface Guardian {
  obId: number;
  phoneNumber: string;
  roleInFamily: string;
  isCallFirst: boolean;
  userId: number;
  fullname: string;
  students: Student[];
}

const API_URL = 'http://localhost:3333/api/v1';

export async function getAllUsers(token: string): Promise<User[]> {
  const res = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
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
      Authorization: `Bearer ${token}`,
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
      Authorization: `Bearer ${token}`,
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
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi xóa người dùng');
  }
}

export async function registerUser(registerData: RegisterUserDto, token: string): Promise<User> {
  const dataToSend = { ...registerData, roleId: 2 };
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi đăng ký người dùng');
  }

  const data = await res.json();
  return data;
}

export async function createGuardianWithStudents(guardianData: GuardianRegisterDto, token: string): Promise<User> {
  const studentsWithRole = guardianData.students.map((student) => ({ ...student, roleId: 3 })); // Default to Student (roleId: 3)
  const guardianDataWithRole = { ...guardianData, roleId: 4, students: studentsWithRole }; // Default to Guardian (roleId: 4)

  const res = await fetch(`${API_URL}/guardians`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ guardian: guardianDataWithRole })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi đăng ký phụ huynh và học sinh');
  }

  const data = await res.json();
  return data;
}

export async function deleteGuardianByObId(obId: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/guardians/${obId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi xóa phụ huynh');
  }
}

export async function getAllGuardians(token: string): Promise<Guardian[]> {
  const res = await fetch(`${API_URL}/guardians`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi lấy danh sách phụ huynh');
  }

  const data = await res.json();
  return data;
}
