const Event = require('../models/Event');

// @desc  Get all events (public)
// @route GET /api/events
const getEvents = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const events = await Event.find(filter).sort({ date: -1 });
  res.json(events);
};

// @desc  Get single event
// @route GET /api/events/:id
const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

// @desc  Create event (admin)
// @route POST /api/events
const createEvent = async (req, res) => {
  const { title, description, date, time, location, category, registrationUrl, status } = req.body;
  const imageUrl = req.file ? req.file.path : '';
  const event = await Event.create({ title, description, date, time, location, category, imageUrl, registrationUrl, status });
  res.status(201).json(event);
};

// @desc  Update event (admin)
// @route PUT /api/events/:id
const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const { title, description, date, time, location, category, registrationUrl, status } = req.body;
  event.title           = title           || event.title;
  event.description     = description     || event.description;
  event.date            = date            || event.date;
  event.time            = time            || event.time;
  event.location        = location        || event.location;
  event.category        = category        || event.category;
  event.registrationUrl = registrationUrl || event.registrationUrl;
  event.status          = status          || event.status;
  if (req.file) event.imageUrl = req.file.path;

  const updated = await event.save();
  res.json(updated);
};

// @desc  Delete event (admin)
// @route DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  await event.deleteOne();
  res.json({ message: 'Event removed' });
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
