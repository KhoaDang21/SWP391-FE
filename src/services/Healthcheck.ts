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
  }
};
