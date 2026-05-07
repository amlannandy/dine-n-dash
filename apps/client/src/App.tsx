import { BrowserRouter, Navigate,Route, Routes } from 'react-router-dom';

function QRScan() {
  return <div><h1>Scan QR Code</h1><p>Scan the table QR code to start ordering.</p></div>;
}

function Menu() {
  return <div><h1>Menu</h1></div>;
}

function Cart() {
  return <div><h1>Your Cart</h1></div>;
}

function Bill() {
  return <div><h1>Your Bill</h1></div>;
}

function OrderConfirmed() {
  return <div><h1>Order Confirmed!</h1></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/scan" element={<QRScan />} />
        <Route path="/menu/:tableId" element={<Menu />} />
        <Route path="/cart/:tableId" element={<Cart />} />
        <Route path="/bill/:orderId" element={<Bill />} />
        <Route path="/confirmed/:orderId" element={<OrderConfirmed />} />
        <Route path="*" element={<Navigate to="/scan" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
