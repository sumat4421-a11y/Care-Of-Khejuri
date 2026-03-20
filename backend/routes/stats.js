const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');
const authMiddleware = require('../middleware/auth');

// Get stats (public)
router.get('/', async (req, res) => {
  try {
    let stats = await Stats.findOne();
    
    // If no stats exist, create default
    if (!stats) {
      stats = new Stats();
      await stats.save();
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update stats (protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { peopleHelped, treesPlanted, mealsDistributed, eventsOrganized } = req.body;

    let stats = await Stats.findOne();

    if (!stats) {
      stats = new Stats();
    }

    if (peopleHelped !== undefined) stats.peopleHelped = Number(peopleHelped) || 0;
    if (treesPlanted !== undefined) stats.treesPlanted = Number(treesPlanted) || 0;
    if (mealsDistributed !== undefined) stats.mealsDistributed = Number(mealsDistributed) || 0;
    if (eventsOrganized !== undefined) stats.eventsOrganized = Number(eventsOrganized) || 0;

    await stats.save();

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
