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




const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require('../models/users')(sequelize, DataTypes)
db.orders = require('../models/orders')(sequelize, DataTypes)
db.orderDetails = require('../models/orderDetails')(sequelize, DataTypes)
db.orderWarehouses = require('../models/orderWarehouse')(sequelize, DataTypes)
db.warehouses = require('../models/warehouse')(sequelize, DataTypes)
db.transports = require('../models/transport')(sequelize, DataTypes)
db.products = require('../models/products')(sequelize, DataTypes)
db.productSupplier = require("../models/productSupplier")(sequelize, DataTypes);
db.inventory = require("../models/inventory.js")(sequelize, DataTypes);
db.orderTransports = require('../models/orderTransport.js')(sequelize, DataTypes);

// creating many to one relationship between orders and users table
db.users.hasMany(db.orders)
db.orders.belongsTo(db.users);

// creating many to many relationship between transports and orders table
db.transports.belongsToMany(db.orders, { through: 'db.orderTransports', foreignKey: 'transportId' });
db.orders.belongsToMany(db.transports, { through: 'db.orderTransports', foreignKey: 'orderId' });



// creating many to many relationship between user and product table through productSupplier

db.products.belongsToMany(db.users, { through: db.productSupplier, foreignKey: "productId" });
db.users.belongsToMany(db.products, { through: db.productSupplier, foreignKey: "userId" });

// creating many to many relationship between product and warehouse through Inventory


// changed here
db.products.belongsToMany(db.warehouses, { through: db.inventory, foreignKey: "productId" });
db.warehouses.belongsToMany(db.products, { through: db.inventory, foreignKey: "wareHouseId" });

// creating many to many relationship between Order and warehouse through OrderWareHouse

db.orders.belongsToMany(db.warehouses, { through: db.orderWarehouses, foreignKey: "orderId" });
db.warehouses.belongsToMany(db.orders, { through: db.orderWarehouses, foreignKey: "wareHouseId" });


// creating many to many relationship between order and warehouse table through orderWarehouse table
db.orders.belongsToMany(db.warehouses, { through: db.orderWarehouses });
db.warehouses.belongsToMany(db.orders, { through: db.orderWarehouses });

// creating many to one relationship between product and orderDetails
db.products.hasMany(db.orderDetails,{foreignKey:"productId"});
db.orderDetails.belongsTo(db.products);

//creating many to one relationship between WareHouse and Inventory
db.warehouses.belongsTo(db.inventory,{foreignKey:"warehouseId"});
db.inventory.belongsTo(db.warehouses);

//creating many to one relationship between Product and Inventory
db.products.hasMany(db.inventory,{foreignKey:"productId"});
db.inventory.belongsTo(db.products);


db.orders.sync({ force: false })
db.transports.sync({ force: false })
db.orderTransports.sync({ force: false })
db.users.sync({ alter: false })

db.orderDetails.sync({ force: false })

db.warehouses.sync({ force: false }).then(() => { console.log("resyncing warehouses model") }).catch((err) => { console.log(err) });
db.orderWarehouses.sync({ force: false }).then(() => { console.log("resyncing orderWarehouses model") }).catch((err) => { console.log(err) });
db.inventory.sync({ force: false }).then(() => { console.log("resyncing inventory model") }).catch((err) => { console.log(err) });


db.productSupplier.sync().then(() => console.log("resync productSupplier model"))
    .catch((err) => console.log(err));

db.products.sync().then(() => console.log("resync product model"))
    .catch((err) => console.log(err));


sequelize.sync().then(() => {
}).catch((e) => {
    console.log("there is an error while synching", e);
})


db.warehouses.sync({force:false}).then(()=>{console.log("resyncing warehouses model")}).catch((err)=>{console.log(err)});
db.orderWarehouses.sync({force:false}).then(()=>{console.log("resyncing orderWarehouses model")}).catch((err)=>{console.log(err)});
db.inventory.sync({force:false}).then(()=>{console.log("resyncing inventory model")}).catch((err)=>{console.log(err)});
db.orderDetails.sync({force:false}).then(()=>{console.log("resyncing orderDetails model")}).catch((err)=>{console.log(err)});
module.exports = db;