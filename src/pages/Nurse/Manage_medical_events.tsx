import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Modal_create_medical_Event from './Modal/Modal_create_medical_Event';
import DeleteConfirmationModal from './Modal/DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye } from 'lucide-react';
import { medicalEventService } from '../../services/MedicalEventService';
import { notificationService } from '../../services/NotificationService';

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
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [medicalEvents, setMedicalEvents] = useState<MedicalEventApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    eventId: number | null;
  }>({
    isOpen: false,
    eventId: null
  });

  useEffect(() => {
    const fetchMedicalEvents = async () => {
    setLoading(true);
      try {
        const data = await medicalEventService.getAllMedicalEvents();
        setMedicalEvents(data);
      } catch (error) {
        notificationService.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalEvents();
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
    try {
      const response = await medicalEventService.createMedicalEvent(formData);
      if (response.status === 201) {
        setIsModalOpen(false);
        notificationService.success('Tạo sự kiện thành công!');
        
        // Refresh data
        const refreshData = await medicalEventService.getAllMedicalEvents();
        setMedicalEvents(refreshData);
      }
    } catch (error: any) {
      notificationService.error(error.message || 'Có lỗi xảy ra khi tạo sự kiện');
      throw error;
    }
  };

  const handleViewDetails = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
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
    
    try {
      const response = await medicalEventService.deleteMedicalEvent(deleteModalConfig.eventId);
      if (response.success) {
        setMedicalEvents(prev => prev.filter(event => event.OrtherM_ID !== deleteModalConfig.eventId));
        notificationService.success('Xóa sự kiện thành công!');
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      notificationService.error(error.message || 'Có lỗi xảy ra khi xóa sự kiện');
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
                  className="hover:bg-gray-50 transition-colors duration-200"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => handleViewDetails(event.OrtherM_ID, e)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(event.OrtherM_ID, e)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Xóa"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
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
    </div>
  );
};

export default MedicalEventManagement;
