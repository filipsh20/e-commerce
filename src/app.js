const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config();
const customCors = require('./utils/custom-cors');
const rateLimit = require('./utils/rate-limit');
const express = require('express');
const app = express();

//middlewars
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(customCors);
app.use(rateLimit);

//routes
app.use('/auth', require('./routes/auth'));

module.exports = app;