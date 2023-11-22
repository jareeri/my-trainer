const { Router } = require("express");
const plansController = require("../controllers/plans_controller");
const verifyToken = require("../middleware/authenticateToken");
const router = Router();


router.post("/createPlan", verifyToken.authenticateToken, plansController.createPlan);
router.get("/getplanbyid/:planId", plansController.getplanbyid);
router.get("/getplansfortrainer/:trainerId", plansController.getplansfortrainer);
router.put("/updatePlanById/:planId", verifyToken.authenticateToken, plansController.updatePlanById);
router.put("/softDeletePlanById/:planId", verifyToken.authenticateToken, plansController.softDeletePlanById);
router.put("/restorePlanById/:planId", verifyToken.authenticateToken, plansController.restorePlanById);

module.exports = router;