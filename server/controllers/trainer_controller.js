require("dotenv").config();
const express = require("express");
const db = require("../models/db");
const firebaseMiddleware = require("../middleware/fierbasemiddleware");
const bodyParser = require("body-parser"); // Import body-parser
const cors = require("cors");

const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");

app.use(cors()); // This enables CORS for all routes
app.use(bodyParser.json()); // Enable JSON request body parsing

const bcrypt = require("bcrypt");
const { authenticate } = require("passport");

// Route to upgrade a user to a trainer
exports.upgradeusertotrainer = async (req, res) => {
  try {
    const { user_id, certification, experience } = req.body;

    if (!user_id || !certification || !experience) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const insertTrainerQuery = `
        INSERT INTO trainers (user_id, certification, experience)
        VALUES ($1, $2, $3)`;

    const insertValues = [user_id, certification, experience];

    await db.query(insertTrainerQuery, insertValues);

    // Change the user's role to 'trainer' in the users table
    const updateRoleQuery = `
        UPDATE users
        SET userrole = 'trainer'
        WHERE user_id = $1`;

    const updateValues = [user_id];

    await db.query(updateRoleQuery, updateValues);

    res
      .status(201)
      .json({ message: "User upgraded to a trainer successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Retrieve all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const query = `
      SELECT
        trainers.*,
        users.*,
        profile_user.*,
        AVG(trainer_reviews.rating) AS avg_rating
      FROM
        trainers
      INNER JOIN
        users ON users.user_id = trainers.user_id
      INNER JOIN
        profile_user ON profile_user.user_id = trainers.user_id  
      LEFT JOIN
        trainer_reviews ON trainers.trainer_id = trainer_reviews.trainer_id
      GROUP BY
        trainers.trainer_id, users.user_id, profile_user.id
    `;

    const result = await db.query(query);

    if (result && result.rows.length > 0) {
      res.status(200).json({ trainers: result.rows });
    } else {
      res.status(404).json({ message: "No trainers found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a specific trainer
exports.updateTrainer = async (req, res) => {
  try {
    const trainerId = req.user.user.Id;
    const { certification, experience } = req.body;

    if (!trainerId) {
      return res.status(400).json({ message: "Trainer ID is required" });
    }

    const query = `
        UPDATE trainers
        SET certification = $1, experience = $2
        WHERE user_id = $3`;

    const values = [certification, experience, trainerId];

    await db.query(query, values);

    res
      .status(200)
      .json({ message: `Trainer with ID ${trainerId} has been updated` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific trainer by ID
exports.getTrainerById = async (req, res) => {
  try {
    const trainerId = req.params.trainer_id;

    const query = `
      SELECT *
      FROM trainers
      INNER JOIN users ON users.user_id = trainers.user_id
      INNER JOIN profile_user ON profile_user.user_id = users.user_id
      WHERE trainers.user_id = $1;
      `;

    const values = [trainerId];

    const result = await db.query(query, values);

    if (result.rows.length === 1) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Trainer not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user profile and trainer information
exports.updateUserProfileAndTrainer = async (req, res) => {
  try {
    const userId = req.user.user.Id;
    const { bio, location, website, username, certification, experience } =
      req.body;
    const file = req.file;

    // Use a transaction to ensure atomicity of updates
    await db.query("BEGIN");

    try {
      // Check if a profile exists for the user
      const existingProfileQuery = `
        SELECT * FROM profile_user WHERE user_id = $1`;

      const existingProfileValues = [userId];

      const existingProfileResult = await db.query(
        existingProfileQuery,
        existingProfileValues
      );

      if (existingProfileResult.rows.length > 0) {
        // If a profile already exists, update it
        const existingProfile = existingProfileResult.rows[0];

        const fileName = `${Date.now()}_${file.originalname}`;
        const fileUrl = await firebaseMiddleware.uploadFileToFirebase(
          file,
          fileName
        );

        const updateProfileQuery = `
          UPDATE profile_user
          SET bio = $1, location = $2, website = $3, profileimage = $4
          WHERE user_id = $5
          RETURNING *`;

        const updateProfileValues = [bio, location, website, fileUrl, userId];

        const updatedProfileResult = await db.query(
          updateProfileQuery,
          updateProfileValues
        );

        // Update users table
        const updateUserQuery = `
          UPDATE users
          SET username = $1
          WHERE user_id = $2`;

        const updateUserValues = [username, userId];

        await db.query(updateUserQuery, updateUserValues);

        // Update trainers table
        const updateTrainerQuery = `
          UPDATE trainers
          SET certification = $1, experience = $2
          WHERE user_id = $3`;

        const updateTrainerValues = [certification, experience, userId];

        await db.query(updateTrainerQuery, updateTrainerValues);

        // Commit the transaction
        await db.query("COMMIT");

        res.status(200).json({
          message:
            "User profile, username, and trainer information updated successfully",
          userprofile: updatedProfileResult.rows[0],
        });
      } else {
        // If no profile exists, create a new one
        const fileName = `${Date.now()}_${file.originalname}`;
        const fileUrl = await firebaseMiddleware.uploadFileToFirebase(
          file,
          fileName
        );

        const insertProfileQuery = `
          INSERT INTO profile_user
          (bio, location, website, profileimage, user_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *`;

        const insertProfileValues = [bio, location, website, fileUrl, userId];

        const insertedProfileResult = await db.query(
          insertProfileQuery,
          insertProfileValues
        );

        // Update users table
        const updateUserQuery = `
          UPDATE users
          SET username = $1
          WHERE user_id = $2`;

        const updateUserValues = [username, userId];

        await db.query(updateUserQuery, updateUserValues);

        // Update trainers table
        const updateTrainerQuery = `
          UPDATE trainers
          SET certification = $1, experience = $2
          WHERE user_id = $3`;

        const updateTrainerValues = [certification, experience, userId];

        await db.query(updateTrainerQuery, updateTrainerValues);

        // Commit the transaction
        await db.query("COMMIT");

        res.status(200).json({
          message:
            "New user profile, username, and trainer information created successfully",
          userprofile: insertedProfileResult.rows[0],
        });
      }
    } catch (error) {
      // Rollback the transaction in case of an error
      await db.query("ROLLBACK");
      console.error(
        "Error updating user profile, username, and trainer information:",
        error
      );
      res
        .status(500)
        .json({
          error:
            "Error updating user profile, username, and trainer information",
        });
    }
  } catch (error) {
    console.error("Error in updateUserProfileAndTrainer:", error);
    res
      .status(500)
      .json({
        error: "Error updating user profile, username, and trainer information",
      });
  }
};
