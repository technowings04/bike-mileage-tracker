import React from 'react';

const Dashboard = ({ children }) => {
  return (
    <div className="dashboard">
      <div className="section-header">
        <h2>📊 Dashboard Overview</h2>
        <p>Your bike's fuel efficiency at a glance</p>
      </div>
      {children}
    </div>
  );
};

export default Dashboard;