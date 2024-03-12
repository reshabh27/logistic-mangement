module.exports = (sequelize, DataTypes) => {
    const Transport = sequelize.define(
      "transports",
      {
        // Model attributes are defined here
        transportId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        type: {
          type: DataTypes.STRING,
        },
        capacity: {
          type: DataTypes.INTEGER,
        },
        costPerMile: {
          type: DataTypes.INTEGER,
        }
      },
      {timestamps:true}
    );
    return Transport;
  };
  