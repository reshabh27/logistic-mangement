// const {sequelize,Sequelize} = require("../db");


// const {DataTypes} = require("sequelize")
module.exports=(sequelize,DataTypes)=>{
const Product = sequelize.define("product",{
    name:{
        type:DataTypes.STRING,
        allowNull:false, 
        validate:{
            notEmpty:true,
        }
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true,
            isValid(value){
                if(value.length<5){
                    throw new Error("Decription must be greater than 5 words");
                }
            }
        }
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true,
            isValid(value){
                if(value.length<3){
                    throw new Error("length of Category must be greater than 3 words ");
                }
            }
        }
    },
    price:{
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
    weight:{
        type:DataTypes.FLOAT,
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
});
return Product
}
// module.exports = {Product};