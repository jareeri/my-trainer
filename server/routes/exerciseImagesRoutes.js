// routes/exerciseImagesRoutes.js
const { Router } = require("express");
const exerciseImagesController = require("../controllers/exerciseImagesController");
const verifyToken = require("../middleware/authenticateToken");
const multer = require('multer');

const router = Router();
const upload = multer(); // Configure Multer for handling file uploads

router.get("/getAllExerciseImages", exerciseImagesController.getAllExerciseImages);
router.post("/createExerciseImage", verifyToken.authenticateToken, upload.single('image'), exerciseImagesController.createExerciseImage);
router.put("/updateExerciseImage/:id", verifyToken.authenticateToken, upload.single('image'), exerciseImagesController.updateExerciseImage);
router.put("/softDeleteExerciseImage/:id", verifyToken.authenticateToken, exerciseImagesController.softDeleteExerciseImage);

module.exports = router;
