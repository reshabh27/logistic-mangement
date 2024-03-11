const { Product } = require("../models/products.js");
const { Op } = require("sequelize");
var IntLarge = 1e9;

// for checking folder structure.

const productCheck = (req, res) => {
  return res.status(200).json({ mesage: "Hello World" });
};

// Adding Product

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res
      .status(200)
      .json({ message: "Product added Successfully", product });
  } catch (error) {
    res.status(400).json(error);
  }
};

// get product from product id

const getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id);
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json(error);
  }
};

// updating product from it's id

const updateProductById = async (req, res) => {
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
          .json({ message: "User with given id not found" });
      }
      options.forEach((option) => {
        product[option] = req.body[option];
      });

      await product.save();
      return res
        .status(200)
        .json({ message: "Product updated Successfully", product });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
};

// deleting product by its id

const deleteProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(400).json({ message: "User with given id not found" });
    }

    await product.destroy();
    return res.status(200).json({ message: "Product deleted Successfully" });
  } catch (error) {
    return res.status(400).json(error);
  }
};



const orderArr = (temp) => {
    const arr = temp.split('_');
    if(arr[0]?.trim() !== '' && arr[1]?.trim() !== ''){
        if(arr[1] === 'asc'){
            return [arr[0],'ASC'];
        }
        else if (arr[1] === 'desc'){
            return [arr[0],'DESC'];
        }
        else{
            return ["error"];
        }
    }
    else{
        return [];
    }
}

// retreiving products

const getProducts = async (req, res) => {
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

  if(orderList[0] === 'error'){
    return res
    .status(400)
    .json({ message: "Invalid sortBy query added for filtering products" });
  }

  try {
    const product = await Product.findAll({
      where: comp,
      order:[orderList],
    }); 

    if (product.length === 0) {
      return res
        .status(400)
        .json({ message: "No matching product found for the given query." });
    }
    return res.status(200).json({ product });
  } catch (error) {
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
};
