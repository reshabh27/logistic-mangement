module.exports = (sequelize, DataTypes) => {
    const OrderWarehouse = sequelize.define(
      "orderWarehouses",
      {
        // Model attributes are defined here Attributes: OrderWarehouseID (PK), OrderID (FK), WarehouseID (FK), DispatchDate, Quantity
        orderId: {
          type: DataTypes.INTEGER,
          allowNull:false,
          validate:{
              notNull:true,
              notEmpty:true
          }
        },
        wareHouseId: {
          type: DataTypes.INTEGER,
          allowNull:false,
          validate:{
              notNull:true,
              notEmpty:true
          }
        },
        dispatchDate: {
          type: DataTypes.DATE,
          allowNull:false,
          validate:{
            notNull:true,
            notEmpty:true,
            isValid(value){
              const currValue = new Date();
              if(value<currValue){
                throw new Error("Providing Past date is inValid");
              }
            }
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
                      throw new Error("Quatity of a product cannot be a negative number.")
                  }
              },
              min:0
          },
        },
      }
    );
    return OrderWarehouse;
  };
  