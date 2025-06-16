import React, { useState } from 'react';

interface VaccineRecord {
  id: number;
  studentName: string;
  class: string;
  postInjectionStatus: string;
  isVaccinated: boolean;
}

const Manage_vaccine: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState('Covid-19');
  const [vaccineRecords] = useState<VaccineRecord[]>([
    {
      id: 1,
      studentName: "Nguyễn Văn A",
      class: "10A1",
      postInjectionStatus: "Bình thường",
      isVaccinated: true
    },
    {
      id: 2,
      studentName: "Trần Thị B",
      class: "10A2",
      postInjectionStatus: "Sốt nhẹ",
      isVaccinated: true
    }
  ]);

  const vaccineTypes = [
    'Covid-19',
    'Viêm gan B',
    'Sởi-Rubella',
    'HPV'
  ];

  const handleEditSave = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log('Saving data...');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý tiêm chủng</h1>
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
              <th className="w-[30%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên học sinh</th>
              <th className="w-[15%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
              <th className="w-[30%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theo dõi sau tiêm</th>
              <th className="w-[15%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vaccineRecords.map((record, index) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{record.studentName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.class}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={record.postInjectionStatus}
                      className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : record.postInjectionStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    record.isVaccinated
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.isVaccinated ? 'Đã tiêm' : 'Chưa tiêm'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manage_vaccine;
