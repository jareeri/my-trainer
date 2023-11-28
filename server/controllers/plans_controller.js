// Import the PlanModel
const PlanModel = require("../models/planModel");

// Route to create a new plan
exports.createPlan = async (req, res) => {
  try {
    const trainerId = req.user.user.Id;

    // Check if required fields are missing
    const { name, description, price, features, duration, category } = req.body;
    const image = req.file;

    if (
      !trainerId ||
      !name ||
      !description ||
      !price ||
      !features ||
      !duration ||
      !image ||
      !category
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Use the PlanModel function to create a plan
    const result = await PlanModel.createPlan(
      trainerId,
      name,
      description,
      price,
      features,
      duration,
      category,
      image
    );

    // Respond with the created plan
    return res
      .status(201)
      .json({ message: "Plan created successfully", plan: result });
  } catch (error) {
    console.error("Error creating plan:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a plan by ID
exports.updatePlanById = async (req, res) => {
  try {
    const trainerId = req.user.user.Id;
    const planId = req.params.planId;
    const { name, description, price, features, duration, category } = req.body;
    const image = req.file;

    if (
      !name ||
      !description ||
      !price ||
      !features ||
      !duration ||
      !image ||
      !category
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Use the PlanModel function to update a plan by ID
    const result = await PlanModel.updatePlanById(
      trainerId,
      planId,
      name,
      description,
      price,
      features,
      duration,
      category,
      image
    );

    // Respond with the updated plan
    return res.status(200).json({
      message: `Plan with ID ${planId} has been updated`,
      plan: result,
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a plan by ID
exports.getplanbyid = async (req, res) => {
  try {
    const planId = req.params.planId;

    // Use the PlanModel function to get a plan by ID
    const result = await PlanModel.getPlanById(planId);

    // Respond with the retrieved plan
    return res.json(result);
  } catch (error) {
    console.error("Error fetching plan by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all plans for a trainer by user_id
exports.getplansfortrainer = async (req, res) => {
  try {
    const trainerId = req.params.trainerId;

    // Use the PlanModel function to get all plans for a trainer
    const result = await PlanModel.getPlansForTrainer(trainerId);

    // Respond with the retrieved plans
    return res.json(result);
  } catch (error) {
    console.error("Error fetching plans for trainer:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Soft delete a plan by ID
exports.softDeletePlanById = async (req, res) => {
  try {
    const planId = req.params.planId;
    const user_id = req.user.user.Id;

    // Use the PlanModel function to soft-delete a plan by ID
    const result = await PlanModel.softDeletePlanById(planId, user_id);

    // Respond with the result message
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error soft-deleting plan:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Restore a soft-deleted plan by ID
exports.restorePlanById = async (req, res) => {
  try {
    const planId = req.params.planId;
    const user_id = req.user.user.Id;

    // Use the PlanModel function to restore a soft-deleted plan by ID
    const result = await PlanModel.restorePlanById(planId, user_id);

    // Respond with the result message
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error restoring plan:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    // Use the PlanModel function to get distinct categories from plans
    const categories = await PlanModel.getAllDistinctCategories();

    // Respond with the retrieved categories
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get plans by category
exports.getPlansByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Use the PlanModel function to get plans by category
    const plans = await PlanModel.getPlansByCategory(category);

    // Respond with the retrieved plans
    return res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching plans by category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
