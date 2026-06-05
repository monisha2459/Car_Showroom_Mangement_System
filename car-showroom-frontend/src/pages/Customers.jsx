import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import ToastContainer, { showToast } from '../components/Toast'
import { apiFetch } from '../api/api'
import './Customers.css'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCustomers() }, [search])

  async function loadCustomers() {
    try {
      const url = search ? `/customers?search=${encodeURIComponent(search)}` : '/customers'
      setCustomers(await apiFetch(url))
    } catch { showToast('Failed to load customers', 'error') }
  }

  function openAdd() { setForm({ name:'', email:'', phone:'', address:'' }); setErrors({}); setShowModal(true) }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true)
    try {
      await apiFetch('/customers', { method: 'POST', body: JSON.stringify({ ...form, email: form.email || null }) })
      showToast('Customer added')
      setShowModal(false)
      loadCustomers()
    } catch (err) { showToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  async function deleteCustomer(id) {
    if (!confirm('Delete this customer?')) return
    try {
      await apiFetch('/customers/' + id, { method: 'DELETE' })
      showToast('Customer deleted')
      loadCustomers()
    } catch (e) { showToast(e.message, 'error') }
  }

  const f = k => ({ value: form[k], onChange: e => setForm({ ...form, [k]: e.target.value }) })

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <h1 className="page-title">👥 Customers</h1>
        <div className="card">
          <div className="toolbar">
            <div className="search-box">
              <span>🔍</span>
              <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={openAdd}>➕ Add Customer</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead>
              <tbody>
                {customers.length === 0
                  ? <tr><td colSpan="6" className="empty-cell">No customers found</td></tr>
                  : customers.map((c, i) => (
                    <tr key={c.id}>
                      <td>{i + 1}</td>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email || '-'}</td>
                      <td>{c.phone || '-'}</td>
                      <td>{c.address || '-'}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => deleteCustomer(c.id)}>🗑️ Delete</button></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title="Add Customer" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label>Full Name *</label>
                <input placeholder="John Doe" {...f('name')} className={errors.name ? 'error' : ''} />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="john@email.com" {...f('email')} className={errors.email ? 'error' : ''} />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input placeholder="9876543210" {...f('phone')} />
              </div>
              <div className="form-group full">
                <label>Address</label>
                <input placeholder="123 Main St" {...f('address')} />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Customer'}</button>
            </div>
          </form>
        </Modal>
      )}
      <ToastContainer />
    </>
  )
}
