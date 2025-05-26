import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Layout from "../components/Layout/Layout";
import About from "../pages/Home/About";
import News from "../pages/Home/News";
import NewsDetail from "../pages/Home/NewsDetail";
import Contact from "../pages/Home/Contact";
import Login from "../pages/Login/Login";
import Nurse from "../pages/Nurse/Nurse";
import Parent from "../pages/Parent/Parent";
import Student from "../pages/Student/Student";
import ProtectedRoute from "../roles/ProtectedRoute";
import AdminLayout from "../components/Admin/AdminLayout";
// Admin pages
import Dashboard from "../pages/Admin/Dashboard";
import HealthOverview from "../pages/Admin/HealthOverview";
import ExportExcel from "../pages/Admin/ExportExcel";
import HealthEvents from "../pages/Admin/Reports/HealthEvents";
import MedicineReports from "../pages/Admin/Reports/MedicineReports";
import VaccinationReports from "../pages/Admin/Reports/VaccinationReports";
import HealthAnalysis from "../pages/Admin/Reports/HealthAnalysis";
import StudentHealthRecords from "../pages/Admin/Students/HealthRecords";
import CreateForm from "../pages/Admin/Forms/CreateForm";
import SendForm from "../pages/Admin/Forms/SendForm";
import UserManagement from "../pages/Admin/Management/UserManagement";
import ContentManagement from "../pages/Admin/Management/ContentManagement";

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

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="health-overview" element={<HealthOverview />} />
                <Route path="export-excel" element={<ExportExcel />} />
                <Route path="reports">
                    <Route path="health-events" element={<HealthEvents />} />
                    <Route path="medicine" element={<MedicineReports />} />
                    <Route path="vaccination" element={<VaccinationReports />} />
                    <Route path="analysis" element={<HealthAnalysis />} />
                </Route>
                <Route path="students">
                    <Route path="health-records" element={<StudentHealthRecords />} />
                </Route>
                <Route path="forms">
                    <Route path="create" element={<CreateForm />} />
                    <Route path="send" element={<SendForm />} />
                </Route>
                <Route path="management">
                    <Route path="users" element={<UserManagement />} />
                    <Route path="content" element={<ContentManagement />} />
                </Route>
            </Route>
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
                        <Parent />
                    </ProtectedRoute>
                }
            />
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