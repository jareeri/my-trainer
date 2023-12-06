// routes/joinOurTeamRoutes.js

const express = require('express');
const router = express.Router();
const joinOurTeamController = require('../controllers/joinOurTeamController');
const verifyToken = require('../middleware/authenticateToken');

// Route to handle trainer registration requests
router.post('/join-our-team', verifyToken.authenticateToken, joinOurTeamController.requestToJoinTeam);

module.exports = router;
