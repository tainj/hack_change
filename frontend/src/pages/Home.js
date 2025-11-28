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
        const userData = JSON.parse(savedUser);
        if (userData.role === 'teacher') {
          setUser(userData);
        } else {
          navigate('/forbidden', { replace: true });
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (!user) return null;

  // Все действия — включая "Добавить студентов"
  const actions = [
    {
      title: 'Мои курсы',
      desc: 'Создавайте и управляйте курсами',
      icon: '📚',
      to: '/courses',
      color: '#0033A0',
    },
    {
      title: 'Новый материал',
      desc: 'Загрузите лекцию, PDF или видео',
      icon: '📤',
      to: '/materials/upload',
      color: '#0057D9',
    },
    {
      title: 'Проверить задания',
      desc: 'Оцените сабмиты студентов',
      icon: '✅',
      to: '/submissions',
      color: '#28A745',
    },
    {
      title: 'Добавить студентов',
      desc: 'Пригласите студентов на курс',
      icon: '👥',
      to: '/students/add',
      color: '#FF9F43', // тёплый акцент — выделяется, но не кричит
    },
    {
      title: 'Журнал успеваемости',
      desc: 'Сводка по всем студентам',
      icon: '📊',
      to: '/grades',
      color: '#6F42C1',
    },
  ];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Приветствие */}
      <div
        style={{
          backgroundColor: '#f0f7ff',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2.5rem',
          borderLeft: '4px solid #0057D9',
        }}
      >
        <h1 style={{ margin: '0 0 0.6rem', color: '#0033A0', fontSize: '1.6rem' }}>
          Добро пожаловать, {user.first_name}!
        </h1>
        <p style={{ margin: 0, color: '#495057', lineHeight: 1.5 }}>
          Вы — в цифровой среде преподавателя <strong>StudyHub</strong>.  
          Здесь вы создаёте курсы, публикуете материалы, проверяете задания, управляете составом группы и отслеживаете прогресс — всё в одном месте.
        </p>
      </div>

      {/* Быстрые действия — теперь 5 плиток */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.4rem' }}>
        {actions.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            style={{
              display: 'block',
              padding: '1.4rem',
              backgroundColor: '#fff',
              border: '1px solid #e0e6ed',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#212529',
              transition: 'box-shadow 0.2s',
              boxShadow: '0 2px 6px rgba(0, 51, 160, 0.06)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 51, 160, 0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 51, 160, 0.06)')}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '0.7rem' }}>{item.icon}</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.4rem', color: item.color }}>
              {item.title}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#6c757d', margin: 0 }}>{item.desc}</p>
          </Link>
        ))}
      </div>

      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} StudyHub — цифровая среда преподавателя ПСБ</p>
      </footer>
    </div>
  );
}