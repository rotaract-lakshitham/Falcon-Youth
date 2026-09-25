const Business = require('../models/Business');

// @desc  Get all businesses (public)
// @route GET /api/directory
const getBusinesses = async (req, res) => {
  const businesses = await Business.find().sort({ createdAt: -1 });
  res.json(businesses);
};

// @desc  Add business (admin)
// @route POST /api/directory
const addBusiness = async (req, res) => {
  const { businessName, category, ownerName, description, location, contactUrl } = req.body;
  const logoUrl = req.file ? req.file.path : '';
  const business = await Business.create({ businessName, category, ownerName, description, location, contactUrl, logoUrl });
  res.status(201).json(business);
};

// @desc  Update business (admin)
// @route PUT /api/directory/:id
const updateBusiness = async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) return res.status(404).json({ message: 'Business not found' });

  const { businessName, category, ownerName, description, location, contactUrl } = req.body;
  business.businessName = businessName || business.businessName;
  business.category     = category     || business.category;
  business.ownerName    = ownerName    || business.ownerName;
  business.description  = description  || business.description;
  business.location     = location     || business.location;
  business.contactUrl   = contactUrl   || business.contactUrl;
  if (req.file) business.logoUrl = req.file.path;

  const updated = await business.save();
  res.json(updated);
};

// @desc  Delete business (admin)
// @route DELETE /api/directory/:id
const deleteBusiness = async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) return res.status(404).json({ message: 'Business not found' });
  await business.deleteOne();
  res.json({ message: 'Business removed' });
};

module.exports = { getBusinesses, addBusiness, updateBusiness, deleteBusiness };
