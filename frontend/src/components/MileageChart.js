import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  Legend, ReferenceLine
} from 'recharts';

const MileageChart = ({ records }) => {
  const withMileage = records.filter((r) => r.mileage > 0);

  if (withMileage.length < 2) {
    return (
      <div className="chart-container">
        <h3>📈 Mileage Trends</h3>
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h3>Not enough data</h3>
          <p>Add at least 2 full-tank fill-ups to see trends</p>
        </div>
      </div>
    );
  }

  const chartData = withMileage.map((r) => ({
    name: new Date(r.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    }),
    mileage: Number(r.mileage),
    distance: Number(r.distance_traveled),
    liters: Number(r.liters),
    cost: Number(r.fuel_amount),
    pricePerLiter: Number(r.price_per_liter)
  }));

  const avg =
    withMileage.reduce((s, r) => s + Number(r.mileage), 0) / withMileage.length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{label}</p>
        {payload.map((e, i) => (
          <p key={i} style={{ color: e.color }}>
            {e.name}: {e.value}
            {e.name === 'mileage'
              ? ' km/L'
              : e.name === 'cost'
              ? ' ₹'
              : e.name === 'liters'
              ? ' L'
              : ' km'}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="charts-section">
      {/* Mileage Trend */}
      <div className="chart-container">
        <h3>📈 Mileage Trend (km/L)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="mileageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avg.toFixed(1)}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{
                value: `Avg: ${avg.toFixed(1)}`,
                position: 'right',
                fill: '#f59e0b',
                fontSize: 12
              }}
            />
            <Area
              type="monotone"
              dataKey="mileage"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#mileageGrad)"
              dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Distance vs Cost */}
      <div className="chart-container">
        <h3>🛣️ Distance vs Cost per Fill-up</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="distance"
              fill="#10b981"
              name="Distance (km)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="cost"
              fill="#f59e0b"
              name="Cost (₹)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Price & Liters Trend */}
      <div className="chart-container">
        <h3>⛽ Fuel Price & Liters Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="pricePerLiter"
              stroke="#ef4444"
              strokeWidth={2}
              name="Price/L (₹)"
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="liters"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Liters"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MileageChart;