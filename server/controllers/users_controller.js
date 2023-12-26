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

const multer = require("multer");
const path = require("path");
const firebaseMiddleware = require("../middleware/fierbasemiddleware");
const bucket = require("../middleware/fierbasemiddleware");
const userModel = require("../models/usermodel");

//google login
exports.loginUsers = async (req, res) => {
  try {
    // console.log("object");
    const username = req.body.name;
    const { email } = req.body;
    // console.log(email);

    const existUser = await userModel.getUserByEmails(email);
    // console.log(`hhh`, existUser);
    console.log("142536", existUser);
    if (existUser) {
      try {
        const user = {
          name: existUser.username,
          // email: existUser.email,
          userRole: existUser.userrole,
          Id: existUser.user_id,
        };
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const token = jwt.sign({ user }, secretKey, { expiresIn: "6h" });

        return res.status(200).json({
          userRole: existUser.userrole,
          Id: existUser.user_id,
          logmessage: "User logged in successfully",
          token: token,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      const user1 = await userModel.createUsers({ username, email });
      console.log(user1);
      const user = {
        // trainerID:result.rows[0],
        name: user1.username,
        userRole: user1.userrole,
        Id: user1.user_id,
      };
      const secretKey = process.env.ACCESS_TOKEN_SECRET;
      const token = jwt.sign({ user1 }, secretKey, { expiresIn: "6h" });

      return res.status(200).json({
        userRole: user1.userrole,
        logmessage: "User added successfully",
        token: token,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// login endpoint
exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    // Validate request data
    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Query the database to retrieve the hashed password for the provided usernameOrEmail
    const query =
      "SELECT user_id, password, userrole FROM Users WHERE username = $1 Or email = $1";
    const values = [usernameOrEmail];

    const result = await db.query(query, values);

    if (result.rows.length === 1) {
      const user = {
        // trainerID:result.rows[0],
        Id: result.rows[0].user_id, // Include user ID in the user
        name: usernameOrEmail, // Include other user information if needed
        userRole: result.rows[0].userrole,
      };

      const hashedPassword = result.rows[0].password;

      // Verify the password ------------------------------------->
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, user is authenticated
        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({
          message: "Login successful",
          Id: result.rows[0].user_id,
          userRole: result.rows[0].userrole,
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

    res.status(201).json({
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
    // Get the user's ID from the JWT user
    const userIdFromToken = req.user.user.Id;

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
      "SELECT user_id, userrole, username, email, deleted  FROM users where deleted = false"
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
    const userId = req.user.user.Id; // Assuming the user ID is in the URL parameter
    const { username, password } = req.body; // Get updated user information from request body

    // Hash the updated password before updating it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with 10 salt rounds

    const query = `
      UPDATE users
      SET  username = $1, password = $2
      WHERE user_id = $3`;

    const values = [username, hashedPassword, userId];

    await db.query(query, values);

    res
      .status(200)
      .json({ message: `User with ID ${userId} has been updated` });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

exports.createUserProfile = async (req, res) => {
  try {
    const userId = req.user.user.Id; // Assuming the user ID is in the URL parameter
    const { bio, location, website } = req.body;
    const file = req.file;

    // Check if a profile already exists for the user
    const existingProfileQuery = `
      SELECT * FROM profile_user WHERE user_id = $1`;

    const existingProfileValues = [userId];

    const existingProfileResult = await db.query(
      existingProfileQuery,
      existingProfileValues
    );

    if (existingProfileResult.rows.length > 0) {
      // If a profile already exists, update it instead of creating a new one
      const existingProfile = existingProfileResult.rows[0];

      const fileName = `${Date.now()}_${file.originalname}`;

      try {
        const fileUrl = await firebaseMiddleware.uploadFileToFirebase(
          file,
          fileName
        );

        const updateQuery = `
          UPDATE profile_user
          SET bio = $1, location = $2, website = $3, profileimage = $4
          WHERE user_id = $5
          RETURNING *`;

        const updateValues = [bio, location, website, fileUrl, userId];

        const updatedProfileResult = await db.query(updateQuery, updateValues);

        res.status(200).json({
          message: "User updated his profile",
          userprofile: updatedProfileResult.rows[0],
        });
      } catch (error) {
        console.error("Error uploading file to Firebase:", error);
        res.status(500).json({ error: "Error updating user profile" });
      }
    } else {
      // If no profile exists, create a new one
      const fileName = `${Date.now()}_${file.originalname}`;

      try {
        const fileUrl = await firebaseMiddleware.uploadFileToFirebase(
          file,
          fileName
        );

        const insertQuery = `
          INSERT INTO profile_user
          (bio, location, website, profileimage, user_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *`;

        const insertValues = [bio, location, website, fileUrl, userId];

        const result = await db.query(insertQuery, insertValues);

        res.status(201).json({
          message: "User created his profile",
          userprofile: result.rows[0],
        });
      } catch (error) {
        console.error("Error uploading file to Firebase:", error);
        res.status(500).json({ error: "Error updating user profile" });
      }
    }
  } catch (error) {
    console.error("Error in createUserProfile:", error);
    res.status(500).json({ error: "Error updating user profile" });
  }
};

exports.getUserProfiles = async (req, res) => {
  try {
    const userId = req.user.user.Id; // Assuming the user ID is in the URL parameter

    const query = `
      SELECT users.user_id, users.username, users.email, users.userrole, users.created_at,  profile_user.bio, profile_user.location, profile_user.website, profile_user.profileimage
      FROM users
      LEFT JOIN profile_user ON users.user_id = profile_user.user_id
      WHERE users.user_id = $1`;

    const values = [userId];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "User profile not found",
        userProfile: null,
      });
    }

    const userProfile = result.rows[0];

    res.status(200).json({
      message: "User profile retrieved successfully",
      userProfile: userProfile,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ error: "Error getting user profile" });
  }
};

exports.updateUserProfileAndUser = async (req, res) => {
  try {
    const userId = req.user.user.Id;
    const { bio, location, website, username } = req.body;
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

        // Commit the transaction
        await db.query("COMMIT");

        res.status(200).json({
          message: "User updated his profile and username",
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

        // Commit the transaction
        await db.query("COMMIT");

        res.status(200).json({
          message: "New user profile and username created successfully",
          userprofile: insertedProfileResult.rows[0],
        });
      }
    } catch (error) {
      // Rollback the transaction in case of an error
      await db.query("ROLLBACK");
      console.error("Error updating user profile and username:", error);
      res
        .status(500)
        .json({ error: "Error updating user profile and username" });
    }
  } catch (error) {
    console.error("Error in updateUserProfileAndUser:", error);
    res.status(500).json({ error: "Error updating user profile and username" });
  }
};
