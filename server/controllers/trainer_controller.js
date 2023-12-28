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

// Get the trainer data by user ID from token
exports.getTrainerByToken = async (req, res) => {
  try {
    // Extract user ID from the token
    const userId = req.user.user.Id;
    
    const query = `
      SELECT *
      FROM trainers
      INNER JOIN users ON users.user_id = trainers.user_id
      INNER JOIN profile_user ON profile_user.user_id = users.user_id
      WHERE trainers.user_id = $1;
    `;

    const values = [userId];

    const result = await db.query(query, values);
    // console.log(result.rows);

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

// Update user profile, username, and trainer information
exports.updateUserProfileAndTrainer = async (req, res) => {
  try {
    const userId = req.user.user.Id;
    const { bio, location, website, username, certification, experience } =
      req.body;
    const file = req.file;

    // Use a transaction to ensure atomicity of updates
    await db.query("BEGIN");

    try {
      let fileUrl = null;

      // Check if a file is provided in the request
      if (file) {
        const fileName = `${Date.now()}_${file.originalname}`;
        fileUrl = await firebaseMiddleware.uploadFileToFirebase(file, fileName);
      }

      // Update profile_user table
      const updateProfileQuery = `
        UPDATE profile_user
        SET bio = $1, location = $2, website = $3
        ${file ? ", profileimage = $4" : ""}
        WHERE user_id = $${file ? "5" : "4"}
        RETURNING *`;

      const updateProfileValues = [bio, location, website];
      if (file) {
        updateProfileValues.push(fileUrl);
      }
      updateProfileValues.push(userId);

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

// Route to upgrade a user to a trainer
exports.upgradeUserToTrainer = async (req, res) => {
  try {
    const { user_id, username } = req.body;

    if (!(user_id || username)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Determine the user_id based on user_id or username
    let userIdToUse;
    if (user_id) {
      userIdToUse = user_id;
    } else {
      // Retrieve user_id based on username
      const getUserIdQuery = 'SELECT user_id FROM users WHERE username = $1';
      const getUserIdValues = [username];
      const getUserIdResult = await db.query(getUserIdQuery, getUserIdValues);

      if (getUserIdResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      userIdToUse = getUserIdResult.rows[0].user_id;
    }

    // Check if there is no existing record in the trainers table for the user
    const checkTrainerQuery = 'SELECT * FROM trainers WHERE user_id = $1';
    const checkTrainerValues = [userIdToUse];
    const checkTrainerResult = await db.query(checkTrainerQuery, checkTrainerValues);

    if (checkTrainerResult.rows.length === 0) {
      // Insert a new row into the trainers table with user_id set to the upgraded user
      const insertTrainerQuery = `
          INSERT INTO trainers (user_id, certification, experience)
          VALUES ($1, null, null)`;

      const insertTrainerValues = [userIdToUse];
      await db.query(insertTrainerQuery, insertTrainerValues);
    }

    // Check if there is no existing record in the profile_user table for the user
    const checkProfileQuery = 'SELECT * FROM profile_user WHERE user_id = $1';
    const checkProfileValues = [userIdToUse];
    const checkProfileResult = await db.query(checkProfileQuery, checkProfileValues);

    if (checkProfileResult.rows.length === 0) {
      // Insert a new row into the profile_user table with user_id set to the upgraded user
      const insertProfileQuery = `
          INSERT INTO profile_user (user_id, bio, location, website, profileimage)
          VALUES ($1, null, null, null, null)`;

      const insertProfileValues = [userIdToUse];
      await db.query(insertProfileQuery, insertProfileValues);
    }

    // Change the user's role to 'trainer' only if user_id or username is provided
    if (user_id || username) {
      const updateRoleQuery = `
          UPDATE users
          SET userrole = 'trainer'
          WHERE user_id = $1`;

      const updateValues = [userIdToUse];
      await db.query(updateRoleQuery, updateValues);
    }

    res.status(201).json({ message: "User upgraded to a trainer successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// // Route to upgrade a user to a trainer
// exports.upgradeUserToTrainer = async (req, res) => {
//   try {
//     const { user_id, username } = req.body;

//     if (!(user_id || username)) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Determine the user_id based on user_id or username
//     let userIdToUse;
//     if (user_id) {
//       userIdToUse = user_id;
//     } else {
//       // Retrieve user_id based on username
//       const getUserIdQuery = 'SELECT user_id FROM users WHERE username = $1';
//       const getUserIdValues = [username];
//       const getUserIdResult = await db.query(getUserIdQuery, getUserIdValues);

//       if (getUserIdResult.rows.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       userIdToUse = getUserIdResult.rows[0].user_id;
//     }

//     const insertTrainerQuery = `
//         INSERT INTO trainers (user_id, certification, experience)
//         VALUES ($1, null, null)`;

//     const insertValues = [userIdToUse];

//     await db.query(insertTrainerQuery, insertValues);

//     // Change the user's role to 'trainer' only if user_id or username is provided
//     if (user_id || username) {
//       const updateRoleQuery = `
//           UPDATE users
//           SET userrole = 'trainer'
//           WHERE user_id = $1`;

//       const updateValues = [userIdToUse];

//       await db.query(updateRoleQuery, updateValues);
//     }

//     res.status(201).json({ message: "User upgraded to a trainer successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

