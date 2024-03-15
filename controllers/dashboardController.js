// const { QueryTypes } = require("sequelize");
const { users, sequelize } = require("../db");

exports.handleAdminDashboard = async (req, res) => {
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

  exports.handleInventoryDashboard = async (req, res) =>{
    try {
      const totalInventoryItems = await inventory.count();

      const stockByProduct = await Inventory.findAll({
        attributes: [
          "productId",
          [sequelize.fn("SUM", sequelize.col("quantity")), "totalStock"],
        ],
        group: ["productId"],
      });
      const lowStockItems = await Inventory.findAll({
        where: {
          quantity: {
            $lt: 5,
          },
        },
      });
      return res.status(200).json({
        totalInventoryItems,
        stockByProduct,
        lowStockItems,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error in fetching total items" });
    }
  };
};
