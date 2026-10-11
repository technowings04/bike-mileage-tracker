import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import FuelEntryForm from './components/FuelEntryForm';
import FuelHistory from './components/FuelHistory';
import MileageChart from './components/MileageChart';
import StatsCards from './components/StatsCards';
import PetrolPriceManager from './components/PetrolPriceManager';
import { getAllFuelRecords, getStats, getLatestPrice } from './services/api';
import './App.css';

function App() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [latestPrice, setLatestPrice] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [recordsRes, statsRes, priceRes] = await Promise.all([
        getAllFuelRecords(),
        getStats(),
        getLatestPrice()
      ]);
      setRecords(recordsRes.data);
      setStats(statsRes.data);
      setLatestPrice(priceRes.data?.price || 0);
    } catch (error) {
      toast.error('Failed to fetch data. Is the server running?');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add', label: 'Add Fuel', icon: '⛽' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'price', label: 'Petrol Price', icon: '💰' }
  ];

  return (
    <div className="app">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏍️</span>
            <div>
              <h1>Mileage Tracker</h1>
              <p className="subtitle">Track your bike's fuel efficiency</p>
            </div>
          </div>
          {latestPrice > 0 && (
            <div className="current-price-badge">
              <span className="price-label">Today's Petrol</span>
              <span className="price-value">₹{latestPrice}/L</span>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="tab-nav">
        <div className="tab-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard>
                <StatsCards stats={stats} />
                <MileageChart records={records} />
              </Dashboard>
            )}
            {activeTab === 'add' && (
              <FuelEntryForm
                latestPrice={latestPrice}
                lastOdometer={
                  records.length > 0
                    ? records[records.length - 1].odometer_reading
                    : 0
                }
                onSuccess={() => {
                  fetchData();
                  toast.success('✅ Fuel record added!');
                }}
              />
            )}
            {activeTab === 'history' && (
              <FuelHistory
                records={records}
                onDelete={() => {
                  fetchData();
                  toast.success('🗑️ Record deleted!');
                }}
              />
            )}
            {activeTab === 'price' && (
              <PetrolPriceManager
                onUpdate={() => {
                  fetchData();
                  toast.success('💰 Petrol price updated!');
                }}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>🏍️ Bike Mileage Tracker • Powered by Supabase © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;