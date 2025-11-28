import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    if (token && userId) {
      setIsAuth(true);
      // Можно подтянуть имя из localStorage, если сохранишь его при логине
          const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
          const fname = savedUser.first_name || savedUser.firstName || '';
          const lname = savedUser.last_name || savedUser.lastName || '';
          const display = (fname || lname) ? `${fname} ${lname}`.trim() : (savedUser.email || 'Студент');
          setUserName(display);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    setIsAuth(false);
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '0.8rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Логотип / Название */}
      <Link
        to="/"
        style={{
          fontSize: '1.4rem',
          fontWeight: '700',
          color: '#2c3e50',
          textDecoration: 'none',
        }}
      >
        📚 LearnPlatform
      </Link>

      {/* Навигация */}
      <nav>
        {isAuth ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link
              to="/courses"
              style={{ color: '#34495e', textDecoration: 'none', fontSize: '1rem' }}
            >
              Курсы
            </Link>
            <Link
              to="/profile"
              style={{
                color: '#34495e',
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              {userName}
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '1px solid #e74c3c',
                color: '#e74c3c',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Выйти
            </button>
          </div>
        ) : (
          <div>
            <Link
              to="/login"
              style={{
                color: '#3498db',
                textDecoration: 'none',
                fontSize: '1rem',
                marginRight: '1rem',
              }}
            >
              Вход
            </Link>
            <Link
              to="/register"
              style={{
                backgroundColor: '#2ecc71',
                color: 'white',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              Регистрация
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}