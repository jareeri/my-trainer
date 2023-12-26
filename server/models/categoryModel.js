// models/categoryModel.js
const db = require("../models/db");
const firebaseMiddleware = require("../middleware/fierbasemiddleware");

const getAllCategories = async () => {
  const query = "SELECT * FROM categories";
  const result = await db.query(query);
  return result.rows;
};

const getCategoryById = async (categoryId) => {
  const query = "SELECT * FROM categories WHERE category_id = $1";
  const values = [categoryId];
  const result = await db.query(query, values);

  if (result.rows.length === 1) {
    return result.rows[0];
  } else {
    return null;
  }
};

const createCategory = async (category_name, file) => {
  const fileName = `${Date.now()}_${file.originalname}`;
  const imgUrl = await firebaseMiddleware.uploadFileToFirebase(file, fileName);
  const query =
    "INSERT INTO categories(category_name, category_image_url) VALUES ($1, $2) RETURNING *";
  const values = [category_name, imgUrl];
  const result = await db.query(query, values);
  return result.rows[0];
};

const updateCategory = async (categoryId, categoryData, file) => {
  const { category_name, category_image_url } = categoryData;
  let query;
  let values;

  if (file) {
    // If category_image_url is provided, handle the file upload using Firebase middleware
    const fileName = `${Date.now()}_${file.originalname}`;
    const imgUrl = await firebaseMiddleware.uploadFileToFirebase(file, fileName);

    query = 'UPDATE categories SET category_name = $1, category_image_url = $2 WHERE category_id = $3 RETURNING *';
    values = [category_name || null, imgUrl, categoryId];
  } else {
    // If category_image_url is not provided, only update the category_name
    query = 'UPDATE categories SET category_name = $1 WHERE category_id = $2 RETURNING *';
    values = [category_name || null, categoryId];
  }

  const result = await db.query(query, values);

  if (result.rows.length === 1) {
    return result.rows[0];
  } else {
    return null;
  }
};


const deleteCategory = async (categoryId) => {
  const query = "DELETE FROM categories WHERE category_id = $1 RETURNING *";
  const values = [categoryId];
  const result = await db.query(query, values);

  if (result.rows.length === 1) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
