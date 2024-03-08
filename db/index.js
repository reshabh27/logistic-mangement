const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_HOST,
    port: '3306',
    dialect: 'mysql'
});
  

sequelize.authenticate().then(() => {
    console.log('Connected to database');
}).catch((e) => {
    console.log(e);
})


const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;




sequelize.sync().then(() => {
}).catch((e) => {
    console.log("there is an error while synching", e);
})


module.exports = db;