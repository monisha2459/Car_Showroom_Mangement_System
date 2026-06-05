import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch, formatINR } from '../../api/api'
import CarImage from '../../components/CarImage'
import ToastContainer, { showToast } from '../../components/Toast'
import './UserPayment.css'

const PAYMENT_METHODS = [
  { id: 'Cash',        label: 'Cash Payment',    icon: '💵', desc: 'Pay full amount in cash at showroom' },
  { id: 'UPI',         label: 'UPI',              icon: '📱', desc: 'Pay via PhonePe, GPay, Paytm, BHIM' },
  { id: 'Credit Card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay accepted' },
  { id: 'Finance',     label: 'EMI / Finance',    icon: '🏦', desc: 'Honda Finance, HDFC, SBI car loans' },
]

export default function UserPayment() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const car = state?.car

  const [step, setStep] = useState(1) // 1=method, 2=details, 3=success
  const [method, setMethod] = useState('')
  const [upiId, setUpiId] = useState('')
  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [emiTenure, setEmiTenure] = useState('12')
  const [processing, setProcessing] = useState(false)
  const [orderData, setOrderData] = useState(null)

  if (!car) {
    navigate('/user/home')
    return null
  }

  const emiAmount = Math.round(car.price / parseInt(emiTenure))

  function validateDetails() {
    if (method === 'UPI' && !upiId.includes('@')) {
      showToast('Enter valid UPI ID (e.g. name@upi)', 'error'); return false
    }
    if (method === 'Credit Card') {
      if (cardNum.replace(/\s/g,'').length < 16) { showToast('Enter valid 16-digit card number', 'error'); return false }
      if (!cardName.trim()) { showToast('Enter cardholder name', 'error'); return false }
      if (!cardExp.match(/^\d{2}\/\d{2}$/)) { showToast('Enter expiry as MM/YY', 'error'); return false }
      if (cardCvv.length < 3) { showToast('Enter valid CVV', 'error'); return false }
    }
    return true
  }

  async function handleConfirm() {
    if (!validateDetails()) return
    setProcessing(true)
    try {
      const sale = await apiFetch('/user/purchase', {
        method: 'POST',
        body: JSON.stringify({
          carId: car.id,
          userId: user.userId,
          salePrice: car.price,
          paymentMethod: method
        })
      })
      setOrderData(sale)
      setStep(3)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  function formatCard(val) {
    return val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  }

  return (
    <div className="payment-page">
      {/* Header */}
      <header className="user-header">
        <div className="user-brand">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/60px-Honda.svg.png" alt="Honda" />
          Honda Car Showroom
        </div>
        <button className="btn-logout" onClick={() => navigate('/user/home')}>← Back</button>
      </header>

      <div className="payment-container">
        {/* Progress */}
        {step < 3 && (
          <div className="payment-steps">
            <div className={`pstep ${step >= 1 ? 'active' : ''}`}><span>1</span> Payment Method</div>
            <div className="pstep-line" />
            <div className={`pstep ${step >= 2 ? 'active' : ''}`}><span>2</span> Payment Details</div>
            <div className="pstep-line" />
            <div className={`pstep ${step >= 3 ? 'active' : ''}`}><span>3</span> Confirmation</div>
          </div>
        )}

        <div className="payment-layout">
          {/* Left — Car Summary */}
          {step < 3 && (
            <div className="payment-car-card">
              <div className="payment-car-img">
                <CarImage model={car.model} imageUrl={car.imageUrl}
                  style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div className="payment-car-info">
                <h3>Honda {car.model}</h3>
                <p>{car.year} • {car.color}</p>
                <p>⛽ {car.fuelType} • ⚙️ {car.transmission}</p>
                <div className="payment-price">{formatINR(car.price)}</div>
                <div className="payment-breakdown">
                  <div><span>Ex-showroom Price</span><span>{formatINR(car.price)}</span></div>
                  <div><span>Registration</span><span>{formatINR(Math.round(car.price * 0.08))}</span></div>
                  <div><span>Insurance</span><span>{formatINR(Math.round(car.price * 0.03))}</span></div>
                  <div className="total-row"><span>Total On-Road</span><span>{formatINR(Math.round(car.price * 1.11))}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Right — Steps */}
          <div className="payment-right">

            {/* STEP 1 — Choose method */}
            {step === 1 && (
              <div className="payment-step-box">
                <h2>Choose Payment Method</h2>
                <div className="method-list">
                  {PAYMENT_METHODS.map(m => (
                    <div key={m.id}
                      className={`method-card ${method === m.id ? 'selected' : ''}`}
                      onClick={() => setMethod(m.id)}>
                      <span className="method-icon">{m.icon}</span>
                      <div>
                        <div className="method-label">{m.label}</div>
                        <div className="method-desc">{m.desc}</div>
                      </div>
                      <div className="method-radio">
                        {method === m.id ? '🔴' : '⚪'}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-pay" disabled={!method}
                  onClick={() => setStep(2)}>
                  Continue →
                </button>
              </div>
            )}

            {/* STEP 2 — Payment details */}
            {step === 2 && (
              <div className="payment-step-box">
                <h2>{PAYMENT_METHODS.find(m=>m.id===method)?.icon} {method}</h2>

                {method === 'Cash' && (
                  <div className="cash-info">
                    <div className="cash-icon">💵</div>
                    <p>Please visit our showroom with the full amount:</p>
                    <div className="cash-amount">{formatINR(car.price)}</div>
                    <p className="cash-note">Our executive will assist you with the paperwork and delivery.</p>
                    <p>📍 Honda Car Showroom, Main Road</p>
                    <p>🕐 Mon–Sat: 9 AM – 7 PM</p>
                  </div>
                )}

                {method === 'UPI' && (
                  <div className="upi-section">
                    <div className="upi-qr">
                      <div className="qr-box">
                        <div style={{fontSize:'3rem'}}>📲</div>
                        <div style={{fontSize:'0.8rem',color:'#64748b',marginTop:4}}>Scan to Pay</div>
                        <div style={{fontWeight:700,color:'#cc0000'}}>honda.showroom@upi</div>
                      </div>
                    </div>
                    <p style={{textAlign:'center',margin:'12px 0',color:'#64748b'}}>— OR enter UPI ID —</p>
                    <div className="pay-field">
                      <label>Your UPI ID</label>
                      <input placeholder="yourname@upi" value={upiId}
                        onChange={e => setUpiId(e.target.value)} />
                    </div>
                    <div className="pay-amount-box">
                      Amount to pay: <strong>{formatINR(car.price)}</strong>
                    </div>
                  </div>
                )}

                {method === 'Credit Card' && (
                  <div className="card-section">
                    <div className="card-preview">
                      <div className="card-chip">💳</div>
                      <div className="card-number-preview">{cardNum || '•••• •••• •••• ••••'}</div>
                      <div className="card-bottom-preview">
                        <span>{cardName || 'CARD HOLDER'}</span>
                        <span>{cardExp || 'MM/YY'}</span>
                      </div>
                    </div>
                    <div className="pay-field">
                      <label>Card Number</label>
                      <input placeholder="1234 5678 9012 3456" value={cardNum}
                        onChange={e => setCardNum(formatCard(e.target.value))} maxLength={19} />
                    </div>
                    <div className="pay-field">
                      <label>Cardholder Name</label>
                      <input placeholder="As on card" value={cardName}
                        onChange={e => setCardName(e.target.value.toUpperCase())} />
                    </div>
                    <div className="pay-row">
                      <div className="pay-field">
                        <label>Expiry</label>
                        <input placeholder="MM/YY" value={cardExp} maxLength={5}
                          onChange={e => {
                            let v = e.target.value.replace(/\D/g,'')
                            if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2)
                            setCardExp(v)
                          }} />
                      </div>
                      <div className="pay-field">
                        <label>CVV</label>
                        <input placeholder="•••" type="password" maxLength={4} value={cardCvv}
                          onChange={e => setCardCvv(e.target.value.replace(/\D/g,''))} />
                      </div>
                    </div>
                    <div className="pay-amount-box">
                      Amount to charge: <strong>{formatINR(car.price)}</strong>
                    </div>
                  </div>
                )}

                {method === 'Finance' && (
                  <div className="emi-section">
                    <div className="emi-header">
                      <span>💰 Loan Amount: <strong>{formatINR(car.price)}</strong></span>
                    </div>
                    <div className="pay-field">
                      <label>Select EMI Tenure</label>
                      <select value={emiTenure} onChange={e => setEmiTenure(e.target.value)}>
                        {['12','24','36','48','60','72','84'].map(t => (
                          <option key={t} value={t}>{t} Months</option>
                        ))}
                      </select>
                    </div>
                    <div className="emi-box">
                      <div className="emi-amount">{formatINR(emiAmount)}<span>/month</span></div>
                      <div className="emi-note">*Indicative EMI at 8.5% p.a. interest</div>
                    </div>
                    <div className="emi-banks">
                      <span>🏦 Honda Finance</span>
                      <span>🏦 HDFC Bank</span>
                      <span>🏦 SBI</span>
                      <span>🏦 ICICI Bank</span>
                    </div>
                  </div>
                )}

                <div className="pay-actions">
                  <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn-pay" onClick={handleConfirm} disabled={processing}>
                    {processing ? '⏳ Processing...' : `✅ Confirm Payment ${formatINR(car.price)}`}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Success */}
            {step === 3 && (
              <div className="success-box">
                <div className="success-icon">🎉</div>
                <h2>Payment Successful!</h2>
                <p>Congratulations! Your Honda {car.model} is booked.</p>
                <div className="order-card">
                  <div className="order-row"><span>Order ID</span><strong>#{orderData?.id || 'HON' + Date.now().toString().slice(-6)}</strong></div>
                  <div className="order-row"><span>Car</span><strong>Honda {car.model} ({car.year})</strong></div>
                  <div className="order-row"><span>Color</span><strong>{car.color}</strong></div>
                  <div className="order-row"><span>Amount Paid</span><strong style={{color:'#cc0000'}}>{formatINR(car.price)}</strong></div>
                  <div className="order-row"><span>Payment Method</span><strong>{method}</strong></div>
                  <div className="order-row"><span>Customer</span><strong>{user.name}</strong></div>
                  <div className="order-row"><span>Date</span><strong>{new Date().toLocaleDateString('en-IN')}</strong></div>
                  <div className="order-row"><span>Status</span><strong className="status-confirmed">✅ Confirmed</strong></div>
                </div>
                <p className="delivery-note">🚚 Expected delivery: <strong>7–14 working days</strong></p>
                <p className="delivery-note">📞 Our team will contact you at <strong>{user.email}</strong></p>
                <div className="success-actions">
                  <button className="btn-pay" onClick={() => window.print()}>🖨️ Print Receipt</button>
                  <button className="btn-back" onClick={() => navigate('/user/home')}>Browse More Cars</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
