const { Router } = require("express");
const trainerController = require("../controllers/trainer_controller");
const verifyToken = require("../middleware/authenticateToken")
const router = Router();

router.post("/upgradeusertotrainer", trainerController.upgradeusertotrainer);
router.get("/getAllTrainers", trainerController.getAllTrainers);
router.put("/updateTrainer/:trainer_id", verifyToken.authenticateToken, trainerController.updateTrainer);
router.get("/getTrainerById/:trainer_id", trainerController.getTrainerById);
module.exports = router;