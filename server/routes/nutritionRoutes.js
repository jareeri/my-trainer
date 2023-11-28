const express = require("express");
const router = express.Router();
const nutritionController = require("../controllers/nutritionController");
const verifyToken = require("../middleware/authenticateToken");


// Create Nutrition Data
router.post("/nutrition/:user_id", verifyToken.authenticateToken, nutritionController.createNutritionData);

// Get Nutrition Data by ID
router.get("/nutrition/:nutritionId", verifyToken.authenticateToken, nutritionController.getNutritionDataById);

// Get Nutrition Data for a User by User ID
router.get("/getNutritionDataForUser", verifyToken.authenticateToken, nutritionController.getNutritionDataForUser);

// Get Nutrition Data for a User by trainer ID
router.get("/getNutritionDataForUserByTrainerId/:userId", verifyToken.authenticateToken, nutritionController.getNutritionDataForUserByTrainerId);

// Update Nutrition Data by ID
router.put("/nutrition/:nutritionId", verifyToken.authenticateToken, nutritionController.updateNutritionDataById);

// Soft delete Nutrition Data by ID
router.delete("/nutrition/:nutritionId", verifyToken.authenticateToken, nutritionController.softDeleteNutritionDataById);

// Restore a soft-deleted Nutrition Data by ID
router.put("/nutrition/restore/:nutritionId", verifyToken.authenticateToken, nutritionController.restoreNutritionDataById);

module.exports = router;
