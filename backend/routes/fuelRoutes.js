const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// ─────────────────────────────────────────────
// GET all fuel records (sorted by odometer ASC)
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('fuel_records')
      .select('*')
      .order('odometer_reading', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('GET /fuel error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────
// GET stats summary
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    // Get stats from the view
    const { data: viewData, error: viewError } = await supabase
      .from('fuel_stats')
      .select('*')
      .single();

    if (viewError) throw viewError;

    // Get last mileage separately
    const { data: lastRecord, error: lastError } = await supabase
      .from('fuel_records')
      .select('mileage')
      .gt('mileage', 0)
      .order('odometer_reading', { ascending: false })
      .limit(1)
      .single();

    const stats = {
      totalRecords: Number(viewData.total_records) || 0,
      totalDistance: Number(viewData.total_distance) || 0,
      totalFuelSpent: Number(viewData.total_fuel_spent) || 0,
      totalLiters: Number(viewData.total_liters) || 0,
      averageMileage: Number(viewData.average_mileage) || 0,
      bestMileage: Number(viewData.best_mileage) || 0,
      worstMileage: Number(viewData.worst_mileage) || 0,
      lastMileage: lastRecord ? Number(lastRecord.mileage) : 0,
      costPerKm: Number(viewData.cost_per_km) || 0
    };

    res.json(stats);
  } catch (error) {
    console.error('GET /fuel/stats error:', error);
    // Return default stats on error
    res.json({
      totalRecords: 0,
      totalDistance: 0,
      totalFuelSpent: 0,
      totalLiters: 0,
      averageMileage: 0,
      bestMileage: 0,
      worstMileage: 0,
      lastMileage: 0,
      costPerKm: 0
    });
  }
});

// ─────────────────────────────────────────────
// POST new fuel record
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const {
      date,
      odometerReading,
      fuelAmount,
      pricePerLiter,
      isFullTank,
      notes
    } = req.body;

    // Validation
    if (!odometerReading || !fuelAmount || !pricePerLiter) {
      return res.status(400).json({
        message: 'odometer_reading, fuel_amount, and price_per_liter are required'
      });
    }

    // Check duplicate odometer
    const { data: existing } = await supabase
      .from('fuel_records')
      .select('id')
      .eq('odometer_reading', odometerReading)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(400).json({
        message: 'A record with this odometer reading already exists'
      });
    }

    // Insert record (triggers will auto-calculate mileage)
    const { data, error } = await supabase
      .from('fuel_records')
      .insert({
        date: date || new Date().toISOString().split('T')[0],
        odometer_reading: parseFloat(odometerReading),
        fuel_amount: parseFloat(fuelAmount),
        price_per_liter: parseFloat(pricePerLiter),
        is_full_tank: isFullTank !== undefined ? isFullTank : true,
        notes: notes || ''
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('POST /fuel error:', error);
    res.status(400).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────
// DELETE a fuel record
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if record exists
    const { data: record, error: findError } = await supabase
      .from('fuel_records')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Delete (trigger will recalculate adjacent records)
    const { error: deleteError } = await supabase
      .from('fuel_records')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('DELETE /fuel error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────
// PUT update a fuel record
// ─────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, odometerReading, fuelAmount, pricePerLiter, isFullTank, notes } = req.body;

    const updateData = {};
    if (date) updateData.date = date;
    if (odometerReading) updateData.odometer_reading = parseFloat(odometerReading);
    if (fuelAmount) updateData.fuel_amount = parseFloat(fuelAmount);
    if (pricePerLiter) updateData.price_per_liter = parseFloat(pricePerLiter);
    if (isFullTank !== undefined) updateData.is_full_tank = isFullTank;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('fuel_records')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('PUT /fuel error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;