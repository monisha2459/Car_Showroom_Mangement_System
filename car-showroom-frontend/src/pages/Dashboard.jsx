import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ToastContainer, { showToast } from '../components/Toast'
import { apiFetch, formatINR } from '../api/api'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentSales, setRecentSales] = useState([])

  useEffect(() => {
    apiFetch('/dashboard/stats').then(setStats).catch(() => showToast('Failed to load stats', 'error'))
    apiFetch('/sales').then(data => setRecentSales([...data].reverse().slice(0, 5))).catch(() => {})
  }, [])

  const statCards = stats ? [
    { icon: '🚗', label: 'Total Cars',    value: stats.totalCars,      color: 'blue'   },
    { icon: '✅', label: 'Available',     value: stats.availableCars,  color: 'green'  },
    { icon: '🔴', label: 'Sold',          value: stats.soldCars,       color: 'red'    },
    { icon: '👥', label: 'Customers',     value: stats.totalCustomers, color: 'purple' },
    { icon: '📋', label: 'Total Sales',   value: stats.totalSales,     color: 'orange' },
    { icon: '💵', label: 'Revenue',       value: formatINR(stats.totalRevenue), color: 'teal' },
  ] : []

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <h1 className="page-title">📊 Honda Showroom Dashboard</h1>

        <div className="stats-grid">
          {statCards.map(c => (
            <div className="stat-card" key={c.label}>
              <div className={`stat-icon ${c.color}`}>{c.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{stats ? c.value : '...'}</div>
                <div className="stat-label">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          <div className="card">
            <h3 className="card-title">Recent Sales</h3>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Car</th><th>Customer</th><th>Price</th><th>Date</th></tr></thead>
                <tbody>
                  {recentSales.length === 0
                    ? <tr><td colSpan="4" className="empty-cell">No sales yet</td></tr>
                    : recentSales.map(s => (
                      <tr key={s.id}>
                        <td>{s.car.make} {s.car.model}</td>
                        <td>{s.customer.name}</td>
                        <td>{formatINR(s.salePrice)}</td>
                        <td>{s.saleDate}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions">
              <Link to="/cars" className="btn btn-primary">➕ Add New Car</Link>
              <Link to="/customers" className="btn btn-success">👤 Add Customer</Link>
              <Link to="/sales" className="btn btn-warning">💰 Record Sale</Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
