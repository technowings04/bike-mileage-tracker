const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// ─────────────────────────────────────────────
// GET latest petrol price
// ─────────────────────────────────────────────
router.get('/latest', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('petrol_prices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

    res.json(data || { price: 0, fuel_type: 'Petrol' });
  } catch (error) {
    console.error('GET /price/latest error:', error);
    res.json({ price: 0, fuel_type: 'Petrol' });
  }
});

// ─────────────────────────────────────────────
// GET price history (last 30)
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('petrol_prices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('GET /price error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────
// POST new petrol price
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { price, fuelType } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({ message: 'Valid price is required' });
    }

    const { data, error } = await supabase
      .from('petrol_prices')
      .insert({
        price: parseFloat(price),
        fuel_type: fuelType || 'Petrol'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('POST /price error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;