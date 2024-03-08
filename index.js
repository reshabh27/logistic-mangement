const express = require('express');
const cors = require('cors')
// require('./db');
require('dotenv').config()

const app = express();

app.listen(process.env.SERVER_PORT, () => {
    console.log(`server started at ${process.env.SERVER_PORT}`);
})