import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <div className="flex items-center space-x-2">
          <img src="/src/assets/images/medical-book.png" alt="Logo" className="w-10 h-10 object-cover" />
          <span className="text-xl font-bold text-blue-600">EduHealth</span>
        </div>


        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Trang chủ</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">Giới thiệu</Link>
          <Link to="/news" className="text-gray-700 hover:text-blue-600 font-medium">Tin tức</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Liên hệ</Link>
        </nav>


        <div>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
