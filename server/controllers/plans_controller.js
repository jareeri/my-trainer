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

// Route to create a new plan
exports.createPlan = async (req, res) => {
  try {
    const trainerId = req.user.id;

    // Check if required fields are missing
    const { name, description, price, features } = req.body;
    if (!trainerId || !name || !description || !price || !features) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if a plan with the same name already exists for the same trainer
    const existingPlan = await db.query('SELECT * FROM plans WHERE name = $1 AND trainer_id = $2', [name, trainerId]);
    if (existingPlan.rows.length > 0) {
      return res.status(400).json({ message: "A plan with the same name already exists for this trainer" });
    }

    const query = `
      INSERT INTO plans (trainer_id, name, description, price, features)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;

    const values = [trainerId, name, description, price, features];

    const result = await db.query(query, values);

    // Check if the query returned any rows
    if (result.rows.length > 0) {
      return res
        .status(201)
        .json({ message: "Plan created successfully", plan: result.rows[0] });
    } else {
      return res.status(500).json({ message: "Failed to create plan" });
    }
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get a plan by ID
exports.getplanbyid = async (req, res) => {
  try {
    const planId = req.params.planId;

    const query = "SELECT * FROM plans WHERE id = $1";
    const values = [planId];

    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Plan not found" });
    }
  } catch (error) {
    console.error("Error fetching plan by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all plans for a trainer by trainer_id
exports.getplansfortrainer = async (req, res) => {
  try {
    const trainerId = req.params.trainerId;

    const query = "SELECT * FROM plans WHERE trainer_id = $1";
    const values = [trainerId];

    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "No plans found for this trainer" });
    }
  } catch (error) {
    console.error("Error fetching plans for trainer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a plan by ID
exports.updatePlanById = async (req, res) => {
  try {
    const trainerId = req.user.user.Id;
    const planId = req.params.planId;
    const { name, description, price, features } = req.body;

    if (!name || !description || !price || !features) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if a plan with the same name already exists for the same trainer
    const existingPlan = await db.query('SELECT * FROM plans WHERE name = $1 AND trainer_id = $2 AND id != $3', [name, trainerId, planId]);
    if (existingPlan.rows.length > 0) {
      return res.status(400).json({ message: "A plan with the same name already exists for this trainer" });
    }

    const updateQuery = `
        UPDATE plans
        SET name = $1, description = $2, price = $3, features = $4
        WHERE id = $5 and trainer_id = $6
        RETURNING *`;

    const values = [name, description, price, features, planId, trainerId];

    const result = await db.query(updateQuery, values);

    if (result.rows.length > 0) {
      res
        .status(200)
        .json({
          message: `Plan with ID ${planId} has been updated`,
          plan: result.rows[0],
        });
    } else {
      res.status(404).json({ message: "Plan not found" });
    }
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Soft delete a plan by ID
exports.softDeletePlanById = async (req, res) => {
  try {
    const planId = req.params.planId;
    const trainer_id = req.user.user.Id;

    // Check if the plan is already soft-deleted
    const checkQuery = 'SELECT deleted FROM plans WHERE id = $1 AND trainer_id = $2';
    const checkValues = [planId, trainer_id];

    const checkResult = await db.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (checkResult.rows[0].deleted) {
      return res.status(400).json({ message: "Plan is already soft-deleted" });
    }

    // Soft-delete the plan
    const updateQuery = `
        UPDATE plans
        SET deleted = true
        WHERE id = $1 AND trainer_id = $2`;

    const values = [planId, trainer_id];

    const result = await db.query(updateQuery, values);

    if (result.rowCount > 0) {
      res
        .status(200)
        .json({ message: `Plan with ID ${planId} has been soft-deleted` });
    } else {
      res.status(404).json({ message: "Plan not found" });
    }
  } catch (error) {
    console.error("Error soft-deleting plan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Restore a soft-deleted plan by ID
exports.restorePlanById = async (req, res) => {
  try {
    const planId = req.params.planId;
    const trainer_id = req.user.user.Id;

    // Check if the plan is already restored
    const checkQuery = 'SELECT deleted FROM plans WHERE id = $1 AND trainer_id = $2';
    const checkValues = [planId, trainer_id];

    const checkResult = await db.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (!checkResult.rows[0].deleted) {
      return res.status(400).json({ message: "Plan is not soft-deleted" });
    }

    // Restore the plan
    const updateQuery = `
        UPDATE plans
        SET deleted = false
        WHERE id = $1 AND trainer_id = $2`;

    const values = [planId, trainer_id];

    const result = await db.query(updateQuery, values);

    if (result.rowCount > 0) {
      res
        .status(200)
        .json({ message: `Plan with ID ${planId} has been restored` });
    } else {
      res.status(404).json({ message: "Plan not found" });
    }
  } catch (error) {
    console.error("Error restoring plan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

