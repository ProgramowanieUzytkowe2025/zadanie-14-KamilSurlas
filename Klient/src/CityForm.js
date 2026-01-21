import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
import { useLoader } from './LoaderContext';
import './App.css';

export default function CityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { startLoading, stopLoading } = useLoader();
  const [city, setCity] = useState({
    nazwa: '',
    ludnosc: 0,
    czy_lotnisko: false
  });
  const [error, setError] = useState(null);

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      startLoading();
      fetch(`http://127.0.0.1:8000/miasta/${id}`)
        .then(res => res.json())
        .then(data => setCity(data))
        .catch(err => console.error(err))
        .finally(() => stopLoading());
    }
  }, [id, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const url = isEditMode 
      ? `http://127.0.0.1:8000/miasta/${id}`
      : `http://127.0.0.1:8000/miasta/`;
    
    const method = isEditMode ? 'PUT' : 'POST';

    startLoading();
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(city)
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Błąd zapisu');
        }
        return response.json();
      })
      .then(() => {
        showToast("Poprawnie zapisano zmiany", "success");
        navigate('/');
      })
      .catch(err => {
        setError(err.message);
        showToast("Wystąpił błąd", "error");
      })
      .finally(() => stopLoading());
  };

  return (
    <div className="container center-form">
      <h1>{isEditMode ? 'Edytuj Miasto' : 'Dodaj Nowe Miasto'}</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="edit-form">
        <label>
          Nazwa:
          <input
            type="text"
            value={city.nazwa}
            onChange={e => setCity({...city, nazwa: e.target.value})}
          />
        </label>
        
        <label>
          Ludność:
          <input
            type="number"
            value={city.ludnosc}
            onChange={e => setCity({...city, ludnosc: parseInt(e.target.value)})}
          />
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={city.czy_lotnisko}
            onChange={e => setCity({...city, czy_lotnisko: e.target.checked})}
          />
          Posiada lotnisko
        </label>
        
        <button type="submit" className="save-btn">Zapisz</button>
        <button type="button" className="cancel-btn" onClick={() => navigate('/')}>Anuluj</button>
      </form>
    </div>
  );
}
