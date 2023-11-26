// cartController.js

const cartModel = require('../models/cartModel');

exports.getAllItems = async (req, res) => {
  try {
    const userId = req.user.user.Id ;
    // console.log(userId);
    const items = await cartModel.getAllItems(userId);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const userId = req.user.user.Id ;
    const cartId = req.params.cart_id;
    const item = await cartModel.getItemById(cartId, userId);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found in the cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const user_id =req.user.user.Id;
    const { plan_id, trainer_id } = req.body;
    const newItem = await cartModel.addItemToCart(user_id, plan_id, trainer_id);
    res.status(201).json({ message: 'Item added to the cart', cartItem: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const user_id = req.user.user.Id;
    const cartId = req.params.cart_id;
    const { plan_id, trainer_id } = req.body;
    const updatedItem = await cartModel.updateCartItem(cartId, user_id, plan_id, trainer_id);
    if (updatedItem) {
      res.json({ message: 'Item in the cart updated successfully', cartItem: updatedItem });
    } else {
      res.status(404).json({ message: 'Item not found in the cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const user_id = req.user.user.Id;
    const cartId = req.params.cart_id;
    const deletedItem = await cartModel.deleteCartItem(cartId, user_id);
    if (deletedItem) {
      res.json({ message: 'Item removed from the cart', cartItem: deletedItem });
    } else {
      res.status(404).json({ message: 'Item not found in the cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
