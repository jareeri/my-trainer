const { Router } = require("express");
const articlesController = require("../controllers/articles_controller");
const verifyToken = require("../middleware/authenticateToken");
const multer = require('multer');

const router = Router();
const upload = multer(); // Configure Multer for handling file uploads

router.get("/getAllArticles", articlesController.getAllArticles);

router.get('/getArticleById/:id', articlesController.getArticleById);

router.get('/articles/for-trainer/:trainerId', articlesController.getArticlesForTrainer);
router.get('/articles/trainer', verifyToken.authenticateToken, articlesController.getTrainerArticles);

// Create a new article with an image
router.post("/createArticle", 
  verifyToken.authenticateToken, 
  upload.single('image'), // Handle a single image upload with the field name 'image'
  articlesController.createArticle
);

// Update a specific article with an image
router.put("/updateArticle/:id", 
  verifyToken.authenticateToken, 
  upload.single('image'), // Handle a single image upload with the field name 'image'
  articlesController.updateArticle
);

router.put("/softDeleteArticle/:id", verifyToken.authenticateToken, articlesController.softDeleteArticle);
router.put("/restoreArticle/:id", verifyToken.authenticateToken, articlesController.restoreArticle);

module.exports = router;