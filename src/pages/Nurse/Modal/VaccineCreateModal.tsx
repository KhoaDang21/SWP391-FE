import React, { useState } from 'react';

interface VaccineCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { vaccineName: string, vaccineType: string, date: string, grade: string }) => boolean | Promise<boolean>;
  vaccineTypes: string[];
  selectedVaccine: string;
  resetTrigger?: number; 
}

const VaccineCreateModal: React.FC<VaccineCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vaccineTypes,
  selectedVaccine,
  resetTrigger = 0
}) => {
  const [date, setDate] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [vaccineType, setVaccineType] = useState('');
  const [grade, setGrade] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (resetTrigger > 0 && !isOpen) {
      setVaccineName('');
      setVaccineType('');
      setDate('');
      setGrade('');
    }
  }, [resetTrigger, isOpen]);

  const resetForm = () => {
    setVaccineName('');
    setVaccineType('');
    setDate('');
    setGrade('');
  };

  const handleClose = () => {
    setShowWarning(false);
    onClose();

  };

  const handleSubmit = () => {
    setShowWarning(true);
  };

  const handleConfirmCreate = async () => {
    if (isSubmitting) return; 
    
    setIsSubmitting(true);
    try {
      const success = await onSubmit({
        vaccineName,
        vaccineType,
        date,
        grade
      });
     
      if (success) {
        setShowWarning(false);
      } else {
        setShowWarning(false);
      }
    } catch (error) {
      setShowWarning(false);
      console.error('Error creating vaccine:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40"
        onClick={handleClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Tạo mới đợt tiêm chủng
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Vaccine
              </label>
              <input
                type="text"
                value={vaccineName}
                onChange={(e) => setVaccineName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                placeholder="Nhập tên vaccine"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại Vaccine
              </label>
              <input
                type="text"
                value={vaccineType}
                onChange={(e) => setVaccineType(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                placeholder="Nhập loại vaccine"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày tiêm
              </label>
              <input
                type="date"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khối lớp
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                placeholder="Nhập khối lớp"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!date || !vaccineName || !vaccineType || !grade || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Tạo mới'}
            </button>
          </div>
        </div>
      </div>
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-13 py-10 max-w-lg w-full border border-red-300 animate-fade-in flex flex-col items-center relative">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setShowWarning(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Đóng"
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-100 rounded-full p-4 mb-4 shadow">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Xác nhận tạo đợt tiêm chủng</h2>
              <div className="text-gray-700 text-center mb-6 leading-relaxed">
                <div style={{ whiteSpace: 'nowrap' }}>
                  Bạn có chắc chắn muốn <span className="font-semibold text-red-600">tạo mới đợt tiêm chủng</span> này không?
                </div>
                <div style={{marginTop: "10px"}}>Hành động này sẽ gửi thông báo đến các học sinh thuộc khối lớp đã chọn.</div>
                <div className="text-sm text-gray-500" style={{marginTop: "10px"}}>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.</div>
              </div>
              <div className="flex gap-4 w-full justify-center mt-2">
                <button
                  onClick={() => setShowWarning(false)}
                  className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmCreate}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:from-red-600 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VaccineCreateModal;