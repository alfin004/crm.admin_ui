import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Login from "../pages/Login";
import UserManagement from "../pages/UserManagement";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}
