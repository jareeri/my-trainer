const subscribersModel = require("../models/subscribersModel");

class SubscribersController {
  //   async subscribeByUser(req, res) {
  //     try {
  //       const { planId } = req.body;
  //       const userId = req.user.user_id;

  //       // You may want to check if the user is not already subscribed to the plan before proceeding
  //       // ...

  //       await subscribersModel.subscribeByUser(userId, planId);

  //       res.json({ success: true, message: "User subscribed successfully" });
  //     } catch (error) {
  //       console.error("Error subscribing user:", error);
  //       res.status(500).json({ success: false, message: "Internal Server Error" });
  //     }
  //   }

  //   async subscribeByTrainer(req, res) {
  //     try {
  //       const { userId, planId } = req.body;

  //       // You may want to check if the user is not already subscribed to the plan before proceeding
  //       // ...

  //       await subscribersModel.subscribeByTrainer(userId, planId);

  //       res.json({ success: true, message: "Trainer subscribed successfully" });
  //     } catch (error) {
  //       console.error("Error subscribing trainer:", error);
  //       res.status(500).json({ success: false, message: "Internal Server Error" });
  //     }
  //   }

  async usersSubscribedToPlan(req, res) {
    try {
      const { planId } = req.params;
      const users = await subscribersModel.getUsersSubscribedToPlan(planId);

      res.json({ success: true, users });
    } catch (error) {
      console.error("Error getting users subscribed to plan:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  async usersSubscribedToPlanByTrainer(req, res) {
    try {
      // Extract the trainer's user ID from the authentication token
      const userId = req.user.user.Id;

      // Extract the plan ID from the route parameter
      const { planId } = req.params;

      // Use the userId and planId to get the subscribed users
      const users = await subscribersModel.getUsersSubscribedToPlanByTrainer(
        userId,
        planId
      );

      res.json({ success: true, users });
    } catch (error) {
      console.error(
        "Error getting users subscribed to plan by trainer:",
        error
      );
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  async usersSubscribedToTrainer(req, res) {
    try {
      const { userId } = req.params;
      const users = await subscribersModel.getUsersSubscribedToTrainer(userId);

      res.json({ success: true, users });
    } catch (error) {
      console.error("Error getting users subscribed to trainer:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  async allSubscribedUsers(req, res) {
    try {
      const users = await subscribersModel.getAllSubscribedUsers();

      res.json({ success: true, users });
    } catch (error) {
      console.error("Error getting all subscribed users:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  async userSubscriptions(req, res) {
    try {
      const userId = req.user.user.Id;
      const subscriptions = await subscribersModel.getUserSubscriptions(userId);

      res.json({ success: true, subscriptions });
    } catch (error) {
      console.error("Error getting user subscriptions:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}

module.exports = new SubscribersController();
