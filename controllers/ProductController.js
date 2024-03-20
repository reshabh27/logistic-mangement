const { Op } = require("sequelize");
const db = require("../db");
const Product = db.products;
var IntLarge = 1e9;

// for checking folder structure.

const productCheck = (req, res) => {
  return res.status(200).json({ mesage: "Hello World" });
};

// Adding Product

const addProduct = async (req, res) => {
  const t = await db.sequelize.transaction();
  console.log("Transaction Initiated");
  try {
    // checking user role 
    if ((req.role !== "Supplier") && (req.role !== "Super Admin"))
      return res.status(403).send({ message: "You are not allowed to do this operation." })
    const product = await Product.create(req.body, { transaction: t });
    await t.commit();
    console.log("Transaction Commited");
    return res
      .status(200)
      .json({ message: "Product added Successfully", product });
  } catch (error) {
    await t.rollback();
    console.log("Rollback Initiated");
    res.status(400).json(error);
  }
};

// get product from product id

const getProductById = async (req, res) => {
  const t = await db.sequelize.transaction();
  console.log("Transaction Initiated");
  // checking if cuurent user is from Admin, Supplier, Customer roles
  const allowedRoles = ["Admin", "Supplier", "Customer", "Super Admin"];
  const isAllowed = allowedRoles.includes(req.role);
  if (!isAllowed)
    return res
      .status(403)
      .send({ message: "You are not allowed to do this operation." });

  const id = req.params.id;
  try {
    const product = await Product.findByPk(id, { transaction: t });
    if (!product) {
      return res
        .status(200)
        .json({ message: "No matching product found for the given id" });
    }
    await t.commit();
    console.log("Transaction Commited");
    return res.status(200).json({ product });
  } catch (error) {
    await t.rollback();
    console.log("Rollback Initiated");
    return res.status(400).json(error);
  }
};

// updating product from it's id

const updateProductById = async (req, res) => {
  const t = await db.sequelize.transaction();
  console.log("Transaction Initiated");
  // checking user role
  if ((req.role !== "Supplier") && (req.role !== "Super Admin"))
    return res
      .status(403)
      .send({ message: "You are not allowed to do this operation." });

  const id = req.params.id;
  const allowedOptions = ["name", "description", "category", "price", "weight"];
  const options = Object.keys(req.body);

  const isValidOptions = options.every((option) => {
    return allowedOptions.includes(option);
  });

  if (!isValidOptions) {
    return res
      .status(400)
      .json({ message: "Invalid feild added for updating data" });
  } else {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res
          .status(400)
          .json({ message: "Product with given id not found" });
      }
      options.forEach((option) => {
        product[option] = req.body[option];
      });

      await product.save();
      await t.commit();
      console.log("Transaction Commited");
      return res
        .status(200)
        .json({ message: "Product updated Successfully", product });
    } catch (error) {
      await t.rollback();
      console.log("Rollback Initiated");
      return res.status(400).json(error);
    }
  }
};

// deleting product by its id

const deleteProductById = async (req, res) => {
  const t = await db.sequelize.transaction();
  console.log("Transaction Initiated");
  // checking user role
  if ((req.role !== "Supplier") && (req.role !== "Super Admin"))
    return res
      .status(403)
      .send({ message: "You are not allowed to do this operation." });

  const id = req.params.id;
  try {
    const product = await Product.findByPk(id, { transaction: t });
    if (!product) {
      return res
        .status(400)
        .json({ message: "Product with given id not found" });
    }

    await product.destroy();
    await t.commit();
    console.log("Transaction Commited");
    return res.status(200).json({ message: "Product deleted Successfully" });
  } catch (error) {
    await t.rollback();
    console.log("Rollback Initiated");
    return res.status(400).json(error);
  }
};

const orderArr = (temp) => {
  const arr = temp?.split("_") || [];
  if (arr[0]?.trim() !== "" && arr[1]?.trim() !== "" && arr.length === 2) {
    if (arr[1] === "asc") {
      return [arr[0], "ASC"];
    } else if (arr[1] === "desc") {
      return [arr[0], "DESC"];
    } else {
      return ["error"];
    }
  } else {
    return [];
  }
};

// retreiving products

const getProducts = async (req, res) => {
  const t = await db.sequelize.transaction();
  console.log("Transaction initiated");
  // checking if cuurent user is from Admin, Supplier, Customer roles
  const allowedRoles = ["Admin", "Supplier", "Customer", "Super Admin"];
  const isAllowed = allowedRoles.includes(req.role);
  if (!isAllowed)
    return res
      .status(403)
      .send({ message: "You are not allowed to do this operation." });

  // object containing query values in key-value pair
  const params = req.query;

  // object to store all string query feilds that are not empty
  const validParams = {};

  // object to store all float query feilds that are not empty
  const floatParams = {};

  // allowed query feilds
  const allowedOptions = ["name", "category", "price", "weight", "sortBy"];

  // query feilds mentioned in req query object
  const options = Object.keys(params);

  const isValid = options.every((option) => {
    return allowedOptions.includes(option);
  });

  if (!isValid) {
    return res
      .status(400)
      .json({ message: "Invalid query added for filtering products" });
  }

  for (let key in params) {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key].trim() !== ""
    ) {
      if (key === "price" || key === "weight") {
        const range = params[key].split("-");
        floatParams[`low${key}`] = parseFloat(range[0]);
        floatParams[`high${key}`] = parseFloat(range[1]);
      } else if (key === "sortBy") {
        continue;
      } else {
        validParams[key] = params[key];
      }
    }
  }

  // comparator obeject for querying the products table
  const comp = {
    ...validParams,
    price: {
      [Op.between]: [
        floatParams.lowprice || 0,
        floatParams.highprice || IntLarge,
      ],
    },
    weight: {
      [Op.between]: [
        floatParams.lowweight || 0,
        floatParams.highweight || IntLarge,
      ],
    },
  };

  const orderList = orderArr(params.sortBy);
  console.log(orderList);

  if (orderList[0] === "error") {
    return res
      .status(400)
      .json({ message: "Invalid sortBy query added for filtering products" });
  }

  try {
    const product = await Product.findAll(
      {
        where: comp,
        order: orderList.length === 0 ? "" : [[orderList]],
      },
      { transaction: t }
    );

    if (product.length === 0) {
      return res
        .status(400)
        .json({ message: "No matching product found for the given query." });
    }
    await t.commit();
    console.log("Transaction Commited");
    return res.status(200).json({ product });
  } catch (error) {
    await t.rollback();
    console.log("Rollback Initiated");
    return res.status(400).json(error);
  }
};

module.exports = {
  productCheck,
  addProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getProducts,
  orderArr,
};
