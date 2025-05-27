import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Layout from "../components/Layout/Layout";
import ParentLayout from "../components/Layout/ParentLayout";
import About from "../pages/Home/About";
import News from "../pages/Home/News";
import NewsDetail from "../pages/Home/NewsDetail";
import Contact from "../pages/Home/Contact";
import Login from "../pages/Login/Login";
import Admin from "../pages/Admin/Admin";
import Manager from "../pages/Manager/Manager";
import Nurse from "../pages/Nurse/Nurse";
import Parent from "../pages/Parent/Parent";
import Student from "../pages/Student/Student";
import ProtectedRoute from "../roles/ProtectedRoute";
import Children from "../pages/Parent/Children";
import SendMedication from "../pages/Parent/SendMedication";
import Vaccine from "../pages/Parent/Vaccine";
import Checkup from "../pages/Parent/Checkup";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/gioi-thieu" element={<About />} />
                <Route path="/tin-tuc" element={<News />} />
                <Route path="/tintuc/:slug" element={<NewsDetail />} />
                <Route path="/lien-he" element={<Contact />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <Admin />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/manager"
                element={
                    <ProtectedRoute allowedRoles={["Manager"]}>
                        <Manager />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/nurse"
                element={
                    <ProtectedRoute allowedRoles={["Nurse"]}>
                        <Nurse />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/parent"
                element={
                    <ProtectedRoute allowedRoles={["Parent"]}>
                        <ParentLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Parent />} />
                <Route path="children" element={<Children />} />
                <Route path="medications" element={<SendMedication />} />
                <Route path="vaccines" element={<Vaccine />} />
                <Route path="checkups" element={<Checkup />} />
            </Route>
            <Route
                path="/student"
                element={
                    <ProtectedRoute allowedRoles={["Student"]}>
                        <Student />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Login />} />
        </Routes>
    );
}