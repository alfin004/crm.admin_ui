import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Attendance from "../pages/Attendance";
import Login from "../pages/Login";
import UserManagement from "../pages/UserManagement";
import Masters from "../pages/Masters";
import Reports from "../pages/Reports";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customers" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/customers" replace />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/customers" element={<Masters type="customers" />} />
        <Route path="/products" element={<Masters type="products" />} />
        <Route path="/customer-product-mapping" element={<Masters type="mapping" />} />
        <Route path="/follow-up-management" element={<Masters type="followups" />} />
        <Route path="/reports/customers" element={<Reports type="customers" />} />
        <Route path="/reports/products" element={<Reports type="products" />} />
        <Route path="/reports/follow-ups" element={<Reports type="followups" />} />
      </Route>
    </Routes>
  );
}
