import React, { useState } from 'react';

interface HealthCheckRecord {
  id: number;
  studentName: string;
  class: string;
  height: string;
  weight: string;
  blood_pressure: string;
  vision: string;
  dental: string;
  ent: string;
  skin: string;
  status: string;
  conclusion?: string;
}

const Manage_healthcheck: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conclusion, setConclusion] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<HealthCheckRecord | null>(null);
  const [healthRecords] = useState<HealthCheckRecord[]>([
    {
      id: 1,
      studentName: "Nguyễn Văn A",
      class: "10A1",
      height: "170",
      weight: "60",
      blood_pressure: "120/80",
      vision: "10/10",
      dental: "Bình thường",
      ent: "Bình thường",
      skin: "Bình thường",
      status: "Đã khám"
    },
  ]);
  const [selectedYear, setSelectedYear] = useState('2023-2024');
  const [activePhase, setActivePhase] = useState(1);

  const schoolYears = [
    '2023-2024',
    '2022-2023',
    '2021-2022',
  ];

  const handleEditSave = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Thực hiện lưu dữ liệu
      console.log('Saving data...');
    }
  };

  const handleConclusionSave = () => {
    if (selectedRecord) {
      // Update conclusion in records
      // You'll need to implement the actual update logic
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý khám sức khỏe</h1>
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">Năm học:</label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="min-w-[150px] border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {schoolYears.map(year => ( 
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex rounded-lg overflow-hidden border border-gray-300 shadow-sm">
            <button
              className={`px-6 py-2.5 font-medium transition-all duration-200 ${
                activePhase === 1 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActivePhase(1)}
            >
              Đợt 1
            </button>
            <button
              className={`px-6 py-2.5 font-medium transition-all duration-200 ${
                activePhase === 2 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActivePhase(2)}
            >
              Đợt 2
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-[5%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="w-[15%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
              <th className="w-[8%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
              <th className="w-[8%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chiều cao</th>
              <th className="w-[8%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cân nặng</th>
              <th className="w-[8%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Huyết áp</th>
              <th className="w-[8%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thị lực</th>
              <th className="w-[10%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Răng miệng</th>
              <th className="w-[10%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tai-Mũi-Họng</th>
              <th className="w-[8%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Da liễu</th>
              <th className="w-[7%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="w-[5%] px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kết luận</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {healthRecords.map((record, index) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{record.studentName}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{record.class}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                  {isEditing ? (
                    <input
                      type="number"
                      defaultValue={record.height}
                      className="w-16 border rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    `${record.height} cm`
                  )}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                  {isEditing ? (
                    <input
                      type="number"
                      defaultValue={record.weight}
                      className="w-16 border rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    `${record.weight} kg`
                  )}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={record.blood_pressure}
                      className="w-20 border rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    `${record.blood_pressure} mmHg`
                  )}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={record.vision}
                      className="w-20 border rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : record.vision}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                  {isEditing ? (
                    <select 
                      defaultValue={record.dental}
                      className="w-28 border rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option>Bình thường</option>
                      <option>Cần tham vấn</option>
                    </select>
                  ) : record.dental}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                  {isEditing ? (
                    <select 
                      defaultValue={record.ent}
                      className="border rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Bình thường</option>
                      <option>Cần tham vấn</option>
                    </select>
                  ) : record.ent}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                  {isEditing ? (
                    <select 
                      defaultValue={record.skin}
                      className="border rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Bình thường</option>
                      <option>Cần tham vấn</option>
                    </select>
                  ) : record.skin}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    record.status === 'Đã khám' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedRecord(record);
                      setConclusion(record.conclusion || '');
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    {isEditing ? 'Kết luận' : record.conclusion ? 'Xem' : 'Kết luận'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Kết luận khám sức khỏe</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <div className="mb-4">
                <span className="font-medium text-gray-700">Học sinh: </span>
                <span className="text-gray-900">{selectedRecord?.studentName}</span>
                <span className="mx-2">-</span>
                <span className="text-gray-600">Lớp {selectedRecord?.class}</span>
              </div>
              <textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-none"
                placeholder="Nhập kết luận chi tiết về tình trạng sức khỏe của học sinh..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConclusionSave}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/30 font-medium"
              >
                Lưu kết luận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage_healthcheck;
