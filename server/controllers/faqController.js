// controllers/faqController.js

const faqModel = require('../models/faqModel');

// Create a new FAQ entry
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const result = await faqModel.createFAQ(question, answer);

    if (result.rows.length > 0) {
      return res.status(201).json({ message: "FAQ entry created successfully", faq: result.rows[0] });
    } else {
      return res.status(500).json({ message: "Failed to create FAQ entry" });
    }
  } catch (error) {
    console.error("Error creating FAQ entry:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all FAQ entries
exports.getAllFAQs = async (req, res) => {
  try {
    const result = await faqModel.getAllFAQs();

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    } else {
      return res.status(404).json({ message: "No FAQ entries found" });
    }
  } catch (error) {
    console.error("Error fetching FAQ entries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a FAQ entry by ID
exports.getFAQById = async (req, res) => {
  try {
    const faqId = req.params.faqId;

    const result = await faqModel.getFAQById(faqId);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    } else {
      return res.status(404).json({ message: "FAQ entry not found" });
    }
  } catch (error) {
    console.error("Error fetching FAQ entry by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a FAQ entry by ID
exports.updateFAQById = async (req, res) => {
  try {
    const faqId = req.params.faqId;
    const { question, answer } = req.body;

    const result = await faqModel.updateFAQById(faqId, question, answer);

    if (result.rows.length > 0) {
      return res.status(200).json({
        message: `FAQ entry with ID ${faqId} has been updated`,
        faq: result.rows[0],
      });
    } else {
      return res.status(404).json({ message: "FAQ entry not found" });
    }
  } catch (error) {
    console.error("Error updating FAQ entry:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Soft delete a FAQ entry by ID
exports.softDeleteFAQById = async (req, res) => {
  try {
    const faqId = req.params.faqId;

    const result = await faqModel.softDeleteFAQById(faqId);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: `FAQ entry with ID ${faqId} has been soft-deleted` });
    } else {
      return res.status(404).json({ message: "FAQ entry not found" });
    }
  } catch (error) {
    console.error("Error soft-deleting FAQ entry:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Restore a soft-deleted FAQ entry by ID
exports.restoreFAQById = async (req, res) => {
  try {
    const faqId = req.params.faqId;

    const result = await faqModel.restoreFAQById(faqId);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: `FAQ entry with ID ${faqId} has been restored` });
    } else {
      return res.status(404).json({ message: "FAQ entry not found" });
    }
  } catch (error) {
    console.error("Error restoring FAQ entry:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
