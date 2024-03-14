const express = require("express");
require("dotenv").config();

const cors = require("cors");

const orderRouter = require("./routes/orderRoutes.js");
const userRoute = require("./routes/userRoutes.js");
const { productRouter } = require("./routes/ProductRoute.js");
const { Product } = require("./models/products.js");
const transportRouter = require("./routes/transportRoutes.js");
const db = require("./db");
const { wareHouseRouter } = require("./routes/wareHouseRoutes.js");
const { inventoryRouter } = require("./routes/inventoryRoutes.js");
const relationRouter = require("./routes/relationshipRoutes.js");
const orderTransportRouter = require("./routes/orderTransportRoutes.js");
// require("./db");
const dashboardRoute = require("./routes/dashboardRoute.js");



const app = express();

db.products.sync()
  .then(() => {
    console.log("resync product model");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

db.productSupplier
  .sync()
  .then(() => {
    console.log("resync productSupplier model");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());



app.use("/dashboard", dashboardRoute);

app.use("/orders", orderRouter);

app.use("/user", userRoute);
app.use("/products", productRouter);
app.use("/transports", transportRouter);
app.use("/relations", relationRouter);
app.use("/orderTransport", orderTransportRouter);


app.use("/wareHouse", wareHouseRouter);
app.use("/inventory", inventoryRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server started at ${process.env.SERVER_PORT}`);
});
