import React, { useState, useEffect } from 'react';
import { vaccineService, VaccinePayload, VaccineCreateRequest, UpdateVaccineStatusRequest } from '../../services/Vaccineservice';
import VaccineCreateModal from './Modal/VaccineCreateModal';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const Manage_vaccine: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [vaccineRecords, setVaccineRecords] = useState<VaccinePayload[]>([]);
  const [vaccineTypes, setVaccineTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteInputs, setNoteInputs] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await vaccineService.getVaccineTypes();
        setVaccineTypes(types);
        setSelectedVaccine(types[0] || '');
      } catch (error) {
        setVaccineTypes([]);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (!selectedVaccine) {
      setVaccineRecords([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchByName = async () => {
      try {
        const records = await vaccineService.getVaccineByName(selectedVaccine);
        setVaccineRecords(records);
      } catch (error) {
        setVaccineRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchByName();
    intervalId = setInterval(fetchByName, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedVaccine]);

  const handleEditSave = async () => {
    if (isEditing) {
      try {
        console.log('Filtered Records:', filteredRecords);
        console.log('Note Inputs:', noteInputs);

        const updates = filteredRecords
          .filter(record => noteInputs[record.MR_ID] !== undefined || record.note_affter_injection)
          .map(record => ({
            VH_ID: record.VH_ID,
            status: "Đã tiêm",
            note_affter_injection: noteInputs[record.MR_ID] || record.note_affter_injection || ''
          }));

        console.log('Updates:', updates);

        if (updates.length === 0) {
          console.log('No records to update');
          setIsEditing(false);
          return;
        }

        const updateData: UpdateVaccineStatusRequest = {
          updates: updates
        };

        console.log('Request Data:', updateData);

        await vaccineService.updateVaccineStatus(updateData);
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
        notification.textContent = 'Cập nhật trạng thái thành công!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);

        // Refresh the data
        const records = await vaccineService.getVaccineByName(selectedVaccine);
        setVaccineRecords(records);
      } catch (error) {
        // Log the error details
        console.error('Update Error Details:', {
          error,
          noteInputs,
          filteredRecords
        });
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
        notification.textContent = 'Có lỗi xảy ra khi cập nhật!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    }
    setIsEditing(!isEditing);
    setNoteInputs({});
  };

  const handleCreateNewEvent = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: { vaccineName: string, vaccineType: string, date: string }) => {
    try {
      setIsLoading(true);
      const newVaccineData: VaccineCreateRequest = {
        Vaccine_name: data.vaccineName,
        Vaccince_type: data.vaccineType,
        Date_injection: data.date,
      };

      await vaccineService.createVaccine(newVaccineData);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
      notification.textContent = 'Tạo đợt tiêm thành công!';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);

      const [types, records] = await Promise.all([
        vaccineService.getVaccineTypes(),
        vaccineService.getVaccineByName(data.vaccineName)
      ]);
      
      setVaccineTypes(types);
      setSelectedVaccine(data.vaccineName);
      setVaccineRecords(records);
      setIsModalOpen(false);

    } catch (error) {
      console.error('Error creating vaccine event:', error);
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
      notification.textContent = 'Có lỗi xảy ra khi tạo đợt tiêm!';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = React.useMemo(() => {
    return vaccineRecords.filter(record => {
      const matchesVaccine = record.Vaccine_name === selectedVaccine;
      const isAllowed = record.Status !== "Không cho phép tiêm";
      return matchesVaccine && isAllowed;
    });
  }, [vaccineRecords, selectedVaccine]);

  // Add function to check if all records are completed
  const areAllRecordsCompleted = React.useMemo(() => {
    return filteredRecords.length > 0 && 
           filteredRecords.every(record => record.Status === 'Đã tiêm');
  }, [filteredRecords]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý tiêm chủng</h1>
        <div className="flex gap-3">
          <button
            onClick={handleCreateNewEvent}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
          >
            Tạo mới đợt tiêm
          </button>
          {!areAllRecordsCompleted && (
            <button 
              onClick={handleEditSave}
              className={`px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg ${
                isEditing 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-green-500/30' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/30'
              } text-white`}
            >
              {isEditing ? 'Lưu' : 'Chỉnh sửa'}
            </button>
          )}
        </div>
      </div>

      <div className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center gap-3">
          <label className="font-medium text-gray-700">Loại Vaccine:</label>
          <select 
            value={selectedVaccine}
            onChange={(e) => setSelectedVaccine(e.target.value)}
            className="min-w-[200px] border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {vaccineTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-[10%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="w-[15%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên học sinh</th>
              <th className="w-[10%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
              <th className="w-[15%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Vaccine</th>
              <th className="w-[15%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tiêm</th>
              <th className="w-[20%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theo dõi sau tiêm</th>
              <th className="w-[15%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <tr key={record.VH_ID} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{record.PatientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.MedicalRecord.Class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.Vaccine_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(record.Date_injection)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={record.note_affter_injection || ''}
                        onChange={(e) => setNoteInputs(prev => ({
                          ...prev,
                          [record.MR_ID]: e.target.value
                        }))}
                        className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : record.note_affter_injection || 'Chưa có ghi chú'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      record.Status === 'Đã tiêm' 
                        ? 'bg-green-100 text-green-800'
                        : record.Status === 'Cho phép tiêm'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.Status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Không có dữ liệu cho loại vaccine này
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <VaccineCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        vaccineTypes={vaccineTypes}
        selectedVaccine={selectedVaccine}
      />
    </div>
  );
};

export default Manage_vaccine;