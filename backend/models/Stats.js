const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  peopleHelped: {
    type: Number,
    default: 0
  },
  treesPlanted: {
    type: Number,
    default: 0
  },
  mealsDistributed: {
    type: Number,
    default: 0
  },
  eventsOrganized: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Stats', statsSchema);
