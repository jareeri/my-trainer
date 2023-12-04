const db = require("../models/db");

class SubscribersModel {
  async getUsersSubscribedToPlan(planId) {
    const query = `
          SELECT users.*
          FROM users
          INNER JOIN subscribers ON users.user_id = subscribers.user_id
          WHERE subscribers.plan_id = $1;
        `;
    const values = [planId];
    const result = await db.query(query, values);
    return result.rows;
  }

  async getUsersSubscribedToPlanByTrainer(userId, planId) {
    const query1 = "SELECT trainer_id FROM trainers WHERE user_id = $1;";
    const values1 = [userId];
    const result1 = await db.query(query1, values1);
    console.log(result1.rows[0].trainer_id);
    const query = `
          SELECT users.*
          FROM users
          INNER JOIN subscribers ON users.user_id = subscribers.user_id
          WHERE subscribers.plan_id = $1 and subscribers.trainer_id = $2;
        `;
    const values = [planId, result1.rows[0].trainer_id];
    const result = await db.query(query, values);
    return result.rows;
  }

  async getUsersSubscribedToTrainer(userId) {
    const query1 = "SELECT trainer_id FROM trainers WHERE user_id = $1;";
    const values1 = [userId];
    const result1 = await db.query(query1, values1);
    // console.log(result1.rows[0].trainer_id);
    const query = `
          SELECT users.*
          FROM users
          INNER JOIN subscribers ON users.user_id = subscribers.user_id
          WHERE subscribers.trainer_id = $1;
        `;
    const values = [result1.rows[0].trainer_id];
    const result = await db.query(query, values);
    console.log(result.rows)
    return result.rows;
  }

  async getAllSubscribedUsers() {
    const query = `
          SELECT users.*
          FROM users
          INNER JOIN subscribers ON users.user_id = subscribers.user_id;
        `;
    const result = await db.query(query);
    return result.rows;
  }

  async getUserSubscriptions(userId) {
    const query = `
          SELECT plans.*
          FROM plans
          INNER JOIN subscribers ON plans.id = subscribers.plan_id
          WHERE subscribers.user_id = $1;
        `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
  }
}

module.exports = new SubscribersModel();
