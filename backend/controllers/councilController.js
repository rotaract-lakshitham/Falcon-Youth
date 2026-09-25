const CouncilMember = require('../models/CouncilMember');

// @desc  Get all council members (public) — optionally filter by year
// @route GET /api/council?year=2026-2027
const getCouncilMembers = async (req, res) => {
  const { year } = req.query;
  const filter = year ? { rotaryYear: year } : {};
  const members = await CouncilMember.find(filter).sort({ displayOrder: 1 });
  res.json(members);
};

// @desc  Add council member (admin)
// @route POST /api/council
const addCouncilMember = async (req, res) => {
  const { name, designation, rotaryYear, bio, displayOrder, socials } = req.body;
  const photoUrl = req.file ? req.file.path : '';
  const member = await CouncilMember.create({
    name, designation, rotaryYear, bio, displayOrder,
    photoUrl,
    socials: socials ? JSON.parse(socials) : {},
  });
  res.status(201).json(member);
};

// @desc  Update council member (admin)
// @route PUT /api/council/:id
const updateCouncilMember = async (req, res) => {
  const member = await CouncilMember.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });

  const { name, designation, rotaryYear, bio, displayOrder, socials } = req.body;
  member.name         = name         || member.name;
  member.designation  = designation  || member.designation;
  member.rotaryYear   = rotaryYear   || member.rotaryYear;
  member.bio          = bio          || member.bio;
  member.displayOrder = displayOrder !== undefined ? displayOrder : member.displayOrder;
  if (socials) member.socials = JSON.parse(socials);
  if (req.file) member.photoUrl = req.file.path;

  const updated = await member.save();
  res.json(updated);
};

// @desc  Delete council member (admin)
// @route DELETE /api/council/:id
const deleteCouncilMember = async (req, res) => {
  const member = await CouncilMember.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  await member.deleteOne();
  res.json({ message: 'Member removed' });
};

module.exports = { getCouncilMembers, addCouncilMember, updateCouncilMember, deleteCouncilMember };
