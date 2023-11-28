const nutritionModel = require("../models/nutritionModel");

// Create Nutrition Data
exports.createNutritionData = async (req, res) => {
  try {
    const trainer_id = req.user.user.Id;
    const user_id = req.params.user_id;
    const { nutrient, amount, daily_value } = req.body;
    // console.log(trainer_id, user_id, nutrient, amount, daily_value);
    const result = await nutritionModel.createNutritionData1(trainer_id, user_id, nutrient, amount, daily_value);
    // console.log(result);
    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "Nutrition data created successfully",
        nutritionData: result.rows[0],
      });
    } else {
      return res.status(500).json({ message: "Failed to create nutrition data" });
    }
  } catch (error) {
    console.error("Error creating nutrition data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Nutrition Data by ID
exports.getNutritionDataById = async (req, res) => {
  try {
    const nutritionId = req.params.nutritionId;
    console.log(nutritionId);
    const result = await nutritionModel.getNutritionDataById(nutritionId);
    console.log(result );
    if (result !== 0) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Nutrition data not found" });
    }
  } catch (error) {
    console.error("Error fetching nutrition data by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Nutrition Data for a User by User ID
exports.getNutritionDataForUser = async (req, res) => {
  try {
    // console.log(req.user);
    const userId = req.user.user.Id;
    // const trainer_id = req.user.user.Id;
    // const user_id = req.params.user_id; 
    // console.log(userId);
    const result = await nutritionModel.getNutritionDataForUser(userId);
    
    if (result!== 0) {
      res.json(result);
    } else {
      res.status(404).json({ message: "No nutrition data found for this user" });
    }
  } catch (error) {
    console.error("Error fetching nutrition data for user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Nutrition Data for a User by User ID
exports.getNutritionDataForUserByTrainerId = async (req, res) => {
    try {
      // console.log(req.user);
      const trainerId = req.user.user.Id;
      const userId = req.params.userId; 
      console.log(userId,trainerId);
      // const trainer_id = req.user.user.Id;
      // const user_id = req.params.user_id; 
    //   console.log(trainerId);
      const result = await nutritionModel.getNutritionDataForUserByTrainerId(trainerId, userId);
      
      if (result!== 0) {
        res.json(result);
      } else {
        res.status(404).json({ message: "No nutrition data found for this user" });
      }
    } catch (error) {
      console.error("Error fetching nutrition data for user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

// Update Nutrition Data by ID
exports.updateNutritionDataById = async (req, res) => {
  try {
    const nutritionId = req.params.nutritionId;
    const user_Id= req.user.user.Id;
    const { nutrient, amount, daily_value } = req.body;

    const result = await nutritionModel.updateNutritionDataById(nutritionId, nutrient, amount, daily_value, user_Id);

    if (result.rows.length > 0) {
      res.status(200).json({
        message: `Nutrition data with ID ${nutritionId} has been updated`,
        nutritionData: result.rows[0],
      });
    } else {
      res.status(404).json({ message: "Nutrition data not found" });
    }
  } catch (error) {
    console.error("Error updating nutrition data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Soft delete Nutrition Data by ID
exports.softDeleteNutritionDataById = async (req, res) => {
  try {
    const nutritionId = req.params.nutritionId;
    const user_Id= req.user.user.Id;
    // console.log(nutritionId);
    const result = await nutritionModel.softDeleteNutritionDataById(nutritionId, user_Id);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: `Nutrition data with ID ${nutritionId} has been soft-deleted`,
      });
    } else {
      res.status(404).json({ message: "Nutrition data not found" });
    }
  } catch (error) {
    console.error("Error soft-deleting nutrition data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Restore a soft-deleted Nutrition Data by ID
exports.restoreNutritionDataById = async (req, res) => {
  try {
    const nutritionId = req.params.nutritionId;
    const user_Id= req.user.user.Id;
    const result = await nutritionModel.restoreNutritionDataById(nutritionId, user_Id);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: `Nutrition data with ID ${nutritionId} has been restored`,
      });
    } else {
      res.status(404).json({ message: "Nutrition data not found" });
    }
  } catch (error) {
    console.error("Error restoring nutrition data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
