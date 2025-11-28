import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // ← добавили

  // Функция обновления состояния из localStorage
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuth(true);
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const fname = savedUser.first_name || savedUser.firstName || '';
      const lname = savedUser.last_name || savedUser.lastName || '';
      const display = fname || lname ? `${fname} ${lname}`.trim() : (savedUser.email || 'Пользователь');
      setUserName(display);
    } else {
      setIsAuth(false);
      setUserName('');
    }
  };

  // Проверяем авторизацию:
  // 1. При монтировании
  // 2. При каждом изменении маршрута (location.pathname)
  useEffect(() => {
    checkAuth();
  }, [location.pathname]); // ← перепроверяем при каждом переходе

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    checkAuth(); // обновляем состояние сразу
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 6px rgba(0, 30, 80, 0.1)',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '2px solid #0033A0',
      }}
    >
      {/* Логотип */}
      <Link
        to="/"
        style={{
          fontSize: '1.65rem',
          fontWeight: '800',
          color: '#0033A0',
          textDecoration: 'none',
          letterSpacing: '-0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '1.8rem' }}>📚</span>
        <span style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>StudyHub</span>
      </Link>

      {/* Навигация */}
      <nav>
        {isAuth ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
            {/* УБРАЛИ "Курсы" — оставили только имя */}
            <div
              style={{
                background: '#f0f5ff',
                color: '#0033A0',
                padding: '0.45rem 1rem',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '1rem',
                border: '1px solid #cce0ff',
              }}
            >
              {userName}
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: '#e6f0ff',
                color: '#0033A0',
                border: '1px solid #b3d1ff',
                borderRadius: '6px',
                padding: '0.4rem 1rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0033A0';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#e6f0ff';
                e.currentTarget.style.color = '#0033A0';
              }}
            >
              Выйти
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            <Link
              to="/login"
              style={{
                color: '#0033A0',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '1.05rem',
                padding: '0.45rem 1.2rem',
                borderRadius: '6px',
                border: '1px solid #0033A0',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0033A0';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#0033A0';
              }}
            >
              Вход
            </Link>

            <Link
              to="/register"
              style={{
                backgroundColor: '#0033A0',
                color: 'white',
                fontWeight: '600',
                padding: '0.45rem 1.2rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '1.05rem',
                border: '1px solid #0033A0',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#002a80')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0033A0')}
            >
              Регистрация
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}