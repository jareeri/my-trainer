const { Router } = require("express");
const articlesController = require("../controllers/articles_controller");

const router = Router();

router.get("/getAllArticles", articlesController.getAllArticles);
router.post("/createArticle", articlesController.createArticle);
router.put("/updateArticle/:id", articlesController.updateArticle);
router.put("/softDeleteArticle/:id", articlesController.softDeleteArticle);
router.put("/restoreArticle/:id", articlesController.restoreArticle);

module.exports = router;