import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function Dashboard() {
  return <div><h1>Partner Dashboard</h1><p>Manage your restaurant, menu, and tables.</p></div>;
}

function Login() {
  return <div><h1>Partner Login</h1></div>;
}

function Register() {
  return <div><h1>Register Restaurant</h1></div>;
}

function MenuManager() {
  return <div><h1>Menu Manager</h1></div>;
}

function TableManager() {
  return <div><h1>Table Manager</h1></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu" element={<MenuManager />} />
        <Route path="/tables" element={<TableManager />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
