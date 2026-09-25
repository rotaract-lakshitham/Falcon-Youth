const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  category:     { type: String, required: true },
  ownerName:    { type: String, required: true },
  description:  { type: String, required: true },
  location:     { type: String, default: 'Bengaluru' },
  contactUrl:   { type: String, default: '' },
  logoUrl:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
