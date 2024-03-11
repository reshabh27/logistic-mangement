const db = require("../db/index");
const Order = db.orders;
const { Sequelize } = require("sequelize");
const testOrder = async (req, res) => {
  res.send("Order is working");
};
const addOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      status: "success",
      data: order,
    });
  } catch (err) {
    console.log(err);
  }
};
const getOrder = async (req, res) => {
  try {
    const order = await Order.findAll({});
    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const getOrderById = async (req, res) => {
    
};
module.exports = { testOrder, addOrder, getOrder, getOrderById };
