// routes.js

const express = require('express');
const faqController = require('../controllers/faqController');
const multer = require('multer');

const router = express.Router();
const upload = multer(); // Use multer for handling form data

// Create a new FAQ entry
router.post('/faqs', upload.none(), faqController.createFAQ);

// Get all FAQ entries
router.get('/faqs', faqController.getAllFAQs);

// Get a FAQ entry by ID
router.get('/faqs/:faqId', faqController.getFAQById);

// Update a FAQ entry by ID
router.put('/faqs/:faqId', upload.none(), faqController.updateFAQById);

// Soft delete a FAQ entry by ID
router.delete('/faqs/:faqId', faqController.softDeleteFAQById);

// Restore a soft-deleted FAQ entry by ID
router.put('/faqs/:faqId/restore', faqController.restoreFAQById);

module.exports = router;
