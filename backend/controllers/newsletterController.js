const Newsletter = require('../models/Newsletter');

// @desc  Get all newsletters (public)
// @route GET /api/newsletters
const getNewsletters = async (req, res) => {
  const newsletters = await Newsletter.find().sort({ createdAt: -1 });
  res.json(newsletters);
};

// @desc  Upload newsletter PDF (admin)
// @route POST /api/newsletters
const createNewsletter = async (req, res) => {
  const { title, edition, publishDate } = req.body;
  if (!req.file) return res.status(400).json({ message: 'PDF file is required' });

  const pdfUrl = req.file.path;
  const newsletter = await Newsletter.create({ title, edition, publishDate, pdfUrl });
  res.status(201).json(newsletter);
};

// @desc  Update newsletter (admin)
// @route PUT /api/newsletters/:id
const updateNewsletter = async (req, res) => {
  const newsletter = await Newsletter.findById(req.params.id);
  if (!newsletter) return res.status(404).json({ message: 'Newsletter not found' });

  const { title, edition, publishDate } = req.body;
  if (title) newsletter.title = title;
  if (edition) newsletter.edition = edition;
  if (publishDate) newsletter.publishDate = publishDate;
  if (req.file) newsletter.pdfUrl = req.file.path;

  const updated = await newsletter.save();
  res.json(updated);
};

// @desc  Delete newsletter (admin)
// @route DELETE /api/newsletters/:id
const deleteNewsletter = async (req, res) => {
  const newsletter = await Newsletter.findById(req.params.id);
  if (!newsletter) return res.status(404).json({ message: 'Newsletter not found' });
  await newsletter.deleteOne();
  res.json({ message: 'Newsletter removed' });
};

module.exports = { getNewsletters, createNewsletter, updateNewsletter, deleteNewsletter };

