// const { QueryTypes } = require("sequelize");
const {
  users,
  sequelize,
  orders,
  transports,
  orderTransports,
  inventory
} = require("../db");
const { QueryTypes,Op } = require("sequelize");

const handleAdminDashboard = async (req, res) => {
  try {
    // count of total no of user
    const totalUsers = await users.count({});
    // console.log("totalUsers", totalUsers);

    // usersByRole through query method
    // const usersByRole = await sequelize.query("SELECT role, COUNT(*) AS count FROM `users` GROUP BY role;", { type: QueryTypes.SELECT });

    // usersByRole by sequlize methods
    const usersByRole = await users.findAll({
      attributes: [
        "role",
        [sequelize.fn("count", sequelize.col("username")), "total_users"],
      ],
      group: "role",
    });

    // console.log(usersByRole);

    // recent registrations can change the limit as our needs
    const recentRegistrations = await users.findAll({
      order: [["createdAt", "DESC"]],
      limit: 2,
    });
    // console.log("recentRegistrations", recentRegistrations);

    const handleAdminDashboard = async (req, res) => {
      try {
        // count of total no of user
        const totalUsers = await users.count({});
        // console.log("totalUsers", totalUsers);

        // usersByRole through query method
        // const usersByRole = await sequelize.query("SELECT role, COUNT(*) AS count FROM `users` GROUP BY role;", { type: QueryTypes.SELECT });

        // usersByRole by sequlize methods
        const usersByRole = await users.findAll({
          attributes: [
            "role",
            [sequelize.fn("count", sequelize.col("username")), "total_users"],
          ],
          group: "role",
        });

        // console.log(usersByRole);

        // recent registrations can change the limit as our needs
        const recentRegistrations = await users.findAll({
          order: [["createdAt", "DESC"]],
          limit: 2,
        });
        // console.log("recentRegistrations", recentRegistrations);
        return res.status(200).send({
          message: "Success",
          totalUsers,
          usersByRole,
          recentRegistrations,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({
          message: "there is some error occured. please try again later.",
        });
      }
    };

    const userActivity = JSON.parse(req.curUser.loginData || "[]");

    return res.status(200).send({
      message: "Success",
      totalUsers,
      usersByRole,
      recentRegistrations,
      userActivity,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "there is some error occured. please try again later.",
    });
  }
};

const handleInventoryDashboard = async (req, res) => {
  try {
    if (req.role !== 'Admin'  && req.role !=="Warehouse Manager"){
      return res.send("Only Admin and Ware house Manager can access this  route.");
    }
    const totalInventoryItems = await inventory.count();
    // console.log(totalInventoryItems);

    const stockByProduct = await inventory.findAll({
      attributes: [
        "productId",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalStock"],
      ],
      group: ["productId"],
    });
    const lowStockItems = await inventory.findAll({
      where : {
        quantity: {
          [Op.lte]: 8
        },
      }
    });
    console.log(lowStockItems)
    return res.status(200).json({
      totalInventoryItems,
      stockByProduct,
      lowStockItems
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in fetching total items" });
  }
};
const handleOrderDashboard = async (req, res) => {
  try {
    const totalOrders = await orders.count({});
    const orderStatus = await sequelize.query(
      "SELECT status, COUNT(*) AS status_count FROM orders GROUP BY status;",
      { type: QueryTypes.SELECT }
    );
    const recentOrders = await orders.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      totalOrders,
      orderStatus,
      recentOrders,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const handleTransportDashboard = async (req, res) => {
  try {
    const totalTransports = await transports.count({});
    const transportUsage = await sequelize.query(
      "SELECT type, COUNT(*) AS frequency FROM transports GROUP BY type;",
      { type: QueryTypes.SELECT }
    );
    const costAnalysis = await sequelize.query(
      `SELECT t.type, DATE(t.createdAt) AS date, SUM(t.costPerMile * d.distance) AS total_cost
        FROM transports t
        JOIN orderTransports d ON t.transportId = d.transportId
        GROUP BY t.type, DATE(t.createdAt)
        ORDER BY date;`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({
      totalTransports,
      transportUsage,
      costAnalysis,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

module.exports = {
  handleAdminDashboard,
  handleOrderDashboard,
  handleTransportDashboard,
  handleInventoryDashboard
};
