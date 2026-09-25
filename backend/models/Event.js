const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  description:     { type: String, required: true },
  date:            { type: Date, required: true },
  time:            { type: String, required: true },
  location:        { type: String, required: true },
  category:        { type: String, default: 'General' },
  imageUrl:        { type: String, default: '' },
  registrationUrl: { type: String, default: '' },
  status:          { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
