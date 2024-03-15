const express = require("express");
const router = express.Router();
const cartManagerInstance = require("../controllers/cartManager.js");
const CartModel = require("../models/carts.model.js");

router.get("/", async (req, res) => {
  try {
    const data = await CartModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).send({ status: "404 Not Found", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManagerInstance.createCart();
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const idCart = req.params.cid;
    const cartById = await cartManagerInstance.getProductById(idCart);
    if (!cartById) {
      res.status(404).json({ error: "cart not found" });
    }
    res.status(200).json(cartById);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const quantity = req.body.quantity || 1;

    const upDateCart = await cartManagerInstance.addProductToCart(
      idCart,
      idProduct,
      quantity
    );
    res.status(200).json(upDateCart);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid/:pid", async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;

    const deleteProductInCart = await cartManagerInstance.deleteProductCart(
      idCart,
      idProduct
    );
    res.status(200).json(deleteProductInCart);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

module.exports = router;
