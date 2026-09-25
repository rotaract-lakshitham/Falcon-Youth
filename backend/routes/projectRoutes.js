const express = require('express');
const router  = express.Router();
const { getProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');

const handleBannerUpload = (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    uploadImage.single('banner')(req, res, next);
  } else {
    next();
  }
};

router.get('/',           getProjects);
router.get('/:id',        getProjectById);
router.post('/',          protect, handleBannerUpload, createProject);
router.put('/:id',       protect, handleBannerUpload, updateProject);
router.delete('/:id',    protect, deleteProject);

module.exports = router;
