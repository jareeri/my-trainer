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

// login endpoint
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Validate request data
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Query the database to retrieve the hashed password for the provided username
    const query = "SELECT user_id, password FROM Users WHERE username = $1";
    const values = [username];

    const result = await db.query(query, values);

    if (result.rows.length === 1) {
      const user = {
        Id: result.rows[0].user_id, // Include user ID in the payload
        name: username, // Include other user information if needed
      };

      const hashedPassword = result.rows[0].password;

      // Verify the password ------------------------------------->
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, user is authenticated
        const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({
          message: "Login successful",
          Id: result.rows[0].user_id,
          accessToken: accessToken,
        });
      } else {
        // Password is incorrect
        res.status(401).json({ message: "Invalid username or password" });
      }
    } else {
      // No matching user found
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  register endpoint
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate the request data here
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    // Hash the password
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if the user already exists in the database
    const userExistsQuery =
      "SELECT * FROM Users WHERE email = $1 OR username = $2";
    const userExistsValues = [email, username];

    const userExistsResult = await db.query(userExistsQuery, userExistsValues);

    if (userExistsResult.rows.length > 0) {
      return res.status(409).json({ message: "User already exists." });
    }

    // If the data is valid and the user doesn't exist, proceed with user registration.
    const query = `
          INSERT INTO Users (username, email, password) 
          VALUES ($1, $2, $3)
          RETURNING user_id`;

    const values = [username, email, hashedPassword]; // Store the hashed password

    const result = await db.query(query, values);

    res
      .status(201)
      .json({
        message: "User registered successfully",
        Id: result.rows[0].user_id,
      });
  } catch (error) {
    // Insert the user data into the database.
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Profile endpoint
exports.profile = async (req, res) => {
  try {
    // Get the user's ID from the JWT payload
    const userIdFromToken = req.user.id;

    const userIdFromRequest = req.params.userId; // Assuming the user's ID is in the request parameters

    // Check if the user making the request matches the user associated with the profile
    if (userIdFromToken == userIdFromRequest) {
      const query =
        "SELECT user_id, username, email, userrole, created_at FROM users WHERE user_id = $1";
      const values = [userIdFromRequest];

      const result = await db.query(query, values);
      if (result.rows.length == 1) {
        const userData = result.rows[0];
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(403).json({
        message: "Access denied. You can only access your own profile.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Retrieve a list of all users
exports.all_users = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT userrole, username, email, deleted  FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Create a new user account
exports.creatuser = async (req, res) => {
  try {
    const { userrole, username, email, password } = req.body;

    // Specify the table name in the SQL query
    const query = `
        INSERT INTO users (userrole, username, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id`;

    const values = [userrole, username, email, password];

    const result = await db.query(query, values);

    res.status(201).json({
      message: "User created successfully",
      user_Id: result.rows[0].user_id,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

// Soft delete a user account
exports.softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is passed as a URL parameter

    // Soft delete user logic (assuming 'deleted' is a column that marks users as deleted)
    const query = `
      UPDATE users
      SET deleted = true
      WHERE user_id = $1`;

    const values = [userId];

    await db.query(query, values);

    res
      .status(200)
      .json({ message: `User with ID ${userId} has been soft deleted` });
  } catch (error) {
    res.status(500).json({ error: "Error while soft deleting user" });
  }
};

// Restore a soft-deleted user account
exports.restoreUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is passed as a URL parameter

    // Restore user logic (assuming 'deleted' is a column that marks users as deleted)
    const query = `
      UPDATE users
      SET deleted = false
      WHERE user_id = $1`;

    const values = [userId];

    await db.query(query, values);

    res
      .status(200)
      .json({ message: `User with ID ${userId} has been restored` });
  } catch (error) {
    res.status(500).json({ error: "Error while restoring user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is in the URL parameter
    const { userrole, username, password } = req.body; // Get updated user information from request body

    // Hash the updated password before updating it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with 10 salt rounds

    const query = `
      UPDATE users
      SET userrole = $1, username = $2, password = $3
      WHERE user_id = $4`;

    const values = [userrole, username, hashedPassword, userId];

    await db.query(query, values);

    res
      .status(200)
      .json({ message: `User with ID ${userId} has been updated` });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};
