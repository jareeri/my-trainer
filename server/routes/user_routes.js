const { Router } = require("express");
const userController = require("../controllers/users_controller");

const authenticateToken = require("../middleware/authenticateToken");
const router = Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/profile/:userId", authenticateToken.authenticateToken, userController.profile);
router.get("/all_users", userController.all_users);
router.post("/creatuser", userController.creatuser);
router.put("/DeleteUser/:userId", userController.softDeleteUser);
router.put("/restoreUser/:userId", userController.restoreUser);
router.put("/updateUser/:userId", userController.updateUser);

module.exports = router;