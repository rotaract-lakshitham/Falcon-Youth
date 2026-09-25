const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');

const handleImageUpload = (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    uploadImage.single('image')(req, res, next);
  } else {
    next();
  }
};

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, handleImageUpload, createEvent);
router.put('/:id', protect, handleImageUpload, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
