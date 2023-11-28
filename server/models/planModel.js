// planModel.js

const db = require("../models/db");
const firebaseMiddleware = require("../middleware/fierbasemiddleware");

const PlanModel = {
  createPlan: async (
    trainerId,
    name,
    description,
    price,
    features,
    duration,
    category,
    image
  ) => {
    try {
      const existingPlan = await db.query(
        "SELECT * FROM plans WHERE name = $1 AND category = $2 AND user_id = $3",
        [name, category, trainerId]
      );
      if (existingPlan.rows.length > 0) {
        throw new Error(
          "A plan with the same name and category already exists for this trainer"
        );
      }

      const fileName = `${Date.now()}_${image.originalname}`;
      const fileUrl = await firebaseMiddleware.uploadFileToFirebase(
        image,
        fileName
      );

      const query = `
        INSERT INTO plans (user_id, name, description, price, features, duration, image, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;

      const values = [
        trainerId,
        name,
        description,
        price,
        features,
        duration,
        fileUrl,
        category,
      ];

      const result = await db.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw new Error("Failed to create plan");
      }
    } catch (error) {
      throw error;
    }
  },

  updatePlanById: async (
    trainerId,
    planId,
    name,
    description,
    price,
    features,
    duration,
    category,
    image
  ) => {
    try {
      const existingPlan = await db.query(
        "SELECT * FROM plans WHERE name = $1 AND category = $2 AND user_id = $3 AND id != $4",
        [name, category, trainerId, planId]
      );
      if (existingPlan.rows.length > 0) {
        throw new Error(
          "A plan with the same name and category already exists for this trainer"
        );
      }

      const fileName = `${Date.now()}_${image.originalname}`;
      const fileUrl = await firebaseMiddleware.uploadFileToFirebase(
        image,
        fileName
      );

      const updateQuery = `
        UPDATE plans
        SET name = $1, description = $2, price = $3, features = $4, duration = $5, image = $6, category = $7
        WHERE id = $8 and user_id = $9
        RETURNING *`;

      const values = [
        name,
        description,
        price,
        features,
        duration,
        fileUrl,
        category,
        planId,
        trainerId,
      ];

      const result = await db.query(updateQuery, values);

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw new Error("Plan not found");
      }
    } catch (error) {
      throw error;
    }
  },

  getPlanById: async (planId) => {
    try {
      const query = "SELECT * FROM plans WHERE id = $1";
      const values = [planId];
      const result = await db.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw new Error("Plan not found");
      }
    } catch (error) {
      throw error;
    }
  },

  getPlansForTrainer: async (trainerId) => {
    try {
      const query = "SELECT * FROM plans WHERE user_id = $1";
      const values = [trainerId];
      const result = await db.query(query, values);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  softDeletePlanById: async (planId, trainerId) => {
    try {
      const checkQuery =
        "SELECT deleted FROM plans WHERE id = $1 AND user_id = $2";
      const checkValues = [planId, trainerId];
      const checkResult = await db.query(checkQuery, checkValues);

      if (checkResult.rows.length === 0) {
        throw new Error("Plan not found");
      }

      if (checkResult.rows[0].deleted) {
        throw new Error("Plan is already soft-deleted");
      }

      const updateQuery = `
        UPDATE plans
        SET deleted = true
        WHERE id = $1 AND user_id = $2`;

      const values = [planId, trainerId];

      const result = await db.query(updateQuery, values);

      if (result.rowCount > 0) {
        return { message: `Plan with ID ${planId} has been soft-deleted` };
      } else {
        throw new Error("Plan not found");
      }
    } catch (error) {
      throw error;
    }
  },

  restorePlanById: async (planId, trainerId) => {
    try {
      const checkQuery =
        "SELECT deleted FROM plans WHERE id = $1 AND user_id = $2";
      const checkValues = [planId, trainerId];
      const checkResult = await db.query(checkQuery, checkValues);

      if (checkResult.rows.length === 0) {
        throw new Error("Plan not found");
      }

      if (!checkResult.rows[0].deleted) {
        throw new Error("Plan is not soft-deleted");
      }

      const updateQuery = `
        UPDATE plans
        SET deleted = false
        WHERE id = $1 AND user_id = $2`;

      const values = [planId, trainerId];

      const result = await db.query(updateQuery, values);

      if (result.rowCount > 0) {
        return { message: `Plan with ID ${planId} has been restored` };
      } else {
        throw new Error("Plan not found");
      }
    } catch (error) {
      throw error;
    }
  },
  // Get distinct categories from plans
  getAllDistinctCategories: async () => {
    try {
      const query = "SELECT DISTINCT category FROM plans";
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  // Get plans by category (using LIKE)
  getPlansByCategory: async (category) => {
    try {
      const query = "SELECT * FROM plans WHERE category LIKE $1";
      const values = [`%${category}%`]; // Use % to match any characters before and after the provided category
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};


// // Get plans by category
// exports.getPlansByCategory = async (category) => {
//   try {
//     const query = "SELECT * FROM plans WHERE category = $1";
//     const values = [category];
//     const result = await db.query(query, values);
//     return result.rows;
//   } catch (error) {
//     throw error;
//   }
// };

module.exports = PlanModel;
