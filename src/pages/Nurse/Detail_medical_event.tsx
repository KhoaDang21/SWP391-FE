import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal_edit_medical_Event from './Modal/Modal_edit_medical_Event';
import { notificationService } from '../../services/NotificationService';
import { medicalEventService } from '../../services/MedicalEventService';

interface MedicalEventDetail {
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
    Class: string;
    historyHealth: string;
  };
  UserFullname?: string;
}

const Detail_medical_event: React.FC = () => {
  const [eventDetail, setEventDetail] = useState<MedicalEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('updated') === 'true') {
      notificationService.success('Cập nhật sự kiện thành công', { autoClose: 3000 });
      setTimeout(() => {
        navigate(`/nurse/medical-events/detail/${id}`, { replace: true });
      }, 3000);
    }

    const fetchEventDetail = async () => {
      try {
        if (!id) return;
        const data = await medicalEventService.getMedicalEventById(id);
        setEventDetail(data);
      } catch (error) {
        notificationService.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    function fetchEventDetailWrapper() {
      fetchEventDetail();
    }
    fetchEventDetailWrapper();
  }, [id, navigate]);

  const handleGoBack = () => {
    navigate('/nurse/medical-events', { state: { from: 'medical-events' }, replace: true });
  };

  const handleEditSubmit = async (formData: any) => {
    try {
      if (!id) return;
      const response = await medicalEventService.updateMedicalEvent(id, formData);
      if (response.success) {
        setIsEditModalOpen(false);
        navigate(`/nurse/medical-events/detail/${id}?updated=true`, { replace: true });
        window.location.reload();
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      notificationService.error(error.message || 'Có lỗi xảy ra khi cập nhật sự kiện');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Không tìm thấy thông tin sự kiện</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Chi tiết sự kiện y tế</h1>
      
      <div className="flex gap-4 mb-4">
        <button 
          onClick={handleGoBack} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Quay lại
        </button>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Chỉnh sửa
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin sự kiện</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Học sinh:</label>
                <p className="text-lg font-medium text-gray-900">{eventDetail.UserFullname}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Lớp:</label>
                <p className="text-lg text-gray-900">{eventDetail.Medical_record.Class}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Tiền sử bệnh:</label>
                <p className="text-lg text-gray-900">{eventDetail.Medical_record.historyHealth}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Mô tả sự kiện:</label>
                <p className="text-lg text-gray-900">{eventDetail.Decription}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Biện pháp xử lý:</label>
                <p className="text-lg text-gray-900">{eventDetail.Handle}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Thời gian:</label>
                <p className="text-lg text-gray-900">
                  {new Date(eventDetail.history[0].Date_create).toLocaleString('vi-VN')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Gọi phụ huynh:</label>
                <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  eventDetail.Is_calLOb
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {eventDetail.Is_calLOb ? 'Đã gọi' : 'Không gọi'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Hình ảnh</h2>
          <div className="flex items-center justify-center h-[500px] w-full">
            {eventDetail.Image ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={eventDetail.Image}
                  alt="Event"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="text-gray-500 text-center">
                Không có hình ảnh
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal_edit_medical_Event
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        existingData={eventDetail}
      />
    </div>
  );
};

export default Detail_medical_event;
