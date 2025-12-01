var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors');
var corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true           
}
app.use(cors(corsOptions)); 

var autoModRouter = require('./routes/autoMod');
var authRouter = require('./routes/authRouter');
var authMiddleware = require('./middleware/authAuto');

app.use('/auth', authRouter);
app.use('/auto' ,autoModRouter);


module.exports = app;
