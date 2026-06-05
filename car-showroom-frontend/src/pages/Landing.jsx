import { useNavigate } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <div className="landing-header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/120px-Honda.svg.png" alt="Honda" className="honda-logo" />
      </div>

      <div className="landing-hero">
        <h1>Honda Car Showroom</h1>
        <p>Experience The Power of Dreams</p>
        <div className="honda-tagline">🏆 India's Most Trusted Car Brand</div>
      </div>

      <div className="landing-cards">
        <div className="role-card admin-card" onClick={() => navigate('/login')}>
          <div className="role-icon">🛡️</div>
          <h2>Admin Portal</h2>
          <p>Manage Honda inventory, customers, sales and generate reports</p>
          <button className="role-btn admin-btn">Admin Login →</button>
        </div>

        <div className="role-divider">OR</div>

        <div className="role-card user-card" onClick={() => navigate('/user/login')}>
          <div className="role-icon">👤</div>
          <h2>Customer Portal</h2>
          <p>Browse Honda cars, book test drives and explore our collection</p>
          <button className="role-btn user-btn">Customer Login →</button>
        </div>
      </div>

      <div className="honda-models">
        <span>City</span><span>City e:HEV</span><span>Amaze</span>
        <span>Elevate</span><span>WR-V</span><span>Jazz</span>
        <span>CR-V</span><span>HR-V</span>
      </div>

      <p className="landing-footer">© 2024 Honda Car Showroom. All Rights Reserved.</p>
    </div>
  )
}
