const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  activeMembers:      { type: Number, default: 45 },
  projectsCompleted:  { type: Number, default: 18 },
  livesImpacted:      { type: Number, default: 1200 },
  volunteerHours:     { type: Number, default: 500 },
}, { timestamps: true });

module.exports = mongoose.model('Stats', statsSchema);
