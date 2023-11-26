// controllers/exerciseImagesController.js
const ExerciseImagesModel = require("../models/exerciseImagesModel");
const verifyToken = require("../middleware/authenticateToken");

exports.getAllExerciseImages = async (req, res) => {
  try {
    const exerciseImages = await ExerciseImagesModel.getAllExerciseImages();
    res.status(200).json(exerciseImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createExerciseImage = async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No GIF file provided" });
    }

    const exerciseImage = await ExerciseImagesModel.createExerciseImage(title, content, file);

    res.status(201).json({
      message: "Exercise image created successfully",
      exerciseImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateExerciseImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No GIF file provided" });
    }

    const updatedExerciseImage = await ExerciseImagesModel.updateExerciseImage(id, title, content, file);

    res.status(200).json({
      message: `Exercise image ${id} updated successfully`,
      updatedExerciseImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.softDeleteExerciseImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExerciseImage = await ExerciseImagesModel.softDeleteExerciseImage(id);

    res.status(200).json({
      message: `Exercise image ${id} soft deleted successfully`,
      deletedExerciseImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
