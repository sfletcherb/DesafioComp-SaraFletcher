const productManagerInstance = require("../controllers/productManager.js");

const deleteProduct = async (id) => {
  try {
    await productManagerInstance.deleteProduct(id);
  } catch (error) {
    console.log("Error reading file", error);
    throw error;
  }
};

const addProduct = async (data) => {
  try {
    await productManagerInstance.addProduct(data);
  } catch (error) {
    console.log("Error reading file", error);
    throw error;
  }
};

module.exports = { deleteProduct, addProduct };
