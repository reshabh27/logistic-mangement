const express = require("express");
const { productCheck, addProduct, getProductById, updateProductById, deleteProductById, getProducts } = require("../controllers/ProductController.js");


const productRouter = express.Router();

// product route for testing
productRouter.get("/test",productCheck);

// product route for adding a new product
productRouter.post("/",addProduct);

// product route for retreiving product by it's id
productRouter.get("/:id",getProductById);

// product route for updating product by it's id
productRouter.patch("/:id",updateProductById);

// product route for deleting product by it's id
productRouter.delete("/:id",deleteProductById);

// product route for retreiving products
productRouter.get("/", getProducts);

module.exports = {productRouter};