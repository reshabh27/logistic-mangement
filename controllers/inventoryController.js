const { Op } = require("sequelize");
const db = require("../db");
const Inventory = db.inventory;

// route handler for checking routers
const check = (req, res) => {
  return res.status(200).json({ message: "omg hello world" });
};

// route handler for adding inventory
const addInventory = async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body);
    return res
      .status(200)
      .json({ message: "Inventory added Successfully", inventory });
  } catch (error) {
    res.status(400).json(error);
  }
};

// route handler for updating inventory
const updateInventory = async (req, res) => {
  const id = req.params.id;
  const allowedOptions = [
    "wareHouseId",
    "productId",
    "quantity",
    "reorderLevel",
  ];
  const options = Object.keys(req.body);

  const isValidOption = options.every((option) => {
    return allowedOptions.includes(option);
  });

  if (!isValidOption) {
    return res
      .status(400)
      .json({ message: "Invalid feild added for updating data" });
  } else {
    try {
      const inventory = await Inventory.findByPk(id);
      if (!inventory) {
        return res
          .status(400)
          .json({ message: "Inventory with given id not found" });
      }
      options.forEach((option) => {
        inventory[option] = req.body[option];
      });
      await inventory.save();
      return res
        .status(200)
        .json({ message: "Inventory updated Successfully", inventory });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
};

// delete inventory from its id
const deleteInventory = async (req, res) => {
  const id = req.params.id;
  try {
    const inventory = await Inventory.findOne({
      where: {
        id,
      },
    });
    if (!inventory) {
      return res
        .status(400)
        .json({ message: "Inventory with given id not found" });
    }
    await inventory.destroy();
    return res.status(200).json({ message: "Inventory deleted Successfully" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = { check, addInventory, updateInventory, deleteInventory };
