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
db.transports = require('../models/transport')(sequelize, DataTypes)
db.products = require('../models/products')(sequelize, DataTypes)
db.productSupplier = require("../models/productSupplier")(sequelize,DataTypes);


// db.users.hasMany(db.orders, {
//     foreignKey: 'userId'
// });
// db.orders.belongsTo(db.users);




// creating one to many relationship between product and productSupplier table


db.products.hasMany(db.productSupplier,{foreignKey:"productId"});
db.productSupplier.belongsTo(db.products);


// creating one to many relationship between user and product supplier table

  
db.User.hasMany(db.productSupplier,{foreignKey:"userId"});
db.productSupplier.belongsTo(db.User);

// creating many to many relationship between user and product table

db.products.belongsToMany(db.User,{through:db.productSupplier,uniqueKey:"productId"});
db.User.belongsToMany(db.products,{through:db.productSupplier,uniqueKey:"userId"});
 

// db.orders.belongsToMany(db.warehouses, { through: db.orderWarehouses });
// db.warehouses.belongsToMany(db.orders, { through: db.orderWarehouses });

db.orders.sync({ force: false })
db.transports.sync({ force: false })

db.warehouses.sync({force:false}).then(()=>{console.log("resyncing warehouses model")}).catch((err)=>{console.log(err)});
db.orderWarehouses.sync({force:false}).then(()=>{console.log("resyncing orderWarehouses model")}).catch((err)=>{console.log(err)});

module.exports = db;