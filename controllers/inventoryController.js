const { Op } = require("sequelize");
const db = require("../db");
const Inventory = db.inventory;


// route handler for checking routers
const check = (req,res) => {
    return res.status(200).json({"message":"omg hello world"});
} 



// route handler for adding inventory
const addInventory = async(req,res) => {
    try {
        const inventory = await Inventory.create(req.body);
        return res
        .status(200)
        .json({ message: "Inventory added Successfully", inventory});
    } catch (error) {
        res.status(400).json(error);
    }
}



module.exports = {check,addInventory};