import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import ToastContainer, { showToast } from '../components/Toast'
import { apiFetch, formatINR } from '../api/api'
import './Sales.css'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [cars, setCars] = useState([])
  const [customers, setCustomers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ carId: '', customerId: '', salePrice: '', paymentMethod: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => { loadSales() }, [])

  async function loadSales() {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.set('from', dateFrom)
      if (dateTo) params.set('to', dateTo)
      const data = await apiFetch('/sales' + (params.toString() ? '?' + params : ''))
      setSales([...data].reverse())
    } catch { showToast('Failed to load sales', 'error') }
  }

  async function openModal() {
    try {
      const [carsData, custData] = await Promise.all([
        apiFetch('/cars?status=Available'),
        apiFetch('/customers')
      ])
      setCars(carsData)
      setCustomers(custData)
      setForm({ carId: '', customerId: '', salePrice: '', paymentMethod: '' })
      setErrors({})
      setShowModal(true)
    } catch { showToast('Failed to load data', 'error') }
  }

  function handleCarChange(e) {
    const id = e.target.value
    const car = cars.find(c => c.id === parseInt(id))
    setForm({ ...form, carId: id, salePrice: car ? car.price : '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.carId) errs.carId = 'Select a car'
    if (!form.customerId) errs.customerId = 'Select a customer'
    if (!form.salePrice || form.salePrice <= 0) errs.salePrice = 'Enter valid price'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true)
    try {
      await apiFetch('/sales', {
        method: 'POST',
        body: JSON.stringify({
          carId: parseInt(form.carId),
          customerId: parseInt(form.customerId),
          salePrice: parseFloat(form.salePrice),
          paymentMethod: form.paymentMethod || null
        })
      })
      showToast('Sale recorded successfully')
      setShowModal(false)
      loadSales()
    } catch (err) { showToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  const totalRevenue = sales.reduce((sum, s) => sum + s.salePrice, 0)

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <h1 className="page-title">💰 Sales</h1>

        <div className="sales-summary">
          <div className="summary-card">
            <span className="summary-icon">📋</span>
            <div><div className="summary-value">{sales.length}</div><div className="summary-label">Total Sales</div></div>
          </div>
          <div className="summary-card">
            <span className="summary-icon">💵</span>
            <div><div className="summary-value">{formatINR(totalRevenue)}</div><div className="summary-label">Total Revenue</div></div>
          </div>
        </div>

        <div className="card">
          <div className="toolbar">
            <div className="date-filter">
              <label>From:</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              <label>To:</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              <button className="btn btn-secondary btn-sm" onClick={loadSales}>Filter</button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setDateFrom(''); setDateTo(''); setTimeout(loadSales, 0) }}>Clear</button>
            </div>
            <button className="btn btn-primary" onClick={openModal}>➕ Record Sale</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Car</th><th>Customer</th><th>Sale Price</th><th>Payment</th><th>Date</th></tr>
              </thead>
              <tbody>
                {sales.length === 0
                  ? <tr><td colSpan="6" className="empty-cell">No sales recorded yet</td></tr>
                  : sales.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td><strong>{s.car.make} {s.car.model}</strong> ({s.car.year})</td>
                      <td>{s.customer.name}</td>
                      <td><strong className="price-green">{formatINR(s.salePrice)}</strong></td>
                      <td>{s.paymentMethod || '-'}</td>
                      <td>{s.saleDate}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title="Record New Sale" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label>Car (Available Only) *</label>
                <select value={form.carId} onChange={handleCarChange} className={errors.carId ? 'error' : ''}>
                  <option value="">Select a car...</option>
                  {cars.map(c => <option key={c.id} value={c.id}>{c.make} {c.model} ({c.year}) — {formatINR(c.price)}</option>)}
                </select>
                {errors.carId && <span className="err">{errors.carId}</span>}
              </div>
              <div className="form-group full">
                <label>Customer *</label>
                <select value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} className={errors.customerId ? 'error' : ''}>
                  <option value="">Select a customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}{c.phone ? ' — ' + c.phone : ''}</option>)}
                </select>
                {errors.customerId && <span className="err">{errors.customerId}</span>}
              </div>
              <div className="form-group">
                <label>Sale Price (₹) *</label>
                <input type="number" placeholder="750000" value={form.salePrice} onChange={e => setForm({ ...form, salePrice: e.target.value })} className={errors.salePrice ? 'error' : ''} />
                {errors.salePrice && <span className="err">{errors.salePrice}</span>}
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                  <option value="">Select</option>
                  {['Cash','Credit Card','Finance','Bank Transfer','UPI'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Processing...' : '✅ Confirm Sale'}</button>
            </div>
          </form>
        </Modal>
      )}
      <ToastContainer />
    </>
  )
}
