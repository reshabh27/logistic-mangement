module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define("Inventory", {
    productId: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty:true
        }
      },

      // changed here
      wareHouseId: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty:true
        }
      },
      reorderLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isFloat: true,
          notNull: true,
          isValid(value) {
            if (value < 0) {
              throw new Error(
                "Reorder Level  cannot be a negative number."
              );
            }
          },
          min: 0,
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate:{
            isFloat:true,
            notNull:true,
            isValid(value){
                if(value<0){
                    throw new Error("Quatity of a product cannot be a negative number.")
                }
            },
            min:0
        },
      },
  });
  return Inventory;
};



