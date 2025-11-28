import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Отправка...');

    try {
      const apiFetch = (await import('../api')).default;
      const response = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Ожидаем формат: { data: { token, user } }
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user?.id) {
          localStorage.setItem('user_id', response.data.user.id);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        setMessage('Вход успешен! Перенаправление...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage('Ошибка авторизации: некорректный ответ сервера');
      }
    } catch (err) {
      setMessage('Ошибка: ' + (err.message || 'не удалось войти'));
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2c3e50', marginBottom: '1.5rem', textAlign: 'center' }}>
        Вход
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.2rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.85rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Войти
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: '1.2rem',
            textAlign: 'center',
            color: message.includes('Ошибка') ? '#e74c3c' : '#27ae60',
            fontSize: '1rem',
          }}
        >
          {message}
        </p>
      )}

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#555' }}>
        Нет аккаунта?{' '}
        <Link
          to="/register"
          style={{
            color: '#3498db',
            textDecoration: 'none',
            fontWeight: '600',
          }}
        >
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}