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
      const { trainer_id, name, description, price, features } = req.body;
  
      if (!trainer_id || !name || !description || !price || !features) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const query = `
        INSERT INTO plans (trainer_id, name, description, price, features)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
  
      const values = [trainer_id, name, description, price, features];
  
      const result = await db.query(query, values);
  
      res.status(201).json({ message: 'Plan created successfully', plan: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Get a plan by ID
exports.getplanbyid = async (req, res) => {
    try {
      const planId = req.params.planId;
  
      const query = 'SELECT * FROM plans WHERE id = $1';
      const values = [planId];
  
      const result = await db.query(query, values);
  
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Plan not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Get all plans for a trainer by trainer_id
exports.getplansfortrainer = async (req, res) => {
    try {
      const trainerId = req.params.trainerId;
  
      const query = 'SELECT * FROM plans WHERE trainer_id = $1';
      const values = [trainerId];
  
      const result = await db.query(query, values);
  
      if (result.rows.length > 0) {
        res.json(result.rows);
      } else {
        res.status(404).json({ message: 'No plans found for this trainer' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };  
  
  // Update a plan by ID
exports.updatePlanById = async (req, res) => {
    try {
      const planId = req.params.planId;
      const { name, description, price, features } = req.body;
  
      if (!name || !description || !price || !features) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const updateQuery = `
        UPDATE plans
        SET name = $1, description = $2, price = $3, features = $4
        WHERE id = $5
        RETURNING *`;
  
      const values = [name, description, price, features, planId];
  
      const result = await db.query(updateQuery, values);
  
      if (result.rows.length > 0) {
        res.status(200).json({ message: `Plan with ID ${planId} has been updated`, plan: result.rows[0] });
      } else {
        res.status(404).json({ message: 'Plan not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Soft delete a plan by ID
exports.softDeletePlanById = async (req, res) => {
    try {
      const planId = req.params.planId;
  
      const updateQuery = `
        UPDATE plans
        SET deleted = true
        WHERE id = $1`;
  
      const values = [planId];
  
      const result = await db.query(updateQuery, values);
  
      if (result.rowCount > 0) {
        res.status(200).json({ message: `Plan with ID ${planId} has been soft-deleted` });
      } else {
        res.status(404).json({ message: 'Plan not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Restore a soft-deleted plan by ID
  exports.restorePlanById = async (req, res) => {
    try {
      const planId = req.params.planId;
  
      const updateQuery = `
        UPDATE plans
        SET deleted = false
        WHERE id = $1`;
  
      const values = [planId];
  
      const result = await db.query(updateQuery, values);
  
      if (result.rowCount > 0) {
        res.status(200).json({ message: `Plan with ID ${planId} has been restored` });
      } else {
        res.status(404).json({ message: 'Plan not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  