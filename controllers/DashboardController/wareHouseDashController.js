const db = require("../../db");
const {Op} = require('sequelize')
const WareHouse = db.warehouses;
const Inventory = db.inventory;
const Product = db.products;

// Display the total number of warehouses.

const countWareHouses = async(req,res) => {
   const t = await db.sequelize.transaction();
   console.log("Transaction Initiated");
   try {
    const {count} = await WareHouse.findAndCountAll({},{transaction:t});
    await t.commit();
    console.log("Transaction Commited");
    return res.status(200).json({"Total WareHouses":count});
   } catch (error) {
    await t.rollback();
    console.log("RollBack Initiated");
    return res.status(400).json(error);
   }
}

// Show current inventory levels in each warehouse.

const inventoryLevels = async(req,res) => {
    const t = await db.sequelize.transaction();
    console.log("Transaction Initiated");
    try {
        const inventory = await WareHouse.findAll({
            include:[
                {model:Inventory,
                attributes:["productId","reorderLevel"]}
            ]
        });
        await t.commit();
        console.log("Transaction Commited");
        return res.status(200).json({"Inventory Levels":inventory});
    } catch (error) {
        await t.rollback();
        console.log("RollBack Initiated");
        return res.status(400).json(error);
    }
}

// utilized capacity of each wareHouses
const utilizedWareHouse = async(req,res) => {
    const t = await db.sequelize.transaction();
    console.log("Transaction Initiated");
    try {
        const capacity = await Inventory.findAll({
            attributes:[
                [db.sequelize.fn("SUM",db.sequelize.col('quantity')),"Utilized Capacity"]
            ],
            include:[
                {model:WareHouse}
            ],
            group:["wareHouseId"]
        },{transaction:t});
        await t.commit();
        console.log("Transaction Commited");
        return res.status(200).json({"WareHouses":capacity});
    } catch (error) {
        await t.rollback();
        console.log("RollBack Initiated");
        return res.status(400).json(error);
    }
}

//List items that are below the reorder level.

const belowReorderProduct = async(req,res) => {
    const t = await db.sequelize.transaction();
    console.log("Transaction Initiated");
    try {
        const data = await Inventory.findAll({
            attributes:['quantity',"reorderLevel"],
            where:db.sequelize.literal('quantity - reorderLevel < 0'),
            include:[
                {model:Product}
            ]
        },{transaction:t});
        await t.commit();
        console.log("Transaction Commited");
        return res.status(200).json(data);
    } catch (error) {
        await t.rollback();
        console.log("RollBack Initiated");
        return res.status(400).json(error);
    }
}

module.exports = {countWareHouses,inventoryLevels,utilizedWareHouse,belowReorderProduct};