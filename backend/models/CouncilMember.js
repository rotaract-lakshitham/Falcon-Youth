const mongoose = require('mongoose');

const councilMemberSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  designation:  { type: String, required: true },
  rotaryYear:   { type: String, required: true, default: '2026-2027' },
  photoUrl:     { type: String, default: '' },
  bio:          { type: String, default: '' },
  socials: {
    linkedin:  { type: String, default: '' },
    instagram: { type: String, default: '' },
    email:     { type: String, default: '' },
  },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('CouncilMember', councilMemberSchema);
