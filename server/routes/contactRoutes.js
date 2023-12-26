const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');


router.post('/send-message', contactController.contactUs);
router.get('/contact-messages', contactController.getAllContactMessages);
router.delete('/contact-messages/:id', contactController.softDeleteContactMessage);
module.exports = router;