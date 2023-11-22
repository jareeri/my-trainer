const { Router } = require("express");
const reviewController = require("../controllers/review_controller");
const verifyToken = require("../middleware/authenticateToken");
const router = Router();


router.post("/TrainerReview/:trainerId", verifyToken.authenticateToken, reviewController.postTrainerReview);
router.get("/getReviewsForTrainer/:trainerId", reviewController.getReviewsForTrainer);
router.put("/softDeleteReview/:reviewId", verifyToken.authenticateToken, reviewController.softDeleteReview);
router.put("/restoreReview/:reviewId", verifyToken.authenticateToken, reviewController.restoreReview);
router.put("/editReview/:reviewId", verifyToken.authenticateToken, reviewController.editReview);

module.exports = router;