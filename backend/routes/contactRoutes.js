const express = require('express');
const router  = express.Router();
const { sendContactMessage, getContactInfo } = require('../controllers/contactController');

router.get('/info', getContactInfo);
router.post('/', sendContactMessage);

module.exports = router;

