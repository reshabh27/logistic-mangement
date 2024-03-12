const express = require("express");
const { check, addWareHouses, getWareHousesById, updateWareHouse, deleteWareHouse, getWareHouse } = require("../controllers/wareHouseController");

const wareHouseRouter = express.Router();

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

module.exports = {wareHouseRouter};