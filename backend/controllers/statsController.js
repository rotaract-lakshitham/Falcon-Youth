// const Stats = require('../models/Stats');

// @desc  Get homepage stats (public)
// @route GET /api/stats
const getStats = async (req, res) => {
  // let stats = await Stats.findOne();
  // if (!stats) stats = await Stats.create({});
  // res.json(stats);
  res.json({});
};

// @desc  Update homepage stats (admin)
// @route PUT /api/stats
const updateStats = async (req, res) => {
  // const { activeMembers, projectsCompleted, livesImpacted, volunteerHours } = req.body;
  // let stats = await Stats.findOne();
  // if (!stats) stats = new Stats();
  // stats.activeMembers     = activeMembers     ?? stats.activeMembers;
  // stats.projectsCompleted = projectsCompleted ?? stats.projectsCompleted;
  // stats.livesImpacted     = livesImpacted     ?? stats.livesImpacted;
  // stats.volunteerHours    = volunteerHours    ?? stats.volunteerHours;
  // const updated = await stats.save();
  // res.json(updated);
  res.json({ message: 'Stats feature is disabled' });
};

module.exports = { getStats, updateStats };
