module.exports = (sequelize, DataTypes) => {
    const Warehouse = sequelize.define(
      "warehouses",
      {
        // Model attributes are defined here   Attributes: WarehouseID (PK), Name, Location, Capacity
        name: {
          type: DataTypes.STRING,
          allowNull:false,
          unique:true,
          validate:{
              notEmpty:true,
              isValid(value){
                if(value.length<2){
                    throw new Error("Name must be greater than 2 words");
                }
            }
          }
        },
        location: {
          type: DataTypes.STRING,
          allowNull:false,
          validate:{
              notEmpty:true,
              isValid(value){
                if(value.length<2){
                    throw new Error("Location must be greater than 2 words");
                }
            }
          }
        },
        capacity: {
          type: DataTypes.INTEGER,
          allowNull:false,
          validate:{
              isFloat:true,
              notNull:true,
              isValid(value){
                  if(value<0){
                      throw new Error("Weight in Kgs cannot be a negative number.")
                  }
              },
              min:0
          },
        } 
      },
    //   {timestamps:true} 
    );
    return Warehouse;
  };
  