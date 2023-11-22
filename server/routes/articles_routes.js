const { Router } = require("express");
const articlesController = require("../controllers/articles_controller");
const verifyToken = require("../middleware/authenticateToken")

const router = Router();

router.get("/getAllArticles", articlesController.getAllArticles);
router.post("/createArticle", verifyToken.authenticateToken, articlesController.createArticle);
router.put("/updateArticle/:id", verifyToken.authenticateToken, articlesController.updateArticle);
router.put("/softDeleteArticle/:id", verifyToken.authenticateToken, articlesController.softDeleteArticle);
router.put("/restoreArticle/:id", verifyToken.authenticateToken, articlesController.restoreArticle);

module.exports = router;