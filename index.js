const express = require('express');
require('dotenv').config()


require('./db.js');


const app = express();









app.listen(process.env.SERVER_PORT, () => {
    console.log(`server started at ${process.env.SERVER_PORT}`);
})