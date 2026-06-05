import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cars from './pages/Cars'
import Customers from './pages/Customers'
import Sales from './pages/Sales'
import UserLogin from './pages/user/UserLogin'
import UserRegister from './pages/user/UserRegister'
import UserHome from './pages/user/UserHome'
import UserBookings from './pages/user/UserBookings'
import UserPayment from './pages/user/UserPayment'

function AdminRoute({ children }) {
  return sessionStorage.getItem('admin') ? children : <Navigate to="/login" replace />
}
function UserRoute({ children }) {
  return sessionStorage.getItem('user') ? children : <Navigate to="/user/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — role selector */}
        <Route path="/" element={<Landing />} />

        {/* Admin routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/cars" element={<AdminRoute><Cars /></AdminRoute>} />
        <Route path="/customers" element={<AdminRoute><Customers /></AdminRoute>} />
        <Route path="/sales" element={<AdminRoute><Sales /></AdminRoute>} />

        {/* User routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/home" element={<UserRoute><UserHome /></UserRoute>} />
        <Route path="/user/bookings" element={<UserRoute><UserBookings /></UserRoute>} />
        <Route path="/user/payment" element={<UserRoute><UserPayment /></UserRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
