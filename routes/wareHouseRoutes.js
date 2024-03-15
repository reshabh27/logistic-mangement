const express = require("express");
const { check, addWareHouses, getWareHousesById, updateWareHouse, deleteWareHouse, getWareHouse, specificWareHouseInventory, updateInventoryWareHouse } = require("../controllers/wareHouseController");
const { auth } = require("../middleware/auth");

const wareHouseRouter = express.Router();

// route for checking 
wareHouseRouter.get("/check", check);

// route for adding wareHouses
wareHouseRouter.post("/", auth, addWareHouses);

// route for retreiving wareHouses by their ids
wareHouseRouter.get("/:id", auth, getWareHousesById);

// route for updating wareHouses by their id's
wareHouseRouter.patch("/:id", auth, updateWareHouse);

// route for deleting wareHouses by their id's 
wareHouseRouter.delete("/:id", auth, deleteWareHouse);

// route for getting wareHouses
wareHouseRouter.get("/", auth, getWareHouse);

// route for  retrieving a list of all inventory items in a specific warehouse.
wareHouseRouter.get("/:id/inventory", auth, specificWareHouseInventory);

//  route for updating the quantity of an inventory item in a warehouse.
wareHouseRouter.patch("/:wareHouseId/inventory/:inventoryId", auth, updateInventoryWareHouse);

module.exports = { wareHouseRouter };