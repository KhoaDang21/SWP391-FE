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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
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

  const openImageModal = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = scale - e.deltaY * 0.001;
    setScale(Math.min(Math.max(1, newScale), 5)); 
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomStep = 0.2;
    let newScale;
    if (direction === 'in') {
      newScale = scale + zoomStep;
    } else {
      newScale = scale - zoomStep;
    }
    setScale(Math.min(Math.max(1, newScale), 5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center drop-shadow">Chi tiết sự kiện y tế</h1>
      <div className="flex gap-4 mb-8 justify-center">
        <button 
          onClick={handleGoBack} 
          className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-sm transition-colors"
        >
          Quay lại
        </button>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Chỉnh sửa
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-4 border-b border-gray-200 flex items-center gap-3">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Thông tin sự kiện
          </h2>
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm font-semibold text-gray-500">Học sinh:</span>
              <span className="col-span-2 text-lg font-medium text-gray-900">{eventDetail.UserFullname}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm font-semibold text-gray-500">Lớp:</span>
              <span className="col-span-2 text-lg text-gray-900">{eventDetail.Medical_record.Class}</span>
            </div>
            {eventDetail.guardian && (
              <div className="rounded-lg bg-blue-50 p-4 mt-4 border border-blue-200">
                <h3 className="text-md font-semibold text-blue-800 mb-3">Thông tin phụ huynh</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-sm font-semibold text-gray-500">Tên phụ huynh:</span>
                    <span className="col-span-2 text-gray-900">{eventDetail.guardian.fullname}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-sm font-semibold text-gray-500">Số điện thoại:</span>
                    <span className="col-span-2 text-gray-900">{eventDetail.guardian.phoneNumber}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-sm font-semibold text-gray-500">Địa chỉ:</span>
                    <span className="col-span-2 text-gray-900">{eventDetail.guardian.address}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-sm font-semibold text-gray-500">Vai trò:</span>
                    <span className="col-span-2 text-gray-900">{eventDetail.guardian.roleInFamily}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm font-semibold text-gray-500 pt-1">Tiền sử bệnh:</span>
              <div className="col-span-2 text-gray-900">
                {eventDetail.Medical_record.chronicDiseases && <div>- Bệnh mãn tính: {eventDetail.Medical_record.chronicDiseases}</div>}
                {eventDetail.Medical_record.allergies && <div>- Dị ứng: {eventDetail.Medical_record.allergies}</div>}
                {eventDetail.Medical_record.pastIllnesses && <div>- Bệnh đã mắc: {eventDetail.Medical_record.pastIllnesses}</div>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm font-semibold text-gray-500 pt-1">Mô tả sự kiện:</span>
              <span className="col-span-2 text-gray-900">{eventDetail.Decription}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm font-semibold text-gray-500 pt-1">Biện pháp xử lý:</span>
              <span className="col-span-2 text-gray-900">{eventDetail.Handle}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm font-semibold text-gray-500">Thời gian:</span>
              <span className="col-span-2 text-gray-900">
                {new Date(eventDetail.history[0].Date_create).toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm font-semibold text-gray-500">Gọi phụ huynh:</span>
              <div className="col-span-2">
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
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-200 flex flex-col">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-4 border-b border-gray-200 flex items-center gap-3">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Hình ảnh
          </h2>
          <div className="flex-grow flex items-center justify-center w-full">
            {eventDetail.Image ? (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={eventDetail.Image}
                  alt="Event"
                  className="max-w-full max-h-[400px] object-contain rounded-lg border border-gray-200 shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={openImageModal}
                  title="Click để xem ảnh phóng to"
                />
              </div>
            ) : (
              <div className="text-gray-400 text-center w-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-200 h-full">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="font-medium">Không có hình ảnh</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isImageModalOpen && eventDetail?.Image && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
          onClick={closeImageModal}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className="relative max-w-5xl max-h-full flex flex-col gap-4" 
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="flex-grow overflow-hidden rounded-lg"
              onWheel={handleWheel}
            >
              <img
                src={eventDetail.Image}
                alt="Event Detail"
                className="max-w-full max-h-[80vh] object-contain shadow-2xl transition-transform duration-100 ease-out"
                style={{ 
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                onMouseDown={handleMouseDown}
              />
            </div>
            
            <div className="flex items-center justify-center gap-2 bg-gray-900/60 p-2 rounded-full text-white self-center">
              <button onClick={() => handleZoom('out')} className="p-2 rounded-full hover:bg-white/20 transition-colors" title="Thu nhỏ">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              
              <span className="w-20 text-center font-mono text-lg cursor-pointer" onClick={handleReset} title="Reset zoom">{Math.round(scale * 100)}%</span>

              <button onClick={() => handleZoom('in')} className="p-2 rounded-full hover:bg-white/20 transition-colors" title="Phóng to">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>

              <button onClick={handleReset} className="p-2 rounded-full hover:bg-white/20 transition-colors" title="Reset vị trí & zoom">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" /></svg>
              </button>
            </div>

            <button
              className="absolute top-2 right-2 text-white bg-gray-900/60 rounded-full p-2 hover:bg-white/20 z-10 transition-colors"
              onClick={closeImageModal}
              title="Đóng"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
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
