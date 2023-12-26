// controllers/categoryController.js
const categoryModel = require('../models/categoryModel');

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await categoryModel.getCategoryById(categoryId);

    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createCategory = async (req, res) => {
  const { category_name } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  try {
    const newCategory = await categoryModel.createCategory(category_name, file);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const categoryData = req.body;
  const file = req.file;

  try {
    const updatedCategory = await categoryModel.updateCategory(categoryId, categoryData, file);

    if (updatedCategory) {
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const result = await categoryModel.deleteCategory(categoryId);

    if (result) {
      res.status(200).json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
