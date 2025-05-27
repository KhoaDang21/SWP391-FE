// App.tsx (nếu bạn đang dùng TypeScript)
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routers";
import { useSelector } from 'react-redux';
import Loading from './app/redux/loading/loading';

// Định nghĩa RootState bên ngoài component
interface RootState {
  loading: boolean;
}

function App() {
  const isLoading = useSelector((state: RootState) => state.loading);

  return (
    <>
      {/* Hiển thị loading nếu đang tải */}
      {isLoading && <Loading />}

      {/* Bọc toàn bộ ứng dụng bằng Router */}
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
