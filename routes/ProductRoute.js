const express = require("express");
const { productCheck, addProduct, getProductById, updateProductById, deleteProductById, getProducts } = require("../controllers/ProductController.js");
const { auth } = require("../middleware/auth.js");


const productRouter = express.Router();

// product route for testing
productRouter.get("/test", productCheck);

// product route for adding a new product
productRouter.post("/", auth, addProduct);

// product route for retreiving product by it's id
productRouter.get("/:id", auth, getProductById);

// product route for updating product by it's id
productRouter.patch("/:id", auth, updateProductById);

// product route for deleting product by it's id
productRouter.delete("/:id", auth, deleteProductById);

// product route for retreiving products
productRouter.get("/", auth, getProducts);

module.exports = { productRouter };