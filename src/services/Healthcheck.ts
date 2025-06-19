export interface HealthCheckEvent {
  HC_ID: number;
  Event_ID: number;
  School_year: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  Event: {
    eventId: number;
    dateEvent: string;
    type: string;
  };
}

export interface CreateHealthCheckRequest {
  title: string;
  description: string;
  dateEvent: string;
  schoolYear: string;
  type: string;
}

export interface CreateHealthCheckResponse {
  success: boolean;
  data: {
    eventId: number;
    dateEvent: string;
    type: string;
    title: string;
    description: string;
    schoolYear: string;
  };
}

export interface SendConfirmationResponse {
  success: boolean;
  message: string;
}

export interface GuardianUser {
  id: number;
  obId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Guardian {
  obId: number;
  phoneNumber: string;
  roleInFamily: string;
  isCallFirst: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  GuardianUser: GuardianUser;
}

export interface Student {
  id: number;
  username: string;
  fullname: string;
  password: string;
  email: string;
  phoneNumber: string | null;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  Guardians: Guardian[];
}

export interface HealthCheckForm {
  Form_ID: number;
  HC_ID: number;
  Student_ID: number;
  Height: number | null;
  Weight: number | null;
  Blood_Pressure: string | null;
  Vision_Left: number | null;
  Vision_Right: number | null;
  Dental_Status: string | null;
  ENT_Status: string | null;
  Skin_Status: string | null;
  General_Conclusion: string | null;
  Is_need_meet: boolean;
  Is_confirmed_by_guardian: boolean;
  createdAt: string;
  updatedAt: string;
  GuardianUserId: number | null;
  Student: Student;
}

export interface GetStudentsByHealthCheckResponse {
  success: boolean;
  data: HealthCheckForm[];
}

const API_URL = 'http://localhost:3333/api/v1';

export const healthCheckService = {
  // Get all health check events
  getAllHealthChecks: async (): Promise<HealthCheckEvent[]> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(`${API_URL}/health-check`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  },

  // Create a new health check event
  createHealthCheck: async (data: CreateHealthCheckRequest): Promise<CreateHealthCheckResponse> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(`${API_URL}/health-check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Send confirmation form to parents
  sendConfirmationForm: async (id: number): Promise<SendConfirmationResponse> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(`${API_URL}/health-check/${id}/send-confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get students by health check ID
  getStudentsByHealthCheck: async (hcId: number): Promise<GetStudentsByHealthCheckResponse> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(`${API_URL}/health-check/${hcId}/students`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};
