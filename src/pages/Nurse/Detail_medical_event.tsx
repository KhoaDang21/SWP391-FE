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
    height: number;
    weight: number;
    bloodType: string;
    chronicDiseases: string;
    allergies: string;
    pastIllnesses?: string;
    historyHealth: string;
  };
  UserFullname?: string;
  guardian?: {
    fullname: string;
    phoneNumber: string;
    roleInFamily: string;
    address: string;
    isCallFirst: boolean;
  };
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
        const transformedData = {
          ...data,
          Medical_record: {
            ID: data.Medical_record.ID,
            userId: data.Medical_record.userId,
            Class: data.Medical_record.Class ?? '',
            height: data.Medical_record.height ?? 0,
            weight: data.Medical_record.weight ?? 0,
            bloodType: data.Medical_record.bloodType ?? '',
            chronicDiseases: data.Medical_record.chronicDiseases ?? '',
            allergies: data.Medical_record.allergies ?? '',
            pastIllnesses: data.Medical_record.pastIllnesses ?? '',
            historyHealth: data.Medical_record.historyHealth ?? '',
          },
        };
        setEventDetail(transformedData);
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
      <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center drop-shadow">Chi tiết sự kiện y tế</h1>
      <div className="flex gap-4 mb-8 justify-center">
        <button 
          onClick={handleGoBack} 
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
        >
          Quay lại
        </button>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-2 px-6 rounded-lg shadow flex items-center gap-2 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Chỉnh sửa
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Thông tin sự kiện
          </h2>
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-blue-700 w-32">Học sinh:</span>
              <span className="text-lg font-medium text-gray-900">{eventDetail.UserFullname}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-blue-700 w-32">Lớp:</span>
              <span className="text-lg text-gray-900">{eventDetail.Medical_record.Class}</span>
            </div>
            {eventDetail.guardian && (
              <div className="rounded-lg bg-blue-50 p-4 mt-2 border border-blue-100">
                <div className="mb-1 flex gap-2 items-center">
                  <span className="text-sm font-semibold text-blue-700 w-32">Tên phụ huynh:</span>
                  <span className="text-gray-900">{eventDetail.guardian.fullname}</span>
                </div>
                <div className="mb-1 flex gap-2 items-center">
                  <span className="text-sm font-semibold text-blue-700 w-32">Số điện thoại:</span>
                  <span className="text-gray-900">{eventDetail.guardian.phoneNumber}</span>
                </div>
                <div className="mb-1 flex gap-2 items-center">
                  <span className="text-sm font-semibold text-blue-700 w-32">Địa chỉ:</span>
                  <span className="text-gray-900">{eventDetail.guardian.address}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold text-blue-700 w-32">Vai trò:</span>
                  <span className="text-gray-900">{eventDetail.guardian.roleInFamily}</span>
                </div>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-blue-700 w-32">Tiền sử bệnh:</span>
              <span className="text-gray-900">
                {eventDetail.Medical_record.chronicDiseases}
                {eventDetail.Medical_record.allergies && `, Dị ứng: ${eventDetail.Medical_record.allergies}`}
                {eventDetail.Medical_record.pastIllnesses && `, Bệnh đã mắc: ${eventDetail.Medical_record.pastIllnesses}`}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-blue-700 w-32">Mô tả sự kiện:</span>
              <span className="text-gray-900">{eventDetail.Decription}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-blue-700 w-32">Biện pháp xử lý:</span>
              <span className="text-gray-900">{eventDetail.Handle}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-blue-700 w-32">Thời gian:</span>
              <span className="text-gray-900">
                {new Date(eventDetail.history[0].Date_create).toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-blue-700 w-32">Gọi phụ huynh:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                eventDetail.Is_calLOb
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {eventDetail.Is_calLOb ? 'Đã gọi' : 'Không gọi'}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col items-center">
          <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v10m0 0H9m6 0a2 2 0 002-2v-8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Hình ảnh
          </h2>
          <div className="flex items-center justify-center h-[400px] w-full">
            {eventDetail.Image ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={eventDetail.Image}
                  alt="Event"
                  className="max-w-full max-h-full object-contain rounded-lg border border-gray-200 shadow"
                />
              </div>
            ) : (
              <div className="text-gray-500 text-center w-full">
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
