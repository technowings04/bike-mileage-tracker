import React, { useState } from 'react';
import { deleteFuelRecord } from '../services/api';

const FuelHistory = ({ records, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fuel record?')) return;
    try {
      setDeletingId(id);
      await deleteFuelRecord(id);
      onDelete();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const getBadgeClass = (m) => {
    if (m >= 50) return 'badge-excellent';
    if (m >= 35) return 'badge-good';
    if (m >= 25) return 'badge-average';
    return 'badge-poor';
  };

  const getBadgeLabel = (m) => {
    if (m >= 50) return 'Excellent';
    if (m >= 35) return 'Good';
    if (m >= 25) return 'Average';
    return 'Poor';
  };

  const sorted = [...records].reverse();

  return (
    <div className="history-container">
      <div className="section-header">
        <h2>📋 Fuel History</h2>
        <p>{records.length} record{records.length !== 1 ? 's' : ''}</p>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No fuel records yet</h3>
          <p>Add your first fill-up to get started!</p>
        </div>
      ) : (
        <div className="records-list">
          {sorted.map((r) => (
            <div key={r.id} className="record-card">
              <div className="record-header">
                <div className="record-date">
                  📅{' '}
                  {new Date(r.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                {r.mileage > 0 && (
                  <span className={`mileage-badge ${getBadgeClass(r.mileage)}`}>
                    {r.mileage} km/L • {getBadgeLabel(r.mileage)}
                  </span>
                )}
              </div>

              <div className="record-details">
                <div className="detail-item">
                  <span className="detail-label">🔢 Odometer</span>
                  <span className="detail-value">
                    {Number(r.odometer_reading).toLocaleString()} km
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">💰 Amount</span>
                  <span className="detail-value">₹{r.fuel_amount}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">⛽ Price/L</span>
                  <span className="detail-value">₹{r.price_per_liter}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🫙 Liters</span>
                  <span className="detail-value">{Number(r.liters).toFixed(3)} L</span>
                </div>
                {r.distance_traveled > 0 && (
                  <div className="detail-item">
                    <span className="detail-label">🛣️ Distance</span>
                    <span className="detail-value">{r.distance_traveled} km</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">🫙 Tank</span>
                  <span className="detail-value">
                    {r.is_full_tank ? '✅ Full' : '⬜ Partial'}
                  </span>
                </div>
              </div>

              {r.notes && <div className="record-notes">📝 {r.notes}</div>}

              <button
                className="delete-btn"
                onClick={() => handleDelete(r.id)}
                disabled={deletingId === r.id}
              >
                {deletingId === r.id ? '⏳ Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FuelHistory;