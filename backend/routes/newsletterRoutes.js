const express = require('express');
const router = express.Router();
const { getNewsletters, createNewsletter, updateNewsletter, deleteNewsletter } = require('../controllers/newsletterController');
const { protect } = require('../middleware/authMiddleware');
const { uploadPDF } = require('../middleware/uploadMiddleware');

const handlePdfUpload = (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    uploadPDF.single('pdf')(req, res, next);
  } else {
    next();
  }
};

router.get('/', getNewsletters);
router.post('/', protect, uploadPDF.single('pdf'), createNewsletter);
router.put('/:id', protect, handlePdfUpload, updateNewsletter);
router.delete('/:id', protect, deleteNewsletter);

module.exports = router;

