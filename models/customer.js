

module.exports=(sequelize,DataTypes)=>{
    const Customer = sequelize.define('customers', {
        // Model attributes are defined here
        customerId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        firstName: {
            type: DataTypes.STRING
            // allowNull defaults to true
          },
        lastName: {
          type: DataTypes.STRING
          // allowNull defaults to true
        }
      }, {
        // Other model options go here
      });
      return Customer
}