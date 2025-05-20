import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routers";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;