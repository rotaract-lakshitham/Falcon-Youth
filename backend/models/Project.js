const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  avenue:      {
    type: String,
    enum: ['Community Service', 'Club Service', 'Professional Development', 'International Service', 'General'],
    default: 'Community Service'
  },
  status:      {
    type: String,
    enum: ['Completed', 'Ongoing', 'Upcoming'],
    default: 'Completed'
  },
  date:        { type: Date, required: true },
  location:    { type: String, required: true, trim: true },
  description: { type: String, required: true },
  bannerUrl:   { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
