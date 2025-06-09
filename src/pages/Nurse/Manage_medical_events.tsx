import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Modal_create_medical_Event from './Modal/Modal_create_medical_Event';
import DeleteConfirmationModal from './Modal/DeleteConfirmationModal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

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

interface FormData {
  MR_ID: string;
  Decription: string;
  Handle: string;
  Image: File | null;
  Is_calLOb: boolean;
}

const MedicalEventManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [medicalEvents, setMedicalEvents] = useState<MedicalEventApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    eventId: number | null;
  }>({
    isOpen: false,
    eventId: null
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setLoading(true);
    fetch('http://localhost:3333/api/v1/other-medical', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) {
          setMedicalEvents(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = selectedDate
    ? medicalEvents.filter(ev => {
        const dateStr = ev.history?.[0]?.Date_create;
        if (!dateStr) return false;
        const eventDate = new Date(dateStr);
        return eventDate.toDateString() === selectedDate.toDateString();
      })
    : medicalEvents;

  const handleCreateEvent = async (formData: FormData) => {
    const token = localStorage.getItem("accessToken");
    const submitData = new FormData();
    submitData.append('MR_ID', formData.MR_ID);
    submitData.append('Decription', formData.Decription);
    submitData.append('Handle', formData.Handle);
    submitData.append('Is_calLOb', formData.Is_calLOb.toString());
    if (formData.Image) {
      submitData.append('Image', formData.Image);
    }

    try {
      const response = await fetch('http://localhost:3333/api/v1/other-medical', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData,
      });
      
      const data = await response.json();
      if (data.status === 201) {
        setIsModalOpen(false);
        setToastConfig({
          show: true,
          message: 'Tạo sự kiện thành công!',
          type: 'success'
        });   
        
        // Refresh data
        const refreshResponse = await fetch('http://localhost:3333/api/v1/other-medical', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const refreshData = await refreshResponse.json();
        if (refreshData && refreshData.success && Array.isArray(refreshData.data)) {
          setMedicalEvents(refreshData.data);
        }
      } else {
        throw new Error(data.message || 'Có lỗi xảy ra khi tạo sự kiện');
      }
    } catch (error: any) {
      setToastConfig({
        show: true,
        message: error.message || 'Có lỗi xảy ra khi tạo sự kiện',
        type: 'error'
      });
      throw error; // Re-throw to trigger loading state in modal
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/nurse/medical-events/detail/${id}`, {
      state: { from: 'medical-events', keepActive: true }
    });
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModalConfig({ isOpen: true, eventId: id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalConfig.eventId) return;
    
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`http://localhost:3333/api/v1/other-medical/${deleteModalConfig.eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMedicalEvents(prev => prev.filter(event => event.OrtherM_ID !== deleteModalConfig.eventId));
        setToastConfig({
          show: true,
          message: 'Xóa sự kiện thành công!',
          type: 'success'
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setToastConfig({
        show: true,
        message: error.message || 'Có lỗi xảy ra khi xóa sự kiện',
        type: 'error'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý sự kiện y tế</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
        >
          + Thêm sự kiện
        </button>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Chọn ngày xem sự kiện:
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="min-w-[200px] border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên học sinh</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sự kiện y tế</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biện pháp xử lý</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gọi bố mẹ</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">Không có dữ liệu</td>
              </tr>
            ) : (
              filteredEvents.map((event, index) => (
                <tr 
                  key={event.OrtherM_ID} 
                  onClick={() => handleRowClick(event.OrtherM_ID)}
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {event.UserFullname || 'Không rõ'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.Medical_record?.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.Decription}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.Handle}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      event.Is_calLOb
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {event.Is_calLOb ? 'Đã gọi' : 'Không gọi'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {event.history?.[0]?.Date_create
                      ? new Date(event.history[0].Date_create).toLocaleDateString('vi-VN')
                      : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => handleDelete(event.OrtherM_ID, e)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal_create_medical_Event
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalConfig.isOpen}
        onClose={() => setDeleteModalConfig({ isOpen: false, eventId: null })}
        onConfirm={handleConfirmDelete}
      />

      {toastConfig.show && (
        <div className={`fixed bottom-4 right-4 border px-6 py-4 rounded-lg shadow-xl transition-all duration-500 z-50 ${
          toastConfig.type === 'success' 
            ? 'bg-green-100 border-green-400 text-green-800'
            : 'bg-red-100 border-red-400 text-red-800'
        }`}>
          <p className="flex items-center text-base font-medium">
            {toastConfig.type === 'success' ? (
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            ) : (
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            )}
            {toastConfig.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalEventManagement;
