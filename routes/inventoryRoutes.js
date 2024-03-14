const express = require('express');
const { check, addInventory, updateInventory, deleteInventory, specificProductInventory } = require('../controllers/inventoryController');

const inventoryRouter = express.Router();

// route for checking route handlers
inventoryRouter.get("/check",check);

// route for adding inventory
inventoryRouter.post("/",addInventory);

// route for updating inventory
inventoryRouter.patch("/:id",updateInventory);

// route for deleting inventory from it's id
inventoryRouter.delete("/:id",deleteInventory);

// route for retrieving a list of all inventory items for a specific product across all warehouses.
inventoryRouter.get("/products/:id",specificProductInventory);

module.exports = {inventoryRouter};