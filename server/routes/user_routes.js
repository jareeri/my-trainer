const { Router } = require("express");
const userController = require("../controllers/users_controller");

const verifyToken = require("../middleware/authenticateToken");
const router = Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get(
  "/profile/:userId",
  verifyToken.authenticateToken,
  userController.profile
);
router.get("/all_users", userController.all_users);
router.post("/creatuser", userController.creatuser);
router.put("/DeleteUser/:userId", userController.softDeleteUser);
router.put("/restoreUser/:userId", userController.restoreUser);
router.put(
  "/updateUser",
  verifyToken.authenticateToken,
  userController.updateUser
);

router.get(
  "/user-profiles",
  verifyToken.authenticateToken,
  userController.getUserProfiles
);
router.post(
  "/UserProfile",
  upload.single("image"),
  verifyToken.authenticateToken,
  userController.createUserProfile
);
// router.put("/updateUserProfile", upload.single('profileimage'), verifyToken.authenticateToken, userController.updateUserProfile);
// Update profile_user and users tables
router.put(
  "/updateUserProfileAndUser",
  upload.single("image"),
  verifyToken.authenticateToken,
  userController.updateUserProfileAndUser
);

// router.put('/upload-video', authenticateUser, upload.single('video'), videoController.uploadVideo);

module.exports = router;
