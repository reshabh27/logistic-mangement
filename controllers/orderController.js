const db = require("../db/index");
const Order = db.orders;
const User = db.users;
const OrderDetails = db.orderDetails;
const { Sequelize } = require("sequelize");
const testOrder = async (req, res) => {
  res.send("Order is working");
};
const addOrder = async (req, res) => {
  try {
    if ((req.role !== "Customer") && (req.role !== "Super Admin"))
      return res.status(403).send({ message: "Only customers can request orders." })
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
    const permitedRoles = ["Admin", "Customer", "Warehouse Manager", "Super Admin"];
    if (!permitedRoles.includes(req.role))
      res
        .status(403)
        .send({
          message: "your type of roles are not permited to access this.",
        });

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
  try {
    const permitedRoles = ["Admin", "Customer", "Warehouse Manager", "Super Admin"];
    if (!permitedRoles.includes(req.role))
      return res
        .status(403)
        .send({
          message: "your type of roles are not permited to access this.",
        });
    if (req.role === "Customer") {
      if (req.params.id !== req.user.id)
        return res
          .status(403)
          .send({ message: " You are not allowed to do this operation." });
    }
    const order = await Order.findOne({
      where: {
        orderId: req.params.id,
      },
    });
    if (!order) {
      return res.status(404).json({
        message: `order with id ${req.params.id} is not found`,
      });
    }
    res.status(200).json({
      status: "success id",
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const deleteOrder = async (req, res) => {
  try {
    if ((req.role !== "Admin") && (req.role !== "Super Admin"))
      return res
        .status(403)
        .send({ message: "You are not allowed to do this operation." });
    const order = await Order.findOne({
      where: {
        orderId: req.params.id,
      },
    });
    if (!order) {
      return res.status(404).json({
        message: `order with id ${req.params.id} is not found`,
      });
    } else {
      await Order.destroy({
        where: {
          orderId: req.params.id,
        },
      });
    }

    res.status(200).json({
      message: "deleted Successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const updateOrder = async (req, res) => {
  try {
    if ((req.role !== "Admin") && (req.role !== "Warehouse Manager") && (req.role !== "Super Admin"))
      return res
        .status(403)
        .send({ message: "You are not allowed to do this operation." });
    const order = await Order.findOne({
      where: {
        orderId: req.params.id,
      },
    });
    if (!order) {
      return res.status(404).json({
        message: `order with id ${req.params.id} is not found`,
      });
    } else {
      await Order.update(req.body, {
        where: {
          orderId: req.params.id,
        },
      });
    }

    res.status(200).json({
      message: "updated successfully",
      //   data: order,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const searchAndSort = async (req, res) => {
  const {
    page = 1,
    limit = 2,
    orderBy = "userId",
    sortBy = "asc",
    keyword,
  } = req.query;

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Build the where clause for search
  const whereClause = keyword
    ? { status: { [Sequelize.Op.like]: `%${keyword}%` } }
    : {};

  // Build the order array for sorting
  const order = [[orderBy, sortBy.toUpperCase()]];

  try {
    const orders = await Order.findAll({
      where: whereClause,
      limit: +limit,
      offset: offset,
      order: order,
    });

    res.status(200).json({
      data: orders,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
const manyToOne = async (req, res) => {
  try {
    const order = await Order.findAll({
      include: {
        model: User,
        attributes: ["username", "email"],
      },
    });
    res.status(200).json({
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// pushing data inside order details

const addOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDetails.create(req.body);
    return res.status(200).json({ orderDetails });
  } catch (error) {
    return res.status(400).json({ error });
  }
}


module.exports = {
  testOrder,
  addOrder,
  getOrder,
  getOrderById,
  deleteOrder,
  updateOrder,
  searchAndSort,
  manyToOne,
  addOrderDetails
};
