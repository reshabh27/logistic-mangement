const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_HOST,
    port: '3306',
    dialect: 'mysql',
    logging: false
});


sequelize.authenticate().then(() => {
    console.log('Connected to database');
}).catch((e) => {
    console.log(e);
})

sequelize.sync().then(() => {
}).catch((e) => {
    console.log("there is an error while synching", e);
})


const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.orders = require('../models/orders')(sequelize, DataTypes)
db.users = require('../models/users')(sequelize, DataTypes)
db.orderDetails = require('../models/orderDetails')(sequelize, DataTypes)
db.orderWarehouses = require('../models/orderWarehouse')(sequelize, DataTypes)
db.warehouses = require('../models/warehouse')(sequelize, DataTypes)

// db.customers.hasMany(db.orders, {
//     foreignKey: 'customerId'
// });
// db.orders.belongsTo(db.customers);

db.User = require('../models/users')(sequelize, DataTypes);






// db.orders.belongsToMany(db.warehouses, { through: db.orderWarehouses });
// db.warehouses.belongsToMany(db.orders, { through: db.orderWarehouses });

db.orders.sync({ force: false })

module.exports = db;