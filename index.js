const express = require("express");
require("dotenv").config();

const cors = require("cors");

const orderRouter = require("./routes/orderRoutes.js");
const userRoute = require("./routes/userRoutes.js");
const { productRouter } = require("./routes/ProductRoute.js");
const db = require("./db");
const { wareHouseRouter } = require("./routes/wareHouseRoutes.js");

require("./db");

const app = express();

db.products.sync()
  .then(() => {
    console.log("resync product model");
  })
  .catch((err) => {
    console.log(err);
  });
db.productSupplier
  .sync()
  .then(() => {
    console.log("resync productSupplier model");
  })
  .catch((err) => {
    console.log(err);
  });
 
app.use(express.json());



app.use("/orders", orderRouter);

app.use("/user", userRoute);
app.use("/products", productRouter);
app.use("/wareHouse",wareHouseRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server started at ${process.env.SERVER_PORT}`);
});
