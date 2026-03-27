
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var app = express();

// Az Express app alap middleware-jei: logolas, body parsing, cookie kezeles es statikus fajlok.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors');
var corsOptions ={
  origin:true,
  "credentials":true           
}
// A frontend es a mobil kliens cookie-val es tokennel is eleri ezt az API-t.
app.use(cors(corsOptions)); 

var autoModRouter = require('./routes/autoMod');
var authMiddleware = require('./middleware/authAuto');

// Az auto router ala kerul az alkalmazas teljes uzleti API-ja.
app.use('/auto' ,autoModRouter);
app.use("/img",express.static("public/img"));

module.exports = app;
