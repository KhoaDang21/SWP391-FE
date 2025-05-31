import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface MedicalEvent {
  id: number;
  studentName: string;
  class: string;
  event: string;
  treatment: string;
  calledParents: boolean;
}

const MedicalEventManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [medicalEvents] = useState<MedicalEvent[]>([
    {
      id: 1,
      studentName: "Nguyễn Văn A",
      class: "10A1",
      event: "Đau bụng",
      treatment: "Cho uống thuốc",
      calledParents: true
    },
    {
      id: 2,
      studentName: "Trần Thị B",
      class: "11A2",
      event: "Sốt nhẹ",
      treatment: "Cho nghỉ ngơi tại phòng y tế",
      calledParents: false
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý sự kiện y tế</h1>
        <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/30">
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên học sinh</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sự kiện y tế</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biện pháp xử lý</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gọi bố mẹ</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {medicalEvents.map((event, index) => (
              <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{event.studentName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.class}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.event}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.treatment}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    event.calledParents
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {event.calledParents ? 'Đã gọi' : 'Không gọi'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-900 font-medium mr-4">
                    Chi tiết
                  </button>
                  <button className="text-red-600 hover:text-red-900 font-medium">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalEventManagement;
