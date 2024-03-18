const { Op } = require("sequelize");
const db = require("../db");
const { orderArr } = require("./ProductController");
const WareHouse = db.warehouses;
const Product = db.products;
const Inventory = db.inventory;
var IntLarge = 1e9;

const check = (req, res) => {
  return res.status(200).json({ message: "Hello World" });
};

// adding wareHouses
const addWareHouses = async (req, res) => {
  const t = await db.sequelize.transaction();
  console.log("Transaction Initiated");
  try {
    const wareHouse = await WareHouse.create(req.body,{transaction:t});
    await t.commit();
    console.log("Transaction Commited");
    if (req.role !== 'Admin')
      return res.status(400).send({ message: "you are not allowed to do this operation." })
    return res
      .status(200)
      .json({ message: "WareHouse added Successfully", wareHouse });
  } catch (error) {
    await t.rollback();
    console.log("Rollback Initiated");
    res.status(400).json(error);
  }
};

// retreiving wareHouses by id

const getWareHousesById = async (req, res) => {
  const t = await db.sequelize.transaction();
  console.log("Transaction Initiated");
  const id = req.params.id;
  try {
    const wareHouse = await WareHouse.findByPk(id,{transaction:true});
    await t.commit();
    console.log("Transaction Commited");
    if (req.role !== 'Admin' && req.role !== 'Warehouse Manager')
      return res.status(400).send({ message: "you are not allowed to do this operation." })

    return res.status(200).json({ wareHouse });
  } catch (error) {
    await t.rollback();
    console.log("Rollback Initiated");
    return res.status(400).json(error);
  }
};

// updating wareHouses from their id's

const updateWareHouse = async (req, res) => {
  const t =await db.sequelize.transaction();
  console.log("Transaction Initiated");
  if (req.role !== 'Admin')
    return res.status(400).send({ message: "you are not allowed to do this operation." })

  const id = req.params.id;
  const allowedOptions = ["name", "location", "capacity"];
  const options = Object.keys(req.body);

  const isValidation = options.every((option) => {
    return allowedOptions.includes(option);
  });

  if (!isValidation) {
    return res
      .status(400)
      .json({ message: "Invalid feild added for updating data" });
  } else {
    try {
      const wareHouse = await WareHouse.findByPk(id,{transaction:t});
      if (!wareHouse) {
        return res
          .status(400)
          .json({ message: "WareHouse with given id not found" });
      }
      options.forEach((option) => {
        wareHouse[option] = req.body[option];
      });
      await wareHouse.save();
      await t.commit();
      console.log("Transaction Commited");
      return res
        .status(200)
        .json({ message: "WareHouse updated Successfully", wareHouse });
    } catch (error) {
      await t.rollback();
      console.log("Rollback Initiated");
      return res.status(400).json(error);
    }
  }
};

// deleting wareHouses by their id's

const deleteWareHouse = async (req, res) => {
  const id = req.params.id;
  try {
    if (req.role !== 'Admin')
      return res.status(400).send({ message: "you are not allowed to do this operation." })

    const wareHouse = await WareHouse.findByPk(id);
    if (!wareHouse) {
      return res
        .status(400)
        .json({ message: "wareHouse with given id not found" });
    }
    await wareHouse.destroy();
    return res.status(200).json({ message: "WareHouse deleted Successfully" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

// retriving wareHouse filtering and sorting

const getWareHouse = async (req, res) => {

  if (req.role !== 'Admin' && req.role !== 'Warehouse Manager')
    return res.status(400).send({ message: "you are not allowed to do this operation." })

  // object containing query values in key-value pair
  const params = req.query;

  // object to store all string query feilds that are not empty
  const validParams = {};

  // object to store all float query feilds that are not empty
  const rangeParams = {};

  // allowed query feilds
  const allowedOptions = ["name", "location", "capacity", "sortBy"];

  // query feilds mentioned in req query object
  const options = Object.keys(params);

  const isValid = options.every((option) => {
    return allowedOptions.includes(option);
  });

  if (!isValid) {
    return res
      .status(400)
      .json({ message: "Invalid query added for filtering WareHouses" });
  }

  for (let key in params) {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key].trim() !== ""
    ) {
      if (key === "capacity") {
        const range = params[key].split("-");
        rangeParams[`low${key}`] = parseInt(range[0]);
        rangeParams[`high${key}`] = parseInt(range[1]);
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
    capacity: {
      [Op.between]: [
        rangeParams.lowcapacity || 0,
        rangeParams.highcapacity || IntLarge,
      ],
    },
  };

  const orderList = orderArr(params.sortBy);
  console.log(orderList);

  if (orderList[0] === "error") {
    return res
      .status(400)
      .json({ message: "Invalid sortBy query added for filtering wareHouses" });
  }

  try {
    const wareHouse = await WareHouse.findAll({
      where: comp,
      order: orderList.length === 0 ? "" : [[orderList]],
    });
    if (wareHouse.length === 0) {
      return res
        .status(400)
        .json({ message: "No matching wareHouse found for the given query." });
    }
    return res.status(200).json({ wareHouse });
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Retrieve a list of all inventory items in a specific warehouse.
const specificWareHouseInventory = async (req, res) => {
  const id = req.params.id;
  try {
    if (req.role !== 'Admin' && req.role !== 'Warehouse Manager')
      return res.status(400).send({ message: "you are not allowed to do this operation." })

    const inventory = await WareHouse.findAll({
      where: { id },
      include: [{ model: Product }],
    });
    if (!inventory) {
      return res
        .status(400)
        .json({ message: "Inventory related to given wareHouse not found" });
    }
    return res.status(200).json({ inventory });
  } catch (error) {
    return res.status(400).json(error);
  }
};

// update the quantity of an inventory item in a warehouse.

const updateInventoryWareHouse = async (req, res) => {

  if (req.role !== 'Warehouse Manager')
    return res.status(400).send({ message: "you are not allowed to do this operation." })

  const { wareHouseId, inventoryId } = req.params;
  const allowedOptions = ["quantity"];
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
      const inventory = await Inventory.findOne({
        where: {
          id: inventoryId,
          wareHouseId,
        },
      });
      if (!inventory) {
        return res
          .status(400)
          .json({ message: "Inventory related to given wareHouse not found" });
      }
      options.forEach((option) => {
        inventory[option] = req.body[option];
      });
      await inventory.save();
      return res.status(200).json({ "message": "Inventory updated successfully", inventory });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
};



module.exports = {
  check,
  addWareHouses,
  getWareHousesById,
  updateWareHouse,
  deleteWareHouse,
  getWareHouse,
  specificWareHouseInventory,
  updateInventoryWareHouse,
};
