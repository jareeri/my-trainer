// cartModel.js

const db = require('../models/db');

exports.getAllItems = async (userId) => {
  try {
    const query = 'SELECT * FROM cart WHERE user_id = $1';
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.getItemById = async (cartId, userId) => {
  try {
    const query = 'SELECT * FROM cart WHERE cart_id = $1 and user_id = $2';
    const values = [cartId, userId];
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

exports.deleteCartItem = async (cartId, user_id) => {
  try {
    const query = 'DELETE FROM cart WHERE cart_id = $1 and user_id = $2 RETURNING *';
    const values = [cartId, user_id];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
