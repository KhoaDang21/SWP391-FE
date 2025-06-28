import React, { useState, useEffect } from 'react';
import { X, Loader2, Search } from 'lucide-react';
import SearchMedicalRecordModal from './SearchMedicalRecordModal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  ID: string;
  Decription: string;
  Handle: string;
  Image: File | null;
  Is_calLOb: boolean;
}

interface StudentGuardianInfo {
  ID: number;
  fullname: string;
  Class: string;
  height: number;
  weight: number;
  bloodType: string;
  chronicDiseases: string;
  allergies: string;
  pastIllnesses?: string;
  guardian?: {
    fullname: string;
    phoneNumber: string;
    roleInFamily: string;
    address: string;
    isCallFirst: boolean;
  };
}

const Modal_create_medical_Event: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    ID: '',
    Decription: '',
    Handle: '',
    Image: null,
    Is_calLOb: false
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<StudentGuardianInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, Image: file }));
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const initialFormData = {
    ID: '',
    Decription: '',
    Handle: '',
    Image: null,
    Is_calLOb: false
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await onSubmit(formData);
      resetForm();
    } catch (err: any) {
      const msg = err?.message || (err?.error && err.error.message) || 'Có lỗi xảy ra';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSelectRecord = (info: StudentGuardianInfo) => {
    setSelectedInfo(info);
    setFormData(prev => ({ ...prev, ID: info.ID.toString() }));
    setShowSearch(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Tạo sự kiện y tế mới</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
              {errorMessage}
            </div>
          )}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thông tin học sinh & phụ huynh
            </label>
            {selectedInfo ? (
              <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white mb-2 relative shadow-sm">
                <button
                  type="button"
                  onClick={() => { setSelectedInfo(null); setFormData(prev => ({ ...prev, ID: '' })); }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  title="Chọn lại hồ sơ"
                >
                  <X size={18} />
                </button>
                <div className="mb-2 flex flex-col gap-1">
                  <div>
                    <span className="font-semibold text-blue-700">Tên học sinh:</span>
                    <span className="ml-2 text-gray-900">{selectedInfo.fullname}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-700">Lớp:</span>
                    <span className="ml-2 text-gray-900">{selectedInfo.Class}</span>
                  </div>
                </div>
                {selectedInfo.guardian && (
                  <div className="mt-2 border-t pt-2 flex flex-col gap-1">
                    <div>
                      <span className="font-semibold text-blue-700">Tên phụ huynh:</span>
                      <span className="ml-2 text-gray-900">{selectedInfo.guardian.fullname}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">Số điện thoại:</span>
                      <span className="ml-2 text-gray-900">{selectedInfo.guardian.phoneNumber}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">Địa chỉ:</span>
                      <span className="ml-2 text-gray-900">{selectedInfo.guardian.address}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">Vai trò trong gia đình:</span>
                      <span className="ml-2 text-gray-900">{selectedInfo.guardian.roleInFamily}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={formData.ID}
                  readOnly
                  placeholder="Chọn hồ sơ y tế"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 cursor-pointer"
                  required
                  onClick={() => setShowSearch(true)}
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  tabIndex={-1}
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả sự kiện
              </label>
              <textarea
                value={formData.Decription}
                onChange={e => setFormData(prev => ({ ...prev, Decription: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biện pháp xử lý
              </label>
              <textarea
                value={formData.Handle}
                onChange={e => setFormData(prev => ({ ...prev, Handle: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] resize-none"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh
            </label>
            <div className="flex flex-col items-center justify-center w-full">
              {previewUrl ? (
                <div className="mb-4 relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-[300px] max-h-[200px] rounded-lg shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setFormData(prev => ({ ...prev, Image: null }));
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click để tải ảnh lên</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x400px)</p>
                  </div>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.Is_calLOb}
              onChange={e => setFormData(prev => ({ ...prev, Is_calLOb: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Gọi điện cho phụ huynh
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo sự kiện'
              )}
            </button>
          </div>
        </form>
      </div>

      {showSearch && (
        <SearchMedicalRecordModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onSelect={handleSelectRecord}
        />
      )}
    </div>
  );
};

export default Modal_create_medical_Event;
