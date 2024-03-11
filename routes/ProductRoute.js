const express = require("express");
const { productCheck } = require("../controllers/ProductController.js");


const productRouter = express.Router();

productRouter.get("/test",productCheck);

module.exports = {productRouter};