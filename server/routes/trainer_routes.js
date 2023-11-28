const { Router } = require("express");
const trainerController = require("../controllers/trainer_controller");
const verifyToken = require("../middleware/authenticateToken");
const router = Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upgradeusertotrainer", trainerController.upgradeusertotrainer);
router.get("/getAllTrainers", trainerController.getAllTrainers);
router.put(
  "/updateTrainer/:trainer_id",
  verifyToken.authenticateToken,
  trainerController.updateTrainer
);
router.get("/getTrainerById/:trainer_id", trainerController.getTrainerById);
// Update user profile, username, and trainer information
router.put(
  "/updateUserProfileAndTrainer",
  upload.single("image"),
  verifyToken.authenticateToken,
  trainerController.updateUserProfileAndTrainer
);

module.exports = router;
