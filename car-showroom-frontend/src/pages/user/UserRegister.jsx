import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../../api/api'
import '../Login.css'
import './User.css'

export default function UserRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password || form.password.length < 4) e.password = 'Min 4 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      const data = await apiFetch('/user/register', { method: 'POST', body: JSON.stringify(form) })
      sessionStorage.setItem('user', JSON.stringify(data))
      navigate('/user/home')
    } catch (err) {
      setServerError(err.message)
    } finally { setLoading(false) }
  }

  const f = k => ({ value: form[k], onChange: e => setForm({ ...form, [k]: e.target.value }) })

  return (
    <div className="login-page user-bg">
      <div className="login-card" style={{ maxWidth: 440 }}>
        <div className="login-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/120px-Honda.svg.png" alt="Honda" className="honda-login-logo" />
          <h1>Create Account</h1>
          <p>Join Honda Car Showroom</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="John Doe" {...f('name')} />
            {errors.name && <span className="login-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="john@email.com" {...f('email')} />
            {errors.email && <span className="login-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 4 characters" {...f('password')} />
            {errors.password && <span className="login-error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Phone (optional)</label>
            <input placeholder="9876543210" {...f('phone')} />
          </div>
          {serverError && <p className="login-error">{serverError}</p>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <p className="login-hint">
          Already have an account? <Link to="/user/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
