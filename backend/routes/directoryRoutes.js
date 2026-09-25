const express = require('express');
const router = express.Router();
const { getBusinesses, addBusiness, updateBusiness, deleteBusiness } = require('../controllers/directoryController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');

const handleLogoUpload = (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    uploadImage.single('logo')(req, res, next);
  } else {
    next();
  }
};

router.get('/', getBusinesses);
router.post('/', protect, handleLogoUpload, addBusiness);
router.put('/:id', protect, handleLogoUpload, updateBusiness);
router.delete('/:id', protect, deleteBusiness);

module.exports = router;
