const Cart = require("../models/Cart");

// Cart එකට Item එකතු කිරීම හෝ පවතින Item එකක Qty වැඩි කිරීම
exports.addToCart = async (req, res) => {
  const { userId, productId, name, price, image, qty } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const itemIndex = cart.items.findIndex(p => p.productId === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].qty += qty;
      } else {
        cart.items.push({ productId, name, price, image, qty });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      const newCart = await Cart.create({
        userId,
        items: [{ productId, name, price, image, qty }]
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

// User ID එක අනුව Cart එක ලබා ගැනීම
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).send(err);
  }
};

// Cart එකෙන් Item එකක් ඉවත් කිරීම
exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;
    try {
      let cart = await Cart.findOne({ userId });
      if (cart) {
        // අදාළ productId එක නොවන අනෙක් සියලුම අයිතම පමණක් ඉතිරි කරයි
        cart.items = cart.items.filter(item => item.productId !== productId);
        await cart.save();
        return res.status(200).json(cart);
      }
      res.status(404).send("Cart not found");
    } catch (err) {
      res.status(500).send("Error removing item");
    }
  };