// controllers/joinOurTeamController.js

const db = require('../models/db');

// Method to handle trainer registration requests
exports.requestToJoinTeam = async (req, res) => {
  try {
    const user_id = req.user.user.Id; // Extract user_id from token
    const { whyJoin, experience, certificate } = req.body;

    // Check if the user is already a trainer
    const checkIfTrainerQuery = 'SELECT * FROM trainers WHERE user_id = $1';
    const checkIfTrainerValues = [user_id];
    const checkIfTrainerResult = await db.query(checkIfTrainerQuery, checkIfTrainerValues);

    if (checkIfTrainerResult.rows.length > 0) {
      return res.status(400).json({ message: "User is already a trainer" });
    }

    // Insert a new request to join the team with additional information
    const insertRequestQuery = `
      INSERT INTO trainer_requests (user_id, why_join, experience, certificate)
      VALUES ($1, $2, $3, $4)`;
    const insertRequestValues = [user_id, whyJoin, experience, certificate];
    await db.query(insertRequestQuery, insertRequestValues);

    res.status(201).json({ message: "Request to join the team submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
