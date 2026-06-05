import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../../api/api'
import '../Login.css'
import './User.css'

export default function UserLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Both fields are required'); return }
    setLoading(true)
    try {
      const data = await apiFetch('/user/login', { method: 'POST', body: JSON.stringify(form) })
      sessionStorage.setItem('user', JSON.stringify(data))
      navigate('/user/home')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="login-page user-bg">
      <div className="login-card">
        <div className="login-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/120px-Honda.svg.png" alt="Honda" className="honda-login-logo" />
          <h1>Honda Car Showroom</h1>
          <p>Customer Portal</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="your@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="login-hint">
          No account? <Link to="/user/register" className="link">Register here</Link>
        </p>
        <p className="login-hint">
          Admin? <Link to="/login" className="link">Admin Login</Link>
        </p>
      </div>
    </div>
  )
}
