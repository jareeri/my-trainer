// cartModel.js

const db = require('../models/db');

exports.getAllItems = async () => {
  try {
    const query = 'SELECT * FROM cart';
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.getItemById = async (cartId) => {
  try {
    const query = 'SELECT * FROM cart WHERE cart_id = $1';
    const values = [cartId];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.addItemToCart = async (user_id, plan_id, trainer_id) => {
  try {
    const query = `
      INSERT INTO cart (user_id, plan_id, trainer_id)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [user_id, plan_id, trainer_id];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateCartItem = async (cartId, user_id, plan_id, trainer_id) => {
  try {
    const query = `
      UPDATE cart
      SET user_id = $1, plan_id = $2, trainer_id = $3
      WHERE cart_id = $4
      RETURNING *`;
    const values = [user_id, plan_id, trainer_id, cartId];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteCartItem = async (cartId) => {
  try {
    const query = 'DELETE FROM cart WHERE cart_id = $1 RETURNING *';
    const values = [cartId];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
