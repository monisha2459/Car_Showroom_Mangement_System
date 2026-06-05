import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch, formatINR } from '../../api/api'
import ToastContainer, { showToast } from '../../components/Toast'
import Modal from '../../components/Modal'
import CarImage from '../../components/CarImage'
import './User.css'

export default function UserHome() {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const [cars, setCars] = useState([])
  const [search, setSearch] = useState('')
  const [fuelFilter, setFuelFilter] = useState('')
  const [selectedCar, setSelectedCar] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingMsg, setBookingMsg] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCars() }, [search, fuelFilter])

  async function loadCars() {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      else params.set('status', 'Available')
      const data = await apiFetch('/cars?' + params)
      const filtered = fuelFilter ? data.filter(c => c.fuelType === fuelFilter) : data
      setCars(filtered.filter(c => c.status === 'Available'))
    } catch { showToast('Failed to load cars', 'error') }
  }

  function openBooking(car) {
    setSelectedCar(car)
    setBookingDate('')
    setBookingMsg('')
    setShowBooking(true)
  }

  async function handleBook(e) {
    e.preventDefault()
    if (!bookingDate) { showToast('Select a date', 'error'); return }
    setSaving(true)
    try {
      await apiFetch('/testdrive', {
        method: 'POST',
        body: JSON.stringify({ carId: selectedCar.id, userId: user.userId, bookingDate, message: bookingMsg })
      })
      showToast('Test drive booked successfully!')
      setShowBooking(false)
    } catch (err) { showToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  function logout() {
    sessionStorage.removeItem('user')
    navigate('/user/login')
  }

  const fuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid']

  return (
    <div className="user-page">
      {/* Header */}
      <header className="user-header">
        <div className="user-brand">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/60px-Honda.svg.png" alt="Honda" />
          Honda Car Showroom
        </div>
        <div className="user-nav">
          <Link to="/user/bookings" className="user-nav-link">📋 My Bookings</Link>
          <span className="user-welcome">👤 {user.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Hero */}
      <div className="user-hero">
        <h1>Discover Honda Cars</h1>
        <p>Experience The Power of Dreams</p>
        <div className="hero-search">
          <input placeholder="🔍 Search by make or model..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Filters */}
      <div className="user-container">
        <div className="user-filters">
          <span className="filter-label">Filter by fuel:</span>
          <button className={`filter-btn ${fuelFilter === '' ? 'active' : ''}`} onClick={() => setFuelFilter('')}>All</button>
          {fuels.map(f => (
            <button key={f} className={`filter-btn ${fuelFilter === f ? 'active' : ''}`}
              onClick={() => setFuelFilter(f)}>{f}</button>
          ))}
        </div>

        <p className="results-count">{cars.length} car{cars.length !== 1 ? 's' : ''} available</p>

        {/* Car Grid */}
        <div className="car-grid">
          {cars.length === 0
            ? <div className="no-cars">No cars available matching your search</div>
            : cars.map(car => (
              <div className="car-card" key={car.id}>
                <div className="car-card-img">
                  <CarImage
                    model={car.model}
                    imageUrl={car.imageUrl}
                    style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  />
                  <span className="car-badge-available">Available</span>
                </div>
                <div className="car-card-body">
                  <h3>{car.make} {car.model}</h3>
                  <p className="car-year-color">{car.year} • {car.color}</p>
                  <div className="car-specs">
                    {car.fuelType && <span>⛽ {car.fuelType}</span>}
                    {car.transmission && <span>⚙️ {car.transmission}</span>}
                    {car.mileage > 0 && <span>📍 {car.mileage.toLocaleString('en-IN')} km</span>}
                  </div>
                  <div className="car-card-footer">
                    <span className="car-price">{formatINR(car.price)}</span>
                    <div className="car-btn-group">
                      <button className="btn-book" onClick={() => openBooking(car)}>
                        🚘 Test Drive
                      </button>
                      <button className="btn-buy" onClick={() => navigate('/user/payment', { state: { car } })}>
                        💳 Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedCar && (
        <Modal title={`Book Test Drive — ${selectedCar.make} ${selectedCar.model}`} onClose={() => setShowBooking(false)}>
          <div className="booking-car-info">
            <span>💰 {formatINR(selectedCar.price)}</span>
            <span>📅 {selectedCar.year}</span>
            <span>⛽ {selectedCar.fuelType || 'N/A'}</span>
          </div>
          <form onSubmit={handleBook}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Preferred Date *</label>
              <input type="date" value={bookingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setBookingDate(e.target.value)}
                style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.9rem', width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Message (optional)</label>
              <textarea placeholder="Any specific requirements..."
                value={bookingMsg} onChange={e => setBookingMsg(e.target.value)}
                rows={3}
                style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.9rem', width: '100%', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowBooking(false)}>Cancel</button>
              <button type="submit" className="btn btn-success" disabled={saving}>
                {saving ? 'Booking...' : '✅ Confirm Booking'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ToastContainer />
    </div>
  )
}
