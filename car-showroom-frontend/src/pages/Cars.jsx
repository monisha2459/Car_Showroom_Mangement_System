import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import ToastContainer, { showToast } from '../components/Toast'
import CarImage from '../components/CarImage'
import { apiFetch, formatINR } from '../api/api'
import './Cars.css'

const empty = { make:'', model:'', year:'', color:'', price:'', fuelType:'', transmission:'', mileage:'', imageUrl:'' }

export default function Cars() {
  const [cars, setCars] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCars() }, [search, statusFilter])

  async function loadCars() {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      else if (statusFilter) params.set('status', statusFilter)
      const data = await apiFetch('/cars' + (params.toString() ? '?' + params : ''))
      setCars(data)
    } catch { showToast('Failed to load cars', 'error') }
  }

  function openAdd() { setEditId(null); setForm(empty); setErrors({}); setShowModal(true) }

  async function openEdit(id) {
    try {
      const car = await apiFetch('/cars/' + id)
      setEditId(id)
      setForm({ make: car.make, model: car.model, year: car.year, color: car.color,
        price: car.price, fuelType: car.fuelType || '', transmission: car.transmission || '',
        mileage: car.mileage || 0, imageUrl: car.imageUrl || '' })
      setErrors({})
      setShowModal(true)
    } catch { showToast('Failed to load car', 'error') }
  }

  function validate() {
    const e = {}
    if (!form.make.trim()) e.make = 'Required'
    if (!form.model.trim()) e.model = 'Required'
    if (!form.year) e.year = 'Required'
    if (!form.color.trim()) e.color = 'Required'
    if (!form.price) e.price = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    const payload = { ...form, year: parseInt(form.year), price: parseFloat(form.price),
      mileage: parseInt(form.mileage) || 0, imageUrl: form.imageUrl || null }
    try {
      if (editId) {
        await apiFetch('/cars/' + editId, { method: 'PUT', body: JSON.stringify(payload) })
        showToast('Car updated')
      } else {
        await apiFetch('/cars', { method: 'POST', body: JSON.stringify(payload) })
        showToast('Car added')
      }
      setShowModal(false)
      loadCars()
    } catch (err) { showToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  async function deleteCar(id) {
    if (!confirm('Delete this car?')) return
    try {
      await apiFetch('/cars/' + id, { method: 'DELETE' })
      showToast('Car deleted')
      loadCars()
    } catch (e) { showToast(e.message, 'error') }
  }

  const f = (k) => ({ value: form[k], onChange: e => setForm({ ...form, [k]: e.target.value }) })

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <h1 className="page-title">🚘 Car Inventory</h1>
        <div className="card">
          <div className="toolbar">
            <div className="search-box">
              <span>🔍</span>
              <input placeholder="Search make or model..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="toolbar-right">
              <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option>Available</option>
                <option>Sold</option>
              </select>
              <button className="btn btn-primary" onClick={openAdd}>➕ Add Car</button>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Image</th><th>Make</th><th>Model</th><th>Year</th><th>Color</th><th>Price</th><th>Fuel</th><th>Transmission</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {cars.length === 0
                  ? <tr><td colSpan="11" className="empty-cell">No cars found</td></tr>
                  : cars.map((c, i) => (
                    <tr key={c.id}>
                      <td>{i + 1}</td>
                      <td>{c.imageUrl || c.model
                        ? <CarImage model={c.model} imageUrl={c.imageUrl}
                            style={{ width:64, height:42, objectFit:'cover', borderRadius:6, border:'1px solid #e2e8f0', display:'block' }} />
                        : <span className="no-img">No image</span>}
                      </td>
                      <td><strong>{c.make}</strong></td>
                      <td>{c.model}</td>
                      <td>{c.year}</td>
                      <td>{c.color}</td>
                      <td><strong>{formatINR(c.price)}</strong></td>
                      <td>{c.fuelType || '-'}</td>
                      <td>{c.transmission || '-'}</td>
                      <td><span className={`badge badge-${c.status === 'Available' ? 'available' : 'sold'}`}>{c.status}</span></td>
                      <td className="actions">
                        <button className="btn btn-warning btn-sm" onClick={() => openEdit(c.id)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteCar(c.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title={editId ? 'Edit Car' : 'Add Car'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Make *</label>
                <input placeholder="e.g. Maruti" {...f('make')} className={errors.make ? 'error' : ''} />
                {errors.make && <span className="err">{errors.make}</span>}
              </div>
              <div className="form-group">
                <label>Model *</label>
                <input placeholder="e.g. Swift" {...f('model')} className={errors.model ? 'error' : ''} />
                {errors.model && <span className="err">{errors.model}</span>}
              </div>
              <div className="form-group">
                <label>Year *</label>
                <input type="number" placeholder="2023" {...f('year')} className={errors.year ? 'error' : ''} />
                {errors.year && <span className="err">{errors.year}</span>}
              </div>
              <div className="form-group">
                <label>Color *</label>
                <input placeholder="White" {...f('color')} className={errors.color ? 'error' : ''} />
                {errors.color && <span className="err">{errors.color}</span>}
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input type="number" placeholder="750000" {...f('price')} className={errors.price ? 'error' : ''} />
                {errors.price && <span className="err">{errors.price}</span>}
              </div>
              <div className="form-group">
                <label>Fuel Type</label>
                <select {...f('fuelType')}>
                  <option value="">Select</option>
                  {['Petrol','Diesel','Electric','Hybrid'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Transmission</label>
                <select {...f('transmission')}>
                  <option value="">Select</option>
                  <option>Automatic</option><option>Manual</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mileage (km)</label>
                <input type="number" placeholder="0" {...f('mileage')} />
              </div>
              <div className="form-group full">
                <label>Image URL</label>
                <input placeholder="https://... (optional)" {...f('imageUrl')} />
                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="img-preview" />}
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Car'}</button>
            </div>
          </form>
        </Modal>
      )}
      <ToastContainer />
    </>
  )
}
