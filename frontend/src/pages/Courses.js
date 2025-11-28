// src/pages/Courses.js
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Загрузка курсов
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadCourses = async () => {
      setLoading(true);
      setMessage('');

    try {
    const apiFetch = (await import('../api')).default;
    const response = await apiFetch('/api/teacher/courses', {
        method: 'GET',
    });

    // Универсальная обработка: null, [] или даже undefined → []
    const coursesData = Array.isArray(response?.data) ? response.data : [];
    setCourses(coursesData);
    } catch (err) {
    console.error('Ошибка загрузки курсов:', err);
    setMessage('Ошибка: ' + (err.message || 'не удалось загрузить курсы'));
    if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        navigate('/login');
    }
    } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [navigate]);

  const handleCreateCourse = () => {
    navigate('/courses/create');
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '1.8rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#0033A0', margin: 0 }}>
          Мои курсы
        </h1>
        <button
          onClick={handleCreateCourse}
          disabled={loading}
          style={{
            backgroundColor: '#0033A0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1.3rem',
            fontSize: '1.05rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#002a80')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0033A0')}
        >
          <span>+</span> Создать курс
        </button>
      </div>

      {message && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.75rem',
            backgroundColor: message.includes('Ошибка') ? '#fff5f5' : '#f0f9ff',
            color: message.includes('Ошибка') ? '#e74c3c' : '#27ae60',
            borderRadius: '8px',
            border: `1px solid ${message.includes('Ошибка') ? '#f1c4c4' : '#bce7ff'}`,
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.1rem', color: '#6c757d' }}>
          Загрузка курсов...
        </div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', backgroundColor: '#f8f9fa', borderRadius: '12px', color: '#6c757d' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <p>У вас пока нет курсов. Создайте первый — и начните обучать!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
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
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700', margin: '0 0 0.4rem', color: '#0033A0' }}>
                {course.title}
              </h2>
              <p style={{ color: '#495057', margin: '0 0 0.6rem', lineHeight: 1.5 }}>
                {course.description || 'Без описания'}
              </p>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>
                Создано: {new Date(course.created_at).toLocaleDateString('ru-RU')}
              </div>
            </Link>
          ))}
        </div>
      )}

      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} StudyHub — цифровая среда преподавателя ПСБ</p>
      </footer>
    </div>
  );
}