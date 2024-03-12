

module.exports = (sequelize,DataTypes) =>{

const productSupplier = sequelize.define("productSupplier",{
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty:true
        }
    },

    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty:true
        }
    },

    supplyPrice:{
        type:DataTypes.FLOAT,
        allowNull:false,
        validate:{
            isFloat:true,
            notNull:true,
            isValid(value){
                if(value<0){
                    throw new Error("Price of a product cannot be a negative number.")
                }
            },
            min:0
        },
    },
    leadTime:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            isInt:true,
            notNull:true,
            isValid(value){
                if(value<0){
                    throw new Error("LeadTime of a product cannot be a negative number.");
                }
            },
            min:0
        },
    }

})
return productSupplier;
}
