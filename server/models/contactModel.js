// models/contactModel.js

const db = require("../models/db");

const saveContactMessage = async (
  contact_name,
  contact_email,
  subject,
  message
) => {
  try {
    const result = await db.query(
      "INSERT INTO contact_us (contact_name, contact_email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *",
      [contact_name, contact_email, subject, message]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in saveContactMessage model:", error);
    throw error;
  }
};

const getAllContactMessages = async () => {
  const query = "SELECT * FROM contact_us where isdeleted = false";
  const result = await db.query(query);
  return result.rows;
};

const deleteContactMessage = async (messageId) => {
    const query = 'DELETE FROM contact_us WHERE id = $1 RETURNING *';
    const values = [messageId];
    const result = await db.query(query, values);
  
    if (result.rows.length === 1) {
      return true; // Deletion successful
    } else {
      return false; // Deletion failed (message not found)
    }
  };


  const softDeleteContactMessage = async (messageId) => {
    const query = 'UPDATE contact_us SET isDeleted = true WHERE id = $1 RETURNING *';
    const values = [messageId];
    const result = await db.query(query, values);
  
    if (result.rows.length === 1) {
      return true; // Soft deletion successful
    } else {
      return false; // Soft deletion failed (message not found)
    }
  };
module.exports = {
  saveContactMessage,
  getAllContactMessages,
  deleteContactMessage,
  softDeleteContactMessage,
};
