module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "orders",
    {
      // Model attributes are defined here
      orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      orderDate: {
        type: DataTypes.DATE,
      },
      deliveryDate: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.STRING,
      },
    },
    {timestamps:true}
  );
  return Order;
};
