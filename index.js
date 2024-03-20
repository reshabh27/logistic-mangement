const express = require("express");
require("dotenv").config();

const orderRouter = require("./routes/orderRoutes.js");
const userRoute = require("./routes/userRoutes.js");
const { productRouter } = require("./routes/ProductRoute.js");
const transportRouter = require("./routes/transportRoutes.js");
const { wareHouseRouter } = require("./routes/wareHouseRoutes.js");
const { inventoryRouter } = require("./routes/inventoryRoutes.js");
const relationRouter = require("./routes/relationshipRoutes.js");
const orderTransportRouter = require("./routes/orderTransportRoutes.js");
const dashboardRoute = require("./routes/dashboardRoute.js");

const app = express();



app.use(express.json());



// app.use(express.json());

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
