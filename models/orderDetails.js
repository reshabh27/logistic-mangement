module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define(
      "orderDetails",
      {
        // Model attributes are defined here Attributes: OrderDetailsID (PK), OrderID (FK), ProductID (FK), Quantity, Price
        orderDetailsId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
        },
        productId: {
          type: DataTypes.INTEGER,
        },
        quantity: {
          type: DataTypes.INTEGER,
        },
        price: {
          type: DataTypes.INTEGER,
        },
      },
      
    );
    return OrderDetail;
  };
  