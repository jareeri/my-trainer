const { Router } = require("express");
const trainerController = require("../controllers/trainer_controller");

const router = Router();

router.post("/upgradeusertotrainer", trainerController.upgradeusertotrainer);
router.get("/getAllTrainers", trainerController.getAllTrainers);
router.put("/updateTrainer/:trainer_id", trainerController.updateTrainer);
router.get("/getTrainerById/:trainer_id", trainerController.getTrainerById);
module.exports = router;