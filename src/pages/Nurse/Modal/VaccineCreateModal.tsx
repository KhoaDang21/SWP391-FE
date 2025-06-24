import React, { useState, useEffect } from 'react';

interface VaccineCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { vaccineName: string, vaccineType: string, date: string }) => void;
  vaccineTypes: string[];
  selectedVaccine: string;
}

const VaccineCreateModal: React.FC<VaccineCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vaccineTypes,
  selectedVaccine
}) => {
  const [date, setDate] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [vaccineType, setVaccineType] = useState('');

  useEffect(() => {
    if (isOpen) {
      setVaccineName('');
      setVaccineType('');
      setDate('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit({ 
      vaccineName, 
      vaccineType, 
      date 
    });
    setVaccineName('');
    setVaccineType('');
    setDate('');
  };

  if (!isOpen) return null;

  return (
    <>  
      <div 
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40"
        onClick={onClose}
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
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!date || !vaccineName || !vaccineType}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tạo mới
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VaccineCreateModal;
