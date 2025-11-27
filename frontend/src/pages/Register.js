// src/pages/Register.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [role, setRole] = useState('student'); // по умолчанию — студент
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setMessage('Ошибка: пароли не совпадают');
      return;
    }

    if (password.length < 8) {
      setMessage('Ошибка: пароль должен содержать не менее 8 символов');
      return;
    }

    setMessage('Отправка...');

    try {
      const apiFetch = (await import('../api')).default;
      const payload = {
        email,
        password,
        password_confirm: passwordConfirm,
        name,
        role, // ← отправляем выбранную роль
      };

      const response = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response?.data) {
        setMessage('Регистрация успешна! Перенаправление на страницу входа...');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setMessage('Регистрация прошла, но ответ не содержит данных.');
      }
    } catch (err) {
      setMessage('Ошибка: ' + (err.message || 'не удалось зарегистрироваться'));
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2c3e50', marginBottom: '1.5rem', textAlign: 'center' }}>
        Регистрация
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Роль */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
            Роль на платформе
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={(e) => setRole(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              Студент
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === 'teacher'}
                onChange={(e) => setRole(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              Преподаватель
            </label>
          </div>
        </div>

        {/* Имя */}
        <div style={{ marginBottom: '1.2rem' }}>
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        {/* Email */}
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

        {/* Пароль */}
        <div style={{ marginBottom: '1.2rem' }}>
          <input
            type="password"
            placeholder="Пароль (минимум 8 символов)"
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

        {/* Подтверждение пароля */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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

        {/* Кнопка */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.85rem',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Зарегистрироваться
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
        Уже есть аккаунт?{' '}
        <Link
          to="/login"
          style={{
            color: '#3498db',
            textDecoration: 'none',
            fontWeight: '600',
          }}
        >
          Войти
        </Link>
      </p>
    </div>
  );
}