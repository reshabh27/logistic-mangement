module.exports = (sequelize, DataTypes) => {
    const Warehouse = sequelize.define(
      "warehouses",
      {
        // Model attributes are defined here   Attributes: WarehouseID (PK), Name, Location, Capacity
        warehouseId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        location: {
          type: DataTypes.STRING,
        },
        capacity: {
          type: DataTypes.INTEGER,
        }
      },
    //   {timestamps:true}
    );
    return Warehouse;
  };
  