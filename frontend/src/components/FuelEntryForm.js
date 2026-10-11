import React, { useState } from 'react';
import { addFuelRecord } from '../services/api';

const FuelEntryForm = ({ latestPrice, lastOdometer, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    odometerReading: '',
    fuelAmount: '',
    pricePerLiter: latestPrice || '',
    isFullTank: true,
    notes: ''
  });

  const [preview, setPreview] = useState({ liters: 0, distance: 0 });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    setFormData(updated);

    // Live preview
    if (updated.fuelAmount && updated.pricePerLiter) {
      const liters = parseFloat(updated.fuelAmount) / parseFloat(updated.pricePerLiter);
      const distance =
        lastOdometer && updated.odometerReading
          ? parseFloat(updated.odometerReading) - lastOdometer
          : 0;
      setPreview({ liters: liters.toFixed(3), distance });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (lastOdometer > 0 && parseFloat(formData.odometerReading) <= lastOdometer) {
      alert(`Odometer must be greater than last reading: ${lastOdometer} km`);
      return;
    }

    try {
      setSubmitting(true);
      await addFuelRecord({
        date: formData.date,
        odometerReading: parseFloat(formData.odometerReading),
        fuelAmount: parseFloat(formData.fuelAmount),
        pricePerLiter: parseFloat(formData.pricePerLiter),
        isFullTank: formData.isFullTank,
        notes: formData.notes
      });

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        odometerReading: '',
        fuelAmount: '',
        pricePerLiter: latestPrice || '',
        isFullTank: true,
        notes: ''
      });
      setPreview({ liters: 0, distance: 0 });
      onSuccess();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      alert('Error: ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  const estimatedMileage =
    preview.distance > 0 && parseFloat(preview.liters) > 0
      ? (preview.distance / parseFloat(preview.liters)).toFixed(2)
      : 0;

  return (
    <div className="form-container">
      <div className="section-header">
        <h2>⛽ Add Fuel Record</h2>
        <p>Enter your fuel fill-up details</p>
      </div>

      <form onSubmit={handleSubmit} className="fuel-form">
        <div className="form-grid">
          <div className="form-group">
            <label>📅 Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>🔢 Odometer Reading (km)</label>
            <input
              type="number"
              name="odometerReading"
              value={formData.odometerReading}
              onChange={handleChange}
              placeholder={lastOdometer > 0 ? `Last: ${lastOdometer} km` : 'Current km reading'}
              min={lastOdometer > 0 ? lastOdometer + 0.1 : 0}
              step="0.1"
              required
            />
            {lastOdometer > 0 && (
              <small className="hint">Last reading: {Number(lastOdometer).toLocaleString()} km</small>
            )}
          </div>

          <div className="form-group">
            <label>💰 Amount Paid (₹)</label>
            <input
              type="number"
              name="fuelAmount"
              value={formData.fuelAmount}
              onChange={handleChange}
              placeholder="e.g., 500"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>⛽ Price per Liter (₹)</label>
            <input
              type="number"
              name="pricePerLiter"
              value={formData.pricePerLiter}
              onChange={handleChange}
              placeholder="e.g., 103.50"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFullTank"
                checked={formData.isFullTank}
                onChange={handleChange}
              />
              🫙 Full Tank Fill-up
            </label>
            <small className="hint">Mileage calculated only for full-tank fills</small>
          </div>

          <div className="form-group full-width">
            <label>📝 Notes (optional)</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="City ride, highway trip, traffic..."
            />
          </div>
        </div>

        {/* Live Preview */}
        {parseFloat(preview.liters) > 0 && (
          <div className="calculation-preview">
            <h3>📐 Live Calculation</h3>
            <div className="calc-grid">
              <div className="calc-item">
                <span className="calc-label">Liters Filled</span>
                <span className="calc-value">{preview.liters} L</span>
              </div>
              {preview.distance > 0 && (
                <>
                  <div className="calc-item">
                    <span className="calc-label">Distance</span>
                    <span className="calc-value">{preview.distance} km</span>
                  </div>
                  <div className="calc-item highlight">
                    <span className="calc-label">Est. Mileage</span>
                    <span className="calc-value">{estimatedMileage} km/L</span>
                  </div>
                </>
              )}
              <div className="calc-item">
                <span className="calc-label">Cost/Liter</span>
                <span className="calc-value">₹{formData.pricePerLiter}</span>
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? '⏳ Saving...' : '✅ Save Fuel Record'}
        </button>
      </form>
    </div>
  );
};

export default FuelEntryForm;