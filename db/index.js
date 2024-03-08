const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('logistic-management', 'root', '', {
    host: "127.0.0.1",
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