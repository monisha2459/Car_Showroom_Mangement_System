import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const admin = JSON.parse(sessionStorage.getItem('admin') || '{}')

  function logout() {
    sessionStorage.removeItem('admin')
    navigate('/login')
  }

  const links = [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/cars', label: '🚘 Cars' },
    { to: '/customers', label: '👥 Customers' },
    { to: '/sales', label: '💰 Sales' },
  ]

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="brand">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/60px-Honda.svg.png" alt="Honda" className="nav-logo" />
        <span>Honda <span className="brand-light">Showroom</span></span>
      </Link>
      <div className="nav-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className="nav-right">
        <span className="admin-name">👤 {admin.fullName}</span>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  )
}
