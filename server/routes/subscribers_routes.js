const express = require("express");
const router = express.Router();
const SubscribersController = require("../controllers/subscribersController");
const verifyToken = require("../middleware/authenticateToken");

router.get('/subscribers/plan/:planId', SubscribersController.usersSubscribedToPlan);
router.get('/subscribers/trainer/:userId', SubscribersController.usersSubscribedToTrainer);
router.get('/subscribers/all', SubscribersController.allSubscribedUsers);

router.get('/subscribers/user', verifyToken.authenticateToken, SubscribersController.userSubscriptions);

// Route to get users subscribed to a plan by the logged-in trainer
router.get('/subscribers/plan/:planId/trainer', verifyToken.authenticateToken, SubscribersController.usersSubscribedToPlanByTrainer);


module.exports = router;
