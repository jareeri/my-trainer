// models/exerciseImagesModel.js
const db = require("../models/db");
const firebaseMiddleware = require("../middleware/fierbasemiddleware");

const ExerciseImagesModel = {
  getAllExerciseImages: async () => {
    try {
      const query = "SELECT * FROM exercise_images WHERE deleted = false";
      const result = await db.query(query);

      return result.rows;
    } catch (error) {
      console.error("Error fetching exercise images:", error);
      throw new Error("Error fetching exercise images");
    }
  },

  createExerciseImage: async (title, content, file) => {
    try {
      const fileName = `${Date.now()}_${file.originalname}`;
      const gifUrl = await firebaseMiddleware.uploadFileToFirebase(file, fileName);

      const query = `
        INSERT INTO exercise_images (title, content, gif_url)
        VALUES ($1, $2, $3)
        RETURNING *`;

      const values = [title, content, gifUrl];

      const result = await db.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Error creating exercise image:", error);
      throw new Error("Error creating exercise image");
    }
  },

  updateExerciseImage: async (id, title, content, file) => {
    try {
      const fileName = `${Date.now()}_${file.originalname}`;
      const gifUrl = await firebaseMiddleware.uploadFileToFirebase(file, fileName);

      const query = `
        UPDATE exercise_images
        SET title = $1, content = $2, gif_url = $3
        WHERE id = $4 AND deleted = false
        RETURNING *`;

      const values = [title, content, gifUrl, id];

      const result = await db.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Error updating exercise image:", error);
      throw new Error("Error updating exercise image");
    }
  },

  softDeleteExerciseImage: async (id) => {
    try {
      const query = `
        UPDATE exercise_images
        SET deleted = true
        WHERE id = $1 AND deleted = false
        RETURNING *`;

      const values = [id];

      const result = await db.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Error soft deleting exercise image:", error);
      throw new Error("Error soft deleting exercise image");
    }
  },
};

module.exports = ExerciseImagesModel;
