// paymentModel.js
const db = require("./db");

class PaymentModel {
  async checkActiveSubscription(user_id) {
    const activeSubscriptionQuery = `
      SELECT * FROM subscribers
      WHERE user_id = $1 AND end_at > NOW()
    `;

    const activeSubscriptionValues = [user_id];

    try {
      const activeSubscriptionResult = await db.query(
        activeSubscriptionQuery,
        activeSubscriptionValues
      );
      return activeSubscriptionResult.rows;
    } catch (error) {
      throw error;
    }
  }

  async addSubscriber(user_id, plan_id, subscribed_at, end_at, trainer_id) {
    const addSubscriberQuery = `
      INSERT INTO subscribers (user_id, plan_id, subscribed_at, end_at, trainer_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;

    const addSubscriberValues = [
      user_id,
      plan_id,
      subscribed_at,
      end_at,
      trainer_id,
    ];

    try {
      const addedSubscriber = await db.query(
        addSubscriberQuery,
        addSubscriberValues
      );
      return addedSubscriber.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PaymentModel;
