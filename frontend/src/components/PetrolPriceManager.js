import React, { useState, useEffect } from 'react';
import { addPetrolPrice, getPriceHistory } from '../services/api';

const PetrolPriceManager = ({ onUpdate }) => {
  const [price, setPrice] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await getPriceHistory();
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addPetrolPrice({ price: parseFloat(price), fuelType });
      setPrice('');
      fetchHistory();
      onUpdate();
    } catch (err) {
      alert('Error updating price');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="price-manager">
      <div className="section-header">
        <h2>💰 Petrol Price Manager</h2>
        <p>Update today's fuel price</p>
      </div>

      <form onSubmit={handleSubmit} className="price-form">
        <div className="form-row">
          <div className="form-group">
            <label>⛽ Fuel Type</label>
            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
              <option value="Petrol">Petrol</option>
              <option value="Premium Petrol">Premium Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
          <div className="form-group">
            <label>💰 Price per Liter (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 103.50"
              step="0.01"
              min="1"
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? '⏳' : '✅'} Update Price
          </button>
        </div>
      </form>

      <div className="price-history">
        <h3>📊 Price History</h3>
        {history.length === 0 ? (
          <p className="no-data">No price records yet</p>
        ) : (
          <div className="price-list">
            {history.map((item) => (
              <div key={item.id} className="price-item">
                <div className="price-info">
                  <span className="price-type">{item.fuel_type}</span>
                  <span className="price-date">
                    {new Date(item.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <span className="price-amount">₹{item.price}/L</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetrolPriceManager;