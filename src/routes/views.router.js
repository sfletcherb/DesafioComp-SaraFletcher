const express = require("express");
const router = express.Router();
const ProductModel = require("../models/products.model.js");

router.get("/", async (req, res) => {
  try {
    const data = await ProductModel.find();

    const newArray = data.map((p) => {
      return {
        title: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        code: p.code,
        category: p.category,
        status: p.status,
        thumbnail: p.thumbnail,
      };
    });

    res.render("index", { data: newArray });
  } catch (error) {
    console.log("error to load list of products");
    res.status(500).send("error loading products");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

router.get("/chat", async (req, res) => {
  res.render("chat");
});

module.exports = router;
