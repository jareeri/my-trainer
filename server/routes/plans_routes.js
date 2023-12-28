const { Router } = require("express");
const plansController = require("../controllers/plans_controller");
const verifyToken = require("../middleware/authenticateToken");
const router = Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "/plans",
  verifyToken.authenticateToken,
  plansController.getAllPlans
);

router.get("/plans/count", plansController.getCountOfAllPlans);

router.post(
  "/createPlan",
  upload.single("image"),
  verifyToken.authenticateToken,
  plansController.createPlan
);
router.get("/getplanbyid/:planId", plansController.getplanbyid);
router.get(
  "/getplansfortrainer/:trainerId",
  plansController.getplansfortrainer
);
router.put(
  "/updatePlanById/:planId",
  upload.single("image"),
  verifyToken.authenticateToken,
  plansController.updatePlanById
);
router.put(
  "/softDeletePlanById/:planId",
  verifyToken.authenticateToken,
  plansController.softDeletePlanById
);
router.put(
  "/restorePlanById/:planId",
  verifyToken.authenticateToken,
  plansController.restorePlanById
);

router.get("/plans/category/:category", plansController.getPlansByCategory);
router.get("/plans/getAllCategories", plansController.getAllCategories);

router.delete('/plans/:planId',  verifyToken.authenticateToken,
plansController.softDeletePlan);

module.exports = router;
