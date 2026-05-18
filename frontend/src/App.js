import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import AdminDashboard from "./admin_dashboard";
import Inventory from "./admin_inventory";
import POS from "./POS";
import EmployeeManagement from "./EmployeeManagement";
import Reports from "./Reports";
import EmployeeDashboard from "./employee_dashboard";
import EmployeeInventory from "./employee_inventory"; // ADD THIS

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/pos" element={<POS />} />
      <Route path="/employees" element={<EmployeeManagement />} />
      <Route path="/reports" element={<Reports />} />

      {/* EMPLOYEE */}
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/employee_inventory" element={<EmployeeInventory />} />

      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
}

export default App;