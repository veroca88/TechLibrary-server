require("dotenv").config();

const path = require('path');
const logger = require('morgan');
const express = require('express');
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const favicon = require("serve-favicon");

// Connected to Cluster Atlas MongoDB
const uri = process.env.MONGO_CONNECTION;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("TechBlog").collection("AboutTech");
  client.close();
});

// setup package.json
const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware Setup
app.use(logger('dev'));
app.use(cookieParser());

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

//  Set paths
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));


// session used for storing messages
app.use(flash());

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;
