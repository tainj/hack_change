// src/pages/CourseCreate.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage('Название курса обязательно');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const apiFetch = (await import('../api')).default;
      const response = await apiFetch('/api/teacher/courses', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (response?.data?.id) {
        setMessage('Курс успешно создан!');
        setTimeout(() => navigate('/courses'), 1000);
      } else {
        setMessage('Ошибка: не удалось создать курс');
      }
    } catch (err) {
      console.error('Ошибка создания курса:', err);
      setMessage('Ошибка: ' + (err.message || 'сервер не отвечает'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0033A0', marginBottom: '1.5rem' }}>
        Создать новый курс
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>
            Название курса *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>
            Описание (опционально)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.85rem',
            backgroundColor: '#0033A0',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? 'Создание...' : 'Создать курс'}
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

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/courses')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0033A0',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          ← Назад к курсам
        </button>
      </div>
    </div>
  );
}