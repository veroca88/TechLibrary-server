require("dotenv").config();

const path = require('path');
const logger = require('morgan');
const express = require('express');
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const favicon = require("serve-favicon");
const mongoose = require('mongoose');
const MongoStore = require("connect-mongo")(session);

const app = express();



// Connected to Cluster Atlas MongoDB
const uri = process.env.MONGODB_URI
mongoose
  .connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

// setup package.json
const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);



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
app.use(express.json({ extended: false }))
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));


// session used for storing messages
app.use(
  session({
    secret: "regenerator",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());

// Routes
const authUsersRouter = require('./routes/Users/AuthUsers');
const principalTab = require('./routes/Tabs/principalTab');

app.use('/', authUsersRouter);
app.use('/', principalTab);


module.exports = app;
