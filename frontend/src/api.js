const API_BASE = process.env.REACT_APP_API_URL || '';

export async function apiFetch(path, opts = {}) {
  // Получаем токен из localStorage
  const token = localStorage.getItem('token');

  // Формируем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}

export default apiFetch;