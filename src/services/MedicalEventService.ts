interface MedicalEventApi {
  OrtherM_ID: number;
  Decription: string;
  Handle: string;
  Image: string | null;
  Is_calLOb: boolean;
  history: {
    ID: number;
    OrtherM_ID: number;
    MR_ID: number;
    Date_create: string;
    Creater_by: string | null;
  }[];
  Medical_record: {
    ID: number;
    userId: number;
    class: string;
    historyHealth: string;
  };
  UserFullname?: string;
}

interface CreateMedicalEventData {
  MR_ID: string;
  Decription: string;
  Handle: string;
  Image: File | null;
  Is_calLOb: boolean;
}

const API_URL = 'http://localhost:3333/api/v1';

export const medicalEventService = {
  // Get all medical events
  getAllMedicalEvents: async (): Promise<MedicalEventApi[]> => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/other-medical`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.data;
  },

  // Get medical event by ID
  getMedicalEventById: async (id: string): Promise<MedicalEventApi> => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/other-medical/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.data;
  },

  // Create medical event
  createMedicalEvent: async (formData: CreateMedicalEventData): Promise<any> => {
    const token = localStorage.getItem("accessToken");
    const submitData = new FormData();
    submitData.append('MR_ID', formData.MR_ID);
    submitData.append('Decription', formData.Decription);
    submitData.append('Handle', formData.Handle);
    submitData.append('Is_calLOb', formData.Is_calLOb.toString());
    if (formData.Image) {
      submitData.append('Image', formData.Image);
    }

    const response = await fetch(`${API_URL}/other-medical`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: submitData
    });
    return response.json();
  },

  // Update medical event
  updateMedicalEvent: async (id: string, formData: CreateMedicalEventData): Promise<any> => {
    const token = localStorage.getItem("accessToken");
    const form = new FormData();
    form.append('MR_ID', formData.MR_ID);
    form.append('Decription', formData.Decription);
    form.append('Handle', formData.Handle);
    form.append('Is_calLOb', String(formData.Is_calLOb));
    if (formData.Image) {
      form.append('Image', formData.Image);
    }

    const response = await fetch(`${API_URL}/other-medical/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });
    return response.json();
  },

  // Delete medical event
  deleteMedicalEvent: async (id: number): Promise<any> => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/other-medical/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
}; 