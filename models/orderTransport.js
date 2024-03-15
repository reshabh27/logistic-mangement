module.exports = (sequelize, DataTypes) => {
  const OrderTransport = sequelize.define(
    "orderTransports",
    {
      // Model attributes are defined here Attributes: OrderTransportID (PK), OrderID (FK), TransportID (FK), Distance, TotalCost
      orderTransportId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        
      },
      orderId: {
        type: DataTypes.INTEGER,
      },
      transportId: {
        type: DataTypes.INTEGER,
      },
      distance: {
        type: DataTypes.INTEGER,
      },
      cost: {
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: true }
  );
  return OrderTransport;
};
