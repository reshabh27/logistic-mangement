const express = require('express');
require('./db.js');
require('dotenv').config()

const app = express();

app.listen(process.env.SERVER_PORT, () => {
    console.log(`server started at ${process.env.SERVER_PORT}`);
})