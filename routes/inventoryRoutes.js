const express = require('express');
const { check, addInventory } = require('../controllers/inventoryController');

const inventoryRouter = express.Router();

// route for checking route handlers
inventoryRouter.get("/check",check);

// route for adding inventory
inventoryRouter.post("/",addInventory);

module.exports = {inventoryRouter};