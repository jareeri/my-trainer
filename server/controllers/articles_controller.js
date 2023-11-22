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

//  all articles from the database
exports.getAllArticles = async (req, res) => {
  try {
    
    const query = "SELECT * FROM articles"; // Query to retrieve all articles
    const result = await db.query(query); // Assuming db.query is a method to query the database

    if (result && result.rows) {
      res.status(200).json(result.rows); // Respond with the retrieved articles
    } else {
      res.status(404).json({ error: "No articles found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching articles" });
  }
};

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const trainer_id = req.user.user.Id;
    // console.log(userID);
    const { title, content } = req.body; // Assuming the request body contains title, content, and published_at date

    const query = `
        INSERT INTO articles (trainer_id, title, content)
        VALUES ($1, $2, $3)
        RETURNING *`;

    const values = [trainer_id, title, content]; // Replace with the appropriate values

    const result = await db.query(query, values); // Execute the query

    if (result && result.rows.length > 0) {
      res.status(201).json({
        message: "Article created successfully",
        article: result.rows[0],
      });
    } else {
      res.status(400).json({ error: "Article creation failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a specific article
exports.updateArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params; // Assuming the ID of the article is provided in the request parameters
    const trainer_id = req.user.user.Id;
    // console.log(trainer_id);

    const query = `
        UPDATE articles
        SET title = $1, content = $2
        WHERE id = $3 and trainer_id = $4
        RETURNING *`;

    const values = [title, content, id, trainer_id]; // Replace with the appropriate values

    const result = await db.query(query, values); // Execute the query

    if (result && result.rows.length > 0) {
      res.status(200).json({
        message: `Article ${id} updated successfully for trainer id ${trainer_id} `,
        updatedArticle: result.rows[0],
      });
    } else {
      res.status(404).json({ error: "Article not found or update failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Soft delete a specific article
exports.softDeleteArticle = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the ID of the article is provided in the request parameters
    const trainer_id = req.user.user.Id;
    // console.log(userID);

    const query = `
        UPDATE articles
        SET deleted = true
        WHERE id = $1 and trainer_id = $2
        RETURNING *`;

    const values = [id, trainer_id];

    const result = await db.query(query, values);

    if (result && result.rows.length > 0) {
      res
        .status(200)
        .json({
          message: `Article ${id} soft deleted successfully`,
          deletedArticle: result.rows[0],
        });
    } else {
      res.status(404).json({ error: "Article not found or delete failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Restore a soft-deleted article
exports.restoreArticle = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the ID of the article is provided in the request parameters
    const trainer_id = req.user.user.Id;
    // console.log(trainer_id);

    const query = `
        UPDATE articles
        SET deleted = false
        WHERE id = $1 and trainer_id = $2
        RETURNING *` ;

    const values = [id, trainer_id];

    const result = await db.query(query, values);

    if (result && result.rows.length > 0) {
      res
        .status(200)
        .json({
          message: `Article ${id} restored successfully`,
          restoredArticle: result.rows[0],
        });
    } else {
      res.status(404).json({ error: "Article not found or restore failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
