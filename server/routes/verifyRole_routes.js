const { Router } = require("express");
const verifyToken = require("../middleware/authenticateToken");

const router = Router();

router.get("/api/admin-only", verifyToken.verifyRole("admin"), (req, res) => {
  res.json({ success: true, message: "Admin access granted" });
});

// Example endpoint that requires 'trainer' access
router.get(
  "/api/trainer-only",
  verifyToken.verifyRole("trainer"),
  (req, res) => {
    res.json({ success: true, message: "Trainer access granted" });
  }
);

module.exports = router;
