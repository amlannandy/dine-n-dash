import { BrowserRouter, Navigate,Route, Routes } from 'react-router-dom';

function Login() {
  return <div><h1>Admin Login</h1></div>;
}

function Dashboard() {
  return <div><h1>Admin Dashboard</h1></div>;
}

function Restaurants() {
  return <div><h1>Restaurants</h1><p>Review and approve restaurant registrations.</p></div>;
}

function RestaurantDetail() {
  return <div><h1>Restaurant Detail</h1></div>;
}

function Subscriptions() {
  return <div><h1>Subscriptions & Payments</h1></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
