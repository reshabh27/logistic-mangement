const { sequelize } = require("../db.js");

module.exports=(sequelize, DataTypes) =>{
    const Users=sequelize.define('users',{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        gender:{
            type:DataTypes.ENUM('male','female'),
            defaultValue:'male',
            allowNull: true  
        },
        role:{
            type:DataTypes.STRING,
            allowNull:false
        },
        department:{
            type:DataTypes.STRING,
            allowNull: false
        }
    })
}