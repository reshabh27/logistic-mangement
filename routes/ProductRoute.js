const express = require("express");
const { productCheck, addProduct, getProductById, updateProductById, deleteProductById, getProducts } = require("../controllers/ProductController.js");
const { auth } = require("../middleware/auth.js");
const { totalProducts, groupByCategory, recentAddition, topSeller} = require("../controllers/DashboardController/productDashController.js");



const productRouter = express.Router();


// Dasboard Routes

// Display the total number of products managed by the supplier.
productRouter.get("/count",totalProducts);

//Show a breakdown of products by category.
productRouter.get("/group",groupByCategory);

//List the most recently added products.
productRouter.get("/recent",recentAddition);

//Top Selling Products
productRouter.get("/top",topSeller);


// Normal Product Routes

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