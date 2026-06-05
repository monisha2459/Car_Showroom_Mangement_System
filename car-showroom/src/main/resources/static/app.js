const API = 'http://localhost:8080/api';

// Indian currency formatter
function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Auth helpers
function getAdmin() {
  try { return JSON.parse(sessionStorage.getItem('admin')); } catch { return null; }
}
function requireAuth() {
  if (!getAdmin()) { window.location.href = '/login.html'; }
}
function logout() {
  sessionStorage.removeItem('admin');
  window.location.href = '/login.html';
}

// Toast notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Generic fetch wrapper
async function apiFetch(url, options = {}) {
  const res = await fetch(API + url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Set active nav link
function setActiveNav() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });
}

// Set admin name in navbar
function setAdminName() {
  const admin = getAdmin();
  const el = document.getElementById('admin-name');
  if (el && admin) el.textContent = admin.fullName;
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  setAdminName();
});
