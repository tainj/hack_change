// src/pages/Home.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // некорректные данные — считаем пользователя неавторизованным
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '700', color: '#2c3e50', marginBottom: '1.5rem' }}>
        Добро пожаловать в LearnPlatform
      </h1>

      {user ? (
        <div>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            Привет, <strong>{(user.first_name || user.firstName || user.email) ? ((user.first_name || user.firstName) ? `${user.first_name || user.firstName} ${user.last_name || user.lastName || ''}`.trim() : user.email) : 'гость'}</strong>! Готов учиться?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <Link
              to="/courses"
              style={{
                padding: '1rem',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              📚 Мои курсы
            </Link>

            <Link
              to="/upload"
              style={{
                padding: '1rem',
                backgroundColor: '#2ecc71',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              📤 Загрузить материалы
            </Link>

            <Link
              to="/profile"
              style={{
                padding: '1rem',
                backgroundColor: '#9b59b6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              👤 Мой профиль
            </Link>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid #e74c3c',
              color: '#e74c3c',
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Выйти из аккаунта
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#555' }}>
            Платформа для эффективного обучения и обмена учебными материалами.
            Присоединяйся уже сегодня!
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600',
              }}
            >
              Войти
            </Link>
            <Link
              to="/register"
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: '#2ecc71',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600',
              }}
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      )}

      <footer style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', color: '#7f8c8d', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} LearnPlatform. Образование без границ.</p>
      </footer>
    </div>
  );
}