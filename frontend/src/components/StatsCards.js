import React from 'react';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const getMileageColor = (mileage) => {
    if (mileage >= 50) return '#10b981';
    if (mileage >= 35) return '#3b82f6';
    if (mileage >= 25) return '#f59e0b';
    return '#ef4444';
  };

  const getMileageEmoji = (mileage) => {
    if (mileage === 0) return '';
    if (mileage >= 50) return '🟢';
    if (mileage >= 35) return '🔵';
    if (mileage >= 25) return '🟡';
    return '🔴';
  };

  const cards = [
    {
      title: 'Average Mileage',
      value: `${stats.averageMileage} km/L`,
      icon: '⛽',
      color: getMileageColor(stats.averageMileage),
      emoji: getMileageEmoji(stats.averageMileage),
      desc: 'Overall fuel efficiency'
    },
    {
      title: 'Last Mileage',
      value: `${stats.lastMileage} km/L`,
      icon: '🏍️',
      color: getMileageColor(stats.lastMileage),
      emoji: getMileageEmoji(stats.lastMileage),
      desc: 'Most recent trip'
    },
    {
      title: 'Best Mileage',
      value: `${stats.bestMileage} km/L`,
      icon: '🏆',
      color: '#10b981',
      desc: 'Your best record'
    },
    {
      title: 'Worst Mileage',
      value: `${stats.worstMileage} km/L`,
      icon: '📉',
      color: '#ef4444',
      desc: 'Needs improvement'
    },
    {
      title: 'Total Distance',
      value: `${Number(stats.totalDistance).toLocaleString()} km`,
      icon: '🛣️',
      color: '#8b5cf6',
      desc: 'Kilometers tracked'
    },
    {
      title: 'Total Spent',
      value: `₹${Number(stats.totalFuelSpent).toLocaleString()}`,
      icon: '💸',
      color: '#f59e0b',
      desc: `${Number(stats.totalLiters).toFixed(1)}L consumed`
    },
    {
      title: 'Cost per KM',
      value: `₹${stats.costPerKm}`,
      icon: '📍',
      color: '#06b6d4',
      desc: 'Running cost per km'
    },
    {
      title: 'Fill-ups',
      value: stats.totalRecords,
      icon: '📝',
      color: '#ec4899',
      desc: 'Total fuel entries'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div key={i} className="stat-card" style={{ borderTopColor: card.color }}>
          <div className="stat-card-header">
            <span className="stat-icon">{card.icon}</span>
            <span className="stat-title">{card.title}</span>
          </div>
          <div className="stat-value" style={{ color: card.color }}>
            {card.value} {card.emoji}
          </div>
          <div className="stat-description">{card.desc}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;