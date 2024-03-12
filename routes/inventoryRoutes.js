const express = require('express');
const { check, addInventory, updateInventory, deleteInventory } = require('../controllers/inventoryController');

const inventoryRouter = express.Router();

// route for checking route handlers
inventoryRouter.get("/check",check);

// route for adding inventory
inventoryRouter.post("/",addInventory);

// route for updating inventory
inventoryRouter.patch("/:id",updateInventory);

// route for deleting inventory from it's id
inventoryRouter.delete("/:id",deleteInventory);

module.exports = {inventoryRouter};