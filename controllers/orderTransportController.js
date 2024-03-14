const db = require("../db/index");
const Transport = db.transports;
const Order = db.orders;
const orderTransport = db.orderTransports;
const { Sequelize } = require("sequelize");

const addOrderTransport = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // console.log(orderId);
    const { orderTransportId, transportId, distance, cost } = req.body;
    const data = await orderTransport.create({
      orderTransportId,
      orderId: orderId,
      transportId: transportId,
      distance: distance,
      cost: cost,
    });
    res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateOrderTransport = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        orderId: req.params.orderId,
      },
    });
    const data = await orderTransport.findOne({
      where: {
        orderTransportId: req.params.orderTransportId,
      },
    });
    if (!data || !order) {
      return res.status(404).json({
        message: "Sorry we could not find the details of which you are need of",
      });
    } else {
      await orderTransport.update(req.body, {
        where: {
          orderTransportId: req.params.orderTransportId,
        },
      });
    }
    res.status(200).json({
      message: "updated successfuly",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { addOrderTransport, updateOrderTransport };
