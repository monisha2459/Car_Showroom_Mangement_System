import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch, formatINR } from '../../api/api'
import ToastContainer, { showToast } from '../../components/Toast'
import CarImage from '../../components/CarImage'
import './User.css'

export default function UserBookings() {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    apiFetch('/testdrive/user/' + user.userId)
      .then(data => setBookings([...data].reverse()))
      .catch(() => showToast('Failed to load bookings', 'error'))
  }, [])

  function logout() {
    sessionStorage.removeItem('user')
    navigate('/user/login')
  }

  const statusColor = { Pending: '#d97706', Confirmed: '#16a34a', Cancelled: '#dc2626' }

  return (
    <div className="user-page">
      <header className="user-header">
        <div className="user-brand">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/60px-Honda.svg.png" alt="Honda" />
          Honda Car Showroom
        </div>
        <div className="user-nav">
          <Link to="/user/home" className="user-nav-link">🚘 Browse Cars</Link>
          <span className="user-welcome">👤 {user.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="user-container" style={{ marginTop: 90 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 24 }}>📋 My Test Drive Bookings</h1>

        {bookings.length === 0
          ? (
            <div className="no-cars" style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
              <p>No bookings yet.</p>
              <Link to="/user/home" className="btn-book" style={{ display: 'inline-block', marginTop: 16 }}>
                Browse Cars
              </Link>
            </div>
          )
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {bookings.map(b => (
                <div key={b.id} className="booking-card">
                  <div className="booking-car-img">
                    <CarImage model={b.car.model} imageUrl={b.car.imageUrl}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div className="booking-info">
                    <h3>{b.car.make} {b.car.model} ({b.car.year})</h3>
                    <p>{b.car.color} • {b.car.fuelType || 'N/A'} • {formatINR(b.car.price)}</p>
                    <p>📅 Booking Date: <strong>{b.bookingDate}</strong></p>
                    {b.message && <p>💬 {b.message}</p>}
                  </div>
                  <div className="booking-status">
                    <span className="status-badge" style={{ background: statusColor[b.status] + '20', color: statusColor[b.status] }}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
      <ToastContainer />
    </div>
  )
}
