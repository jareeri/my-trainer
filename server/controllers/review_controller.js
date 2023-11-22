require("dotenv").config();
const express = require("express");
const db = require("../models/db");
const bodyParser = require("body-parser"); // Import body-parser
const cors = require("cors");

const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");

app.use(cors()); // This enables CORS for all routes
app.use(bodyParser.json()); // Enable JSON request body parsing

const bcrypt = require("bcrypt");
const { authenticate } = require("passport");

// Endpoint to post a trainer review
exports.postTrainerReview = async (req, res) => {
  try {
    const userID = req.user.user.Id;
    // console.log(userID);
    const { rating, comment } = req.body;
    const trainerId = req.params.trainerId;

    if (!userID || !trainerId || !rating || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const checkReviewQuery = `
          SELECT id FROM trainer_reviews 
          WHERE user_id = $1 AND trainer_id = $2
          LIMIT 1`;

    const checkReviewValues = [userID, trainerId];

    const checkResult = await db.query(checkReviewQuery, checkReviewValues);

    if (checkResult.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Review already exists for this user and trainer" });
    }

    const query = `
          INSERT INTO trainer_reviews (user_id, trainer_id, rating, comment)
          VALUES ($1, $2, $3, $4)
          RETURNING id`;

    const values = [userID, trainerId, rating, comment];

    const result = await db.query(query, values);

    if (result) {
      res.status(201).json({
        message: "Review posted successfully",
        reviewId: result.rows[0].id,
      });
    } else {
      res.status(500).json({ message: "Error posting review" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error posting review" });
  }
};

// Endpoint to get all reviews for a trainer
exports.getReviewsForTrainer = async (req, res) => {
  try {
    const trainerId = req.params.trainerId;

    if (!trainerId) {
      return res.status(400).json({ message: "Trainer ID is required" });
    }

    const query = `
          SELECT * FROM trainer_reviews
          WHERE trainer_id = $1`;

    const values = [trainerId];

    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "No reviews found for this trainer" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// Soft delete a review for a trainer
exports.softDeleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userID = req.user.user.Id;
    // console.log(userID);

    if (!reviewId) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const query = `
          UPDATE trainer_reviews
          SET deleted = true
          WHERE id = $1 and user_id = $2 `;

    const values = [reviewId, userID];

    const result = await db.query(query, values);

    if (result.rowCount > 0) {
      res.json({ message: "Review soft deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error soft deleting review" });
  }
};

// Restore a soft-deleted review for a trainer
exports.restoreReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userID = req.user.user.Id;
    // console.log(userID);

    if (!reviewId) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const query = `
          UPDATE trainer_reviews
          SET deleted = false
          WHERE id = $1 and user_id = $2`;

    const values = [reviewId, userID];

    const result = await db.query(query, values);

    if (result.rowCount > 0) {
      res.json({ message: "Review restored successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error restoring review" });
  }
};

// Edit a trainer review
exports.editReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.reviewId;
    const userID = req.user.user.Id;
    // console.log(userID);

    if (!rating || !comment || !reviewId) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const query = `
          UPDATE trainer_reviews
          SET rating = $1, comment = $2
          WHERE id = $3 and user_id =$4`;

    const values = [rating, comment, reviewId, userID];

    const result = await db.query(query, values);

    if (result.rowCount > 0) {
      res.json({ message: "Review updated successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating review" });
  }
};
