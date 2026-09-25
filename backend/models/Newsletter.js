const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  edition:       { type: String, required: true },
  publishDate:   { type: String, required: true },
  pdfUrl:        { type: String, required: true },
  coverImageUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Newsletter', newsletterSchema);
