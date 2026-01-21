import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CityForm from './CityForm';
import { ToastProvider, useToast } from './ToastContext';
import { LoaderProvider, useLoader } from './LoaderContext';
import './App.css';

function CityList() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();
  const { startLoading, stopLoading } = useLoader();

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const fetchData = (currentFilter) => {
    let url = 'http://127.0.0.1:8000/miasta/';
    if (currentFilter && currentFilter !== 'all') {
      url += `?czy_lotnisko=${currentFilter}`;
    }

    startLoading();
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => stopLoading());
  };

  const deleteCity = (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten rekord?")) {
      return;
    }

    startLoading();
    fetch(`http://127.0.0.1:8000/miasta/${id}`, {
      method: 'DELETE',
    })
      .then(async response => {
        if (response.ok) {
          showToast("Poprawnie zapisano zmiany", "success");
          fetchData(filter);
        } else {
            try {
                const err = await response.json();
                console.error('Delete failed:', err);
            } catch(e) {}
            showToast("Wystąpił błąd", "error");
        }
      })
      .catch(error => {
          console.error('Error deleting city:', error);
          showToast("Wystąpił błąd", "error");
      })
      .finally(() => stopLoading());
  };

  return (
    <div className="container">
      <h1>Lista Miast</h1>
      <div className="top-actions">
        <div className="filter-container">
            <label htmlFor="filter">Filtruj: </label>
            <select 
                id="filter"
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
            >
                <option value="all">Wszystkie</option>
                <option value="true">Z lotniskiem</option>
                <option value="false">Bez lotniska</option>
            </select>
        </div>
        <Link to="/add" className="add-btn">Dodaj Miasto</Link>
      </div>
      <div className="grid">
        {data.map(item => (
          <div key={item.id} className="tile">
            <h2>{item.nazwa}</h2>
            <div className="info-row">
              <span className="label">Ludność:</span>
              <span className="value">{item.ludnosc}</span>
            </div>
            <div className="info-row">
              <span className="label">Lotnisko:</span>
              <span className={`value ${item.czy_lotnisko ? 'yes' : 'no'}`}>
                {item.czy_lotnisko ? "Tak" : "Nie"}
              </span>
            </div>
            
            <div className="actions">
                <Link to={`/edit/${item.id}`} className="edit-btn">Edytuj</Link>
                <button className="delete-btn" onClick={() => deleteCity(item.id)}>
                Usuń
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LoaderProvider>
      <ToastProvider>
          <BrowserRouter>
          <Routes>
              <Route path="/" element={<CityList />} />
              <Route path="/add" element={<CityForm />} />
              <Route path="/edit/:id" element={<CityForm />} />
          </Routes>
          </BrowserRouter>
      </ToastProvider>
    </LoaderProvider>
  );
}
