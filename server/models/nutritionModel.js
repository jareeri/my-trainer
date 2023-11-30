const db = require("./db");

// Create Nutrition Data
exports.createNutritionData1 = async (trainer_id, user_id, nutrient, amount, daily_value) => {
    console.log(trainer_id, user_id, nutrient, amount, daily_value);

  const query = `
    INSERT INTO nutrition_data (trainer_id, user_id, nutrient, amount, daily_value)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;

  const values = [trainer_id, user_id, nutrient, amount, daily_value];

  const result = await db.query(query, values);
  return result;
};

// Get Nutrition Data by ID
exports.getNutritionDataById = async (nutritionId) => {
  const query = "SELECT * FROM nutrition_data WHERE id = $1";
  const values = [nutritionId];
//   console.log(values);

  const result = await db.query(query, values);
//   console.log(result.rows[0]);
  return result.rows[0];
};

// Get Nutrition Data for a User by User ID
exports.getNutritionDataForUser = async (userId) => {
  const query = "SELECT * FROM nutrition_data WHERE user_id = $1 and deleted = false";
  const values = [parseInt(userId)];

  const result = await db.query(query, values);
  return result.rows;
};

// Get Nutrition Data for a User by trainer_id ID
exports.getNutritionDataForUserByTrainerId = async (trainerId, userId) => {
    const query = "SELECT * FROM nutrition_data WHERE trainer_id = $1 and user_id = $2";
    const values = [trainerId, userId];
  
    const result = await db.query(query, values);
    return result.rows;
  };

// Update Nutrition Data by ID
exports.updateNutritionDataById = async (nutritionId, nutrient, amount, daily_value, user_Id) => {
  const updateQuery = `
    UPDATE nutrition_data
    SET nutrient = $1, amount = $2, daily_value = $3, updated_at = NOW()
    WHERE id = $4 and trainer_Id= $5
    RETURNING *`;

  const updateValues = [nutrient, amount, daily_value, nutritionId, user_Id];

  const result = await db.query(updateQuery, updateValues);
  return result;
};


// Soft delete Nutrition Data by ID
exports.softDeleteNutritionDataById = async (nutritionId, user_Id) => {
  const checkQuery = 'SELECT deleted FROM nutrition_data WHERE id = $1 and user_id = $2';
  const checkValues = [nutritionId, user_Id];

  const checkResult = await db.query(checkQuery, checkValues);
    // console.log(checkResult,checkQuery);
  if (checkResult.rows.length === 0 || checkResult.rows[0].deleted) {
    return false; // Nutrition data not found or already soft-deleted
  }

  const updateQuery = `
    UPDATE nutrition_data
    SET deleted = true
    WHERE id = $1
    RETURNING *`;

  const updateValues = [nutritionId];

  const result = await db.query(updateQuery, updateValues);
  return result;
};

// Restore a soft-deleted Nutrition Data by ID
exports.restoreNutritionDataById = async (nutritionId, user_Id) => {
  const checkQuery = 'SELECT deleted FROM nutrition_data WHERE id = $1 and user_id = $2';
  const checkValues = [nutritionId, user_Id];

  const checkResult = await db.query(checkQuery, checkValues);

  if (checkResult.rows.length === 0 || !checkResult.rows[0].deleted) {
    return false; // Nutrition data not found or not soft-deleted
  }

  const updateQuery = `
    UPDATE nutrition_data
    SET deleted = false
    WHERE id = $1
    RETURNING *`;

  const updateValues = [nutritionId];

  const result = await db.query(updateQuery, updateValues);
  return result;
};
