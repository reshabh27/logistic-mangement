const express = require("express");
const { check, addWareHouses, getWareHousesById, updateWareHouse, deleteWareHouse, getWareHouse, specificWareHouseInventory, updateInventoryWareHouse} = require("../controllers/wareHouseController");
const { countWareHouses, inventoryLevels, utilizedWareHouse, belowReorderProduct } = require("../controllers/DashboardController/wareHouseDashController");

const wareHouseRouter = express.Router();

//DashBoar Routes

// Display the total number of warehouses.

wareHouseRouter.get("/countAll",countWareHouses)

// Show current inventory levels in each warehouse.
wareHouseRouter.get("/listLevels",inventoryLevels);

// utilized capacity of each wareHouses
wareHouseRouter.get("/capacity",utilizedWareHouse);

// List items that are below the reorder level.
wareHouseRouter.get("/reorder",belowReorderProduct);

// route for checking 
wareHouseRouter.get("/check",check);

// route for adding wareHouses
wareHouseRouter.post("/",addWareHouses);

// route for retreiving wareHouses by their ids
wareHouseRouter.get("/:id",getWareHousesById);

// route for updating wareHouses by their id's
wareHouseRouter.patch("/:id",updateWareHouse);

// route for deleting wareHouses by their id's 
wareHouseRouter.delete("/:id",deleteWareHouse);
 
// route for getting wareHouses
wareHouseRouter.get("/",getWareHouse);

// route for  retrieving a list of all inventory items in a specific warehouse.
wareHouseRouter.get("/:id/inventory",specificWareHouseInventory);

//  route for updating the quantity of an inventory item in a warehouse.
wareHouseRouter.patch("/:wareHouseId/inventory/:inventoryId",updateInventoryWareHouse);




module.exports = {wareHouseRouter};