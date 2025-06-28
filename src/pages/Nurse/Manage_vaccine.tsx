import React, { useState, useEffect } from 'react';
import { vaccineService, VaccineEvent } from '../../services/Vaccineservice';
import VaccineCreateModal from './Modal/VaccineCreateModal';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const Manage_vaccine: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vaccineEvents, setVaccineEvents] = useState<VaccineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchGrade, setSearchGrade] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await vaccineService.getVaccineEvents();
        setVaccineEvents(events);
      } catch (error) {
        setVaccineEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateNewEvent = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: { vaccineName: string, vaccineType: string, date: string, grade: string }) => {
    try {
      setIsLoading(true);
      await vaccineService.createVaccine({
        Vaccine_name: data.vaccineName,
        Vaccince_type: data.vaccineType,
        Date_injection: data.date,
        Grade: data.grade
      });

      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
      notification.textContent = 'Tạo đợt tiêm thành công!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

      const events = await vaccineService.getVaccineEvents();
      setVaccineEvents(events);
      setIsModalOpen(false);
    } catch (error) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
      notification.textContent = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đợt tiêm';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const gradeOptions = Array.from(new Set(vaccineEvents.map(e => e.grade))).sort();


  const filteredEvents = vaccineEvents.filter(event => {
    const matchesName = event.vaccineName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = searchDate
      ? formatDate(event.eventdate) === formatDate(searchDate)
      : true;
    const matchesGrade = searchGrade
      ? String(event.grade) === searchGrade
      : true;
    return matchesName && matchesDate && matchesGrade;
  });
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredEvents.length / pageSize);

  useEffect(() => {
    if (!searchDate) {
      setSelectedDate(null);
    } else {
      const d = new Date(searchDate);
      if (!isNaN(d.getTime())) setSelectedDate(d);
    }
  }, [searchDate]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý tiêm chủng</h1>
        <button
          onClick={handleCreateNewEvent}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
        >
          Tạo mới đợt tiêm
        </button>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="block text-gray-700 font-medium mb-1 sm:mb-0 sm:mr-4" htmlFor="search-vaccine-event">
            Tìm kiếm đợt tiêm:
          </label>
          <input
            id="search-vaccine-event"
            type="text"
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="Nhập tên đợt tiêm..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
          />
          <label className="block text-gray-700 font-medium mb-1 sm:mb-0 sm:ml-4" htmlFor="search-vaccine-date">
            Ngày tiêm:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              setSelectedDate(date);
              setSearchDate(date ? date.toISOString().slice(0, 10) : '');
              setCurrentPage(1);
            }}
            dateFormat="dd/MM/yyyy"
            className="min-w-[200px] border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholderText="Chọn ngày tiêm"
            id="search-vaccine-date"
            isClearable
          />
          <label className="block text-gray-700 font-medium mb-1 sm:mb-0 sm:ml-4" htmlFor="search-vaccine-grade">
            Khối:
          </label>
          <select
            id="search-vaccine-grade"
            className="w-full sm:w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={searchGrade}
            onChange={e => {
              setSearchGrade(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Tất cả</option>
            {gradeOptions.map(grade => (
              <option key={grade} value={grade}>Khối {grade}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-[10%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="w-[30%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đợt tiêm</th>
              <th className="w-[20%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khối</th>
              <th className="w-[20%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tiêm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.length > 0 ? (
              paginatedEvents.map((event, index) => (
                <tr
                  key={event.vaccineName + event.grade + event.eventdate}
                  className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/nurse/vaccine-events/${encodeURIComponent(event.vaccineName)}/${event.grade}/${event.eventdate}`,
                      { state: { vaccineName: event.vaccineName, grade: event.grade, eventDate: event.eventdate } }
                    )
                  }
                  title="Xem danh sách học sinh"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{event.vaccineName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Khối {event.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(event.eventdate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Không có dữ liệu đợt tiêm
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredEvents.length > pageSize && (
          <div className="flex justify-end items-center px-6 py-4 space-x-2">            
            <button
              className={`w-8 h-8 flex items-center justify-center rounded border ${currentPage === 1 ? 'border-gray-200 text-gray-300 bg-white' : 'border-gray-300 text-gray-600 bg-white hover:border-blue-400 hover:text-blue-600'} transition`}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Trang trước"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span
              className="w-8 h-8 flex items-center justify-center rounded border border-blue-500 text-blue-600 bg-white font-semibold"
            >
              {currentPage}
            </span>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded border ${currentPage === totalPages ? 'border-gray-200 text-gray-300 bg-white' : 'border-gray-300 text-gray-600 bg-white hover:border-blue-400 hover:text-blue-600'} transition`}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Trang sau"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <VaccineCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        vaccineTypes={[]}
        selectedVaccine={''}
      />
    </div>
  );
};

export default Manage_vaccine;