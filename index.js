const express = require('express');
require('dotenv').config()

const cors = require('cors');

const {productRouter} = require("./routes/ProductRoute.js")

require('./db');

const app = express();

app.use(express.json());
app.use("/products",productRouter);
 
app.listen(process.env.SERVER_PORT, () => {
    console.log(`server started at ${process.env.SERVER_PORT}`);
})