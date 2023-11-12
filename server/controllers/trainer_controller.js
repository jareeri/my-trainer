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


// Route to upgrade a user to a trainer
exports.upgradeusertotrainer = async (req, res) => {
    try {
      const { user_id, certification, experience } = req.body;
  
      if (!user_id || !certification || !experience) {
        return res.status(400).json({ message: 'Missing required fields' });
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
  
      res.status(201).json({ message: 'User upgraded to a trainer successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Retrieve all trainers
exports.getAllTrainers = async (req, res) => {
    try {
      const query = `SELECT * FROM trainers inner join users on users.user_id = trainers.user_id`;
      const result = await db.query(query);
  
      if (result && result.rows.length > 0) {
        res.status(200).json({ trainers: result.rows });
      } else {
        res.status(404).json({ message: 'No trainers found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Update a specific trainer
exports.updateTrainer = async (req, res) => {
    try {
      const trainerId = req.params.trainer_id;
      const { certification, experience } = req.body;
  
      if (!trainerId) {
        return res.status(400).json({ message: 'Trainer ID is required' });
      }
  
      const query = `
        UPDATE trainers
        SET certification = $1, experience = $2
        WHERE trainer_id = $3`;
  
      const values = [certification, experience, trainerId];
  
      await db.query(query, values);
  
      res.status(200).json({ message: `Trainer with ID ${trainerId} has been updated` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Get a specific trainer by ID
exports.getTrainerById = async (req, res) => {
    try {
      const trainerId = req.params.trainer_id;
  
      const query = `
        SELECT *
        FROM trainers inner join users on users.user_id = trainers.user_id
        WHERE trainer_id = $1`;
  
      const values = [trainerId];
  
      const result = await db.query(query, values);
  
      if (result.rows.length === 1) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Trainer not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };  
  
  
  
  
  