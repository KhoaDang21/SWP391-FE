import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Admin from "../pages/Admin/Admin";
import Manager from "../pages/Manager/Manager";
import Nurse from "../pages/Nurse/Nurse";
import Parent from "../pages/Parent/Parent";
import Student from "../pages/Student/Student";
import ProtectedRoute from "../roles/ProtectedRoute";

export default function AppRoutes() {
    return (
        <Routes>
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