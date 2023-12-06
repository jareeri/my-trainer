// routes/workoutRoutes.js

const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController'); // Adjust the path accordingly
const verifyToken = require("../middleware/authenticateToken");

router.get('/', verifyToken.authenticateToken, workoutController.getAllWorkouts);
router.get('/:id', verifyToken.authenticateToken, workoutController.getWorkoutById);
router.post('/:userId', verifyToken.authenticateToken, workoutController.createWorkout);
router.put('/:id/:userId', verifyToken.authenticateToken, workoutController.updateWorkout);
router.delete('/:id', verifyToken.authenticateToken, workoutController.deleteWorkout);

router.get('/forTrainerAndUser/:userId',  verifyToken.authenticateToken, workoutController.getWorkoutsForTrainerAndUser);
router.get('/api/User',  verifyToken.authenticateToken, workoutController.getWorkoutsForUser);


module.exports = router;
