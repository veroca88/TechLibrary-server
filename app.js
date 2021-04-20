require("dotenv").config();

const path = require('path');
const logger = require('morgan');
const express = require('express');
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const favicon = require("serve-favicon");
const mongoose = require('mongoose');

const app = express();

//Get user if user is loggedin
const userToViewLocals = require('./configs/user-in-view-locals.config')


// Connected to Cluster Atlas MongoDB
require('./configs/db.config')

// Routers
const authUsersRouter = require('./routes/Users/AuthUsers');
const principalTab = require('./routes/Tabs/principalTab');


// session used for storing messages
require('./configs/session.config')(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(logger('dev'));
// app.use(express.json({ extended: false }))
app.use(express.json())
// app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(userToViewLocals);
const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

// Express View engine setup
// app.use(
//   require("node-sass-middleware")({
//     src: path.join(__dirname, "public"),
//     dest: path.join(__dirname, "public"),
//     sourceMap: true
//   })
// );



// Routes Middleware
app.use('/', authUsersRouter);
app.use('/', principalTab);


module.exports = app;
