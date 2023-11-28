// models/faqModel.js

const db = require('./db');

// Create a new FAQ entry
const createFAQ = async (question, answer) => {
  const query = `
    INSERT INTO faq (question, answer)
    VALUES ($1, $2)
    RETURNING *`;

  const values = [question, answer];

  return await db.query(query, values);
};

// Get all FAQ entries
const getAllFAQs = async () => {
  const query = "SELECT * FROM faq WHERE deleted = false";
  return await db.query(query);
};

// Get a FAQ entry by ID
const getFAQById = async (faqId) => {
  const query = "SELECT * FROM faq WHERE id = $1 AND deleted = false";
  const values = [faqId];
  return await db.query(query, values);
};

// Update a FAQ entry by ID
const updateFAQById = async (faqId, question, answer) => {
  const updateQuery = `
    UPDATE faq
    SET question = $1, answer = $2,  updated_at = NOW()
    WHERE id = $3 AND deleted = false
    RETURNING *`;

  const updateValues = [question, answer, faqId];

  return await db.query(updateQuery, updateValues);
};

// Soft delete a FAQ entry by ID
const softDeleteFAQById = async (faqId) => {
  const updateQuery = `
    UPDATE faq
    SET deleted = true
    WHERE id = $1`;

  const values = [faqId];

  return await db.query(updateQuery, values);
};

// Restore a soft-deleted FAQ entry by ID
const restoreFAQById = async (faqId) => {
  const updateQuery = `
    UPDATE faq
    SET deleted = false
    WHERE id = $1`;

  const values = [faqId];

  return await db.query(updateQuery, values);
};

module.exports = {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQById,
  softDeleteFAQById,
  restoreFAQById,
};
