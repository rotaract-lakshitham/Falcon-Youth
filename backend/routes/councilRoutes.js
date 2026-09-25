const express = require('express');
const router = express.Router();
const { getCouncilMembers, addCouncilMember, updateCouncilMember, deleteCouncilMember } = require('../controllers/councilController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');

const handlePhotoUpload = (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    uploadImage.single('photo')(req, res, next);
  } else {
    next();
  }
};

router.get('/', getCouncilMembers);
router.post('/', protect, handlePhotoUpload, addCouncilMember);
router.put('/:id', protect, handlePhotoUpload, updateCouncilMember);
router.delete('/:id', protect, deleteCouncilMember);

module.exports = router;
