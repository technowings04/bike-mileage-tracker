const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import supabase config (triggers connection test)
require('./config/supabase');

const fuelRoutes = require('./routes/fuelRoutes');
const priceRoutes = require('./routes/priceRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/fuel', fuelRoutes);
app.use('/api/price', priceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running 🏍️',
    database: 'Supabase (PostgreSQL)',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: Supabase PostgreSQL`);
});