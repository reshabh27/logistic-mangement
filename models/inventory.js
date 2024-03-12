module.exports = (sequelize,DataTypes) => {
    const Inventory = sequelize.define("Inventory",{
        wareHouseId: {
            type: DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notNull:true,
                notEmpty:true
            }
          },
          productId: {
            type: DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notNull:true,
                notEmpty:true
            }
          },
          quantity: {
            type: DataTypes.INTEGER,
            allowNull:false,
            validate:{
                isFloat:true,
                notNull:true,
                isValid(value){
                    if(value<0){
                        throw new Error("Quantity of a product cannot be a negative number.")
                    }
                },
                min:0
            },
          },
          reorderLevel:{
            type: DataTypes.INTEGER,
            allowNull:false,
            validate:{
                isFloat:true,
                notNull:true,
                isValid(value){
                    if(value<0){
                        throw new Error("Quantity of a product cannot be a negative number.")
                    }
                },
                min:0
            },
          }
    });
    return Inventory;
};