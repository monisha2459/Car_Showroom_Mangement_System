const BASE = '/api'

export async function apiFetch(url, options = {}) {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const formatINR = (amount) =>
  '₹' + Number(amount).toLocaleString('en-IN')
