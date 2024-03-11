module.exports = (sequelize, DataTypes) => {
    const OrderWarehouse = sequelize.define(
      "orderWarehouses",
      {
        // Model attributes are defined here Attributes: OrderWarehouseID (PK), OrderID (FK), WarehouseID (FK), DispatchDate, Quantity
        orderWarehouseId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
        },
        warehouseId: {
          type: DataTypes.INTEGER,
        },
        dispatchDate: {
          type: DataTypes.DATE,
        },
        quantity: {
          type: DataTypes.INTEGER,
        },
      },
      {timestamps:true}
    );
    return OrderWarehouse;
  };
  