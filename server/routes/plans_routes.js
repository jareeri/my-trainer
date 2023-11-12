const { Router } = require("express");
const plansController = require("../controllers/plans_controller");

const router = Router();


router.post("/createPlan", plansController.createPlan);
router.get("/getplanbyid/:planId", plansController.getplanbyid);
router.get("/getplansfortrainer/:trainerId", plansController.getplansfortrainer);
router.put("/updatePlanById/:planId", plansController.updatePlanById);
router.put("/softDeletePlanById/:planId", plansController.softDeletePlanById);
router.put("/restorePlanById/:planId", plansController.restorePlanById);

module.exports = router;